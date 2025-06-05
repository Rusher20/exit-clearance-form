import ExitConfirmation from "@/components/exit-page";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Exit Forms | ProgressPro",
  description:
    "Fill out and submit the official exit clearance form for ProgressPro.",
  icons: {
    icon: "/FINAL PPSI 3.png",
  },
};
export default function ExitConfirmationPage() {
  return (
    <main>
      <ExitConfirmation />
    </main>
  );
}




