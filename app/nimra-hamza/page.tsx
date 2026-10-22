import type { Metadata } from "next";

import NimraInvitation from "./nimra-invitation";
import "./nimra.css";

export const metadata: Metadata = {
  title: "Nimra Javed & Hamza Ishfaq | Wedding Invitation",
  description:
    "You are cordially invited to the wedding celebrations of Nimra Javed and Hamza Ishfaq.",
};

export default function NimraHamzaPage() {
  return <NimraInvitation />;
}