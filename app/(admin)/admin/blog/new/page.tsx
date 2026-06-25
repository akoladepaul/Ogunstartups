"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { createPost } from "@/lib/actions/posts";
import { Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "news", label: "News" },
  { value: "press_release", label: "Press Release" },
  { value: "founder_story", label: "Founder Story" },
  { value: "ecosystem", label: "Ecosystem" },
  { value: "opinion", label: "Opinion" },
  { value: "event", label: "Event" },
];

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    category: "news",
    tags: "",
    status: "draft" as "draft" | "published",
    featured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await createPost({
        ...form,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      });
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin/blog");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">New Blog Post</h1>
        <p className="text-neutral-500 mt-1">Write a press release, news article, or founder story.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-neutral-100 p-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={form.title} onChange={e => update("title", e.target.value)}
            placeholder="e.g. Ogun State Startup Raises ₦50M Seed Round" required className="mt-1.5 text-lg" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Category *</Label>
            <Select value={form.category} onValueChange={v => update("category", v)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status *</Label>
            <Select value={form.status} onValueChange={v => update("status", v)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt / Summary</Label>
          <Textarea id="excerpt" value={form.excerpt} onChange={e => update("excerpt", e.target.value)}
            rows={2} placeholder="1–2 sentence summary shown in cards and meta description" className="mt-1.5" />
        </div>

        <div>
          <Label htmlFor="content">Content *</Label>
          <Textarea id="content" value={form.content} onChange={e => update("content", e.target.value)}
            rows={16} placeholder="Write your article here. Use double line breaks to separate paragraphs..." className="mt-1.5 font-mono text-sm" required />
          <p className="text-xs text-neutral-400 mt-1">
            {form.content.split(/\s+/).filter(Boolean).length} words ·{" "}
            {Math.max(1, Math.ceil(form.content.split(/\s+/).filter(Boolean).length / 200))} min read
          </p>
        </div>

        <div>
          <Label htmlFor="coverImageUrl">Cover Image URL</Label>
          <Input id="coverImageUrl" type="url" value={form.coverImageUrl}
            onChange={e => update("coverImageUrl", e.target.value)}
            placeholder="https://..." className="mt-1.5" />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" value={form.tags} onChange={e => update("tags", e.target.value)}
            placeholder="startup, funding, agritech" className="mt-1.5" />
        </div>

        <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
          <input id="featured" type="checkbox" checked={form.featured}
            onChange={e => update("featured", e.target.checked)}
            className="h-4 w-4 accent-brand-green-600" />
          <Label htmlFor="featured" className="cursor-pointer">
            Feature this post (shown prominently on the blog homepage)
          </Label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">{error}</div>
        )}

        <div className="flex gap-3">
          <Button type="submit" variant="default" disabled={loading} className="gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : "Save Post"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
