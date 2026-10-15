/** Experience copy. Employers are named; client work stays anonymized. */

export type ExperienceEntry = {
  id: string;
  title: string;
  period?: string;
  note?: string;
  summary?: string;
  tags?: readonly string[];
};

export type ExperienceGroup = {
  id: string;
  label: string;
  entries: readonly ExperienceEntry[];
};

export const experience: readonly ExperienceGroup[] = [
  {
    id: "current",
    label: "Currently",
    entries: [
      {
        id: "valtech",
        title:
          "Senior Full Stack Engineer · Valtech (formerly MJD Interactive)",
        period: "2017 — Present",
        note: "MJD was acquired by Valtech in 2022; I've worked with the team as a contractor and full-time.",
        summary:
          "Lead engineering and client demos, run discovery and estimation, and manage offshore engineers.",
      },
    ],
  },
  {
    id: "previous",
    label: "Previously",
    entries: [
      {
        id: "zeeto",
        title: "Software Engineer · Zeeto",
        period: "2016 — 2017",
      },
    ],
  },
];
