"use client";

import { Button } from "./ui/button";
import { CardHeader } from "./ui/card";
import { CardTitle } from "./ui/card";

export default function ExitInterview() {
  const doneFillingUp = () => {
    window.location.href = "/exit-page";
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-t from-sky-500 to-indigo-500 p-4 sm:p-8"
      style={{ backgroundAttachment: "fixed" }}
    >
      <div className="relative w-full max-w-5xl bg-white shadow-2xl rounded-3xl p-6 sm:p-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/PPSI.png"
            alt="ProgressPro Logo"
            className="h-20 object-contain"
          />
        </div>

        {/* Form Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">
            Please fill up the form below:
          </h3>

          <div className="w-full overflow-x-auto rounded-lg shadow">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSfiVKL6mfpJCnG5BgMKRcFSoODtRi6NWTvI4ZKBGIzHK6sUXg/viewform?embedded=true"
              width="100%"
              height="400"
              className="rounded-xl border border-gray-300"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
