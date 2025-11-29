"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transferSFT } from "@/src/blockchain/wallet";

const formSchema = z.object({
    recipient: z.string().min(42, "Invalid Ethereum address").max(42, "Invalid Ethereum address").regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address format"),
    amount: z.string().regex(/^\d+(\.\d+)?$/, "Invalid amount"),
});

interface TransferFormProps {
    address: string | null;
    sftBalance: string;
    onTransferSuccess: () => void;
}

export function TransferForm({ address, sftBalance, onTransferSuccess }: TransferFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            recipient: "",
            amount: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!address) {
            toast.error("Please connect your wallet first");
            return;
        }

        if (parseFloat(values.amount) > parseFloat(sftBalance)) {
            toast.error("Insufficient Balance", {
                description: `You only have ${sftBalance} SFT.`
            });
            return;
        }

        setIsLoading(true);
        try {
            // 1. Execute Blockchain Transaction
            const txHash = await transferSFT(values.recipient, values.amount);

            // 2. Log to Backend
            await fetch('/api/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    txHash,
                    from: address,
                    to: values.recipient,
                    amount: values.amount,
                    timestamp: new Date().toISOString()
                })
            });

            toast.success("Transfer successful!", {
                description: `Transaction Hash: ${txHash.slice(0, 10)}...`
            });

            form.reset();
            onTransferSuccess();
        } catch (error: any) {
            console.error(error);
            toast.error("Transfer failed", {
                description: error.message || "Unknown error occurred"
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="bg-black/40 border-[#00C2A8]/20 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Send className="h-5 w-5 text-[#00C2A8]" />
                    Transfer SFT
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="recipient"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Recipient Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0x..." {...field} className="bg-black/20 border-slate-700 text-white focus:border-[#00C2A8]" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Amount (SFT)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0.0" {...field} className="bg-black/20 border-slate-700 text-white focus:border-[#00C2A8]" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-black font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Send Tokens"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
