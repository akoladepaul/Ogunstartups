import { z } from "zod";

export const startupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  tagline: z.string().min(10, "Tagline must be at least 10 characters").max(150),
  description: z.string().min(50, "Description must be at least 50 characters").max(2000),
  categories: z.array(z.string()).min(1, "Please select at least one sector").max(3, "Maximum 3 sectors allowed"),
  stage: z.enum(["idea", "mvp", "growth", "scale"]),
  lga: z.string().min(1, "Please select an LGA"),
  founded_year: z.coerce
    .number()
    .min(2000)
    .max(new Date().getFullYear())
    .optional()
    .nullable(),
  website_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  is_hiring: z.boolean().default(false),
  tags: z.array(z.string()).max(10).default([]),
  social_links: z
    .object({
      twitter: z.string().url().optional().or(z.literal("")),
      linkedin: z.string().url().optional().or(z.literal("")),
      instagram: z.string().url().optional().or(z.literal("")),
      facebook: z.string().url().optional().or(z.literal("")),
    })
    .default({}),
});

export type StartupFormData = z.infer<typeof startupSchema>;

export const productSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  price: z.coerce.number().min(0).optional().nullable(),
  currency: z.string().default("NGN"),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const orgSchema = z.object({
  name: z.string().min(2).max(100),
  tagline: z.string().min(10).max(150),
  description: z.string().min(50).max(2000),
  org_type: z.string().min(1, "Please select an organization type"),
  lga: z.string().min(1, "Please select an LGA"),
  founded_year: z.coerce.number().min(1990).max(new Date().getFullYear()).optional().nullable(),
  website_url: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).max(10).default([]),
  social_links: z.object({
    twitter: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
  }).default({}),
});

export type OrgFormData = z.infer<typeof orgSchema>;
