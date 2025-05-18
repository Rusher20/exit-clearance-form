import Link from "next/link"

export default function ExitConfirmation(){
    return(
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-t from-sky-500 to-indigo-500 p-4 sm:p-8"
        style={{ backgroundAttachment: "fixed" }}>

            <div className="relative w-full max-w-5xl bg-white shadow-xl rounded-2xl p-4 sm:p-8">
<div className="flex justify-center mb-4">
    <Link href='/'> <img src="/PPSI.png" alt="ProgressPro Logo" className="h-20 object-contain" /></Link>
          </div>
          <div className="h-[100px]">
            <div><h1 className=" text-3xl mt-[5rem]"> Thank you for responding the forms! </h1></div>
          </div>
          </div>
    </div>
    )
}