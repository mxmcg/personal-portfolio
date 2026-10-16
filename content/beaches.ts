/** Surf spots for the hero. Swell numbers match the approved water scene. */

export const beachIds = ["swamis", "grandview", "shipwrecks"] as const;

export type BeachId = (typeof beachIds)[number];

export type BeachMotion = {
  slope: number;
  gap: number;
  peel: number;
  tint: number;
};

export type Beach = BeachMotion & {
  id: BeachId;
  label: string;
  caption: string;
};

export const beachStorageKey = "beach";

export const defaultBeachId: BeachId = "swamis";

/** How long a beach change takes, in milliseconds. */
export const beachCrossfadeMs = 700;

/**
 * Shipwrecks blends the water toward this reef color.
 * Values are linear 0–1, same as the water shader.
 */
export const reefWater = {
  sunrise: {
    top: [0.33, 0.8, 0.78] as const,
    bot: [0.05, 0.42, 0.48] as const,
  },
  sunset: {
    top: [0.24, 0.42, 0.54] as const,
    bot: [0.05, 0.15, 0.26] as const,
  },
};

export const beaches: readonly Beach[] = [
  {
    id: "swamis",
    label: "Swamis",
    caption: "Swamis · Cardiff, CA",
    slope: -0.09,
    gap: 0.18,
    peel: 0.035,
    tint: 0,
  },
  {
    id: "grandview",
    label: "Grandview",
    caption: "Grandview · Leucadia, CA",
    slope: 0,
    gap: 0.62,
    peel: 0,
    tint: 0,
  },
  {
    id: "shipwrecks",
    label: "Shipwrecks",
    caption: "Shipwrecks · Poipu, Kauai",
    slope: -0.03,
    gap: 0.35,
    peel: 0.008,
    tint: 1,
  },
];

export function isBeachId(value: string | null | undefined): value is BeachId {
  return value === "swamis" || value === "grandview" || value === "shipwrecks";
}

export function beachById(id: BeachId): Beach {
  const beach = beaches.find((item) => item.id === id);
  return beach ?? beaches[0];
}
