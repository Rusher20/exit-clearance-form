"use client"

import { CardHeader } from "./ui/card";
import { CardTitle } from "./ui/card";
import Link from "next/link";

export default function ExitInterview() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-t from-sky-500 to-indigo-500 p-4 sm:p-8"
      style={{ backgroundAttachment: "fixed" }}
    >
      <div className="relative w-full max-w-5xl bg-white shadow-xl rounded-2xl p-4 sm:p-8">
        <div className="flex justify-center mb-4">
          <img src="/PPSI.png" alt="ProgressPro Logo" className="h-20 object-contain" />
        </div>
        <form>
          <CardHeader className="bg-gray-100 py-2 px-4">
            <CardTitle className="text-center text-lg font-bold">EXIT INTERVIEW FORM</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1  gap-4 mb-6">
            <div className="space-y-4">

              <h3 className=" text-lg mb-[5px]"> Please fill up the form: </h3>

              <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfiVKL6mfpJCnG5BgMKRcFSoODtRi6NWTvI4ZKBGIzHK6sUXg/viewform?embedded=true" width="900" height="400"  ></iframe>

            </div>
          </div>
        </form>
        </div>
      </div>
  )
}