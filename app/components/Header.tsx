import { navItems } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="site-header">
      <a className="logo" href="#top">
        max<span>.</span>mcgee
      </a>
      <div className="nav-right">
        <nav className="primary-nav" aria-label="Primary">
          <ul className="nav-desktop">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle variant="nav" />
      </div>
    </header>
  );
}
