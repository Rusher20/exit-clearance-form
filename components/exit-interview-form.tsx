"use client"

import { CardHeader } from "./ui/card";
import { CardTitle } from "./ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { RadioGroup } from "./ui/radio-group";
import { RadioGroupItem } from "./ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button"



export default function ExitInterview(){
 
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

            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfiVKL6mfpJCnG5BgMKRcFSoODtRi6NWTvI4ZKBGIzHK6sUXg/viewform?embedded=true" width="900" height="500"  ></iframe>
                {/* <div>
                  <div className="flex space-y-2">
                    <RadioGroup
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="type" id="type" tabIndex={12} />
                        <Label htmlFor="type">Type of Work</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="compensation" id="compensation" tabIndex={13} />
                        <Label htmlFor="compensation">Compensation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lack" id="lack" tabIndex={14} />
                        <Label htmlFor="lack">Lack of Recognition</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="company" id="company" tabIndex={15} />
                        <Label htmlFor="company">Company Culture</Label>
                        </div>
                        </RadioGroup>
                        <div className="space-y-2">
                    <RadioGroup
                      className="space-y-2 ml-[8rem] "
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="quality" id="quality" tabIndex={16} />
                        <Label htmlFor="quality">Quality of Supervision</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="work" id="work" tabIndex={17} />
                        <Label htmlFor="work">Work Conditions</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="family" id="family" tabIndex={18} />
                        <Label htmlFor="family">Family Circumstances</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="termination" id="termination" tabIndex={19} />
                        <Label htmlFor="termination">Termination For Cause</Label>
                      </div>
                    </RadioGroup>
                      </div>
                      </div>
                     </div> */}

            </div>
            </div>
        </form>
        <h3 className="  mb-[5px]"> After filling up the form send the Exit_Clearance_Form.pdf in Gmail below: </h3>
        <Button
              type="button"
              onClick={handleComposeEmail}
              className="bg-green-600 hover:bg-green-700"
              tabIndex={33}
            >
              Compose Gmail
            </Button>
</div>
  </div>
    )
}