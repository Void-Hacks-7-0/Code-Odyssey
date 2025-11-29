"use client"

import * as React from "react"
import { X, Calendar, IndianRupee, Tag, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddExpenseModalProps {
    isOpen: boolean
    onClose: () => void
    onAddExpense: (expense: any) => void
}

export function AddExpenseModal({ isOpen, onClose, onAddExpense }: AddExpenseModalProps) {
    const [name, setName] = React.useState("")
    const [amount, setAmount] = React.useState("")
    const [category, setCategory] = React.useState("Food")
    const [date, setDate] = React.useState("")
    const [isCustomCategory, setIsCustomCategory] = React.useState(false)
    const [isImportant, setIsImportant] = React.useState(false)

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newExpense = {
            name,
            amount,
            category,
            date,
            important: isImportant,
            id: Date.now().toString()
        }
        onAddExpense(newExpense)
        onClose()
        // Reset form
        setName("")
        setAmount("")
        setCategory("Food")
        setDate("")
        setIsCustomCategory(false)
        setIsImportant(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="p-6 pb-0">
                    <h2 className="text-xl font-bold text-white mb-1">Add New Expense</h2>
                    <p className="text-slate-400 text-sm">Track your daily spending</p>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Description</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                    placeholder=""
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Amount</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Category</label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCustomCategory(!isCustomCategory)
                                            setCategory(isCustomCategory ? "Food" : "")
                                        }}
                                        className="text-[10px] text-cyan-500 hover:text-cyan-400"
                                    >
                                        {isCustomCategory ? "Select List" : "Type Manual"}
                                    </button>
                                </div>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                    {isCustomCategory ? (
                                        <input
                                            type="text"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                                            placeholder="Type category..."
                                            required
                                        />
                                    ) : (
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all appearance-none"
                                        >
                                            <option value="Food">Food</option>
                                            <option value="Transport">Transport</option>
                                            <option value="Utilities">Utilities</option>
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="Shopping">Shopping</option>
                                            <option value="Health">Health</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all [color-scheme:dark]"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="important"
                                checked={isImportant}
                                onChange={(e) => setIsImportant(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/50"
                            />
                            <label htmlFor="important" className="text-sm text-slate-400 cursor-pointer select-none">
                                Mark as Important Expense
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-xl transition-all mt-4"
                        >
                            Add Expense
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
