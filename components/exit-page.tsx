import Link from "next/link";
export default function ExitConfirmation() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-t from-sky-500 to-indigo-500 p-4 sm:p-8"
      style={{ backgroundAttachment: "fixed" }}
    >
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-10 animate-fade-in">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <img
              src="/PPSI.png"
              alt="ProgressPro Logo"
              className="h-20 object-contain"
            />
          </Link>
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">
            Thank you for responding to the form!
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Your response has been successfully recorded. You may now return to
            the home page.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-3 rounded-full bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}