import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UI Showcase - Max McGee",
  description: "A collection of UI components and design patterns",
};

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
