import ExitInterview from "@/components/exit-interview-form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Exit Forms | ProgressPro",
  description:
    "Fill out and submit the official exit clearance form for ProgressPro.",
  icons: {
    icon: "/FINAL PPSI 3.png",
  },
};
export default function ExitInterviewForm() {
  return (
    <main>
      <ExitInterview/>
    </main>
  );
}
