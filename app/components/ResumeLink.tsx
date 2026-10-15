"use client";

type ResumeLinkProps = {
  href: string;
  placeholder?: boolean;
  children: React.ReactNode;
};

export function ResumeLink({
  href,
  placeholder = false,
  children,
}: ResumeLinkProps) {
  return (
    <a
      href={href}
      aria-disabled={placeholder || undefined}
      data-todo={placeholder ? "resume" : undefined}
      onClick={
        placeholder
          ? (event) => {
              event.preventDefault();
            }
          : undefined
      }
    >
      {children}
    </a>
  );
}
