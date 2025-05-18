import ExitClearanceForm from "@/components/exit-clearance-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exit Clearance Form | ProgressPro",
  description:
    "Fill out and submit the official exit clearance form for ProgressPro.",
  icons: {
    icon: "/FINAL PPSI 3.png",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ExitClearanceForm />
    </main>
  );
}
