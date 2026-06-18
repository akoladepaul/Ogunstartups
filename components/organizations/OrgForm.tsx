"use client";

import { useState } from "react";
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
import { createOrganization } from "@/lib/actions/organizations";
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
  { value: "venture_support", label: "Venture Support" },
];

export default function OrgForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState("");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<OrgFormData>({
    resolver: zodResolver(orgSchema),
    defaultValues: { tags: [], social_links: {} },
  });

  const onSubmit = async (data: OrgFormData) => {
    setLoading(true);
    setError(null);
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
    const result = await createOrganization(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
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
            <Input id="name" {...register("name")} placeholder="e.g. Ogun Tech Hub" className="mt-1.5" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="tagline">Tagline * <span className="text-neutral-400 font-normal">(max 150 chars)</span></Label>
            <Input id="tagline" {...register("tagline")} placeholder="What your organization does in one line" className="mt-1.5" />
            {errors.tagline && <p className="text-xs text-red-500 mt-1">{errors.tagline.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register("description")} rows={5}
              placeholder="Tell us about your mission, programs, and who you support..." className="mt-1.5" />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">Organization Type & Location</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Organization Type *</Label>
            <Select onValueChange={(v) => setValue("org_type", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {ORG_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.org_type && <p className="text-xs text-red-500 mt-1">{errors.org_type.message}</p>}
          </div>
          <div>
            <Label>LGA *</Label>
            <Select onValueChange={(v) => setValue("lga", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select LGA" /></SelectTrigger>
              <SelectContent>
                {ALL_LGAS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.lga && <p className="text-xs text-red-500 mt-1">{errors.lga.message}</p>}
          </div>
          <div>
            <Label htmlFor="founded_year">Founded Year</Label>
            <Input id="founded_year" type="number" min={1990} max={2025}
              {...register("founded_year")} placeholder="e.g. 2018" className="mt-1.5" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">Links</h2>
        <div className="space-y-3">
          <div>
            <Label htmlFor="website_url">Website URL</Label>
            <Input id="website_url" type="url" {...register("website_url")} placeholder="https://..." className="mt-1.5" />
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

      <Button type="submit" variant="default" size="lg" className="w-full" disabled={loading}>
        {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting...</> : "Submit for Review"}
      </Button>

      <p className="text-xs text-neutral-400 text-center">
        Your listing will be reviewed by our team before going live.
      </p>
    </form>
  );
}
