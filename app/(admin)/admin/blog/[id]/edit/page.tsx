"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { updatePost, getAllPostsAdmin } from "@/lib/actions/posts";
import type { Post } from "@/lib/actions/posts";
import { Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "news", label: "News" },
  { value: "press_release", label: "Press Release" },
  { value: "founder_story", label: "Founder Story" },
  { value: "ecosystem", label: "Ecosystem" },
  { value: "opinion", label: "Opinion" },
  { value: "event", label: "Event" },
];

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    category: "news",
    tags: "",
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
  });

  useEffect(() => {
    getAllPostsAdmin().then((posts) => {
      const found = posts.find((p) => p.id === params.id);
      if (found) {
        setPost(found);
        setForm({
          title: found.title,
          excerpt: found.excerpt ?? "",
          content: found.content,
          coverImageUrl: found.coverImageUrl ?? "",
          category: found.category,
          tags: Array.isArray(found.tags) ? (found.tags as string[]).join(", ") : "",
          status: found.status,
          featured: found.featured,
        });
      }
      setFetching(false);
    });
  }, [params.id]);

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await updatePost(params.id, {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        status: form.status,
      }) as { success?: boolean; error?: string } | undefined;
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

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-green-600" />
      </div>
    );
  }

  if (!post) {
    return <div className="text-neutral-500 py-8">Post not found.</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Edit Post</h1>
        <p className="text-neutral-500 mt-1 text-sm">/{post.slug}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-neutral-100 p-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={form.title} onChange={(e) => update("title", e.target.value)}
            required className="mt-1.5 text-lg" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label>Category *</Label>
            <Select value={form.category} onValueChange={(v) => update("category", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status *</Label>
            <Select value={form.status} onValueChange={(v) => update("status", v)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="h-4 w-4 accent-brand-green-600" />
              <span className="text-sm text-neutral-700">Featured</span>
            </label>
          </div>
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)}
            rows={2} className="mt-1.5" />
        </div>

        <div>
          <Label htmlFor="content">Content *</Label>
          <Textarea id="content" value={form.content} onChange={(e) => update("content", e.target.value)}
            rows={18} className="mt-1.5 font-mono text-sm" required />
          <p className="text-xs text-neutral-400 mt-1">
            {form.content.split(/\s+/).filter(Boolean).length} words ·{" "}
            {Math.max(1, Math.ceil(form.content.split(/\s+/).filter(Boolean).length / 200))} min read
          </p>
        </div>

        <div>
          <Label htmlFor="coverImageUrl">Cover Image URL</Label>
          <Input id="coverImageUrl" type="url" value={form.coverImageUrl}
            onChange={(e) => update("coverImageUrl", e.target.value)} className="mt-1.5" />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" value={form.tags} onChange={(e) => update("tags", e.target.value)}
            placeholder="startup, funding, agritech" className="mt-1.5" />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">{error}</div>
        )}

        <div className="flex gap-3">
          <Button type="submit" variant="default" disabled={loading} className="gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
