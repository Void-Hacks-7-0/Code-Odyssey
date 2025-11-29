"use client"

import { Navbar } from "@/components/navbar"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Shield, LogOut, TrendingUp, AlertCircle, Wallet, Radar as RadarIcon, Home, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { AddExpenseModal } from "@/components/add-expense-modal"
import { Bar, BarChart, CartesianGrid, XAxis, Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts"
import {
    ChartConfig,
    Chart,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"


const chartConfig = {
    Expenditure: {
        label: "Expenditure",
        color: "#005A30",
    },
} satisfies ChartConfig

const categoryConfig = {
    amount: { label: "Amount", color: "#03224C" },
} satisfies ChartConfig

export default function DashboardPage() {
    const { logout, role } = useAuth()
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
    const [expenses, setExpenses] = useState([
        { id: "1", name: "Rent", amount: "5200", due: "1st of month", paid: false, category: "Rent", date: "2024-05-01", important: true },
        { id: "2", name: "EMI - Laptop", amount: "3500", due: "5th of month", paid: true, category: "Shopping", date: "2024-05-05", important: true },
        { id: "3", name: "Utilities", amount: "750", due: "10th of month", paid: false, category: "Utilities", date: "2024-05-10", important: false },
        { id: "4", name: "Internet", amount: "570", due: "15th of month", paid: true, category: "Utilities", date: "2024-05-15", important: true },
    ])
    const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }))

    const handleAddExpense = (newExpense: any) => {
        setExpenses(prev => [{
            ...newExpense,
            due: "Today",
            paid: false
        }, ...prev])
    }

    const handleDeleteExpense = (id: string) => {
        setExpenses(prev => prev.filter(expense => expense.id !== id))
    }

    // Group expenses by month
    const expensesByMonth = React.useMemo(() => {
        const grouped: { [key: string]: { title: string, expenses: typeof expenses, sortKey: number } } = {}

        expenses.forEach(expense => {
            const date = expense.date ? new Date(expense.date) : new Date()
            const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' })

            if (!grouped[monthYear]) {
                grouped[monthYear] = {
                    title: monthYear,
                    expenses: [],
                    sortKey: date.getTime() // Use timestamp for sorting
                }
            }
            grouped[monthYear].expenses.push(expense)
        })

        return Object.values(grouped).sort((a, b) => a.sortKey - b.sortKey)
    }, [expenses])

    // Derive Chart Data
    const chartData = React.useMemo(() => {
        return expensesByMonth.map(group => ({
            month: group.title,
            Expenditure: group.expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)
        }))
    }, [expensesByMonth])

    // Derive Category Data
    const categoryData = React.useMemo(() => {
        const catData: { [key: string]: number } = {}

        expenses.forEach(expense => {
            const cat = expense.category || "Others"
            if (!catData[cat]) catData[cat] = 0
            catData[cat] += parseFloat(expense.amount)
        })

        return Object.keys(catData).map(category => ({
            category,
            amount: catData[category]
        }))
    }, [expenses])

    // Calculate Budget Metrics
    const budgetMonth = selectedMonth
    const currentMonthExpenses = expensesByMonth.find(g => g.title === budgetMonth)?.expenses || []
    const totalSpent = currentMonthExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)

    const MONTHLY_LIMIT = 10000
    const SAVINGS_GOAL = 1000
    const remaining = Math.max(0, MONTHLY_LIMIT - totalSpent)
    const saved = remaining // Assuming remaining budget is saved
    const spentPercentage = Math.min(100, (totalSpent / MONTHLY_LIMIT) * 100)
    const savedPercentage = Math.min(100, (saved / SAVINGS_GOAL) * 100)

    if (role === "admin") {
        return (
            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <Navbar />
                <main className="flex-1 container px-4 md:px-6 py-12 pt-24">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
                            <div className="flex gap-2">
                                <Button variant="outline">Manage Users</Button>
                                <Button>System Settings</Button>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Users</h3>
                                <p className="text-3xl font-bold">12,345</p>
                                <div className="text-xs text-green-500 mt-2 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" /> +12% from last month
                                </div>
                            </div>
                            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Sessions</h3>
                                <p className="text-3xl font-bold">1,203</p>
                                <div className="text-xs text-green-500 mt-2 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" /> +5% from last hour
                                </div>
                            </div>
                            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">System Health</h3>
                                <p className="text-3xl font-bold text-green-500">99.9%</p>
                                <div className="text-xs text-muted-foreground mt-2">All systems operational</div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-8 text-center py-20">
                            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium">Admin Panel Content</h3>
                            <p className="text-muted-foreground max-w-md mx-auto mt-2">
                                This is a placeholder for the admin dashboard. You can add user management, analytics, and system configuration tools here.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />

            <main className="flex-1 container px-4 md:px-6 py-8 pt-24 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
                        <p className="text-muted-foreground mt-1">Track your expenses and manage your budget effectively.</p>
                    </div>
                    <div className="flex items-center gap-1 bg-card border border-border px-4 py-2 rounded-xl shadow-sm">
                        <Wallet className="h-5 w-5 text-cyan-500" />
                        <span className="text-sm font-medium text-muted-foreground">Total Balance:</span>
                        <span className="text-lg font-bold">₹12,450.00</span>
                    </div>
                    <Button onClick={() => setIsAddExpenseOpen(true)} className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold gap-2">
                        <Plus className="h-4 w-4" />
                        Add Expense
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    {/* Expense Trend Chart */}
                    <div className="col-span-4 bg-card border border-border rounded-2xl p-11 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-cyan-500" />
                                    Monthly Expense Trend
                                </h3>
                                <p className="text-sm">Tracking monthly expenditure</p>
                            </div>
                        </div>
                        <Chart config={chartConfig} className="h-[300px] w-full">
                            <BarChart accessibilityLayer data={chartData}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                    stroke="hsl(var(--muted-foreground))"
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar
                                    dataKey="Expenditure"
                                    fill="var(--color-Expenditure)"
                                    radius={4}
                                    maxBarSize={50}
                                    onClick={(data) => setSelectedMonth(data.month)}
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                />
                            </BarChart>
                        </Chart>
                    </div>

                    {/* Expense Categorization Chart (Radar) */}
                    <div className="col-span-4 lg:col-span-3 bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <RadarIcon className="h-5 w-5 text-cyan-500" />
                                    Expense Breakdown
                                </h3>
                                <p className="text-sm text-muted-foreground">Distribution by category</p>
                            </div>
                        </div>
                        <Chart config={categoryConfig} className="h-[300px] w-full mx-auto aspect-square max-h-[300px]">
                            <RadarChart data={categoryData}>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                />
                                <PolarGrid className="fill-[--color-desktop] opacity-20" />
                                <PolarAngleAxis dataKey="category" />
                                <Radar
                                    dataKey="amount"
                                    fill="var(--color-amount)"
                                    fillOpacity={0.5}
                                    stroke="var(--color-amount)"
                                    strokeWidth={2}
                                />
                            </RadarChart>
                        </Chart>
                    </div>

                    {/* Side Widgets */}
                    <div className="col-span-4 lg:col-span-7 grid md:grid-cols-2 gap-6">
                        {/* Important Expenses */}
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-orange-500" />
                                Important Expenses
                            </h3>
                            <div className="space-y-4">
                                {expenses.filter(e => e.important).map((expense, i) => (
                                    <div key={expense.id || i} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 hover:border-border transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${expense.paid ? "bg-green-500" : "bg-orange-500"}`} />
                                            <div>
                                                <p className="font-medium text-sm">{expense.name}</p>
                                                <p className="text-xs text-muted-foreground">Due: {expense.due}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-sm">₹{expense.amount}</span>
                                            <button
                                                onClick={() => handleDeleteExpense(expense.id)}
                                                className="text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                title="Remove Expense"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Budget Constraints */}
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-4">Budget Constraints <span className="text-sm font-normal text-muted-foreground ml-2">({budgetMonth})</span></h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Monthly Limit</span>
                                        <span className="font-medium">₹{MONTHLY_LIMIT.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${spentPercentage > 90 ? 'bg-red-500' : 'bg-cyan-500'}`}
                                            style={{ width: `${spentPercentage}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                                        <span>Spent: ₹{totalSpent.toLocaleString()}</span>
                                        <span>Remaining: ₹{remaining.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Savings Goal</span>
                                        <span className="font-medium">₹{SAVINGS_GOAL.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500"
                                            style={{ width: `${savedPercentage}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                                        <span>Saved: ₹{saved.toLocaleString()}</span>
                                        <span>Target: ₹{SAVINGS_GOAL.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Expenses List */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-cyan-500" />
                        Monthly Expenses
                    </h3>
                    <div className="space-y-6">
                        {expensesByMonth.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No expenses recorded yet.</p>
                        ) : (
                            expensesByMonth.map((group) => (
                                <div key={group.title} className="space-y-3">
                                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider pl-1">{group.title}</h4>
                                    <div className="space-y-3">
                                        {group.expenses.map((expense, i) => (
                                            <div key={expense.id || i} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 hover:border-border transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${expense.paid ? "bg-green-500" : "bg-orange-500"}`} />
                                                    <div>
                                                        <p className="font-medium text-sm">{expense.name}</p>
                                                        <div className="flex gap-2 text-xs text-muted-foreground">
                                                            <span>{expense.category}</span>
                                                            <span>•</span>
                                                            <span>{expense.date || "No Date"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-sm">₹{expense.amount}</span>
                                                    <button
                                                        onClick={() => handleDeleteExpense(expense.id)}
                                                        className="text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        title="Remove Expense"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
            <AddExpenseModal
                isOpen={isAddExpenseOpen}
                onClose={() => setIsAddExpenseOpen(false)}
                onAddExpense={handleAddExpense}
            />
        </div>
    )
}
