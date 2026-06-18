"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Pencil, Trash2, Package, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getMyStartup } from "@/lib/actions/startups";
import { createProduct, updateProduct, deleteProduct } from "@/lib/actions/products";

interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  url: string | null;
  price: unknown;
  currency: string;
  createdAt: Date;
}

type FormState = {
  name: string;
  description: string;
  url: string;
  price: string;
  currency: string;
  imageUrl: string;
};

const EMPTY_FORM: FormState = { name: "", description: "", url: "", price: "", currency: "NGN", imageUrl: "" };

export default function ProductsPage() {
  const [startupId, setStartupId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    getMyStartup().then((s) => {
      if (s) {
        setStartupId(s.id);
        setProducts((s.products ?? []) as Product[]);
      }
      setLoading(false);
    });
  }, []);

  const update = (k: keyof FormState, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const openCreate = () => { setEditId(null); setForm(EMPTY_FORM); setShowForm(true); setError(null); };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      url: p.url ?? "",
      price: p.price != null ? String(p.price) : "",
      currency: p.currency,
      imageUrl: p.imageUrl ?? "",
    });
    setShowForm(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startupId) return;
    setSaving(true);
    setError(null);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));

    const result = editId
      ? await updateProduct(editId, fd)
      : await createProduct(startupId, fd);

    if (result?.error) {
      setError(result.error);
    } else {
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditId(null);
      const startup = await getMyStartup();
      if (startup) setProducts((startup.products ?? []) as Product[]);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const result = await deleteProduct(id);
    if (!result?.error) {
      setProducts((p) => p.filter((x) => x.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-brand-green-600" />
      </div>
    );
  }

  if (!startupId) {
    return (
      <div className="max-w-lg">
        <div className="bg-white rounded-2xl border border-neutral-100 p-8 text-center">
          <Package className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">No Startup Yet</h2>
          <p className="text-neutral-500 text-sm">
            Register your startup first before adding products.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Products & Services</h1>
          <p className="text-neutral-500 mt-1 text-sm">Showcase what your startup offers.</p>
        </div>
        {!showForm && (
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-100 p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-neutral-900">{editId ? "Edit Product" : "New Product"}</h2>

          <div>
            <Label htmlFor="p-name">Name *</Label>
            <Input id="p-name" value={form.name} onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. AgroScan Mobile App" required className="mt-1.5" />
          </div>

          <div>
            <Label htmlFor="p-desc">Description *</Label>
            <Textarea id="p-desc" value={form.description} onChange={(e) => update("description", e.target.value)}
              rows={3} placeholder="Brief description of the product or service" required className="mt-1.5" />
          </div>

          <div>
            <Label htmlFor="p-url">Product Link <span className="text-neutral-400 font-normal">(optional)</span></Label>
            <Input id="p-url" type="url" value={form.url}
              onChange={(e) => update("url", e.target.value)} placeholder="https://..." className="mt-1.5" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="p-price">Price (optional)</Label>
              <Input id="p-price" type="number" min="0" step="0.01" value={form.price}
                onChange={(e) => update("price", e.target.value)} placeholder="0.00" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="p-currency">Currency</Label>
              <Input id="p-currency" value={form.currency} onChange={(e) => update("currency", e.target.value)}
                placeholder="NGN" className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label htmlFor="p-image">Image URL (optional)</Label>
            <Input id="p-image" type="url" value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)} placeholder="https://..." className="mt-1.5" />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">{error}</div>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : editId ? "Save Changes" : "Add Product"}
            </Button>
            <Button type="button" variant="outline"
              onClick={() => { setShowForm(false); setEditId(null); setError(null); }}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {products.length === 0 && !showForm && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-8 text-center">
            <Package className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 text-sm">No products yet. Click "Add Product" to get started.</p>
          </div>
        )}

        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-neutral-100 p-4 flex items-start gap-4">
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.name} className="h-14 w-14 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="h-14 w-14 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                <Package className="h-6 w-6 text-neutral-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-neutral-900">{p.name}</div>
              <p className="text-sm text-neutral-500 line-clamp-2 mt-0.5">{p.description}</p>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {p.price != null && (
                  <p className="text-sm font-semibold text-brand-green-600">
                    ₦{Number(p.price).toLocaleString()} {p.currency}
                  </p>
                )}
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-green-600 hover:underline">
                    <ExternalLink className="h-3 w-3" /> View Product
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => openEdit(p)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => handleDelete(p.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
