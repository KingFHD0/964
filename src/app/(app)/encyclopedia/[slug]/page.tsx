import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock, Share2 } from "lucide-react";
import { ARTICLES, getArticleBySlug } from "@/lib/ecosystem";
import { Badge } from "@/components/ui/Badge";
import { ArticleToc } from "@/components/encyclopedia/ArticleToc";
import { MarkdownLite } from "@/components/encyclopedia/MarkdownLite";
import { ReadingProgress } from "@/components/encyclopedia/ReadingProgress";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const a = getArticleBySlug(slug);
  if (!a) return { title: "Not found" };
  return { title: a.title, description: a.subtitle };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = ARTICLES.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 md:px-8 md:py-14 lg:grid-cols-[1fr_260px]">
        {/* Article */}
        <article className="min-w-0">
          <Link
            href="/encyclopedia"
            className="focus-ring inline-flex items-center gap-2 text-[12.5px] text-primary-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to encyclopedia
          </Link>

          <header className="mt-6">
            <div className="flex items-center gap-2">
              <Badge tone="default">{article.category}</Badge>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-primary-muted">
                <Clock className="h-3 w-3" />
                {article.readTime}
              </span>
            </div>
            <h1 className="mt-5 font-display text-display-md font-medium leading-[1.08] tracking-tight text-grad">
              {article.title}
            </h1>
            <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-primary/65">
              {article.subtitle}
            </p>
            <div className="mt-6 flex items-center justify-between gap-3 border-y border-white/[0.06] py-3 text-[12.5px] text-primary-muted">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-full border border-white/[0.08] bg-gradient-to-br from-accent/40 to-accent-secondary/40 text-[10.5px] font-medium text-white">
                  {article.author
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <span className="text-primary/85">{article.author}</span>
                <span className="h-1 w-1 rounded-full bg-white/15" />
                <span>{article.date}</span>
              </div>
              <button className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 transition-colors hover:border-white/[0.15] hover:text-primary">
                <Share2 className="h-3 w-3" />
                Share
              </button>
            </div>
          </header>

          <div className="prose-aether mt-10 max-w-2xl">
            <MarkdownLite source={article.body} />
          </div>

          {/* Related */}
          {related.length > 0 ? (
            <section className="mt-16 border-t border-white/[0.06] pt-10">
              <div className="text-[11px] uppercase tracking-[0.22em] text-primary-muted">Continue reading</div>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/encyclopedia/${r.slug}`}
                      className="card-premium group block p-4 lift ring-accent-hover"
                    >
                      <div className="text-[11px] uppercase tracking-[0.18em] text-primary-muted">
                        {r.category}
                      </div>
                      <div className="mt-2 font-display text-[15px] font-medium leading-snug tracking-tight text-primary">
                        {r.title}
                      </div>
                      <div className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-primary/60">
                        {r.subtitle}
                      </div>
                      <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-accent">
                        Read
                        <ArrowUpRight className="h-3 w-3" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>

        {/* Floating TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ArticleToc items={article.toc} />
          </div>
        </aside>
      </div>
    </>
  );
}
