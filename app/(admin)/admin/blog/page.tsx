import Link from "next/link";
import { getAllPostsAdmin } from "@/lib/actions/posts";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Plus, Edit, Eye } from "lucide-react";

export default async function AdminBlogPage() {
  const posts = await getAllPostsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Blog & Press Room</h1>
        <Link href="/admin/blog/new">
          <Button variant="default" size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> New Post
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Views</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900 line-clamp-1 max-w-xs">{post.title}</div>
                    {post.featured && (
                      <span className="text-xs text-brand-gold-600 font-medium">★ Featured</span>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize text-neutral-600 text-xs">
                    {post.category.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      post.status === "published" ? "bg-green-100 text-green-700"
                        : post.status === "draft" ? "bg-yellow-100 text-yellow-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{post.viewCount}</td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">
                    {formatDate(post.createdAt.toISOString())}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {post.status === "published" && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                            <Eye className="h-3 w-3" /> View
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/blog/${post.id}/edit`}>
                        <Button size="sm" variant="default" className="h-7 text-xs gap-1">
                          <Edit className="h-3 w-3" /> Edit
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-neutral-500 text-sm mb-4">No posts yet. Publish your first article.</p>
            <Link href="/admin/blog/new">
              <Button variant="default" size="sm">Create First Post</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
