"use client"

import { useState } from "react"

const QuotationPreview = ({
  data,
  onEdit,
  onNewQuotation,
  quotationLink,
  pdfUrl,
  selectedReferences,
  specialDiscount,
  imageform,
  handleGenerateLink,
  handleGeneratePDF,
  isGenerating,
  isSubmitting,
}) => {
  const [showActions, setShowActions] = useState(true)

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotation data...</p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    try {
      if (dateString.includes("/")) {
        const [day, month, year] = dateString.split("/")
        return `${day}/${month}/${year}`
      }
      return dateString
    } catch {
      return dateString
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Action Buttons */}
      {showActions && (
        <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex space-x-3">
            {/* <button
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button> */}
            {/* <button
              onClick={onNewQuotation}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Quotation
            </button> */}
          </div>
          {/* <div className="flex space-x-3">
            <button
              onClick={handleGenerateLink}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center disabled:opacity-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              {isGenerating ? "Generating..." : "Share"}
            </button>
            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center disabled:opacity-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {isGenerating ? "Generating..." : "Download PDF"}
            </button>
          </div> */}
        </div>
      )}

      {/* Quotation Content */}
      <div className="border border-gray-300 p-8 bg-white" id="quotation-content">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center">
            {imageform && (
              <img src={imageform || "/placeholder.svg"} alt="Company Logo" className="h-16 w-16 object-contain mr-4" />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DIVINE EMPIRE</h1>
              <p className="text-sm text-gray-600">Private Limited</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-blue-600">QUOTATION</h2>
            <p className="text-sm text-gray-600">No: {data.quotationNo}</p>
            <p className="text-sm text-gray-600">Date: {formatDate(data.date)}</p>
          </div>
        </div>

        {/* Company Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Consignor Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">FROM:</h3>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{data.consignorName || "Divine Empire Private Limited"}</p>
              <p>{data.consignorAddress}</p>
              <p>State: {data.consignorState}</p>
              <p>Mobile: {data.consignorMobile}</p>
              {data.consignorPhone && <p>Phone: {data.consignorPhone}</p>}
              <p>GSTIN: {data.consignorGSTIN}</p>
              <p>State Code: {data.consignorStateCode}</p>
            </div>
          </div>

          {/* Consignee Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-gray-300 pb-1">TO:</h3>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{data.consigneeName}</p>
              <p>{data.consigneeAddress}</p>
              {data.shipTo && data.shipTo !== data.consigneeAddress && <p>Ship To: {data.shipTo}</p>}
              <p>State: {data.consigneeState}</p>
              <p>Contact: {data.consigneeContactName}</p>
              <p>Mobile: {data.consigneeContactNo}</p>
              <p>GSTIN: {data.consigneeGSTIN}</p>
              <p>State Code: {data.consigneeStateCode}</p>
              {data.msmeNumber && <p>MSME: {data.msmeNumber}</p>}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Items:</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">S.No.</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">Code</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">Description</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">GST%</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">Qty</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">Units</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">Rate</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">Disc%</th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-xs font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items && data.items.length > 0 ? (
                  data.items.map((item, index) => (
                    <tr key={item.id || index}>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{index + 1}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{item.code}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.description && <p className="text-xs text-gray-600">{item.description}</p>}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-center">{item.gst}%</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-center">{item.qty}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-center">{item.units}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-right">
                        {formatCurrency(item.rate)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-center">{item.discount}%</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm text-right font-medium">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="border border-gray-300 px-3 py-4 text-center text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="border border-gray-300">
              <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                <span className="font-medium">Subtotal:</span>
                <span>{formatCurrency(data.subtotal || 0)}</span>
              </div>
              {data.totalFlatDiscount > 0 && (
                <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                  <span className="font-medium">Flat Discount:</span>
                  <span>-{formatCurrency(data.totalFlatDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                <span className="font-medium">CGST ({data.cgstRate || 9}%):</span>
                <span>{formatCurrency(data.cgstAmount || 0)}</span>
              </div>
              <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                <span className="font-medium">SGST ({data.sgstRate || 9}%):</span>
                <span>{formatCurrency(data.sgstAmount || 0)}</span>
              </div>
              {specialDiscount > 0 && (
                <div className="flex justify-between px-4 py-2 border-b border-gray-300">
                  <span className="font-medium">Special Discount:</span>
                  <span>-{formatCurrency(specialDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between px-4 py-2 bg-gray-100 font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(data.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Terms & Conditions:</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Validity:</strong> {data.validity}
              </p>
              <p>
                <strong>Payment Terms:</strong> {data.paymentTerms}
              </p>
              <p>
                <strong>Delivery:</strong> {data.delivery}
              </p>
              <p>
                <strong>Freight:</strong> {data.freight}
              </p>
              <p>
                <strong>Insurance:</strong> {data.insurance}
              </p>
              <p>
                <strong>Taxes:</strong> {data.taxes}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bank Details:</h3>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Account No:</strong> {data.accountNo}
              </p>
              <p>
                <strong>Bank Name:</strong> {data.bankName}
              </p>
              <p>
                <strong>Bank Address:</strong> {data.bankAddress}
              </p>
              <p>
                <strong>IFSC Code:</strong> {data.ifscCode}
              </p>
              <p>
                <strong>Email:</strong> {data.email}
              </p>
              <p>
                <strong>Website:</strong> {data.website}
              </p>
              <p>
                <strong>PAN:</strong> {data.pan}
              </p>
            </div>
          </div>
        </div>

        {/* Special Offers */}
        {data.specialOffers && data.specialOffers.length > 0 && data.specialOffers[0] && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Offers:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {data.specialOffers.map((offer, index) => offer && <li key={index}>{offer}</li>)}
            </ul>
          </div>
        )}

        {/* Notes */}
        {data.notes && data.notes.length > 0 && data.notes[0] && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {data.notes.map((note, index) => note && <li key={index}>{note}</li>)}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-end mt-12">
          <div>
            <p className="text-sm text-gray-600">Prepared By: {data.preparedBy}</p>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-400 w-48 mb-2"></div>
            <p className="text-sm font-medium">Authorized Signature</p>
          </div>
        </div>
      </div>

      {/* Links Display */}
      {(quotationLink || pdfUrl) && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Generated Links:</h3>
          {quotationLink && (
            <div className="mb-2">
              <p className="text-sm text-green-700">Quotation Link:</p>
              <a
                href={quotationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm break-all"
              >
                {quotationLink}
              </a>
            </div>
          )}
          {pdfUrl && (
            <div>
              <p className="text-sm text-green-700">PDF Link:</p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm break-all"
              >
                {pdfUrl}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default QuotationPreview
