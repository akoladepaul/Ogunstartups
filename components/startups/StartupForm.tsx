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
import { startupSchema, type StartupFormData } from "@/lib/validations/startup";
import { createStartup } from "@/lib/actions/startups";
import { SECTORS } from "@/constants/sectors";
import { ALL_LGAS } from "@/constants/lgas";
import { STAGES } from "@/constants/stages";
import ImageUpload from "@/components/ui/ImageUpload";

export default function StartupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<StartupFormData>({
    resolver: zodResolver(startupSchema),
    defaultValues: { is_hiring: false, tags: [], social_links: {}, categories: [] },
  });

  const toggleCategory = (value: string) => {
    let next: string[];
    if (selectedCategories.includes(value)) {
      next = selectedCategories.filter((c) => c !== value);
    } else if (selectedCategories.length < 3) {
      next = [...selectedCategories, value];
    } else {
      return;
    }
    setSelectedCategories(next);
    setValue("categories", next, { shouldValidate: true });
  };

  const onSubmit = async (data: StartupFormData) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== null && v !== undefined) {
        if (k === "categories" && Array.isArray(v)) {
          formData.set(k, (v as string[]).join(","));
        } else if (typeof v === "object") {
          formData.set(k, JSON.stringify(v));
        } else {
          formData.set(k, String(v));
        }
      }
    });
    if (logoUrl) formData.set("logoUrl", logoUrl);
    const result = await createStartup(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-2xl border border-neutral-100 p-6">
      {/* Basic info */}
      <div>
        <h2 className="font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <Label className="mb-1.5 block">Logo</Label>
            <ImageUpload value={logoUrl} onChange={setLogoUrl} label="Upload Logo" aspectRatio="square" />
          </div>
          <div>
            <Label htmlFor="name">Startup Name *</Label>
            <Input id="name" {...register("name")} placeholder="e.g. AgroNova" className="mt-1.5" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="tagline">Tagline * <span className="text-neutral-400 font-normal">(max 150 chars)</span></Label>
            <Input id="tagline" {...register("tagline")} placeholder="One sentence describing what you do" className="mt-1.5" />
            {errors.tagline && <p className="text-xs text-red-500 mt-1">{errors.tagline.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register("description")} rows={5}
              placeholder="Tell investors and partners about your startup, problem you solve, and traction..." className="mt-1.5" />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>
        </div>
      </div>

      {/* Sector & Stage */}
      <div>
        <h2 className="font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">Sector & Stage</h2>
        <div className="space-y-4">
          <div>
            <Label>
              Sector * <span className="text-neutral-400 font-normal">(pick up to 3)</span>
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {SECTORS.map((s) => {
                const selected = selectedCategories.includes(s.value);
                const maxReached = selectedCategories.length >= 3;
                return (
                  <button
                    key={s.value}
                    type="button"
                    disabled={!selected && maxReached}
                    onClick={() => toggleCategory(s.value)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                      selected
                        ? "bg-brand-green-600 text-white border-brand-green-600"
                        : maxReached
                        ? "bg-neutral-50 text-neutral-300 border-neutral-100 cursor-not-allowed"
                        : "bg-white text-neutral-600 border-neutral-200 hover:border-brand-green-400 hover:text-brand-green-700"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-neutral-400 mt-1.5">
              {selectedCategories.length} / 3 selected
            </p>
            {errors.categories && (
              <p className="text-xs text-red-500 mt-1">{(errors.categories as any).message ?? "Please select at least one sector"}</p>
            )}
          </div>
          <div>
            <Label>Stage *</Label>
            <Select onValueChange={(v) => setValue("stage", v as any)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.stage && <p className="text-xs text-red-500 mt-1">{errors.stage.message}</p>}
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h2 className="font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">Location</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>LGA *</Label>
            <Select onValueChange={(v) => setValue("lga", v)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                {ALL_LGAS.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.lga && <p className="text-xs text-red-500 mt-1">{errors.lga.message}</p>}
          </div>
          <div>
            <Label htmlFor="founded_year">Founded Year</Label>
            <Input id="founded_year" type="number" min={2000} max={2025}
              {...register("founded_year")} placeholder="e.g. 2022" className="mt-1.5" />
          </div>
        </div>
      </div>

      {/* Links */}
      <div>
        <h2 className="font-semibold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">Links</h2>
        <div className="space-y-3">
          <div>
            <Label htmlFor="website_url">Website URL</Label>
            <Input id="website_url" type="url" {...register("website_url")}
              placeholder="https://yourstartup.com" className="mt-1.5" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="twitter">Twitter / X</Label>
              <Input id="twitter" type="url" {...register("social_links.twitter")}
                placeholder="https://x.com/handle" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input id="linkedin" type="url" {...register("social_links.linkedin")}
                placeholder="https://linkedin.com/company/..." className="mt-1.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Hiring */}
      <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
        <input id="is_hiring" type="checkbox" {...register("is_hiring")} className="h-4 w-4 accent-brand-green-600" />
        <Label htmlFor="is_hiring" className="cursor-pointer">
          We are currently hiring / looking for co-founders
        </Label>
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
