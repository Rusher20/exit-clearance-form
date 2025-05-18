"use client"

import { Button } from "./ui/button";
import { CardHeader } from "./ui/card";
import { CardTitle } from "./ui/card";
import { toast } from "@/hooks/use-toast";




export default function ExitInterview(){
 const doneFillingUp= () =>{
  window.location.href= "/exit-page"
 }
  const handleComposeEmail = () => {
  

    const subject = encodeURIComponent(`Exit Clearance Form `)
    const body = encodeURIComponent(
      `Please find attached the exit clearance form.\n\n` +
        `Note: Please manually attach the downloaded PDF file named "Exit_Clearance_Form.pdf" to this email.`,
    )

    // Open Gmail compose window with pre-filled recipients and subject
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=hrteam@progresspro.com.ph&cc=itteam@progresspro.com.ph&su=${subject}&body=${body}`,
      "_blank",
    )

    toast({
      title: "Gmail Compose Opened",
      description: "Don't forget to attach the downloaded PDF file to your email.",
    })
  }
    return(
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
           <Button
              type="button"
              onClick={doneFillingUp}
            >
              Done
            </Button>
</div>
  </div>
    )
}