"use client";

import {
  beachById,
  beachStorageKey,
  beaches,
  defaultBeachId,
  isBeachId,
  type BeachId,
} from "@/content/beaches";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type BeachContextValue = {
  beach: BeachId;
  announcement: string;
  select: (id: BeachId) => void;
};

const BeachContext = createContext<BeachContextValue | null>(null);

function useBeach() {
  const value = useContext(BeachContext);
  if (!value) {
    throw new Error("Beach controls must be inside the hero beach provider");
  }
  return value;
}

export function BeachProvider({ children }: { children: ReactNode }) {
  const [beach, setBeach] = useState<BeachId>(defaultBeachId);
  const [announcement, setAnnouncement] = useState("");
  const beachRef = useRef(beach);

  useLayoutEffect(() => {
    const stored = document.documentElement.dataset.beach;
    if (!isBeachId(stored) || stored === beachRef.current) return;
    beachRef.current = stored;
    setBeach(stored);
  }, []);

  const select = useCallback((id: BeachId) => {
    if (beachRef.current === id) return;
    beachRef.current = id;
    document.documentElement.dataset.beach = id;
    try {
      localStorage.setItem(beachStorageKey, id);
    } catch {
      /* Private browsing can reject storage writes. The choice still applies. */
    }
    setBeach(id);
    setAnnouncement(beachById(id).caption);
  }, []);

  return (
    <BeachContext.Provider value={{ beach, announcement, select }}>
      {children}
    </BeachContext.Provider>
  );
}

/** Polite announcement of the place name when the surf spot changes. */
export function BeachLive() {
  const { announcement } = useBeach();
  return (
    <span className="sr-only" aria-live="polite">
      {announcement}
    </span>
  );
}

export function BeachSwitcher() {
  const { beach, select } = useBeach();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (index: number) => {
    const next = beaches[index];
    if (!next) return;
    select(next.id);
    buttons.current[index]?.focus();
  };

  return (
    <div className="beaches">
      <div className="beach-seg" role="radiogroup" aria-label="Surf spot">
        {beaches.map((item, index) => {
          const selected = item.id === beach;
          return (
            <button
              key={item.id}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              role="radio"
              data-b={item.id}
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(item.id)}
              onKeyDown={(event) => {
                let next: number | null = null;
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  next = (index + 1) % beaches.length;
                } else if (
                  event.key === "ArrowLeft" ||
                  event.key === "ArrowUp"
                ) {
                  next = (index + beaches.length - 1) % beaches.length;
                } else if (event.key === "Home") {
                  next = 0;
                } else if (event.key === "End") {
                  next = beaches.length - 1;
                }
                if (next === null) return;
                event.preventDefault();
                move(next);
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
