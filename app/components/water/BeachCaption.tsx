import { beaches } from "@/content/beaches";

/** Visible place name. Which span shows is chosen with the beach attribute. */
export function BeachCaption() {
  return (
    <span className="beach-cap" id="beach-caption">
      {beaches.map((beach) => (
        <span key={beach.id} data-b={beach.id}>
          {beach.caption}
        </span>
      ))}
    </span>
  );
}
