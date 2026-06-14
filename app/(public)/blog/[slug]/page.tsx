import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Eye, Tag } from "lucide-react";
import { getPostBySlug, getLatestPosts, incrementPostViews } from "@/lib/actions/posts";
import { formatDate, getInitials } from "@/lib/utils";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImageUrl ? [post.coverImageUrl] : [],
      type: "article",
    },
  };
}

const categoryLabels: Record<string, string> = {
  news: "News",
  press_release: "Press Release",
  founder_story: "Founder Story",
  ecosystem: "Ecosystem",
  opinion: "Opinion",
  event: "Event",
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, latest] = await Promise.all([
    getPostBySlug(slug),
    getLatestPosts(4),
  ]);

  if (!post) notFound();

  incrementPostViews(post.id).catch(() => {});

  const tags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="section-container pt-6">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-brand-green-600 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>

      {post.coverImageUrl && (
        <div className="section-container mb-8">
          <div className="rounded-2xl overflow-hidden h-72 lg:h-96">
            <img src={post.coverImageUrl} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className="section-container">
        <div className="grid lg:grid-cols-3 gap-12 pb-16">
          <article className="lg:col-span-2">
            <div className="mb-4">
              <span className="text-xs font-semibold text-brand-green-600 uppercase tracking-widest">
                {categoryLabels[post.category] ?? post.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mb-8 pb-8 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-brand-green-100 flex items-center justify-center text-brand-green-700 text-xs font-bold">
                  {getInitials(post.author?.name ?? "A")}
                </div>
                <span className="font-medium text-neutral-700">
                  {post.author?.name ?? "OgunStartups Team"}
                </span>
              </div>
              {post.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(new Date(post.publishedAt).toISOString())}
                </div>
              )}
              {post.readTimeMins && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTimeMins} min read
                </div>
              )}
              <div className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {post.viewCount} views
              </div>
            </div>

            <div className="prose prose-neutral max-w-none">
              {post.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-neutral-600 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-neutral-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-neutral-400" />
                  {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {post.startup && (
              <div className="mt-8 p-5 bg-brand-green-50 rounded-2xl border border-brand-green-100">
                <p className="text-sm text-brand-green-700 mb-2">Featured startup in this story:</p>
                <Link
                  href={`/startups/${post.startup.slug}`}
                  className="font-semibold text-brand-green-800 hover:underline"
                >
                  {post.startup.name} →
                </Link>
              </div>
            )}
          </article>

          <aside className="space-y-6">
            <div className="bg-neutral-50 rounded-2xl p-5">
              <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Latest Posts</h3>
              <div className="space-y-4">
                {latest
                  .filter((p) => p.slug !== post.slug)
                  .slice(0, 4)
                  .map((p) => (
                    <Link key={p.id} href={`/blog/${p.slug}`}>
                      <div className="group">
                        <div className="text-sm font-medium text-neutral-800 group-hover:text-brand-green-700 line-clamp-2 mb-1">
                          {p.title}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {p.publishedAt ? formatDate(new Date(p.publishedAt).toISOString()) : ""}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="bg-brand-green-900 rounded-2xl p-5 text-white">
              <h3 className="font-semibold mb-2 text-sm">Are you a founder?</h3>
              <p className="text-brand-green-200 text-xs mb-4 leading-relaxed">
                Get your startup story featured in our press room.
              </p>
              <Link
                href="/login"
                className="inline-block text-xs font-medium bg-brand-gold-500 text-white px-4 py-2 rounded-lg hover:bg-brand-gold-600 transition-colors"
              >
                List Your Startup →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
