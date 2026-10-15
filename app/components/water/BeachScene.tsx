import { grandviewMarkup } from "./scenes/grandview";
import { shipwrecksMarkup } from "./scenes/shipwrecks";
import { swamisMarkup } from "./scenes/swamis";

const scenes = [
  ["swamis", swamisMarkup],
  ["grandview", grandviewMarkup],
  ["shipwrecks", shipwrecksMarkup],
] as const;

export function BeachScene() {
  return (
    <svg
      className="scene"
      viewBox="0 0 1000 625"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {scenes.map(([id, markup]) => (
        <g
          key={id}
          className="beach"
          data-b={id}
          dangerouslySetInnerHTML={{ __html: markup }}
        />
      ))}
    </svg>
  );
}
