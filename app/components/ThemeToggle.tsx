"use client";

const THEME_KEY = "theme";
const THEME_COLOR = {
  sunrise: "#fcf4ec",
  sunset: "#121a2e",
} as const;

type ThemeName = keyof typeof THEME_COLOR;

function applyTheme(theme: ThemeName) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme === "sunset" ? "dark" : "light";
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute("content", THEME_COLOR[theme]);
  });
}

export function toggleTheme() {
  const next: ThemeName =
    document.documentElement.dataset.theme === "sunset" ? "sunrise" : "sunset";
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // Private browsing can block storage. The choice still applies for this view.
  }
}

export function ThemeToggle({ variant }: { variant: "nav" | "fab" }) {
  const className = variant === "fab" ? "theme-fab" : "theme-toggle";

  return (
    <button
      type="button"
      className={className}
      aria-label="Toggle sunrise or sunset theme"
      onClick={toggleTheme}
    >
      <span className="theme-face show-in-sunrise">
        <span className="icon" aria-hidden="true">
          ☀️
        </span>
        <span className="label">Sunset</span>
      </span>
      <span className="theme-face show-in-sunset">
        <span className="icon" aria-hidden="true">
          🌙
        </span>
        <span className="label">Sunrise</span>
      </span>
    </button>
  );
}
