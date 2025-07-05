"use client"

import { useState, useEffect, useContext, useCallback, useMemo } from "react"
import { AuthContext } from "../App"

const Dashboard = ({ onViewQuotation, onNewQuotation, onLogout }) => {
  // ===========================
  // STATE MANAGEMENT
  // ===========================
  const [quotations, setQuotations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [dataFilter, setDataFilter] = useState("all")

  // ===========================
  // CONTEXT & CONSTANTS
  // ===========================
  const { userCompany, userType } = useContext(AuthContext)
  
  const scriptUrl = useMemo(
    () => "https://script.google.com/macros/s/AKfycbzTPj_x_0Sh6uCNnMDi-KlwVzkGV3nC4tRF6kGUNA1vXG0Ykx4Lq6ccR9kYv6Cst108aQ/exec",
    []
  )

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================
  const isRevisionQuotation = useCallback((quotationNo) => {
    if (!quotationNo) return false
    const revisionPattern = /-\d{2}$/
    return revisionPattern.test(quotationNo)
  }, [])

  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    return (amount) => formatter.format(amount || 0)
  }, [])

  const formatDateDisplay = useCallback((dateString) => {
    if (!dateString) return "N/A"

    if (dateString.includes("/")) {
      return dateString
    }

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Invalid Date"
      }
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch {
      return "N/A"
    }
  }, [])

  const getDataFilterLabel = useCallback(() => {
    switch (dataFilter) {
      case "current":
        return "(Latest)"
      case "rewise":
        return "(Rewise)"
      default:
        return ""
    }
  }, [dataFilter])

  // ===========================
  // DATA PROCESSING FUNCTIONS
  // ===========================
  const extractItemData = useCallback((items) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return { itemName: "N/A", qty: 0 }
    }

    try {
      const itemNames = []
      const quantities = []
      let totalQty = 0

      items.forEach((item) => {
        const name = item.name && item.name.trim() !== "" ? item.name.trim() : item.code || "Unknown Item"
        itemNames.push(name)
        const qty = item.qty || 0
        quantities.push(qty)
        totalQty += qty
      })

      return {
        itemName: itemNames.join(", "),
        qty: quantities.join(", "),
        totalQty: totalQty,
      }
    } catch (error) {
      console.error("Error parsing items data:", error)
      return { itemName: "N/A", qty: 0 }
    }
  }, [])

  const processQuotationData = useCallback((data, quotationNo) => {
    // Filter by company for non-admin users
    if (userType !== "admin" && userCompany && data.consigneeName !== userCompany) {
      return null
    }

    // Calculate total from items
    let total = 0
    if (data.items && Array.isArray(data.items)) {
      const subtotal = data.items.reduce((sum, item) => sum + (item.amount || 0), 0)
      const cgstAmount = subtotal * 0.09
      const sgstAmount = subtotal * 0.09
      total = subtotal + cgstAmount + sgstAmount
      if (data.specialDiscount) {
        total = total - data.specialDiscount
      }
    }

    const itemData = extractItemData(data.items)

    // Create complete fullData object
    const fullData = {
      quotationNo: data.quotationNo,
      date: data.date,
      preparedBy: data.preparedBy,
      consignorState: data.consignorState || "",
      consignorName: data.consignorName || "",
      consignorAddress: data.consignorAddress || "",
      consignorMobile: data.consignorMobile || "",
      consignorPhone: data.consignorPhone || "",
      consignorGSTIN: data.consignorGSTIN || "",
      consignorStateCode: data.consignorStateCode || "",
      consigneeName: data.consigneeName || "",
      consigneeAddress: data.consigneeAddress || "",
      shipTo: data.shipTo || data.consigneeAddress || "",
      consigneeState: data.consigneeState || "",
      consigneeContactName: data.consigneeContactName || "",
      consigneeContactNo: data.consigneeContactNo || "",
      consigneeGSTIN: data.consigneeGSTIN || "",
      consigneeStateCode: data.consigneeStateCode || "",
      msmeNumber: data.msmeNumber || "",
      items: data.items || [],
      subtotal: data.subtotal || 0,
      totalFlatDiscount: data.totalFlatDiscount || 0,
      cgstRate: data.cgstRate || 9,
      sgstRate: data.sgstRate || 9,
      cgstAmount: data.cgstAmount || 0,
      sgstAmount: data.sgstAmount || 0,
      total: data.total || total,
      validity: data.validity || "",
      paymentTerms: data.paymentTerms || "",
      delivery: data.delivery || "",
      freight: data.freight || "",
      insurance: data.insurance || "",
      taxes: data.taxes || "",
      accountNo: data.accountNo || "",
      bankName: data.bankName || "",
      bankAddress: data.bankAddress || "",
      ifscCode: data.ifscCode || "",
      email: data.email || "",
      website: data.website || "",
      pan: data.pan || "",
      notes: data.notes || [""],
      specialOffers: data.specialOffers || [""],
      specialDiscount: data.specialDiscount || 0,
      pdfUrl: data.pdfUrl || "",
    }

    return {
      id: quotationNo,
      quotationNo: data.quotationNo,
      date: data.date || new Date().toLocaleDateString("en-GB"),
      preparedBy: data.preparedBy || "Unknown",
      consigneeName: data.consigneeName || "Unknown Company",
      total: total,
      status: "Active",
      itemName: itemData.itemName,
      qty: itemData.qty,
      fullData: fullData,
    }
  }, [userType, userCompany, extractItemData])

  // ===========================
  // DATA FETCHING FUNCTIONS
  // ===========================
  const fallbackFetchMethod = useCallback(async () => {
    try {
      // Get quotation numbers
      const quotationNumbersResponse = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          sheetName: "Make Quotation",
          action: "getQuotationNumbers",
        }),
      })

      const quotationNumbersResult = await quotationNumbersResponse.json()
      if (!quotationNumbersResult.success) {
        throw new Error("Failed to fetch quotation numbers: " + quotationNumbersResult.error)
      }

      const quotationNumbers = quotationNumbersResult.quotationNumbers || []
      if (quotationNumbers.length === 0) {
        setQuotations([])
        return
      }

      // Process in optimized batches
      const batchSize = 10
      const batches = []
      for (let i = 0; i < quotationNumbers.length; i += batchSize) {
        batches.push(quotationNumbers.slice(i, i + batchSize))
      }

      // Process all batches in parallel
      const batchPromises = batches.map(async (batch) => {
        const quotationPromises = batch.map(async (quotationNo) => {
          try {
            const response = await fetch(scriptUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                sheetName: "Make Quotation",
                action: "getQuotationData",
                quotationNo: quotationNo,
              }),
            })

            const result = await response.json()
            if (result.success && result.quotationData) {
              return processQuotationData(result.quotationData, quotationNo)
            }
            return null
          } catch (error) {
            console.error("Error fetching quotation data for:", quotationNo, error)
            return null
          }
        })

        return Promise.all(quotationPromises)
      })

      const allBatchResults = await Promise.all(batchPromises)
      const allQuotations = allBatchResults.flat().filter((q) => q !== null)

      setQuotations(allQuotations)
    } catch (error) {
      console.error("Error in fallback fetch method:", error)
      throw error
    }
  }, [scriptUrl, processQuotationData])

  const fetchQuotations = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log("Fetching all quotations data in bulk...")

      // Try bulk API first
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          sheetName: "Make Quotation",
          action: "getAllQuotationsData",
        }),
      })

      const result = await response.json()
      
      if (result.success && result.quotationsData) {
        const processedQuotations = result.quotationsData
          .map((data) => processQuotationData(data, data.quotationNo))
          .filter((q) => q !== null)

        setQuotations(processedQuotations)
      } else {
        console.log("Bulk API not available, using fallback method...")
        await fallbackFetchMethod()
      }
    } catch (error) {
      console.error("Error fetching quotations:", error)
      // Demo data fallback
      setQuotations(getDemoData())
    } finally {
      setIsLoading(false)
    }
  }, [scriptUrl, processQuotationData, fallbackFetchMethod])

  const getDemoData = useCallback(() => [
    {
      id: 1,
      quotationNo: "NBD-001",
      date: "01/01/2024",
      consigneeName: "ABC Corp",
      total: 150000,
      preparedBy: "John Doe",
      status: "Active",
      itemName: "FISCHER-ANCHOR-FWA 16X180",
      qty: 1,
      fullData: {
        quotationNo: "NBD-001",
        date: "01/01/2024",
        consigneeName: "ABC Corp",
        consigneeAddress: "123 Business Street, Mumbai",
        consigneeContactName: "Rajesh Kumar",
        consigneeContactNo: "9876543210",
        consigneeState: "Maharashtra",
        consigneeGSTIN: "27ABCDE1234F1Z5",
        consigneeStateCode: "27",
        consignorName: "Divine Empire",
        consignorAddress: "456 Empire Road, Delhi",
        consignorMobile: "9999888877",
        consignorGSTIN: "07XYZAB1234C1Z5",
        consignorStateCode: "07",
        items: [
          {
            id: 1,
            code: "PROD001",
            name: "Product 1",
            description: "High quality product",
            gst: 18,
            qty: 10,
            units: "Nos",
            rate: 1000,
            discount: 0,
            flatDiscount: 0,
            amount: 10000,
          },
        ],
        subtotal: 10000,
        cgstAmount: 900,
        sgstAmount: 900,
        total: 11800,
        preparedBy: "John Doe",
        validity: "Valid for 30 days",
        paymentTerms: "100% advance",
        delivery: "Within 7 days",
        freight: "Extra",
        insurance: "Buyer's risk",
        taxes: "As applicable",
        accountNo: "1234567890",
        bankName: "State Bank of India",
        bankAddress: "Main Branch, Delhi",
        ifscCode: "SBIN0001234",
        email: "info@divineempire.com",
        website: "www.divineempire.com",
        pan: "ABCDE1234F",
        notes: ["Quality assured", "Warranty included"],
        specialOffers: ["10% discount on bulk orders"],
        specialDiscount: 0,
      },
    },
    {
      id: 2,
      quotationNo: "NBD-002-01",
      date: "15/12/2024",
      consigneeName: "XYZ Industries",
      total: 250000,
      preparedBy: "Jane Smith",
      status: "Active",
      itemName: "Steel Rods",
      qty: 50,
      fullData: {
        quotationNo: "NBD-002-01",
        date: "15/12/2024",
        consigneeName: "XYZ Industries",
        consigneeAddress: "789 Industrial Area, Chennai",
        consigneeContactName: "Suresh Kumar",
        consigneeContactNo: "9876543211",
        consigneeState: "Tamil Nadu",
        consigneeGSTIN: "33ABCDE1234F1Z6",
        consigneeStateCode: "33",
        consignorName: "Divine Empire",
        consignorAddress: "456 Empire Road, Delhi",
        consignorMobile: "9999888877",
        consignorGSTIN: "07XYZAB1234C1Z5",
        consignorStateCode: "07",
        items: [
          {
            id: 1,
            code: "STEEL001",
            name: "Steel Rods",
            description: "High grade steel rods",
            gst: 18,
            qty: 50,
            units: "Nos",
            rate: 4000,
            discount: 0,
            flatDiscount: 0,
            amount: 200000,
          },
        ],
        subtotal: 200000,
        cgstAmount: 18000,
        sgstAmount: 18000,
        total: 236000,
        preparedBy: "Jane Smith",
        validity: "Valid for 45 days",
        paymentTerms: "50% advance, 50% on delivery",
        delivery: "Within 15 days",
        freight: "Extra",
        insurance: "Buyer's risk",
        taxes: "As applicable",
        accountNo: "1234567890",
        bankName: "State Bank of India",
        bankAddress: "Main Branch, Delhi",
        ifscCode: "SBIN0001234",
        email: "info@divineempire.com",
        website: "www.divineempire.com",
        pan: "ABCDE1234F",
        notes: ["Premium quality", "Tested materials"],
        specialOffers: ["Bulk discount available"],
        specialDiscount: 0,
      },
    },
  ], [])

  // ===========================
  // COMPUTED VALUES (MEMOIZED)
  // ===========================
  const filteredQuotations = useMemo(() => {
    let filtered = [...quotations]

    // Apply data filter
    if (dataFilter === "current") {
      filtered = quotations
        .sort((a, b) => {
          try {
            const dateA = new Date(a.date.split("/").reverse().join("-"))
            const dateB = new Date(b.date.split("/").reverse().join("-"))
            return dateB - dateA
          } catch {
            return 0
          }
        })
        .slice(0, 1)
    } else if (dataFilter === "rewise") {
      filtered = quotations.filter((q) => isRevisionQuotation(q.quotationNo))
    }

    // Apply additional filters
    switch (filter) {
      case "recent":
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        filtered = filtered.filter((q) => {
          try {
            const qDate = new Date(q.date.split("/").reverse().join("-"))
            return qDate >= thirtyDaysAgo
          } catch {
            return false
          }
        })
        break
      case "high-value":
        filtered = filtered.filter((q) => (q.total || 0) > 100000)
        break
      default:
        break
    }

    // Sort results
    return filtered.sort((a, b) => {
      try {
        const dateA = new Date(a.date.split("/").reverse().join("-"))
        const dateB = new Date(b.date.split("/").reverse().join("-"))
        return dateB - dateA
      } catch {
        return 0
      }
    })
  }, [quotations, filter, dataFilter, isRevisionQuotation])

  const recentQuotations = useMemo(() => {
    let baseData = quotations

    if (dataFilter === "current") {
      baseData = quotations
        .sort((a, b) => {
          try {
            const dateA = new Date(a.date.split("/").reverse().join("-"))
            const dateB = new Date(b.date.split("/").reverse().join("-"))
            return dateB - dateA
          } catch {
            return 0
          }
        })
        .slice(0, 1)
    } else if (dataFilter === "rewise") {
      baseData = quotations.filter((q) => isRevisionQuotation(q.quotationNo))
    }

    return [...baseData]
      .sort((a, b) => {
        try {
          const dateA = new Date(a.date.split("/").reverse().join("-"))
          const dateB = new Date(b.date.split("/").reverse().join("-"))
          return dateB - dateA
        } catch {
          return 0
        }
      })
      .slice(0, 5)
  }, [quotations, dataFilter, isRevisionQuotation])

  const topValueQuotations = useMemo(() => {
    let baseData = quotations

    if (dataFilter === "current") {
      baseData = quotations
        .sort((a, b) => {
          try {
            const dateA = new Date(a.date.split("/").reverse().join("-"))
            const dateB = new Date(b.date.split("/").reverse().join("-"))
            return dateB - dateA
          } catch {
            return 0
          }
        })
        .slice(0, 1)
    } else if (dataFilter === "rewise") {
      baseData = quotations.filter((q) => isRevisionQuotation(q.quotationNo))
    }

    return [...baseData].sort((a, b) => (b.total || 0) - (a.total || 0)).slice(0, 5)
  }, [quotations, dataFilter, isRevisionQuotation])

  const stats = useMemo(() => {
    let baseData = quotations

    if (dataFilter === "current") {
      baseData = quotations
        .sort((a, b) => {
          try {
            const dateA = new Date(a.date.split("/").reverse().join("-"))
            const dateB = new Date(b.date.split("/").reverse().join("-"))
            return dateB - dateA
          } catch {
            return 0
          }
        })
        .slice(0, 1)
    } else if (dataFilter === "rewise") {
      baseData = quotations.filter((q) => isRevisionQuotation(q.quotationNo))
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const totalValue = baseData.reduce((sum, q) => sum + (q.total || 0), 0)
    const recentCount = baseData.filter((q) => {
      try {
        const qDate = new Date(q.date.split("/").reverse().join("-"))
        return qDate >= thirtyDaysAgo
      } catch {
        return false
      }
    }).length
    const highValueCount = baseData.filter((q) => (q.total || 0) > 100000).length

    return {
      totalQuotations: baseData.length,
      totalValue,
      recentCount,
      highValueCount,
    }
  }, [quotations, dataFilter, isRevisionQuotation])

  // ===========================
  // EVENT HANDLERS
  // ===========================
  const handleViewQuotation = useCallback((quotation) => {
    console.log("View quotation clicked:", quotation.quotationNo)
    
    if (userType !== "admin" && userCompany && quotation.fullData?.consigneeName !== userCompany) {
      alert("You don't have access to view this quotation.")
      return
    }

    if (quotation.fullData && onViewQuotation && typeof onViewQuotation === "function") {
      onViewQuotation(quotation.fullData)
    } else {
      console.error("❌ Missing quotation data or onViewQuotation callback")
      alert("Unable to view quotation. Please try refreshing the page.")
    }
  }, [userType, userCompany, onViewQuotation])

  const handleNewQuotationClick = useCallback(() => {
    if (onNewQuotation && typeof onNewQuotation === "function") {
      onNewQuotation()
    } else {
      console.error("❌ onNewQuotation callback is not provided")
      alert("Navigation function not available. Please refresh the page.")
    }
  }, [onNewQuotation])

  const handleLogoutClick = useCallback(() => {
    if (onLogout && typeof onLogout === "function") {
      onLogout()
    } else {
      console.error("❌ onLogout callback is not provided")
      alert("Logout function not available. Please refresh the page.")
    }
  }, [onLogout])

  // ===========================
  // RENDER FUNCTIONS
  // ===========================
  const renderCompactTableRow = useCallback((quotation, index) => (
    <tr
      key={quotation.id}
      className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
    >
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">
        <button
          onClick={() => handleViewQuotation(quotation)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center shadow-md hover:shadow-lg transition-all duration-200"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="hidden sm:inline">View</span>
        </button>
      </td>
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{index + 1}</td>
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">
        <div className="flex flex-col">
          <span>{quotation.quotationNo}</span>
          {isRevisionQuotation(quotation.quotationNo) && (
            <span className="mt-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-lg text-xs font-medium inline-block w-fit">
              REWISE
            </span>
          )}
        </div>
      </td>
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">
        {formatDateDisplay(quotation.date)}
      </td>
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">
        {formatCurrency(quotation.total)}
      </td>
    </tr>
  ), [handleViewQuotation, formatCurrency, isRevisionQuotation, formatDateDisplay])

  const renderFullTableRow = useCallback((quotation, index) => (
    <tr
      key={quotation.id}
      className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
    >
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">
        <button
          onClick={() => handleViewQuotation(quotation)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center shadow-md hover:shadow-lg transition-all duration-200"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="hidden sm:inline">View</span>
        </button>
      </td>
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">{index + 1}</td>
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">
        <div className="flex flex-col">
          <span>{quotation.quotationNo}</span>
          {isRevisionQuotation(quotation.quotationNo) && (
            <span className="mt-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-lg text-xs font-medium inline-block w-fit">
              REWISE
            </span>
          )}
        </div>
      </td>
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900">
        {formatDateDisplay(quotation.date)}
      </td>
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
        <span className="truncate block max-w-[120px] sm:max-w-none">{quotation.consigneeName}</span>
      </td>
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-medium truncate block max-w-[100px] sm:max-w-none">
          {quotation.itemName}
        </span>
      </td>
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-medium">{quotation.qty}</span>
      </td>
      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-semibold">
        {formatCurrency(quotation.total)}
      </td>
    </tr>
  ), [handleViewQuotation, formatCurrency, isRevisionQuotation, formatDateDisplay])

  const renderStatsCard = useCallback((icon, title, value, bgColor, iconColor) => (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 hover:shadow-xl transition-all duration-200">
      <div className="flex items-center">
        <div className={`p-3 sm:p-4 ${bgColor} rounded-xl`}>
          <svg className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icon}
          </svg>
        </div>
        <div className="ml-3 sm:ml-4">
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl sm:text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  ), [])

  const renderTableSection = useCallback((title, icon, data, isCompact = true) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {icon}
          </svg>
          {title} {getDataFilterLabel()}
        </h3>
      </div>
      <div className="h-80 overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No.</th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quotation No.</th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="text-gray-600 text-sm">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-8 h-8 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm font-medium">No quotations found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((quotation, index) => renderCompactTableRow(quotation, index))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ), [isLoading, getDataFilterLabel, renderCompactTableRow])

  // ===========================
  // EFFECTS
  // ===========================
  useEffect(() => {
    console.log("Dashboard props:", { onViewQuotation, onNewQuotation, onLogout })
    console.log("User company:", userCompany)
    console.log("User type:", userType)
  }, [onViewQuotation, onNewQuotation, onLogout, userCompany, userType])

  useEffect(() => {
    fetchQuotations()
  }, []) // Only run once on component mount

  // ===========================
  // MAIN RENDER
  // ===========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-4">
            <div className="flex items-center">
              <div>
                <p className="text-sm text-gray-600 mt-1">
                  Quotation Management Dashboard
                  {userCompany && userType !== "admin" && (
                    <span className="ml-2 text-blue-600 font-medium">({userCompany})</span>
                  )}
                  {userType === "admin" && <span className="ml-2 text-red-600 font-medium">(Admin View)</span>}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Data Filter Dropdown */}
              <div className="flex items-center">
                <label htmlFor="dataFilter" className="text-sm font-medium text-gray-700 mr-2">
                  Data View:
                </label>
                <select
                  id="dataFilter"
                  value={dataFilter}
                  onChange={(e) => setDataFilter(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Data</option>
                  <option value="current">Current (Latest)</option>
                  {userType === "admin" && <option value="rewise">Rewise</option>}
                </select>
              </div>
              
              <button
                onClick={fetchQuotations}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-200"
                disabled={isLoading}
              >
                <svg
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H14"
                  />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {renderStatsCard(
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
            `Total Quotations ${getDataFilterLabel()}`,
            stats.totalQuotations,
            "bg-blue-100",
            "text-blue-600"
          )}
          
          {renderStatsCard(
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
            `Total Value ${getDataFilterLabel()}`,
            formatCurrency(stats.totalValue),
            "bg-green-100",
            "text-green-600"
          )}
          
          {renderStatsCard(
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V11a4 4 0 118 0v4z" />,
            "Recent (30 days)",
            stats.recentCount,
            "bg-purple-100",
            "text-purple-600"
          )}
          
          {renderStatsCard(
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
            `High Value (>₹1L) ${getDataFilterLabel()}`,
            stats.highValueCount,
            "bg-orange-100",
            "text-orange-600"
          )}
        </div>

        {/* Recent and Top Quotations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {renderTableSection(
            "Recent Quotations",
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
            recentQuotations
          )}
          
          {renderTableSection(
            "Top 5 Quotations",
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
            topValueQuotations
          )}
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Quotations {getDataFilterLabel()}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="all">All Quotations</option>
                  <option value="recent">Recent (30 days)</option>
                  <option value="high-value">High Value (&gt;₹1L)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Quotations Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="h-96 overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No.</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quotation No.</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="px-4 sm:px-6 py-12 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
                          <span className="text-gray-600">Loading quotations from Google Sheets...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredQuotations.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 sm:px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-lg font-medium">No quotations found</p>
                          <p className="text-sm text-gray-400">
                            {userType === "admin"
                              ? dataFilter === "rewise"
                                ? "No rewise quotations found"
                                : "Create your first quotation to get started"
                              : `No quotations found for ${userCompany}`}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredQuotations.map((quotation, index) => renderFullTableRow(quotation, index))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard