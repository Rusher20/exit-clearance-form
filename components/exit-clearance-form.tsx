"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import { toast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"


export default function ExitClearanceForm() {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    designation: "",
    department: "",
    office: "",
    empNo: "",
    contactNo: "",
    emailAddress: "",
    dateHired: "",
    dateSeparation: "",
    additionalNotes: "",

    reasonForSeparation: "",
    otherReason: "",
    employmentStatus: "",
  })

  const [signature, setSignature] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReasonChange = (value: string) => {
    setFormData((prev) => ({ ...prev, reasonForSeparation: value }))
  }

  const handleEmploymentStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, employmentStatus: value }))
  }

  const handleSignatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setSignature(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (!formData.reasonForSeparation) {
      toast({
        title: "Missing Information",
        description: "Please select a reason for separation.",
        variant: "destructive",
      })
      return
    }

    if (!formData.employmentStatus) {
      toast({
        title: "Missing Information",
        description: "Please select an employment status.",
        variant: "destructive",
      })
      return
    }

    if (!signature) {
      toast({
        title: "Missing Signature",
        description: "Please provide your signature before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Fetch the PDF template
      const templateResponse = await fetch("/exit-clearance-template.pdf")
      const templateArrayBuffer = await templateResponse.arrayBuffer()

      // Load the PDF document
      const pdfDoc = await PDFDocument.load(templateArrayBuffer)
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]

      // Embed font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

      // Set text options
      const textOptions = {
        font: helveticaFont,
        size: 9,
        color: rgb(0, 0, 0),
      }

      // Fill in the form fields
      // Name section
      firstPage.drawText(formData.lastName, { x: 67, y: 705, ...textOptions })
      firstPage.drawText(formData.firstName, { x: 181, y: 705, ...textOptions })
      firstPage.drawText(formData.middleName, { x: 315, y: 705, ...textOptions })

      // Department and Office
      firstPage.drawText(formData.designation, { x: 84, y: 693, ...textOptions })
      firstPage.drawText(formData.empNo, { x: 240, y: 693, ...textOptions })
      firstPage.drawText(formData.department, { x: 387, y: 705, ...textOptions })
      firstPage.drawText(formData.office, { x: 500, y: 705, ...textOptions })

      // Contact info, Email, Date Hired, Date Separated
      firstPage.drawText(formData.emailAddress, { x: 85, y: 680, ...textOptions, size: 7 })
      firstPage.drawText(formData.contactNo, { x: 250, y: 680, ...textOptions })
      firstPage.drawText(formData.dateHired, { x: 413, y: 680, ...textOptions })
      firstPage.drawText(formData.dateSeparation, { x: 530, y: 680, ...textOptions, size: 8 })

      // Reason for Separation - Mark the selected reason
      const reasonPositions = {
        voluntaryResignation: { x: 49, y: 656 },
        endOfProbationary: { x: 49, y: 643 },
        redundancy: { x: 49, y: 631 },
        promotion: { x: 49, y: 618 },
        others: { x: 49, y: 605 },
        transferOfBranch: { x: 229, y: 656 },
        awol: { x: 229, y: 644 },
        discontinuance: { x: 229, y: 631 },
        termination: { x: 229, y: 618 },
      }

      const selectedReason = formData.reasonForSeparation
      if (selectedReason && reasonPositions[selectedReason as keyof typeof reasonPositions]) {
        const position = reasonPositions[selectedReason as keyof typeof reasonPositions]
        firstPage.drawText("X", { x: position.x, y: position.y, ...textOptions, size: 7 })

        // If "others" is selected, add the other reason text
        if (selectedReason === "others" && formData.otherReason) {
          firstPage.drawText(formData.otherReason, { x: 90, y: 605, ...textOptions })
        }
      }

      // Employment Status - Mark the selected status
      const statusPositions = {
        consultancy: { x: 382, y: 644 },
        contractual: { x: 382, y: 630 },
        fixedTerm: { x: 382, y: 618 },
        regular: { x: 478, y: 644 },
        probationary: { x: 478, y: 630 },
        projectEmployee: { x: 478, y: 618 },
      }

      const selectedStatus = formData.employmentStatus
      if (selectedStatus && statusPositions[selectedStatus as keyof typeof statusPositions]) {
        const position = statusPositions[selectedStatus as keyof typeof statusPositions]
        firstPage.drawText("X", { x: position.x, y: position.y, ...textOptions, size: 7 })
      }

      // Additional Notes (with optional text wrapping if needed)
      if (formData.additionalNotes) {
        const lines = formData.additionalNotes.match(/.{1,80}/g) || []
        lines.forEach((line, index) => {
          firstPage.drawText(line, { x: 99, y: 356 - index * 10, ...textOptions })
        })
      }

      // Add signature if available
    if (signature) {
  // Convert signature DataURL to bytes
  const signatureImage = await fetch(signature)
  const signatureArrayBuffer = await signatureImage.arrayBuffer()
  const signatureUint8Array = new Uint8Array(signatureArrayBuffer)

  // Set max file size (200 KB)
  const MAX_SIGNATURE_SIZE = 200 * 1024
  if (signatureUint8Array.length > MAX_SIGNATURE_SIZE) {
    throw new Error("Signature image is too large. Please upload a smaller image.")
  }

  // Embed the signature image
  const signatureEmbed = await pdfDoc.embedPng(signatureUint8Array)

  // Limit image dimensions
  const maxWidth = 100
  const maxHeight = 50

  const widthRatio = maxWidth / signatureEmbed.width
  const heightRatio = maxHeight / signatureEmbed.height
  const scale = Math.min(widthRatio, heightRatio, 1)

  const scaledWidth = signatureEmbed.width * scale
  const scaledHeight = signatureEmbed.height * scale

  // Draw signature image on PDF
  firstPage.drawImage(signatureEmbed, {
    x: 168,
    y: 265,
    width: scaledWidth,
    height: scaledHeight,
  })

  // Draw the name text below the signature
  firstPage.drawText(`${formData.firstName} ${formData.middleName} ${formData.lastName}`, {
    x: 170,
    y: 275,
    ...textOptions,
  })

  // Add current date next to signature
  const currentDate = new Date().toLocaleDateString()
  firstPage.drawText(currentDate, {
    x: 350,
    y: 276,
    ...textOptions,
  })
}
      // Save the PDF
      const pdfBytes = await pdfDoc.save()
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(pdfBlob)

      // Auto-download
      const a = document.createElement("a")
      a.href = url
      a.download = `Exit_Clearance_Form_${formData.lastName}_${formData.firstName}.pdf`
      a.click()

      // Store the employee name for email
      window.employeeName = `${formData.firstName} ${formData.lastName}`
      setPdfGenerated(true)

      toast({
        title: "PDF Generated Successfully",
        description: "You can now compose an email with this form as an attachment.",
      })
    } 
     finally {
      setIsSubmitting(false)
    }
  }

  // const handleComposeEmail = () => {
  //   if (!pdfGenerated) {
  //     toast({
  //       title: "No PDF Generated",
  //       description: "Please generate the PDF first before composing an email.",
  //       variant: "destructive",
  //     })
  //     return
  //   }

  //   const subject = encodeURIComponent(`Exit Clearance Form - ${window.employeeName}`)
  //   const body = encodeURIComponent(
  //     `Please find attached the exit clearance form for ${window.employeeName}.\n\n` +
  //       `Note: Please manually attach the downloaded PDF file named "Exit_Clearance_Form_${formData.lastName}_${formData.firstName}.pdf" to this email.`,
  //   )

  //   // Open Gmail compose window with pre-filled recipients and subject
  //   window.open(
  //     `https://mail.google.com/mail/?view=cm&fs=1&to=hrteam@progresspro.com.ph&cc=itteam@progresspro.com.ph&su=${subject}&body=${body}`,
  //     "_blank",
  //   )

  //   toast({
  //     title: "Gmail Compose Opened",
  //     description: "Don't forget to attach the downloaded PDF file to your email.",
  //   })
  // }
  const handleNextPage = () => {
    if (!pdfGenerated) {
      toast({
        title: "No PDF Generated",
        description: "Please generate the PDF first before proceeding to the next page.",
        variant: "destructive",
      })
      return
    }

    // Navigate to the next page
    window.location.href = "/exit-interview" // Replace with your actual next page URL
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-t from-sky-500 to-indigo-500 p-4 sm:p-8"
      style={{ backgroundAttachment: "fixed" }}
    >
      <div className="relative w-full max-w-5xl bg-white shadow-xl rounded-2xl p-4 sm:p-8">
        <div className="flex justify-center mb-4">
          <img src="/PPSI.png" alt="ProgressPro Logo" className="h-20 object-contain" />
        </div>
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader className="bg-gray-100 py-2 px-4">
              <CardTitle className="text-center text-lg font-bold">EXIT CLEARANCE FORM</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="lastName">Last Name:</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="h-9"
                        required
                        tabIndex={1}
                      />
                    </div>
                    <div>
                      <Label htmlFor="firstName">First Name:</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="h-9"
                        required
                        tabIndex={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="middleName">Middle Name:</Label>
                      <Input
                        id="middleName"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        className="h-9"
                        required
                        tabIndex={3}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="designation">Designation:</Label>
                      <Input
                        id="designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className="h-9"
                        required
                        tabIndex={6}
                      />
                    </div>
                    <div>
                      <Label htmlFor="empNo">Emp. No.:</Label>
                      <Input
                        id="empNo"
                        name="empNo"
                        value={formData.empNo}
                        onChange={handleChange}
                        className="h-9"
                        required
                        tabIndex={7}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailAddress">Email Address:</Label>
                      <Input
                        id="emailAddress"
                        name="emailAddress"
                        type="email"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        className="h-9"
                        required
                        tabIndex={10}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactNo">Contact No.:</Label>
                      <Input
                           id="contactNo"
                           name="contactNo"
                           type="tel"
                           pattern="[0-9]*"
                           inputMode="numeric"
                           value={formData.contactNo}
                           onChange={handleChange}
                           className="h-9"
                           required
                           tabIndex={11}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="department">Department / Section:</Label>
                      <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="h-9"
                        required
                        tabIndex={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="office">Office / Branch / Site:</Label>
                      <Input
                        id="office"
                        name="office"
                        value={formData.office}
                        onChange={handleChange}
                        className="h-9"
                        required
                        tabIndex={5}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="dateHired">Date Hired:</Label>
                      <Input
                        id="dateHired"
                        name="dateHired"
                        type="date"
                        value={formData.dateHired}
                        onChange={handleChange}
                        className="h-9"
                        required
                        tabIndex={8}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateSeparation">Date Separation:</Label>
                      <Input
                        id="dateSeparation"
                        name="dateSeparation"
                        type="date"
                        value={formData.dateSeparation}
                        onChange={handleChange}
                        className="h-9"
                        required
                        tabIndex={9}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason for Clearance Section - RadioGroup */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Reason for Separation:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <RadioGroup
                      value={formData.reasonForSeparation}
                      onValueChange={handleReasonChange}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="voluntaryResignation" id="voluntaryResignation" tabIndex={12} />
                        <Label htmlFor="voluntaryResignation">Voluntary Resignation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="endOfProbationary" id="endOfProbationary" tabIndex={13} />
                        <Label htmlFor="endOfProbationary">End of Probationary Employment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="redundancy" id="redundancy" tabIndex={14} />
                        <Label htmlFor="redundancy">Redundancy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="promotion" id="promotion" tabIndex={15} />
                        <Label htmlFor="promotion">Promotion</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="others" id="others" tabIndex={16} />
                        <Label htmlFor="others">Others</Label>
                        {formData.reasonForSeparation === "others" && (
                          <Input
                            id="otherReason"
                            name="otherReason"
                            value={formData.otherReason}
                            onChange={handleChange}
                            className="h-8 w-40 ml-2"
                            placeholder="Specify"
                            required={formData.reasonForSeparation === "others"}
                            tabIndex={17}
                          />
                        )}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <RadioGroup
                      value={formData.reasonForSeparation}
                      onValueChange={handleReasonChange}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="transferOfBranch" id="transferOfBranch" tabIndex={18} />
                        <Label htmlFor="transferOfBranch">Transfer of Branch (lateral)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="awol" id="awol" tabIndex={19} />
                        <Label htmlFor="awol">Work Abandonment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="discontinuance" id="discontinuance" tabIndex={20} />
                        <Label htmlFor="discontinuance">Discontinuance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="termination" id="termination" tabIndex={21} />
                        <Label htmlFor="termination">Termination For Cause</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Employment Status - Changed to RadioGroup */}
                  <div>
                    <h3 className="font-semibold mb-2">Employment Status:</h3>
                    <RadioGroup
                      value={formData.employmentStatus}
                      onValueChange={handleEmploymentStatusChange}
                      className="space-y-2"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="consultancy" id="consultancy" tabIndex={22} />
                            <Label htmlFor="consultancy">Consultancy</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="contractual" id="contractual" tabIndex={23} />
                            <Label htmlFor="contractual">Contractual</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixedTerm" id="fixedTerm" tabIndex={24} />
                            <Label htmlFor="fixedTerm">Fixed-Term</Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="regular" id="regular" tabIndex={25} />
                            <Label htmlFor="regular">Regular</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="probationary" id="probationary" tabIndex={26} />
                            <Label htmlFor="probationary">Probationary</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="projectEmployee" id="projectEmployee" tabIndex={27} />
                            <Label htmlFor="projectEmployee">Project Employee</Label>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="mb-6">
                <div className="text-sm space-y-1 mb-4">
                  <p>*Indicate Not Applicable "N/A", as appropriate</p>
                  <p>
                    *Synopsis attached, for computation details of gross final pay, total accountabilities and net final
                    pay.
                  </p>
                  <p>*In lieu of a missed Identification card please submit an affidavit of loss.</p>
                </div>

                <div className="mt-4">
                  <Label htmlFor="additionalNotes">Additional Notes:</Label>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    className="h-20"
                    tabIndex={28}
                  />
                </div>
              </div>

              {/* Clearance Statement */}
              <div className="mb-6 text-sm">
                <p>
                  This clearance is understood not to cover accountabilities discovered in the future, after
                  verification of customer records, etc.
                </p>
                <p>
                  I will settle accountabilities with the company within 30 days or as the day of my last employment.
                </p>
              </div>

              {/* Employee Signature */}
              <div className="mt-6 border p-4 rounded-md">
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Employee Signature:</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Label htmlFor="signatureUpload" className="block mb-2">
                        Upload Signature Image
                      </Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("signatureUpload")?.click()}
                          className="w-full"
                          tabIndex={29}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Image
                        </Button>
                        <input
                          id="signatureUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleSignatureImageUpload}
                          className="hidden"
                          tabIndex={-1} // Hidden input, not in tab order
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Supported format: PNG </p>
                    </div>
                  </div>
                </div>
                {signature && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Signature Preview:</p>
                    <img
                      src={signature || "/placeholder.svg"}
                      alt="Signature"
                      className="border border-gray-200 max-w-[200px]"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-red-500 hover:text-red-700"
                      onClick={() => setSignature(null)}
                      tabIndex={30}
                    >
                      Clear Signature
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-end gap-4 mt-6">
            <Button variant="outline" type="button" onClick={() => window.location.reload()} tabIndex={31}>
              Reset Form
            </Button>
            <Button type="submit" disabled={isSubmitting} tabIndex={32}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Generate PDF"
              )}
            </Button>

            <Button
              type="button"
              onClick={handleNextPage}
              disabled={!pdfGenerated || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
              tabIndex={33}
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Add this to the global Window interface
declare global {
  interface Window {
    employeeName: string
  }
}
