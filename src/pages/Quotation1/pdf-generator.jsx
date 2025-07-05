import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export const generatePDFFromData = (quotationData, selectedReferences, specialDiscount) => {
  const doc = new jsPDF("p", "mm", "a4")

  const pageWidth = 210
  const pageHeight = 297
  const margin = 15
  let currentY = 15

  const wrapText = (text, maxWidth) => {
    return doc.splitTextToSize(text || "", maxWidth)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
      .format(value || 0)
      .replace("₹", "")
      .trim()
  }

  const checkSpace = (requiredHeight) => {
    if (currentY + requiredHeight > pageHeight - margin - 20) {
      doc.addPage()
      currentY = margin + 10
      return true
    }
    return false
  }

  const addPageHeader = () => {
    currentY = margin

    // Header background with light blue color like in the web interface
    doc.setFillColor(240, 248, 255) // Light blue background
    doc.rect(margin, currentY, pageWidth - 2 * margin, 35, "F")
    
    // Header border
    doc.setDrawColor(0, 0, 0)
    doc.setLineWidth(0.5)
    doc.rect(margin, currentY, pageWidth - 2 * margin, 35)

    // Company logo placeholder (left side) - blue color like web interface
    doc.setFillColor(0, 123, 255) // Blue color matching web interface
    doc.rect(margin + 5, currentY + 5, 15, 15, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("DE", margin + 12.5, currentY + 14, { align: "center" })

    // Company name (center)
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("DIVINE EMPIRE", pageWidth / 2, currentY + 12, { align: "center" })
    
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text("Private Limited", pageWidth / 2, currentY + 20, { align: "center" })

    // Quotation header box (right side) - blue background like web interface
    const quotationBoxX = pageWidth - margin - 60
    const quotationBoxY = currentY + 5
    const quotationBoxWidth = 55
    const quotationBoxHeight = 25

    doc.setFillColor(0, 123, 255) // Blue background matching web interface
    doc.setDrawColor(0, 123, 255)
    doc.rect(quotationBoxX, quotationBoxY, quotationBoxWidth, quotationBoxHeight, "FD")

    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(255, 255, 255) // White text on blue background
    doc.text("QUOTATION", quotationBoxX + quotationBoxWidth/2, quotationBoxY + 8, { align: "center" })
    
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor(255, 255, 255) // White text
    doc.text(`No: ${quotationData.quotationNo || "NBD-25-26-002"}`, quotationBoxX + quotationBoxWidth/2, quotationBoxY + 15, { align: "center" })
    
    const dateStr = quotationData.date ? new Date(quotationData.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')
    doc.text(`Date: ${dateStr}`, quotationBoxX + quotationBoxWidth/2, quotationBoxY + 21, { align: "center" })

    currentY += 45
  }

  // Only add header on first page
  addPageHeader()

  // FROM and TO sections side by side - No borders, no background
  const sectionWidth = (pageWidth - 3 * margin) / 2
  
  const consignorDetails = [
    String(selectedReferences && selectedReferences[0] ? selectedReferences[0] : "NEERAJ SIR"),
    `Plot no 27, PATRAPADA Bhagabanpur Industrial Estate`,
    `PATRAPADA, PS - TAMANDO, Bhubaneswar, Odisha 751019`,
    `State: ${String(quotationData.consignorState || "Odisha")}`,
    `Mobile: ${String(quotationData.consignorMobile && typeof quotationData.consignorMobile === 'string' ? quotationData.consignorMobile.split(",")[0] : quotationData.consignorMobile || "7024425225")}`,
    `Phone: ${String(quotationData.consignorPhone || "c")}`,
    `GSTIN: ${String(quotationData.consignorGSTIN || "21AAGCD9326H1ZS")}`,
    `State Code: ${String(quotationData.consignorStateCode || "21")}`,
  ]

  const consigneeDetails = [
    String(quotationData.consigneeName || "A S CONSTRUCTION , Raipur"),
    `31/554, GALI NO.6, NEW SHANTI NAGAR,`,
    `RAIPUR, Raipur, Chhattisgarh, 492004`,
    `State: ${String(quotationData.consigneeState || "Chhattisgarh")}`,
    `Contact: ${String(quotationData.consigneeContactName || "N/A")}`,
    `Mobile: ${String(quotationData.consigneeContactNo || "N/A")}`,
    `GSTIN: ${String(quotationData.consigneeGSTIN || "22AAGFA4837R2ZT")}`,
    `State Code: ${String(quotationData.consigneeStateCode || "22")}`,
    `MSME: ${String(quotationData.consigneeMSME || "UDYAM-CG-14-0001307")}`,
  ]

  // FROM section (left side) - No border, no background
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text("FROM:", margin, currentY + 8)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  let fromY = currentY + 15
  consignorDetails.forEach((line) => {
    if (fromY < currentY + 52) {
      const wrappedLines = wrapText(line, sectionWidth - 10)
      wrappedLines.forEach((wrappedLine) => {
        if (fromY < currentY + 52) {
          doc.text(wrappedLine, margin, fromY)
          fromY += 4
        }
      })
    }
  })

  // TO section (right side) - No border, no background
  const toSectionX = margin + sectionWidth + 5
  
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.text("TO:", toSectionX, currentY + 8)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  let toY = currentY + 15
  consigneeDetails.forEach((line) => {
    if (toY < currentY + 52) {
      const wrappedLines = wrapText(line, sectionWidth - 10)
      wrappedLines.forEach((wrappedLine) => {
        if (toY < currentY + 52) {
          doc.text(wrappedLine, toSectionX, toY)
          toY += 4
        }
      })
    }
  })

  currentY += 60

  // Items section header
  doc.setFont("helvetica", "bold")
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Items:", margin, currentY)

  currentY += 8

  // Items table
  const itemsData = quotationData.items ? quotationData.items.map((item, index) => [
    String(index + 1),
    String(item.code || "AFG10017"),
    String(item.description || item.name || "FISCHER-ANCHOR-FWA 16X180"),
    String(`${item.gst || 18}%`),
    String(item.qty || 1),
    String(item.units || "Nos"),
    String(formatCurrency(item.rate || 1712121.00)),
    String(`${item.discount || 0}%`),
    String(formatCurrency(item.amount || 1712121.00)),
  ]) : [
    ["1", "AFG10017", "FISCHER-ANCHOR-FWA 16X180", "18%", "1", "Nos", String(formatCurrency(1712121.00)), "0%", String(formatCurrency(1712121.00))]
  ]

  autoTable(doc, {
    startY: currentY,
    head: [["S.No", "Code", "Description", "GST%", "Qty", "Units", "Rate", "Disc%", "Amount"]],
    body: itemsData,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      lineColor: [0, 0, 0],
      lineWidth: 0.5,
      textColor: [0, 0, 0],
      font: 'helvetica',
    },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontSize: 9,
      fontStyle: 'bold',
      cellPadding: 4,
      halign: 'center',
      valign: 'middle',
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 40, halign: 'left' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 12, halign: 'center' },
      5: { cellWidth: 15, halign: 'center' },
      6: { cellWidth: 25, halign: 'right' },
      7: { cellWidth: 15, halign: 'center' },
      8: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
    },
    didDrawPage: (data) => {
      currentY = data.cursor.y;
    },
  });

  currentY = doc.lastAutoTable.finalY + 10

  // Financial summary on the right side
  const summaryX = pageWidth - margin - 70
  const summaryY = currentY

  const subtotal = quotationData.subtotal || 1712121.00
  const cgstAmount = quotationData.cgstAmount || (subtotal * 0.09)
  const sgstAmount = quotationData.sgstAmount || (subtotal * 0.09)
  const total = quotationData.total || (subtotal + cgstAmount + sgstAmount)

  // Draw summary box
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.rect(summaryX, summaryY, 70, 40)

  const summaryItems = [
    { label: "Subtotal:", value: String(formatCurrency(subtotal)) },
    { label: "CGST (9%):", value: String(formatCurrency(cgstAmount)) },
    { label: "SGST (9%):", value: String(formatCurrency(sgstAmount)) },
    { label: "Total:", value: String(formatCurrency(total)) }
  ]

  let summaryCurrentY = summaryY + 8

  summaryItems.forEach((item, index) => {
    if (index === summaryItems.length - 1) { // Total row
      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.setFillColor(240, 240, 240)
      doc.rect(summaryX, summaryCurrentY - 3, 70, 8, "F")
    } else {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
    }

    doc.setTextColor(0, 0, 0)
    doc.text(item.label, summaryX + 5, summaryCurrentY)
    doc.text(item.value, summaryX + 65, summaryCurrentY, { align: "right" })
    summaryCurrentY += 8
  })

  currentY = summaryCurrentY + 15

  // Check if we need a new page for terms and bank details
  checkSpace(60)

  // Terms & Conditions and Bank Details - Clean Layout with proper spacing
  const leftColumnX = margin
  const rightColumnX = pageWidth / 2 + 5
  const columnWidth = (pageWidth - 3 * margin) / 2 - 5

  // Terms & Conditions (left column)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text("Terms & Conditions:", leftColumnX, currentY)

  const terms = [
    { label: "Validity", value: quotationData.validity || "The above quoted prices are valid up to 5 days from date of offer." },
    { label: "Payment Terms", value: quotationData.paymentTerms || "100% advance payment in the mode of NEFT, RTGS & DD" },
    { label: "Delivery", value: quotationData.delivery || "Material is ready in our stock" },
    { label: "Freight", value: quotationData.freight || "Extra as per actual." },
    { label: "Insurance", value: quotationData.insurance || "Transit insurance for all shipment is at Buyer's risk." },
    { label: "Taxes", value: quotationData.taxes || "Extra as per actual." },
  ]

  let termsY = currentY + 12
  doc.setFontSize(9)

  terms.forEach((term) => {
    // Label in bold
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text(`${term.label}:`, leftColumnX, termsY)
    
    // Value in normal font with proper spacing
    doc.setFont("helvetica", "normal")
    const labelWidth = 35 // Fixed width for consistent alignment
    const wrappedLines = wrapText(term.value, columnWidth - labelWidth)
    
    wrappedLines.forEach((line, index) => {
      doc.text(line, leftColumnX + labelWidth, termsY + (index * 4))
    })
    
    termsY += Math.max(7, wrappedLines.length * 4) + 2
  })

  // Bank Details (right column) - Fixed spacing and alignment
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text("Bank Details:", rightColumnX, currentY)

  const bankDetails = [
    { label: "Account No", value: String(quotationData.accountNo || "438605000447") },
    { label: "Bank Name", value: String(quotationData.bankName || "ICICI BANK") },
    { label: "Bank Address", value: String(quotationData.bankAddress || "FAFADHI, RAIPUR") },
    { label: "IFSC Code", value: String(quotationData.ifscCode || "ICIC0004386") },
    { label: "Email", value: String(quotationData.email || "Support@thedivineempire.com") },
    { label: "Website", value: String(quotationData.website || "www.thedivineempire.com") },
    { label: "PAN", value: String(quotationData.pan || "AAGCD9326H") },
  ]

  let bankY = currentY + 12
  doc.setFontSize(9)

  bankDetails.forEach((detail) => {
    // Label in bold
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text(`${detail.label}:`, rightColumnX, bankY)
    
    // Value in normal font with proper spacing
    doc.setFont("helvetica", "normal")
    const labelWidth = 35 // Fixed width for consistent alignment
    const wrappedLines = wrapText(String(detail.value || ""), columnWidth - labelWidth)
    
    wrappedLines.forEach((line, index) => {
      doc.text(line, rightColumnX + labelWidth, bankY + (index * 4))
    })
    
    bankY += Math.max(7, wrappedLines.length * 4) + 2
  })

  currentY = Math.max(termsY, bankY) + 20

  // Signature section
  const signatureY = currentY
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.text(`Prepared By: ${quotationData.preparedBy || "GEETA BHIWAGADE"}`, margin, signatureY)

  // Draw line for signature
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.line(pageWidth - margin - 80, signatureY + 10, pageWidth - margin - 10, signatureY + 10)
  
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.text("Authorized Signature", pageWidth - margin - 45, signatureY + 20, { align: "center" })

  // Special offers section (if exists)
  if (quotationData.specialOffers && quotationData.specialOffers.filter((offer) => offer.trim()).length > 0) {
    currentY += 30
    checkSpace(30)
    
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text("DIVINE EMPIRE'S 10TH ANNIVERSARY SPECIAL OFFER", margin, currentY)
    currentY += 8

    quotationData.specialOffers
      .filter((offer) => offer.trim())
      .forEach((offer) => {
        doc.setTextColor(200, 50, 50)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(9)
        const text = `★ ${offer}`
        const wrappedLines = wrapText(text, pageWidth - 2 * margin)
        wrappedLines.forEach((line) => {
          doc.text(line, margin, currentY)
          currentY += 5
        })
      })
  }

  // Additional notes section (if exists)
  if (quotationData.notes && quotationData.notes.length > 0) {
    currentY += 15
    checkSpace(30)
    
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text("ADDITIONAL NOTES", margin, currentY)
    currentY += 8

    quotationData.notes
      .filter((note) => note.trim())
      .forEach((note) => {
        doc.setTextColor(0, 0, 0)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        const text = `• ${note}`
        const wrappedLines = wrapText(text, pageWidth - 2 * margin)
        wrappedLines.forEach((line) => {
          doc.text(line, margin, currentY)
          currentY += 5
        })
      })
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)

    doc.setFontSize(7)
    doc.setTextColor(120, 120, 120)
    doc.setFont("helvetica", "normal")

    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: "right" })

    doc.text("Generated by Divine Empire Professional Quotation System", margin, pageHeight - 12)
    doc.text("This is a computer-generated document", margin, pageHeight - 6)

    const now = new Date()
    doc.text(`Generated on: ${now.toLocaleDateString('en-GB')}, ${now.toLocaleTimeString()}`, pageWidth - margin, pageHeight - 12, { align: "right" })
  }

  return doc.output("datauristring").split(",")[1]
}