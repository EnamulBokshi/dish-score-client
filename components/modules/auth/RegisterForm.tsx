"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Lock, Mail, User, Upload, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import AppField from "@/components/layout/forms/AppFiled";
import AppSubmitButton from "@/components/layout/forms/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { signUpWithEmail } from "@/services/auth.client";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.schema";

export default function RegisterForm() {
	const router = useRouter();
	const [formError, setFormError] = useState<string | null>(null);

	const getApiErrorMessage = (error: unknown): string => {
		if (axios.isAxiosError(error)) {
			const responseData = error.response?.data;
			if (responseData && typeof responseData === "object" && "error" in responseData) {
				return String((responseData as { error?: unknown }).error || "Unable to create account");
			}
		}

		if (error instanceof Error) {
			return error.message;
		}

		return "Unable to create account";
	};

	const registerMutation = useMutation({
		mutationFn: async ({ payload, image }: { payload: Omit<IRegisterPayload, "confirmPassword">; image: File | null }) => {
			return signUpWithEmail(payload, image);
		},
		onSuccess: (_data, variables) => {
			setFormError(null);
			toast.success("Account created successfully. Please verify your email.");
			router.push(`/verify-email?email=${encodeURIComponent(variables.payload.email)}`);
		},
		onError: (error) => {
			setFormError(getApiErrorMessage(error));
		},
	});

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			role: "CONSUMER" as "CONSUMER" | "OWNER",
			image: null as File | null,
		},
		onSubmit: async ({ value }) => {
			const parsed = registerZodSchema.safeParse(value);

			if (!parsed.success) {
				setFormError(null);
				toast.error(parsed.error.issues[0]?.message || "Invalid signup input");
				return;
			}

			setFormError(null);

			const payload = {
				name: parsed.data.name,
				email: parsed.data.email,
				password: parsed.data.password,
				role: parsed.data.role,
			};

			await registerMutation.mutateAsync({ payload, image: value.image });
		},
	});

	const handleGoogleSignUp = () => {
		const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

		if (!baseUrl) {
			toast.error("API base URL is missing");
			return;
		}

		window.location.href = `${baseUrl}/auth/sign-in/google`;
	};

	return (
		<div className="w-full max-w-md rounded-2xl border border-dark-border bg-dark-card/80 p-6 shadow-[0_0_50px_rgba(255,87,34,0.08)] backdrop-blur md:p-8">
			<div className="mb-6 space-y-2">
				<p className="text-sm font-semibold tracking-[0.18em] text-[#FFD700]">JOIN DISH SCORE</p>
				<h1 className="text-3xl font-extrabold text-white">Create your account</h1>
				<p className="text-sm text-[#a0a0a0]">Sign up as a reviewer or owner and start building your food reputation.</p>
			</div>

			<form
				className="space-y-4"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					void form.handleSubmit();
				}}
			>
				<form.Field
					name="role"
					validators={{
						onChange: ({ value }) => {
							const result = registerZodSchema.shape.role.safeParse(value);
							return result.success ? undefined : result.error.issues[0]?.message;
						},
					}}
				>
					{(field) => (
						<div className="space-y-2">
							<Label className="font-medium">Account Type</Label>
							<RadioGroup
								value={field.state.value}
								onValueChange={(value) => field.handleChange(value as "CONSUMER" | "OWNER")}
								className="grid grid-cols-2 gap-3"
							>
								<label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dark-border bg-[#121217] px-3 py-3 text-sm text-[#d7d7d7] transition-colors hover:border-[#FF5722]/60">
									<RadioGroupItem value="CONSUMER" />
									Reviewer
								</label>
								<label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dark-border bg-[#121217] px-3 py-3 text-sm text-[#d7d7d7] transition-colors hover:border-[#FF5722]/60">
									<RadioGroupItem value="OWNER" />
									Owner
								</label>
							</RadioGroup>
						</div>
					)}
				</form.Field>

				<form.Field
					name="image"
					children={(field) => {
						const selectedImagePreview = field.state.value ? URL.createObjectURL(field.state.value) : null;

						return (
						<div className="space-y-1.5">
							<Label htmlFor="image" className="font-medium">Profile Image (optional)</Label>
							<div className="relative">
								<Upload className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#a0a0a0]" />
								<input
									id="image"
									type="file"
									accept="image/*"
									onChange={(e) => field.handleChange(e.target.files?.[0] || null)}
									disabled={registerMutation.isPending}
									className="h-8 w-full rounded-lg border border-input bg-transparent pl-10 pr-3 text-sm text-[#d7d7d7] file:mr-3 file:rounded-md file:border-0 file:bg-[#FF5722] file:px-2 file:py-1 file:text-xs file:font-medium file:text-black focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
								/>
							</div>
							{selectedImagePreview ? (
								<div className="relative h-16 w-16 overflow-hidden rounded-md border border-dark-border">
									<img
										src={selectedImagePreview}
										alt="Selected profile preview"
										className="h-full w-full object-cover"
									/>
									<Button
										type="button"
										size="icon"
										variant="destructive"
										onClick={() => field.handleChange(null)}
										className="absolute right-0 top-0 h-5 w-5 rounded-bl-md rounded-tr-md p-0"
										aria-label="Remove selected profile image"
									>
										<X className="h-3 w-3" />
									</Button>
								</div>
							) : null}
						</div>
						);
					}}
				/>

				<form.Field
					name="name"
					validators={{
						onChange: ({ value }) => {
							const result = registerZodSchema.shape.name.safeParse(value);
							return result.success ? undefined : result.error.issues[0]?.message;
						},
					}}
				>
					{(field) => (
						<AppField
							field={field}
							label="Name"
							type="text"
							placeholder="Your full name"
							prepend={<User className="h-4 w-4 text-[#a0a0a0]" />}
							disabled={registerMutation.isPending}
						/>
					)}
				</form.Field>

				<form.Field
					name="email"
					validators={{
						onChange: ({ value }) => {
							const result = registerZodSchema.shape.email.safeParse(value);
							return result.success ? undefined : result.error.issues[0]?.message;
						},
					}}
				>
					{(field) => (
						<AppField
							field={field}
							label="Email"
							type="email"
							placeholder="you@example.com"
							prepend={<Mail className="h-4 w-4 text-[#a0a0a0]" />}
							disabled={registerMutation.isPending}
						/>
					)}
				</form.Field>

				<form.Field
					name="password"
					validators={{
						onChange: ({ value }) => {
							const result = registerZodSchema.shape.password.safeParse(value);
							return result.success ? undefined : result.error.issues[0]?.message;
						},
					}}
				>
					{(field) => (
						<AppField
							field={field}
							label="Password"
							type="password"
							placeholder="Enter your password"
							prepend={<Lock className="h-4 w-4 text-[#a0a0a0]" />}
							disabled={registerMutation.isPending}
						/>
					)}
				</form.Field>

				<form.Field
					name="confirmPassword"
					validators={{
						onChange: ({ value, fieldApi }) => {
							const values = fieldApi.form.state.values;
							if (!value) return "Confirm Password must be at least 8 characters long";
							if (value.length < 8) return "Confirm Password must be at least 8 characters long";
							if (values.password && values.password !== value) return "Passwords do not match";
							return undefined;
						},
					}}
				>
					{(field) => (
						<AppField
							field={field}
							label="Confirm Password"
							type="password"
							placeholder="Re-enter your password"
							prepend={<Lock className="h-4 w-4 text-[#a0a0a0]" />}
							disabled={registerMutation.isPending}
						/>
					)}
				</form.Field>

				{formError && (
					<div
						role="alert"
						className="rounded-lg border border-[#FF0040]/40 bg-[#FF0040]/10 px-3 py-2 text-sm text-[#ffd4dd]"
					>
						{formError}
					</div>
				)}

				<AppSubmitButton
					isPending={registerMutation.isPending}
					pendingLabel="Creating account..."
					className="btn-neon-primary mt-1"
				>
					Create Account
				</AppSubmitButton>
			</form>

			<div className="my-6 flex items-center gap-3">
				<div className="h-px flex-1 bg-dark-border" />
				<span className="text-xs uppercase tracking-[0.14em] text-[#7f7f7f]">or</span>
				<div className="h-px flex-1 bg-dark-border" />
			</div>

			<Button
				type="button"
				onClick={handleGoogleSignUp}
				variant="outline"
				className="btn-outline-neon w-full"
				disabled={registerMutation.isPending}
			>
				<span className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[11px] font-bold text-black">
					G
				</span>
				Continue with Google
			</Button>

			<p className="mt-6 text-center text-sm text-[#a0a0a0]">
				Already have an account?{" "}
				<Link href="/login" className="font-medium text-[#FFD700] transition-colors hover:text-[#FF5722]">
					Sign in
				</Link>
			</p>
		</div>
	);
}
