"use client"

const QuotationHeader = ({ image, isRevising, toggleRevising }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <img src={image || "/placeholder.svg?height=80&width=100"} alt="Logo" className="h-20 w-25 mr-3" />
      <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center">
        DIVINE EMPIRE INDIA PVT. LTD.
      </h1>
      {/* Remove the toggle button since revise will be auto-enabled */}
      <div className="text-sm text-gray-600 font-medium">
        Revise Mode Active
      </div>
    </div>
  )
}

export default QuotationHeader