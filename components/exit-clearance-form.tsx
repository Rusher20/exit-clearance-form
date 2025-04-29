"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import SignaturePad from "./signature-pad"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      firstPage.drawText(formData.emailAddress, { x: 180, y: 650, ...textOptions })
      firstPage.drawText(formData.contactNo, { x: 280, y: 650, ...textOptions })
      firstPage.drawText(formData.dateHired, { x: 380, y: 650, ...textOptions })
      firstPage.drawText(formData.dateSeparation, { x: 520, y: 650, ...textOptions })

      // Reason for Separation - Mark the selected reason
      const reasonPositions = {
        voluntaryResignation: { x: 49, y: 656 },
        endOfProbationary: { x: 49, y: 643 },
        redundancy: { x: 49, y: 631 },
        promotion: { x: 49, y: 618 },
        others: { x: 49, y: 605 },
        transferOfBranch: { x: 240, y: 620 },
        awol: { x: 240, y: 600 },
        discontinuance: { x: 240, y: 580 },
        dismissal: { x: 240, y: 560 },
        termination: { x: 240, y: 540 },
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
        consultancy: { x: 420, y: 620 },
        contractual: { x: 420, y: 600 },
        fixedTerm: { x: 420, y: 580 },
        regular: { x: 500, y: 620 },
        probationary: { x: 500, y: 600 },
        projectEmployee: { x: 500, y: 580 },
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
          firstPage.drawText(line, { x: 100, y: 300 - index * 15, ...textOptions })
        })
      }

      // Add signature if available
      if (signature) {
        // Convert signature DataURL to bytes
        const signatureImage = await fetch(signature)
        const signatureArrayBuffer = await signatureImage.arrayBuffer()
        const signatureUint8Array = new Uint8Array(signatureArrayBuffer)

        // Embed the signature image
        const signatureEmbed = await pdfDoc.embedPng(signatureUint8Array)
        const signatureDims = signatureEmbed.scale(0.5) // adjust scale as needed

        // Draw the signature
        firstPage.drawImage(signatureEmbed, {
          x: 70,
          y: 110,
          width: signatureDims.width,
          height: signatureDims.height,
        })

        // Add current date next to signature
        const currentDate = new Date().toLocaleDateString()
        firstPage.drawText(currentDate, { x: 350, y: 100, ...textOptions })
      }

      // Save the PDF
      const pdfBytes = await pdfDoc.save()
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(pdfBlob)

      // Open the PDF in a new tab
      window.open(url, "_blank")

      // Auto-download
      const a = document.createElement("a")
      a.href = url
      a.download = "Exit_Clearance_Form.pdf"
      a.click()
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Error generating PDF. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="empNo">Emp. No.:</Label>
                      <Input id="empNo" name="empNo" value={formData.empNo} onChange={handleChange} className="h-9" />
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
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactNo">Contact No.:</Label>
                      <Input
                        id="contactNo"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleChange}
                        className="h-9"
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
                        <RadioGroupItem value="voluntaryResignation" id="voluntaryResignation" />
                        <Label htmlFor="voluntaryResignation">Voluntary Resignation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="endOfProbationary" id="endOfProbationary" />
                        <Label htmlFor="endOfProbationary">End of Probationary Employment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="redundancy" id="redundancy" />
                        <Label htmlFor="redundancy">Redundancy</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="promotion" id="promotion" />
                        <Label htmlFor="promotion">Promotion</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="others" id="others" />
                        <Label htmlFor="others">Others</Label>
                        {formData.reasonForSeparation === "others" && (
                          <Input
                            id="otherReason"
                            name="otherReason"
                            value={formData.otherReason}
                            onChange={handleChange}
                            className="h-8 w-40 ml-2"
                            placeholder="Specify"
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
                        <RadioGroupItem value="transferOfBranch" id="transferOfBranch" />
                        <Label htmlFor="transferOfBranch">Transfer of Branch (lateral)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="awol" id="awol" />
                        <Label htmlFor="awol">Work Abandonment</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="discontinuance" id="discontinuance" />
                        <Label htmlFor="discontinuance">Discontinuance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dismissal" id="dismissal" />
                        <Label htmlFor="dismissal">Dismissal/Cause</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="termination" id="termination" />
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
                            <RadioGroupItem value="consultancy" id="consultancy" />
                            <Label htmlFor="consultancy">Consultancy</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="contractual" id="contractual" />
                            <Label htmlFor="contractual">Contractual</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixedTerm" id="fixedTerm" />
                            <Label htmlFor="fixedTerm">Fixed-Term</Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="regular" id="regular" />
                            <Label htmlFor="regular">Regular</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="probationary" id="probationary" />
                            <Label htmlFor="probationary">Probationary</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="projectEmployee" id="projectEmployee" />
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
                <SignaturePad onSignatureChange={setSignature} label="Employee Signature" width={200} height={50} />
                {signature && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    <img
                      src={signature || "/placeholder.svg"}
                      alt="Signature"
                      className="border border-gray-200 max-w-[200px]"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" type="button" onClick={() => window.location.reload()}>
              Reset Form
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Fill PDF & Download"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
