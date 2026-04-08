"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { PenLine, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTestimonial } from "@/services/testimonial.client";
import { createTestimonialZodSchema } from "@/zod/testimonial.schema";

function firstErrorMessage(error: unknown, fallback: string): string {
	if (typeof error === "string") {
		return error;
	}

	if (error && typeof error === "object" && "message" in error) {
		const maybeMessage = (error as { message?: unknown }).message;
		if (typeof maybeMessage === "string" && maybeMessage.trim().length > 0) {
			return maybeMessage;
		}
	}

	return fallback;
}

export default function TestimonialFeedbackDialog() {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const testimonialMutation = useMutation({
		mutationFn: createTestimonial,
		onSuccess: () => {
			toast.success("Testimonial shared successfully");
			form.reset();
			setOpen(false);
			router.refresh();
		},
		onError: (error) => {
			toast.error(firstErrorMessage(error, "Failed to submit testimonial"));
		},
	});

	const form = useForm({
		defaultValues: {
			title: "",
			feedback: "",
			rating: 0,
		},
		onSubmit: async ({ value }) => {
			const normalizedPayload = {
				title: value.title.trim() || undefined,
				feedback: value.feedback.trim(),
				rating: Number(value.rating),
			};

			const parsed = createTestimonialZodSchema.safeParse(normalizedPayload);

			if (!parsed.success) {
				toast.error(parsed.error.issues[0]?.message || "Invalid testimonial input");
				return;
			}

			await testimonialMutation.mutateAsync(parsed.data);
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="btn-neon-primary h-10 rounded-full px-5" type="button">
					<PenLine className="h-4 w-4" />
					Share Feedback
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-2xl border-[#e4d1c6] bg-[#fff9f4] text-[#2f201d] dark:border-[#2d2328] dark:bg-[#120c10] dark:text-[#f7efe9]">
				<DialogHeader>
					<DialogTitle className="text-2xl">Share your testimonial</DialogTitle>
					<DialogDescription className="text-sm text-[#6e5c54] dark:text-[#b9b2bd]">
						Tell the community what stood out for you. Your feedback will appear in the home testimonial carousel.
					</DialogDescription>
				</DialogHeader>

				<form
					className="grid gap-4"
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						void form.handleSubmit();
					}}
				>
					<form.Field
						name="title"
						validators={{
							onChange: ({ value }) => {
								const result = createTestimonialZodSchema.shape.title.safeParse(value.trim() || undefined);
								return result.success ? undefined : result.error.issues[0]?.message;
							},
						}}
					>
						{(field) => (
							<div className="space-y-1.5">
								<Label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8c6b5c] dark:text-[#d8c4b8]">
									Title <span className="font-normal normal-case tracking-normal opacity-70">(optional)</span>
								</Label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
									placeholder="A short headline for your feedback"
									aria-invalid={Boolean(field.state.meta.errors.length)}
									className="h-11 border-[#e7d8cf] bg-white text-[#2f201d] dark:border-white/10 dark:bg-white/5 dark:text-white"
									disabled={testimonialMutation.isPending}
								/>
								{field.state.meta.isTouched && field.state.meta.errors[0] ? (
									<p className="text-xs text-red-500">{String(field.state.meta.errors[0])}</p>
								) : null}
							</div>
						)}
					</form.Field>

					<form.Field
						name="rating"
						validators={{
							onChange: ({ value }) => {
								const result = createTestimonialZodSchema.shape.rating.safeParse(value);
								return result.success ? undefined : result.error.issues[0]?.message;
							},
						}}
					>
						{(field) => (
							<div className="space-y-2">
								<Label className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8c6b5c] dark:text-[#d8c4b8]">Rating</Label>
								<div className="flex flex-wrap gap-2">
									{[1, 2, 3, 4, 5].map((value) => {
										const isActive = Number(field.state.value) >= value;

										return (
											<button
												key={value}
												type="button"
												onClick={() => field.handleChange(value)}
												className={
													isActive
														? "inline-flex h-11 items-center gap-1.5 rounded-full border border-[#f0bf82] bg-[#fff1d9] px-4 text-sm font-semibold text-[#9b5a1f] transition hover:bg-[#ffe7bc] dark:border-neon-gold/35 dark:bg-neon-gold/10 dark:text-neon-gold"
														: "inline-flex h-11 items-center gap-1.5 rounded-full border border-[#e7d8cf] bg-white px-4 text-sm font-medium text-[#6c5449] transition hover:bg-[#fbf3ee] dark:border-white/10 dark:bg-white/5 dark:text-[#d9d0d8] dark:hover:bg-white/10"
												}
												aria-pressed={field.state.value === value}
											>
												<Star className={isActive ? "h-4 w-4 fill-current" : "h-4 w-4"} />
												<span>{value}</span>
											</button>
										);
									})}
								</div>
								{field.state.meta.isTouched && field.state.meta.errors[0] ? (
									<p className="text-xs text-red-500">{String(field.state.meta.errors[0])}</p>
								) : null}
							</div>
						)}
					</form.Field>

					<form.Field
						name="feedback"
						validators={{
							onChange: ({ value }) => {
								const result = createTestimonialZodSchema.shape.feedback.safeParse(value);
								return result.success ? undefined : result.error.issues[0]?.message;
							},
						}}
					>
						{(field) => (
							<div className="space-y-1.5">
								<Label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8c6b5c] dark:text-[#d8c4b8]">
									Feedback
								</Label>
								<Textarea
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
									placeholder="What did you love about your experience?"
									aria-invalid={Boolean(field.state.meta.errors.length)}
									className="min-h-32 border-[#e7d8cf] bg-white text-[#2f201d] dark:border-white/10 dark:bg-white/5 dark:text-white"
									disabled={testimonialMutation.isPending}
								/>
								{field.state.meta.isTouched && field.state.meta.errors[0] ? (
									<p className="text-xs text-red-500">{String(field.state.meta.errors[0])}</p>
								) : null}
							</div>
						)}
					</form.Field>

					<div className="flex flex-wrap items-center gap-3 pt-2">
						<Button
							type="submit"
							className="btn-neon-primary h-11 rounded-full px-5"
							disabled={testimonialMutation.isPending}
						>
							{testimonialMutation.isPending ? "Submitting..." : "Submit Testimonial"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}