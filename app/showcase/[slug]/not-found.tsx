import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Showcase Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          The showcase you're looking for doesn't exist.
        </p>
        <Link
          href="/showcase"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-slate-900 font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          <svg
            className="w-4 h-4"
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
      </div>
    </div>
  );
}
