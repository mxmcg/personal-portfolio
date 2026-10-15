import { beachIds, beachStorageKey, defaultBeachId } from "@/content/beaches";

/** Runs before paint so a saved surf spot does not flash Swamis first. */
export const beachInitScript = `
(function () {
  try {
    var allowed = ${JSON.stringify([...beachIds])};
    var stored = localStorage.getItem(${JSON.stringify(beachStorageKey)});
    var beach =
      allowed.indexOf(stored) === -1
        ? ${JSON.stringify(defaultBeachId)}
        : stored;
    document.documentElement.setAttribute("data-beach", beach);
  } catch (e) {
    document.documentElement.setAttribute(
      "data-beach",
      ${JSON.stringify(defaultBeachId)}
    );
  }
})();
`;
