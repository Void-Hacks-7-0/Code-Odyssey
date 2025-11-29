"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Loader2, Sparkles, TrendingUp, Wallet, PiggyBank } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/navbar";

export default function OptiBudgetPage() {
    const [loading, setLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<string | null>(null);

    // Tab 1 State
    const [income, setIncome] = useState("");
    const [goal, setGoal] = useState("");

    // Tab 2 State
    const [capital, setCapital] = useState("");
    const [risk, setRisk] = useState("Moderate");

    // Tab 3 State
    const [habitIncome, setHabitIncome] = useState("");
    const [needs, setNeeds] = useState({ Food: "", Rent: "", Utilities: "" });
    const [wants, setWants] = useState({ Shopping: "", Entertainment: "", Dining: "" });

    async function handleAnalyze(prompt: string) {
        setLoading(true);
        setAiResponse(null);
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setAiResponse(data.text);
        } catch (error: any) {
            toast.error("Analysis Failed", { description: error.message });
        } finally {
            setLoading(false);
        }
    }

    const generateBudgetPlan = () => {
        const prompt = `Act as a financial advisor. Create a monthly budget plan for someone with a monthly income of ${income} and a financial goal of "${goal}". Provide a breakdown of 50/30/20 rule and specific tips.`;
        handleAnalyze(prompt);
    };

    const generateInvestmentStrategy = () => {
        const prompt = `Act as an investment advisor. Suggest an investment strategy for a capital of ${capital} with a ${risk} risk tolerance. Suggest asset allocation percentages (Stocks, Bonds, Crypto, etc.) and explain why.`;
        handleAnalyze(prompt);
    };

    const generateSavingsSuggestions = () => {
        const totalNeeds = Object.values(needs).reduce((acc, val) => acc + Number(val || 0), 0);
        const totalWants = Object.values(wants).reduce((acc, val) => acc + Number(val || 0), 0);
        const prompt = `Analyze these expenses: Monthly Income: ${habitIncome}. Needs: ${totalNeeds} (Food, Rent, Utilities). Wants: ${totalWants} (Shopping, Entertainment). Total Spent: ${totalNeeds + totalWants}. Remaining: ${Number(habitIncome) - (totalNeeds + totalWants)}. Give 3 specific, actionable tips to save money and reduce "Wants" spending.`;
        handleAnalyze(prompt);
    };

    // Chart Data
    const totalNeeds = Object.values(needs).reduce((acc, val) => acc + Number(val || 0), 0);
    const totalWants = Object.values(wants).reduce((acc, val) => acc + Number(val || 0), 0);
    const chartData = [
        { name: "Needs", value: totalNeeds },
        { name: "Wants", value: totalWants },
    ];
    const COLORS = ["#10B981", "#EF4444"]; // Emerald, Red

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar />
            <div className="max-w-5xl mx-auto space-y-8 pt-24 px-8 pb-12">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Opti<span className="text-emerald-500">Budget</span>
                    </h1>
                    <p className="text-zinc-400">
                        Your AI-powered financial assistant for smarter budgeting, investing, and saving.
                    </p>
                </div>

                <Tabs defaultValue="budget" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
                        <TabsTrigger value="budget">Smart Budget</TabsTrigger>
                        <TabsTrigger value="investment">Investment</TabsTrigger>
                        <TabsTrigger value="tracker">Habit Tracker</TabsTrigger>
                    </TabsList>

                    {/* TAB 1: SMART BUDGET PLANNER */}
                    <TabsContent value="budget">
                        <Card className="border-emerald-500/50 shadow-lg shadow-emerald-500/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Wallet className="h-5 w-5 text-emerald-500" />
                                    Smart Budget Planner
                                </CardTitle>
                                <CardDescription>Create a personalized budget based on your income and goals.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Monthly Income</Label>
                                        <Input
                                            placeholder="e.g. 50000"
                                            value={income}
                                            onChange={(e) => setIncome(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Financial Goal</Label>
                                        <Input
                                            placeholder="e.g. Buy a car in 2 years"
                                            value={goal}
                                            onChange={(e) => setGoal(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                                    onClick={generateBudgetPlan}
                                    disabled={loading || !income || !goal}
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Generate Budget Plan
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB 2: INVESTMENT ADVISOR */}
                    <TabsContent value="investment">
                        <Card className="border-blue-500/50 shadow-lg shadow-blue-500/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-500" />
                                    Investment Advisor
                                </CardTitle>
                                <CardDescription>Get tailored investment strategies based on your risk profile.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Investment Capital</Label>
                                        <Input
                                            placeholder="e.g. 100000"
                                            value={capital}
                                            onChange={(e) => setCapital(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Risk Tolerance</Label>
                                        <select
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={risk}
                                            onChange={(e) => setRisk(e.target.value)}
                                        >
                                            <option value="Low">Low (Conservative)</option>
                                            <option value="Moderate">Moderate (Balanced)</option>
                                            <option value="High">High (Aggressive)</option>
                                        </select>
                                    </div>
                                </div>
                                <Button
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                    onClick={generateInvestmentStrategy}
                                    disabled={loading || !capital}
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Get Investment Strategy
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB 3: EXPENSE HABIT TRACKER */}
                    <TabsContent value="tracker">
                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Left Column: Inputs */}
                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>Expense Entry</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Monthly Income</Label>
                                        <Input
                                            placeholder="e.g. 60000"
                                            value={habitIncome}
                                            onChange={(e) => setHabitIncome(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-emerald-500">Essential (Needs)</h4>
                                            {Object.keys(needs).map((key) => (
                                                <div key={key} className="space-y-1">
                                                    <Label className="text-xs">{key}</Label>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        value={needs[key as keyof typeof needs]}
                                                        onChange={(e) => setNeeds({ ...needs, [key]: e.target.value })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-red-500">Non-Essential (Wants)</h4>
                                            {Object.keys(wants).map((key) => (
                                                <div key={key} className="space-y-1">
                                                    <Label className="text-xs">{key}</Label>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        value={wants[key as keyof typeof wants]}
                                                        onChange={(e) => setWants({ ...wants, [key]: e.target.value })}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Right Column: Summary */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">₹{totalNeeds + totalWants}</div>
                                        <p className="text-xs text-muted-foreground">Total Spent</p>
                                        <div className="mt-4 text-xl font-bold text-emerald-500">
                                            ₹{Math.max(0, Number(habitIncome) - (totalNeeds + totalWants))}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Remaining</p>
                                    </CardContent>
                                </Card>

                                <Card className="flex flex-col items-center p-4">
                                    <div className="h-[200px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <Button
                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                    onClick={generateSavingsSuggestions}
                                    disabled={loading || !habitIncome}
                                >
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PiggyBank className="mr-2 h-4 w-4" />}
                                    Get Savings Suggestions
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* AI Response Area */}
                {aiResponse && (
                    <Card className="bg-muted/50 border-primary/20 animate-in fade-in slide-in-from-bottom-4">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Sparkles className="h-5 w-5" />
                                AI Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                                {aiResponse}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
