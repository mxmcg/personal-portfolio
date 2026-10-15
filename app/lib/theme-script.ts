/**
 * Runs before paint. Restores a saved Sunrise/Sunset choice, otherwise
 * follows the system color scheme. Migrates the previous light/dark value.
 */
export const themeInitScript = `
(function () {
  try {
    var key = "theme";
    var stored = localStorage.getItem(key);
    var theme =
      stored === "sunrise" || stored === "sunset"
        ? stored
        : stored === "dark"
          ? "sunset"
          : stored === "light"
            ? "sunrise"
            : window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "sunset"
              : "sunrise";
    var root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme === "sunset" ? "dark" : "light";
    if (stored === "dark" || stored === "light" || stored === "system") {
      localStorage.setItem(key, theme);
    }
  } catch (e) {}
})();
`;
