"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { startupSchema, type StartupFormData } from "@/lib/validations/startup";
import { updateStartup } from "@/lib/actions/startups";
import { SECTORS } from "@/constants/sectors";
import { ALL_LGAS } from "@/constants/lgas";
import { STAGES } from "@/constants/stages";
import ImageUpload from "@/components/ui/ImageUpload";

interface Props {
  startup: {
    id: string;
    name: string;
    tagline: string | null;
    description: string | null;
    category: string | null;
    stage: string | null;
    lga: string | null;
    foundedYear: number | null;
    websiteUrl: string | null;
    logoUrl: string | null;
    isHiring: boolean;
    tags: unknown;
    socialLinks: unknown;
  };
}

export default function EditStartupForm({ startup }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [logoUrl, setLogoUrl] = useState(startup.logoUrl ?? "");

  const socialLinks = (startup.socialLinks ?? {}) as Record<string, string>;
  const tags = Array.isArray(startup.tags) ? (startup.tags as string[]) : [];

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<StartupFormData>({
    resolver: zodResolver(startupSchema),
    defaultValues: {
      name: startup.name,
      tagline: startup.tagline ?? "",
      description: startup.description ?? "",
      category: startup.category ?? "",
      stage: (startup.stage as any) ?? undefined,
      lga: startup.lga ?? "",
      founded_year: startup.foundedYear ?? undefined,
      website_url: startup.websiteUrl ?? "",
      is_hiring: startup.isHiring,
      tags,
      social_links: {
        twitter: socialLinks.twitter ?? "",
        linkedin: socialLinks.linkedin ?? "",
        instagram: socialLinks.instagram ?? "",
        facebook: socialLinks.facebook ?? "",
      },
    },
  });

  const onSubmit = async (data: StartupFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== null && v !== undefined) {
        if (typeof v === "object") {
          formData.set(k, JSON.stringify(v));
        } else {
          formData.set(k, String(v));
        }
      }
    });
    formData.set("logoUrl", logoUrl);
    const result = await updateStartup(startup.id, formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-2xl border border-neutral-100 p-6">
      <div>
        <h2 className="font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <Label className="mb-1.5 block">Logo</Label>
            <ImageUpload value={logoUrl} onChange={setLogoUrl} label="Update Logo" aspectRatio="square" />
          </div>
          <div>
            <Label htmlFor="name">Startup Name *</Label>
            <Input id="name" {...register("name")} className="mt-1.5" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="tagline">Tagline *</Label>
            <Input id="tagline" {...register("tagline")} className="mt-1.5" />
            {errors.tagline && <p className="text-xs text-red-500 mt-1">{errors.tagline.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register("description")} rows={5} className="mt-1.5" />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">Sector & Stage</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Sector *</Label>
            <Select defaultValue={startup.category ?? undefined} onValueChange={(v) => setValue("category", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select sector" /></SelectTrigger>
              <SelectContent>
                {SECTORS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Stage *</Label>
            <Select defaultValue={startup.stage ?? undefined} onValueChange={(v) => setValue("stage", v as any)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select stage" /></SelectTrigger>
              <SelectContent>
                {STAGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">Location</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>LGA *</Label>
            <Select defaultValue={startup.lga ?? undefined} onValueChange={(v) => setValue("lga", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select LGA" /></SelectTrigger>
              <SelectContent>
                {ALL_LGAS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="founded_year">Founded Year</Label>
            <Input id="founded_year" type="number" min={2000} max={2025} {...register("founded_year")} className="mt-1.5" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">Links</h2>
        <div className="space-y-3">
          <div>
            <Label htmlFor="website_url">Website URL</Label>
            <Input id="website_url" type="url" {...register("website_url")} className="mt-1.5" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Twitter / X</Label>
              <Input type="url" {...register("social_links.twitter")} placeholder="https://x.com/handle" className="mt-1.5" />
            </div>
            <div>
              <Label>LinkedIn</Label>
              <Input type="url" {...register("social_links.linkedin")} placeholder="https://linkedin.com/company/..." className="mt-1.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
        <input id="is_hiring" type="checkbox" {...register("is_hiring")} className="h-4 w-4 accent-brand-green-600" />
        <Label htmlFor="is_hiring" className="cursor-pointer">
          We are currently hiring / looking for co-founders
        </Label>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-100">Profile updated successfully!</div>
      )}

      <div className="flex gap-3">
        <Button type="submit" variant="default" size="lg" disabled={loading} className="gap-2">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
