"use client"

const BankDetails = ({
  quotationData = {}, // Default empty object
  handleInputChange = () => {}, // Default empty function
  imageform = "/placeholder.svg?height=200&width=300" // Default placeholder image
}) => {
  // Define default bank details
  const defaultBankDetails = {
    accountNo: "",
    bankName: "",
    bankAddress: "",
    ifscCode: "",
    email: "",
    website: "",
    pan: ""
  }

  // Merge with actual quotationData
  const safeQuotationData = { ...defaultBankDetails, ...quotationData }

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-6 text-center">Bank Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-center justify-center p-6 rounded-lg border border-gray-200">
          <img
            src={imageform}
            alt="Company Logo"
            className="max-h-100 w-auto object-contain"
          />
        </div>

        <div className="md:hidden w-full border-t border-gray-200 my-4"></div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Account No.</label>
              <input
                type="text"
                value={safeQuotationData.accountNo}
                onChange={(e) => handleInputChange("accountNo", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Bank Name</label>
              <input
                type="text"
                value={safeQuotationData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Bank Address</label>
              <input
                type="text"
                value={safeQuotationData.bankAddress}
                onChange={(e) => handleInputChange("bankAddress", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">IFSC Code</label>
              <input
                type="text"
                value={safeQuotationData.ifscCode}
                onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="text"
                value={safeQuotationData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="text"
                value={safeQuotationData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">PAN</label>
              <input
                type="text"
                value={safeQuotationData.pan}
                onChange={(e) => handleInputChange("pan", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BankDetails