import z from "zod";

export const contentSchema = z.object({
  title: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: "Title is required" }),
  contentType: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: "Content type is required" }),
  url: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => /^https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?.*$/.test(val), {
      message: "Invalid URL format. Please provide a valid URL.",
    }),
});

export type ContentSchema = z.infer<typeof contentSchema>;
