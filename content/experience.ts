/** Experience copy. Set `draft: true` to keep the dashed badge on an entry. */

export type ExperienceEntry = {
  id: string;
  title: string;
  period?: string;
  summary: string;
  tags?: readonly string[];
  draft?: boolean;
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
        title: "Senior Software Engineer · Valtech",
        period: "2022 — Present",
        summary:
          "Lead full-stack development and architect headless CMS and e-commerce platforms for large enterprise clients.",
        tags: [
          "React",
          "React Native",
          "Next.js",
          "TypeScript",
          "GraphQL",
          "Contentstack",
          "AWS",
        ],
      },
    ],
  },
  {
    id: "previous",
    label: "Previously",
    entries: [
      {
        id: "mjd",
        title: "MJD Interactive",
        summary: "Digital agency work for brand clients.",
        draft: true,
      },
      {
        id: "nations",
        title: "Nations Media",
        summary: "Web development for media and marketing clients.",
        draft: true,
      },
      {
        id: "zeeto",
        title: "Front End Engineer · Zeeto",
        period: "2016 — 2017",
        summary:
          "Built React and Node.js applications; A/B testing lifted revenue 2–8%.",
        tags: ["React", "Node.js", "Redux"],
      },
    ],
  },
];
