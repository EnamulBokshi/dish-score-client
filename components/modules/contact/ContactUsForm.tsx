"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createContactMessage } from "@/services/contact-us.serice";
import { createContactZodSchema } from "@/zod/contact.schema";

const firstIssue = (error: unknown): string | undefined => {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    const maybeMessage = (error as { message?: unknown }).message;
    return typeof maybeMessage === "string" ? maybeMessage : undefined;
  }

  return undefined;
};

export default function ContactUsForm() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMutation = useMutation({
    mutationFn: createContactMessage,
    onSuccess: () => {
      toast.success("Your message has been sent successfully.");
      form.reset();
      setIsSubmitted(true);
      router.push("/contact/thank-you");
    },
    onError: (error) => {
      const message = firstIssue(error) || "Failed to submit your message";
      toast.error(message);
      setIsSubmitted(false);
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitted(false);

      const normalizedPayload = {
        name: value.name.trim(),
        email: value.email.trim(),
        phone: value.phone.trim() || undefined,
        subject: value.subject.trim(),
        message: value.message.trim(),
      };

      const parsed = createContactZodSchema.safeParse(normalizedPayload);

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Invalid contact input");
        return;
      }

      await contactMutation.mutateAsync(parsed.data);
    },
  });

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              const result = createContactZodSchema.shape.name.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9f7b6d] dark:text-[#d7c6be]">
                Full Name
              </label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="Your name"
                aria-invalid={Boolean(field.state.meta.errors.length)}
                className="h-11 border-[#ead9d1] bg-white text-gray-900 placeholder:text-[#9f857a] dark:border-[#5a465f] dark:bg-[#191224] dark:text-[#f2e8e3] dark:placeholder:text-[#9f91a9] dark:focus-visible:ring-[#b47cff]/30"
                disabled={contactMutation.isPending}
              />
              {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                <p className="text-xs text-red-500">{String(field.state.meta.errors[0])}</p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = createContactZodSchema.shape.email.safeParse(value.trim());
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-1.5">
              <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9f7b6d] dark:text-[#d7c6be]">
                Email Address
              </label>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="you@example.com"
                aria-invalid={Boolean(field.state.meta.errors.length)}
                className="h-11 border-[#ead9d1] bg-white text-gray-900 placeholder:text-[#9f857a] dark:border-[#5a465f] dark:bg-[#191224] dark:text-[#f2e8e3] dark:placeholder:text-[#9f91a9] dark:focus-visible:ring-[#b47cff]/30"
                disabled={contactMutation.isPending}
              />
              {field.state.meta.isTouched && field.state.meta.errors[0] ? (
                <p className="text-xs text-red-500">{String(field.state.meta.errors[0])}</p>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field
        name="phone"
        validators={{
          onChange: ({ value }) => {
            const normalized = value.trim() || undefined;
            const result = createContactZodSchema.shape.phone.safeParse(normalized);
            return result.success ? undefined : result.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9f7b6d] dark:text-[#d7c6be]">
              Phone (optional)
            </label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="+1 555 000 0000"
              aria-invalid={Boolean(field.state.meta.errors.length)}
              className="h-11 border-[#ead9d1] bg-white text-gray-900 placeholder:text-[#9f857a] dark:border-[#5a465f] dark:bg-[#191224] dark:text-[#f2e8e3] dark:placeholder:text-[#9f91a9] dark:focus-visible:ring-[#b47cff]/30"
              disabled={contactMutation.isPending}
            />
            {field.state.meta.isTouched && field.state.meta.errors[0] ? (
              <p className="text-xs text-red-500">{String(field.state.meta.errors[0])}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="subject"
        validators={{
          onChange: ({ value }) => {
            const result = createContactZodSchema.shape.subject.safeParse(value);
            return result.success ? undefined : result.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9f7b6d] dark:text-[#d7c6be]">
              Subject
            </label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="How can we help?"
              aria-invalid={Boolean(field.state.meta.errors.length)}
              className="h-11 border-[#ead9d1] bg-white text-gray-900 placeholder:text-[#9f857a] dark:border-[#5a465f] dark:bg-[#191224] dark:text-[#f2e8e3] dark:placeholder:text-[#9f91a9] dark:focus-visible:ring-[#b47cff]/30"
              disabled={contactMutation.isPending}
            />
            {field.state.meta.isTouched && field.state.meta.errors[0] ? (
              <p className="text-xs text-red-500">{String(field.state.meta.errors[0])}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="message"
        validators={{
          onChange: ({ value }) => {
            const result = createContactZodSchema.shape.message.safeParse(value);
            return result.success ? undefined : result.error.issues[0]?.message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-1.5">
            <label htmlFor={field.name} className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9f7b6d] dark:text-[#d7c6be]">
              Message
            </label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Share your feedback, issue, or idea..."
              aria-invalid={Boolean(field.state.meta.errors.length)}
              className="min-h-36 border-[#ead9d1] bg-white text-gray-900 placeholder:text-[#9f857a] dark:border-[#5a465f] dark:bg-[#191224] dark:text-[#f2e8e3] dark:placeholder:text-[#9f91a9] dark:focus-visible:ring-[#b47cff]/30"
              disabled={contactMutation.isPending}
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
          className="h-10 rounded-full bg-[#6e5a52] px-5 text-white hover:bg-[#5e4c45]"
          disabled={contactMutation.isPending}
        >
          {contactMutation.isPending ? "Submitting..." : "Submit Message"}
        </Button>
        {isSubmitted ? (
          <p className="text-xs font-medium text-[#2f7a45] dark:text-[#7dde9c]" role="status" aria-live="polite">
            Thanks, we received your message. Our team will reach out soon.
          </p>
        ) : (
          <p className="text-xs text-[#8b756c] dark:text-[#b7a9a2]">Your message will be delivered securely to our support team.</p>
        )}
      </div>
    </form>
  );
}
