import type { Metadata } from "next";

import NimraInvitation from "./nimra-invitation";
import "./nimra.css";

export const metadata: Metadata = {
  title: "Nimra Javed & Hamza Ishfaq | Wedding Invitation",
  description:
    "Wedding celebrations of Nimra Javed and Hamza Ishfaq — 9 & 10 November 2026.",
};

export default function NimraHamzaPage() {
  return <NimraInvitation />;
}