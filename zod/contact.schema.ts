import z from "zod";

export const createContactZodSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(1, "Subject is required"),
  message: z.string().trim().min(1, "Message is required"),
});

export const replyContactZodSchema = z.object({
  subject: z.string().trim().min(1, "Subject is required"),
  message: z.string().trim().min(1, "Message is required"),
});

export const updateContactStatusZodSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED"], {
    message: "Status must be PENDING, IN_PROGRESS, or RESOLVED",
  }),
});

export type ICreateContactPayload = z.infer<typeof createContactZodSchema>;
export type IReplyContactPayload = z.infer<typeof replyContactZodSchema>;
export type IUpdateContactStatusPayload = z.infer<typeof updateContactStatusZodSchema>;
