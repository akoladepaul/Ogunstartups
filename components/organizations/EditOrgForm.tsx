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
import { orgSchema, type OrgFormData } from "@/lib/validations/startup";
import { updateOrganization } from "@/lib/actions/organizations";
import { ALL_LGAS } from "@/constants/lgas";
import ImageUpload from "@/components/ui/ImageUpload";

const ORG_TYPES = [
  { value: "accelerator", label: "Accelerator" },
  { value: "incubator", label: "Incubator" },
  { value: "coworking", label: "Co-working Space" },
  { value: "angel_network", label: "Angel Network" },
  { value: "government_agency", label: "Government Agency" },
  { value: "ngo", label: "NGO / Foundation" },
  { value: "university_hub", label: "University Hub" },
  { value: "corporate_program", label: "Corporate Program" },
];

interface Props {
  org: {
    id: string;
    name: string;
    tagline: string | null;
    description: string | null;
    orgType: string | null;
    lga: string | null;
    foundedYear: number | null;
    websiteUrl: string | null;
    logoUrl: string | null;
    tags: unknown;
    socialLinks: unknown;
  };
}

export default function EditOrgForm({ org }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [logoUrl, setLogoUrl] = useState(org.logoUrl ?? "");

  const socialLinks = (org.socialLinks ?? {}) as Record<string, string>;
  const tags = Array.isArray(org.tags) ? (org.tags as string[]) : [];

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<OrgFormData>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      name: org.name,
      tagline: org.tagline ?? "",
      description: org.description ?? "",
      org_type: org.orgType ?? "",
      lga: org.lga ?? "",
      founded_year: org.foundedYear ?? undefined,
      website_url: org.websiteUrl ?? "",
      tags,
      social_links: {
        twitter: socialLinks.twitter ?? "",
        linkedin: socialLinks.linkedin ?? "",
      },
    },
  });

  const onSubmit = async (data: OrgFormData) => {
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
    if (logoUrl) formData.set("logoUrl", logoUrl);
    const result = await updateOrganization(org.id, formData);
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
            <ImageUpload value={logoUrl} onChange={setLogoUrl} label="Upload Logo" aspectRatio="square" />
          </div>
          <div>
            <Label htmlFor="name">Organization Name *</Label>
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
        <h2 className="font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">Type & Location</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Organization Type *</Label>
            <Select defaultValue={org.orgType ?? undefined} onValueChange={(v) => setValue("org_type", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {ORG_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>LGA *</Label>
            <Select defaultValue={org.lga ?? undefined} onValueChange={(v) => setValue("lga", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select LGA" /></SelectTrigger>
              <SelectContent>
                {ALL_LGAS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="founded_year">Founded Year</Label>
            <Input id="founded_year" type="number" min={1990} max={2025} {...register("founded_year")} className="mt-1.5" />
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

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-100">{error}</div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-100">Profile updated!</div>
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
