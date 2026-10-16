import { navItems } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="site-header">
      <a className="logo home-mark" href="#top" aria-label="Max McGee, home">
        <svg className="hm" viewBox="-5 0 50 40" aria-hidden="true" focusable="false">
          <rect className="hm-sky" x="-5" width="50" height="40" />
          <rect className="hm-band1" x="-5" y="13" width="50" height="7" />
          <rect className="hm-band2" x="-5" y="19" width="50" height="8" />
          <g className="hm-stars">
            <circle className="hm-star" cx="1" cy="7" r="0.55" />
            <circle className="hm-star" cx="6" cy="6" r="0.7" />
            <circle className="hm-star t2" cx="14" cy="10" r="0.5" />
            <circle className="hm-star t3" cx="27" cy="5" r="0.6" />
            <circle className="hm-star t2" cx="34" cy="11" r="0.5" />
            <circle className="hm-star" cx="21" cy="3.5" r="0.45" />
            <circle className="hm-star t3" cx="41" cy="8" r="0.55" />
          </g>
          <g className="hm-moonarc">
            <circle className="hm-moon" cx="20" cy="9" r="2.6" />
            <circle className="hm-mooncut" cx="21.4" cy="8" r="2.2" />
          </g>
          <path className="hm-hill" d="M-6 30 Q9 19 21 24 Q31 28 46 23 V40 H-6 Z" />
          <path className="hm-roof" d="M8 21 L14.5 15.5 L21 21 Z" />
          <rect className="hm-wall" x="9.5" y="21" width="10" height="6.5" />
          <rect className="hm-win" x="13" y="22.8" width="3" height="3" rx="0.6" />
          <g className="hm-sunarc">
            <circle className="hm-sunglow" cx="20" cy="14.5" r="5.5" />
            <circle className="hm-sun" cx="20" cy="14.5" r="3.2" />
          </g>
          <rect className="hm-sea" x="-5" y="29" width="50" height="11" />
          <path
            className="hm-wave"
            d="M-20 30 q5 -2.2 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 V40 H-20 Z"
          />
        </svg>
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
