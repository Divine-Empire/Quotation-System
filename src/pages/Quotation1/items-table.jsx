"use client"
import { PlusIcon, TrashIcon } from "../../components/Icons"
import { useState } from "react"

const ItemsTable = ({
    quotationData,
    handleItemChange,
    handleAddItem,
    specialDiscount,
    setSpecialDiscount,
    productCodes,
    productNames,
    productData,
    setQuotationData,
    handleSpecialDiscountChange, // Add this
  }) => {
  const [hideDisc, setHideDisc] = useState(false)
  const [hideFlatDisc, setHideFlatDisc] = useState(false)
  const [hideTotalFlatDisc, setHideTotalFlatDisc] = useState(false)
  const [hideSpecialDiscount, setHideSpecialDiscount] = useState(false)

  const calculateColSpan = () => {
    let baseSpan = 9
    if (hideDisc) baseSpan -= 1
    if (hideFlatDisc) baseSpan -= 1
    return baseSpan.toString()
  }

  // Calculate taxable amount properly (subtotal - totalFlatDiscount)
  const taxableAmount = Math.max(0, quotationData.subtotal - quotationData.totalFlatDiscount)

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Items</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              className="px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-50"
              onClick={() => setHideDisc(!hideDisc)}
            >
              {hideDisc ? 'Show' : 'Hide'} Disc%
            </button>
            <button
              className="px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-50"
              onClick={() => setHideFlatDisc(!hideFlatDisc)}
            >
              {hideFlatDisc ? 'Show' : 'Hide'} Flat Disc
            </button>
            <button
              className="px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-50"
              onClick={() => setHideTotalFlatDisc(!hideTotalFlatDisc)}
            >
              {hideTotalFlatDisc ? 'Show' : 'Hide'} Total Flat Disc
            </button>
            <button
              className="px-2 py-1 border border-gray-300 rounded-md text-xs text-gray-700 hover:bg-gray-50"
              onClick={() => setHideSpecialDiscount(!hideSpecialDiscount)}
            >
              {hideSpecialDiscount ? 'Show' : 'Hide'} Special Disc
            </button>
            <button
              className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              onClick={handleAddItem}
            >
              <PlusIcon className="h-4 w-4 inline mr-1" /> Add Item
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">S No.</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">GST %</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty.</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Units</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                {!hideDisc && <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Disc %</th>}
                {!hideFlatDisc && <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Flat Disc</th>}
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quotationData.items.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={item.code}
                        onChange={(e) => {
                          handleItemChange(item.id, "code", e.target.value)
                          if (productData[e.target.value]) {
                            const productInfo = productData[e.target.value]
                            handleItemChange(item.id, "name", productInfo.name)
                            handleItemChange(item.id, "description", productInfo.description)
                            handleItemChange(item.id, "rate", productInfo.rate)
                          }
                        }}
                        list={`code-list-${item.id}`}
                        className="w-24 p-1 border border-gray-300 rounded-md"
                      />
                      <datalist id={`code-list-${item.id}`}>
                        {productCodes.map((code) => (
                          <option key={code} value={code} />
                        ))}
                      </datalist>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          handleItemChange(item.id, "name", e.target.value)
                          if (productData[e.target.value]) {
                            const productInfo = productData[e.target.value]
                            handleItemChange(item.id, "code", productInfo.code)
                            handleItemChange(item.id, "description", productInfo.description)
                            handleItemChange(item.id, "rate", productInfo.rate)
                          }
                        }}
                        list={`name-list-${item.id}`}
                        className="w-full p-1 border border-gray-300 rounded-md"
                        placeholder="Enter item name"
                        required
                      />
                      <datalist id={`name-list-${item.id}`}>
                        {productNames.map((name) => (
                          <option key={name} value={name} />
                        ))}
                      </datalist>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={item.description || ""}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        className="w-full p-1 border border-gray-300 rounded-md"
                        placeholder="Enter description"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={item.gst}
                      onChange={(e) => handleItemChange(item.id, "gst", Number.parseInt(e.target.value))}
                      className="w-20 p-1 border border-gray-300 rounded-md"
                    >
                      <option value="0">0%</option>
                      <option value="18">18%</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, "qty", Number.parseInt(e.target.value) || 0)}
                      className="w-16 p-1 border border-gray-300 rounded-md"
                      placeholder="0"
                      required
                    />
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={item.units}
                      onChange={(e) => handleItemChange(item.id, "units", e.target.value)}
                      className="w-20 p-1 border border-gray-300 rounded-md"
                    >
                      <option value="Nos">Nos</option>
                      <option value="Pcs">Pcs</option>
                      <option value="Kg">Kg</option>
                      <option value="Set">Set</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, "rate", Number.parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 border border-gray-300 rounded-md"
                      placeholder="0.00"
                      required
                    />
                  </td>
                  {!hideDisc && (
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => handleItemChange(item.id, "discount", Number.parseFloat(e.target.value) || 0)}
                        className="w-20 p-1 border border-gray-300 rounded-md"
                        placeholder="0%"
                        min="0"
                        max="100"
                      />
                    </td>
                  )}
                  {!hideFlatDisc && (
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={item.flatDiscount}
                        onChange={(e) =>
                          handleItemChange(item.id, "flatDiscount", Number.parseFloat(e.target.value) || 0)
                        }
                        className="w-24 p-1 border border-gray-300 rounded-md"
                        placeholder="0.00"
                        min="0"
                      />
                    </td>
                  )}
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.amount}
                      className="w-24 p-1 border border-gray-300 rounded-md bg-gray-50"
                      readOnly
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="text-red-500 hover:text-red-700 p-1 rounded-md"
                      onClick={() => {
                        const newItems = quotationData.items.filter((i) => i.id !== item.id)
                        if (newItems.length === 0) return

                        const subtotal = newItems.reduce((sum, i) => sum + i.amount, 0)
                        const subtotalAfterDiscount = Math.max(0, subtotal - quotationData.totalFlatDiscount)
                        
                        let cgstAmount = 0
                        let sgstAmount = 0
                        let igstAmount = 0
                        let total = 0

                        if (quotationData.isIGST) {
                          igstAmount = Number((subtotalAfterDiscount * (quotationData.igstRate / 100)).toFixed(2))
                          total = Number((subtotalAfterDiscount + igstAmount - (Number(specialDiscount) || 0)).toFixed(2))
                        } else {
                          cgstAmount = Number((subtotalAfterDiscount * (quotationData.cgstRate / 100)).toFixed(2))
                          sgstAmount = Number((subtotalAfterDiscount * (quotationData.sgstRate / 100)).toFixed(2))
                          total = Number((subtotalAfterDiscount + cgstAmount + sgstAmount - (Number(specialDiscount) || 0)).toFixed(2))
                        }

                        setQuotationData({
                          ...quotationData,
                          items: newItems,
                          subtotal,
                          cgstAmount,
                          sgstAmount,
                          igstAmount,
                          total,
                        })
                      }}
                      disabled={quotationData.items.length <= 1}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={calculateColSpan()} className="px-4 py-2 text-right font-medium">
                  Subtotal:
                </td>
                <td className="border p-2">
                  ₹{typeof quotationData.subtotal === "number" ? quotationData.subtotal.toFixed(2) : "0.00"}
                </td>
                <td></td>
              </tr>
              {!hideTotalFlatDisc && (
                <tr>
                  <td colSpan={calculateColSpan()} className="px-4 py-2 text-right font-medium">
                    Total Flat Discount:
                  </td>
                  <td className="p-2">
                    ₹
                    {typeof quotationData.totalFlatDiscount === "number"
                      ? quotationData.totalFlatDiscount.toFixed(2)
                      : "0.00"}
                  </td>
                  <td></td>
                </tr>
              )}
              <tr className="border">
                <td colSpan={calculateColSpan()} className="px-4 py-2 text-right font-medium">
                  Taxable Amount:
                </td>
                <td className="px-4 py-2">₹{taxableAmount.toFixed(2)}</td>
                <td></td>
              </tr>
              {quotationData.isIGST ? (
                <tr className="border">
                  <td colSpan={calculateColSpan()} className="px-4 py-2 text-right font-medium">
                    IGST ({quotationData.igstRate}%):
                  </td>
                  <td className="px-4 py-2">₹{(quotationData.igstAmount || 0).toFixed(2)}</td>
                  <td></td>
                </tr>
              ) : (
                <>
                  <tr className="border">
                    <td colSpan={calculateColSpan()} className="px-4 py-2 text-right font-medium">
                      CGST ({quotationData.cgstRate}%):
                    </td>
                    <td className="px-4 py-2">₹{quotationData.cgstAmount.toFixed(2)}</td>
                    <td></td>
                  </tr>
                  <tr className="border">
                    <td colSpan={calculateColSpan()} className="px-4 py-2 text-right font-medium">
                      SGST ({quotationData.sgstRate}%):
                    </td>
                    <td className="px-4 py-2">₹{quotationData.sgstAmount.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </>
              )}
              {!hideSpecialDiscount && (
                <tr>
                  <td colSpan={calculateColSpan()} className="px-4 py-2 text-right font-medium">
                    Special Discount:
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={specialDiscount}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSpecialDiscount(value);
                        handleSpecialDiscountChange(value);
                      }}
                      className="w-24 p-1 border border-gray-300 rounded-md"
                      min="0"
                      placeholder="0.00"
                    />
                  </td>
                  <td></td>
                </tr>
              )}
              <tr className="font-bold">
                <td colSpan={calculateColSpan()} className="px-4 py-2 text-right">
                  Grand Total:
                </td>
                <td className="px-4 py-2">
                  ₹{(() => {
                    // Calculate the correct grand total
                    const taxableAmt = Math.max(0, quotationData.subtotal - quotationData.totalFlatDiscount)
                    let grandTotal = 0
                    
                    if (quotationData.isIGST) {
                      const igstAmt = taxableAmt * (quotationData.igstRate / 100)
                      grandTotal = taxableAmt + igstAmt - (Number(specialDiscount) || 0)
                    } else {
                      const cgstAmt = taxableAmt * (quotationData.cgstRate / 100)
                      const sgstAmt = taxableAmt * (quotationData.sgstRate / 100)
                      grandTotal = taxableAmt + cgstAmt + sgstAmt - (Number(specialDiscount) || 0)
                    }
                    
                    return Math.max(0, grandTotal).toFixed(2)
                  })()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ItemsTable