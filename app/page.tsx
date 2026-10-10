import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Invation-Craft — SaaS for web, mobile & desktop",
  description:
    "Invation-Craft builds purposeful SaaS products across web, mobile, and desktop. From your first idea to your next chapter.",
  openGraph: {
    title: "Invation-Craft — SaaS for web, mobile & desktop",
    description:
      "Purposeful software. One connected experience. Discover SaaS development with Invation-Craft.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Page() {
  return <HomeClient />;
}