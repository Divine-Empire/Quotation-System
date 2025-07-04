"use client"

import { useState } from "react"

const MainNav = ({ logout, username, userType, currentView, onViewChange, onNewQuotation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
  }

  const handleNewQuotation = () => {
    if (onNewQuotation) {
      onNewQuotation()
    }
  }

  const handleDashboard = () => {
    if (onViewChange) {
      onViewChange("dashboard")
    }
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">DE</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Divine Empire</h1>
                <p className="text-xs text-gray-600">Quotation Management</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={handleDashboard}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === "dashboard"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={handleNewQuotation}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-md hover:shadow-lg transition-all duration-200"
              >
                Quotation
              </button>
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {username}
                    {userType === "admin" && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Admin
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600">{userType === "admin" ? "System Administrator" : "User"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
          <button
            onClick={handleDashboard}
            className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors ${
              currentView === "dashboard"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={handleNewQuotation}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
          >
            New Quotation
          </button>
          <div className="border-t border-gray-300 pt-4 pb-3">
            <div className="flex items-center px-3">
              <div>
                <div className="text-base font-medium text-gray-900">
                  {username}
                  {userType === "admin" && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Admin
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{userType === "admin" ? "System Administrator" : "User"}</div>
              </div>
            </div>
            <div className="mt-3 px-2">
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MainNav
