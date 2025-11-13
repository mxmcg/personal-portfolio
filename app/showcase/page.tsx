import Link from "next/link";
import { showcases } from "../lib/showcases";

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
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
          Back to Portfolio
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            UI Showcase
          </h1>
          <p className="text-lg text-muted-foreground">
            A collection of UI components and design patterns
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {showcases.map((showcase) => (
            <Link
              key={showcase.slug}
              href={`/showcase/${showcase.slug}`}
              className="group relative flex flex-col p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-accent/50 dark:hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
            >
              {/* Title */}
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                {showcase.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 flex-1">
                {showcase.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {showcase.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-accent/10 text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Arrow indicator */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-5 h-5 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state if no showcases */}
        {showcases.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No showcases available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
