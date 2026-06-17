import Link from "next/link";
import { getPosts } from "@/lib/actions/posts";
import { formatDate, getInitials } from "@/lib/utils";
import type { Metadata } from "next";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Press Room",
  description:
    "News, press releases, and founder stories from Ogun State's innovation ecosystem.",
};

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "news", label: "News" },
  { value: "press_release", label: "Press Releases" },
  { value: "founder_story", label: "Founder Stories" },
  { value: "ecosystem", label: "Ecosystem" },
  { value: "opinion", label: "Opinion" },
  { value: "event", label: "Events" },
];

const categoryVariant: Record<string, string> = {
  news: "bg-blue-100 text-blue-700",
  press_release: "bg-brand-green-100 text-brand-green-800",
  founder_story: "bg-purple-100 text-purple-700",
  ecosystem: "bg-teal-100 text-teal-700",
  opinion: "bg-orange-100 text-orange-700",
  event: "bg-pink-100 text-pink-700",
};

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);

  const result = await getPosts({
    category: params.category,
    page,
    limit: 12,
  });

  return (
    <div className="pt-16 min-h-screen bg-neutral-50">
      <div className="bg-brand-green-900 text-white py-10 sm:py-16">
        <div className="section-container text-center">
          <div className="inline-flex items-center gap-2 bg-brand-green-800 rounded-full px-4 py-1.5 text-sm mb-3 sm:mb-4">
            📰 Press Room
          </div>
          <h1 className="heading-2 text-white mb-2 sm:mb-3">Blog & Innovation Stories</h1>
          <p className="text-brand-green-200 max-w-xl mx-auto text-sm sm:text-base">
            Press releases, founder stories, ecosystem news, and insights from
            Ogun State&apos;s growing innovation community.
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-neutral-100 sticky top-16 z-10">
        <div className="section-container py-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              href={cat.value ? `/blog?category=${cat.value}` : "/blog"}
            >
              <button className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                (params.category ?? "") === cat.value
                  ? "bg-brand-green-600 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}>
                {cat.label}
              </button>
            </Link>
          ))}
        </div>
      </div>

      <div className="section-container py-6 sm:py-12">
        {result.data.length === 0 ? (
          <div className="text-center py-20 text-neutral-500">
            No posts published yet. Check back soon.
          </div>
        ) : (
          <>
            {page === 1 && result.data[0] && (
              <Link href={`/blog/${result.data[0].slug}`} className="block mb-6 sm:mb-12">
                <article className="bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="grid md:grid-cols-2">
                    <div className="h-48 sm:h-64 md:h-auto bg-gradient-to-br from-brand-green-100 to-brand-green-50">
                      {result.data[0].coverImageUrl && (
                        <img
                          src={result.data[0].coverImageUrl}
                          alt={result.data[0].title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-5 sm:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                          categoryVariant[result.data[0].category] ?? "bg-neutral-100 text-neutral-700"
                        }`}>
                          {result.data[0].category.replace("_", " ")}
                        </span>
                        {result.data[0].featured && (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-gold-100 text-brand-gold-700">
                            Featured
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-brand-green-700 transition-colors">
                        {result.data[0].title}
                      </h2>
                      <p className="text-neutral-500 line-clamp-3 mb-4 leading-relaxed">
                        {result.data[0].excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-neutral-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {result.data[0].publishedAt ? formatDate(new Date(result.data[0].publishedAt).toISOString()) : ""}
                        </div>
                        {result.data[0].readTimeMins && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {result.data[0].readTimeMins} min read
                          </div>
                        )}
                        <div className="flex items-center gap-1 ml-auto text-brand-green-600 font-medium">
                          Read more <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.data.slice(page === 1 ? 1 : 0).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="group h-full bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-md hover:border-brand-green-100 transition-all">
                    <div className="h-44 bg-gradient-to-br from-neutral-100 to-neutral-50">
                      {post.coverImageUrl && (
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                        categoryVariant[post.category] ?? "bg-neutral-100 text-neutral-700"
                      }`}>
                        {post.category.replace("_", " ")}
                      </span>
                      <h3 className="font-semibold text-neutral-900 mt-2 mb-2 line-clamp-2 group-hover:text-brand-green-700 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-neutral-500 line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <div className="h-5 w-5 rounded-full bg-brand-green-100 flex items-center justify-center text-brand-green-700 font-bold text-xs">
                          {getInitials(post.author?.name ?? "A")}
                        </div>
                        <span>{post.author?.name}</span>
                        <span>·</span>
                        <span>{post.readTimeMins ?? 1} min read</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {(result.totalPages ?? 1) > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {page > 1 && (
                  <Link href={`/blog?page=${page - 1}${params.category ? `&category=${params.category}` : ""}`}>
                    <button className="px-4 py-2 border border-neutral-200 rounded-lg text-sm hover:border-brand-green-300">
                      ← Previous
                    </button>
                  </Link>
                )}
                <span className="flex items-center px-4 text-sm text-neutral-500">
                  {page} / {result.totalPages ?? 1}
                </span>
                {page < (result.totalPages ?? 1) && (
                  <Link href={`/blog?page=${page + 1}${params.category ? `&category=${params.category}` : ""}`}>
                    <button className="px-4 py-2 border border-neutral-200 rounded-lg text-sm hover:border-brand-green-300">
                      Next →
                    </button>
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
