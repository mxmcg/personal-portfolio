import Link from "next/link";
import { beaches } from "@/content/beaches";

/** Visible place name. Which span shows is chosen with the beach attribute. */
export function BeachCaption() {
  return (
    <span className="beach-cap" id="beach-caption">
      {beaches.map((beach) => (
        <span key={beach.id} data-b={beach.id}>
          {beach.id === "shipwrecks" ? (
            <Link href="/lab/shipwrecks" prefetch={false} title="Watch the surf at Shipwrecks">
              {beach.caption}
              <span className="beach-cap-go" aria-hidden="true">
                ↗
              </span>
            </Link>
          ) : (
            beach.caption
          )}
        </span>
      ))}
    </span>
  );
}
