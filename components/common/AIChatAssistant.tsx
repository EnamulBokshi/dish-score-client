"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bot, Loader2, Sparkles, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAIChatResponse } from "@/services/ai.client";
import { IAIChatResult } from "@/types/ai.types";
import { aiChatRequestSchema } from "@/zod/ai.schema";

interface AIChatAssistantProps {
	variant?: "navbar" | "dashboard";
	className?: string;
}

export default function AIChatAssistant({ variant = "navbar", className }: AIChatAssistantProps) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [top, setTop] = useState("3");
	const [result, setResult] = useState<IAIChatResult | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const chatMutation = useMutation({
		mutationFn: getAIChatResponse,
		onSuccess: (data) => {
			setResult(data);
			setErrorMessage(null);
		},
		onError: (error) => {
			const message = error instanceof Error ? error.message : "Failed to generate AI response";
			setErrorMessage(message);
		},
	});

	const triggerButtonClassName = useMemo(() => {
		if (variant === "dashboard") {
			return "h-10 rounded-full border border-border bg-background px-4 text-sm text-foreground hover:bg-muted";
		}

		return "h-10 rounded-full border border-[#cfbfb6] bg-white px-4 text-sm text-[#4f3f38] shadow-[0_8px_20px_-18px_rgba(66,46,37,0.45)] hover:bg-[#f7eee9] hover:text-[#8f452f] dark:border-white/15 dark:bg-white/5 dark:text-[#f2e8e2] dark:hover:bg-white/10 dark:hover:text-white";
	}, [variant]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage(null);

		const parsedTop = Number(top);
		const parsedMaxPrice = maxPrice.trim() ? Number(maxPrice.trim()) : undefined;

		const payload = {
			query: query.trim(),
			top: Number.isFinite(parsedTop) ? parsedTop : undefined,
			maxPrice:
				typeof parsedMaxPrice === "number" && Number.isFinite(parsedMaxPrice)
					? parsedMaxPrice
					: undefined,
		};

		const validated = aiChatRequestSchema.safeParse(payload);
		if (!validated.success) {
			setErrorMessage(validated.error.issues[0]?.message || "Invalid chat input");
			return;
		}

		await chatMutation.mutateAsync(validated.data);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) {
					setErrorMessage(null);
				}
			}}
		>
			<DialogTrigger asChild>
				<Button type="button" variant="outline" className={`${triggerButtonClassName} ${className ?? ""}`}>
					<Bot className="h-4 w-4" />
					<span className="hidden sm:inline">AI Assistant</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="max-h-[90vh] overflow-hidden border-[#dccfc6] bg-[#fbf7f3] sm:max-w-2xl dark:border-white/12 dark:bg-[#0b0810]">
				<DialogHeader>
					<DialogTitle className="inline-flex items-center gap-2 text-[#2d201a] dark:text-white">
						<Sparkles className="h-4 w-4 text-neon-orange" />
						Food AI Assistant
					</DialogTitle>
					<DialogDescription>
						Ask dish and restaurant recommendation questions based on live platform data.
					</DialogDescription>
				</DialogHeader>

				<form className="space-y-3" onSubmit={handleSubmit}>
					<div className="space-y-1.5">
						<Label htmlFor="ai-chat-query">Query</Label>
						<Input
							id="ai-chat-query"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="e.g. top 3 affordable foods"
							disabled={chatMutation.isPending}
						/>
					</div>

					<div className="grid gap-3 sm:grid-cols-2">
						<div className="space-y-1.5">
							<Label htmlFor="ai-chat-max-price">Max Price (optional)</Label>
							<Input
								id="ai-chat-max-price"
								type="number"
								min={1}
								step="0.01"
								value={maxPrice}
								onChange={(event) => setMaxPrice(event.target.value)}
								placeholder="e.g. 20"
								disabled={chatMutation.isPending}
							/>
						</div>

						<div className="space-y-1.5">
							<Label>Top Results</Label>
							<Select value={top} onValueChange={setTop} disabled={chatMutation.isPending}>
								<SelectTrigger>
									<SelectValue placeholder="Top" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1">1</SelectItem>
									<SelectItem value="2">2</SelectItem>
									<SelectItem value="3">3</SelectItem>
									<SelectItem value="4">4</SelectItem>
									<SelectItem value="5">5</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{errorMessage ? (
						<div className="rounded-lg border border-[#ff0040]/40 bg-[#ff0040]/10 px-3 py-2 text-sm text-[#ffd4dd]">
							{errorMessage}
						</div>
					) : null}

					<Button type="submit" className="btn-neon-primary h-10 rounded-full px-5" disabled={chatMutation.isPending}>
						{chatMutation.isPending ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Thinking...
							</>
						) : (
							<>
								<WandSparkles className="h-4 w-4" />
								Ask AI
							</>
						)}
					</Button>
				</form>

				<ScrollArea className="mt-4 h-[min(45vh,22rem)] pr-2">
					{result ? (
						<div className="space-y-3">
							<Card className="border-[#e0d0c6] bg-white/80 dark:border-white/10 dark:bg-white/5">
								<CardContent className="space-y-2 p-4">
									<p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8d5c45] dark:text-[#c9bec6]">
										Answer
									</p>
									<p className="text-sm text-[#3f2d24] dark:text-[#ede5df]">{result.answer}</p>
									<p className="text-xs text-muted-foreground">Confidence: {result.confidence}</p>
								</CardContent>
							</Card>

							{result.recommendations.map((item, index) => (
								<Card key={`${item.dishName}-${index}`} className="border-[#e0d0c6] bg-white/80 dark:border-white/10 dark:bg-white/5">
									<CardContent className="space-y-1.5 p-4">
										<p className="font-semibold text-[#2d201a] dark:text-white">{item.dishName}</p>
										<p className="text-sm text-muted-foreground">{item.restaurantName}</p>
										<p className="text-xs text-muted-foreground">
											Price: {typeof item.price === "number" ? `$${item.price.toFixed(2)}` : "N/A"} • Rating: {item.rating.toFixed(1)}
										</p>
										<p className="text-sm text-[#4f3d33] dark:text-[#d8cfd8]">{item.reason}</p>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="rounded-lg border border-dashed border-border bg-card/60 p-4 text-sm text-muted-foreground">
							Ask about dishes, prices, top picks, or affordable food recommendations.
						</div>
					)}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}