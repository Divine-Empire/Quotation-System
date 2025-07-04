"use client"

const TermsAndConditions = ({
  quotationData = {}, // Provide default empty object
  handleInputChange = () => {}, // Default empty function
  hiddenFields = {}, // Default empty object
  toggleFieldVisibility = () => {}, // Default empty function
}) => {
  // Define all possible fields with default empty strings
  const defaultFields = {
    validity: "",
    paymentTerms: "",
    delivery: "",
    freight: "",
    insurance: "",
    taxes: "",
  }

  // Merge with actual quotationData to ensure all fields exist
  const safeQuotationData = { ...defaultFields, ...quotationData }

  // Ensure hiddenFields has all fields with default false
  const safeHiddenFields = Object.keys(defaultFields).reduce((acc, field) => {
    acc[field] = hiddenFields[field] || false
    return acc
  }, {})

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Terms & Conditions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries({
          validity: "Validity",
          paymentTerms: "Payment Terms",
          delivery: "Delivery",
          freight: "Freight",
          insurance: "Insurance",
          taxes: "Taxes",
        }).map(([field, label]) => (
          <div key={field} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">{label}</label>
              <button
                type="button"
                onClick={() => toggleFieldVisibility(field)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {safeHiddenFields[field] ? "Show" : "Hide"}
              </button>
            </div>
            {!safeHiddenFields[field] && (
              <input
                type="text"
                value={safeQuotationData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TermsAndConditions