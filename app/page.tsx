import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Invasion-Craft — SaaS for web, mobile & desktop",
  description:
    "Invasion-Craft builds purposeful SaaS products across web, mobile, and desktop. From your first idea to your next chapter.",
  openGraph: {
    title: "Invasion-Craft — SaaS for web, mobile & desktop",
    description:
      "Purposeful software. One connected experience. Discover SaaS development with Invasion-Craft.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Page() {
  return <HomeClient />;
}