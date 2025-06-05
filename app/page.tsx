import ExitClearanceForm from "@/components/exit-clearance-form"
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Exit Forms | ProgressPro",
  description:
    "Fill out and submit the official exit clearance form for ProgressPro.",
  icons: {
    icon: "/FINAL PPSI 3.png",
  },
};
export default function Home() {
  return (
    <main>
      <ExitClearanceForm/>
    </main>
  )
}
