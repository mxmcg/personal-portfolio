import { notFound } from "next/navigation";
import Link from "next/link";
import { showcases, getShowcaseBySlug } from "@/app/lib/showcases";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return showcases.map((showcase) => ({
    slug: showcase.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const showcase = getShowcaseBySlug(slug);

  if (!showcase) {
    return {
      title: "Showcase Not Found",
    };
  }

  return {
    title: `${showcase.title} - UI Showcase - Max McGee`,
    description: showcase.description,
  };
}

export default async function ShowcaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const showcase = getShowcaseBySlug(slug);

  if (!showcase) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        {/* Back Link */}
        <Link
          href="/showcase"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Showcase
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {showcase.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            {showcase.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {showcase.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/10 text-accent"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Showcase Content */}
        <div className="space-y-8">
          {/* Preview */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-foreground">Preview</h2>
            </div>
            <div className="px-6 py-12 bg-white dark:bg-slate-950">
              {showcase.component}
            </div>
          </div>

          {/* Code Snippet */}
          {showcase.codeSnippet && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-foreground">Code</h2>
              </div>
              <div className="px-6 py-6 bg-slate-50 dark:bg-slate-900">
                <pre className="p-4 bg-slate-100 dark:bg-slate-800 rounded overflow-x-auto">
                  <code className="text-sm text-foreground font-mono">
                    {showcase.codeSnippet}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
