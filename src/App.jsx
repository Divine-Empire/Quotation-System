// "use client"

// import { useState, useEffect, createContext } from "react"
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
// import Login from "./pages/Login"
// import Dashboard from "./pages/Dashboard"
// import Leads from "./pages/Leads"
// import FollowUp from "./pages/FollowUp"
// import NewFollowUp from "./pages/NewFollowUp"
// import CallTracker from "./pages/CallTracker"
// import NewCallTracker from "./pages/NewCallTracker"
// // import Quotation from "./pages/Quotation"
// import Quotation from "./pages/Quotation/Quotation"
// import MainNav from "./components/MainNav"
// import Footer from "./components/Footer"
// import Notification from "./components/Notification"

// // Create auth context
// export const AuthContext = createContext(null)
// // Create data context to manage data access based on user type
// export const DataContext = createContext(null)

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [notification, setNotification] = useState(null)
//   const [currentUser, setCurrentUser] = useState(null)
//   const [userType, setUserType] = useState(null)
//   const [userData, setUserData] = useState(null)

//   // Check if user is already logged in
//   useEffect(() => {
//     const auth = localStorage.getItem("isAuthenticated")
//     const storedUser = localStorage.getItem("currentUser")
//     const storedUserType = localStorage.getItem("userType")
    
//     if (auth === "true" && storedUser) {
//       setIsAuthenticated(true)
//       setCurrentUser(JSON.parse(storedUser))
//       setUserType(storedUserType)
//       // Fetch data based on user type
//       fetchUserData(JSON.parse(storedUser).username, storedUserType)
//     }
//   }, [])

//   // Function to fetch data based on user type
//   const fetchUserData = async (username, userType) => {
//     try {
//       // Example: Fetch data from Google Sheet
//       const dataUrl = "https://docs.google.com/spreadsheets/d/1TZVWkmASF7tG-QER17588sl4SvRgY7knFKFDtYFjB0Q/gviz/tq?tqx=out:json&sheet=Data"
//       const response = await fetch(dataUrl)
//       const text = await response.text()
      
//       // Extract JSON from response
//       const jsonStart = text.indexOf('{')
//       const jsonEnd = text.lastIndexOf('}') + 1
//       const jsonData = text.substring(jsonStart, jsonEnd)
//       const data = JSON.parse(jsonData)
      
//       if (!data || !data.table || !data.table.rows) {
//         showNotification("Failed to fetch data", "error")
//         return
//       }
      
//       // Filter data based on user type
//       if (userType === "admin") {
//         // Admin sees all data
//         setUserData(data.table.rows)
//       } else {
//         // Regular user only sees their own data
//         const filteredData = data.table.rows.filter(row => 
//           row.c && row.c[0] && row.c[0].v === username
//         )
//         setUserData(filteredData)
//       }
//     } catch (error) {
//       console.error("Data fetching error:", error)
//       showNotification("An error occurred while fetching data", "error")
//     }
//   }

//   const login = async (username, password) => {
//     try {
//       // Fetch user credentials from Google Sheet
//       const loginUrl = "https://docs.google.com/spreadsheets/d/1TZVWkmASF7tG-QER17588sl4SvRgY7knFKFDtYFjB0Q/gviz/tq?tqx=out:json&sheet=Login"
//       const response = await fetch(loginUrl)
//       const text = await response.text()
      
//       // Extract JSON from response
//       const jsonStart = text.indexOf('{')
//       const jsonEnd = text.lastIndexOf('}') + 1
//       const jsonData = text.substring(jsonStart, jsonEnd)
//       const data = JSON.parse(jsonData)
      
//       if (!data || !data.table || !data.table.rows) {
//         showNotification("Failed to fetch user data", "error")
//         return false
//       }
      
//       // Find matching user
//       let foundUser = null
//       data.table.rows.forEach(row => {
//         if (row.c && 
//             row.c[0] && row.c[0].v === username && 
//             row.c[1] && row.c[1].v === password) {
//           foundUser = {
//             username: row.c[0].v,
//             userType: row.c[2] ? row.c[2].v : "user" // Default to "user" if type is not specified
//           }
//         }
//       })
      
//       if (foundUser) {
//         // Store user info
//         const userInfo = {
//           username: foundUser.username,
//           loginTime: new Date().toISOString()
//         }
        
//         setIsAuthenticated(true)
//         setCurrentUser(userInfo)
//         setUserType(foundUser.userType)
        
//         localStorage.setItem("isAuthenticated", "true")
//         localStorage.setItem("currentUser", JSON.stringify(userInfo))
//         localStorage.setItem("userType", foundUser.userType)
        
//         // Fetch data based on user type
//         await fetchUserData(foundUser.username, foundUser.userType)
        
//         showNotification(`Welcome, ${username}! (${foundUser.userType})`, "success")
//         return true
//       } else {
//         showNotification("Invalid credentials", "error")
//         return false
//       }
//     } catch (error) {
//       console.error("Login error:", error)
//       showNotification("An error occurred during login", "error")
//       return false
//     }
//   }

//   const logout = () => {
//     setIsAuthenticated(false)
//     setCurrentUser(null)
//     setUserType(null)
//     setUserData(null)
//     localStorage.removeItem("isAuthenticated")
//     localStorage.removeItem("currentUser")
//     localStorage.removeItem("userType")
//     showNotification("Logged out successfully", "success")
//   }

//   const showNotification = (message, type = "info") => {
//     setNotification({ message, type })
//     setTimeout(() => {
//       setNotification(null)
//     }, 3000)
//   }
  
//   // Check if user has admin privileges
//   const isAdmin = () => {
//     return userType === "admin"
//   }

//   // Protected route component
//   const ProtectedRoute = ({ children, adminOnly = false }) => {
//     if (!isAuthenticated) {
//       return <Navigate to="/login" />
//     }
    
//     // If admin-only route and user is not admin, redirect to dashboard
//     if (adminOnly && !isAdmin()) {
//       showNotification("You don't have permission to access this page", "error")
//       return <Navigate to="/" />
//     }
    
//     return children
//   }

//   return (
//     <AuthContext.Provider value={{ 
//       isAuthenticated, 
//       login, 
//       logout, 
//       showNotification, 
//       currentUser, 
//       userType, 
//       isAdmin: isAdmin 
//     }}>
//       <DataContext.Provider value={{ userData, fetchUserData }}>
//         <Router>
//           <div className="min-h-screen flex flex-col bg-white text-gray-900">
//             {isAuthenticated && <MainNav logout={logout} userType={userType} username={currentUser?.username} />}
//             <main className="flex-1">
//               <Routes>
//                 <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
//                 <Route
//                   path="/"
//                   element={
//                     <ProtectedRoute>
//                       <Dashboard />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/leads"
//                   element={
//                     <ProtectedRoute>
//                       <Leads />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/follow-up"
//                   element={
//                     <ProtectedRoute>
//                       <FollowUp />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/follow-up/new"
//                   element={
//                     <ProtectedRoute>
//                       <NewFollowUp />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/call-tracker"
//                   element={
//                     <ProtectedRoute>
//                       <CallTracker />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/call-tracker/new"
//                   element={
//                     <ProtectedRoute>
//                       <NewCallTracker />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route
//                   path="/quotation"
//                   element={
//                     <ProtectedRoute>
//                       <Quotation />
//                     </ProtectedRoute>
//                   }
//                 />
//                 <Route path="*" element={<Navigate to="/" />} />
//               </Routes>
//             </main>
//             {isAuthenticated && <Footer />}
//             {notification && <Notification message={notification.message} type={notification.type} />}
//           </div>
//         </Router>
//       </DataContext.Provider>
//     </AuthContext.Provider>
//   )
// }

// export default App




"use client"

import { useState, useEffect, createContext } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import Dashboard from "../src/pages/Dashboard"
import Quotation from "../src/pages/Quotation/Quotation"
import QuotationCopy from "./pages/Quotation1/Quotation"
import Login from "../src/pages/Login"
import MainNav from "../src/components/MainNav"
import Footer from "../src/components/Footer"
import Notification from "../src/components/Notification"

// Create auth context
export const AuthContext = createContext(null)
// Create data context to manage data access based on user type
export const DataContext = createContext(null)

export default function Home() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [notification, setNotification] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [userCompany, setUserCompany] = useState(null)
  const [userType, setUserType] = useState(null) // Added userType state

  const showNotification = (message, type = "info") => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Check if user is already logged in
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated")
    const storedUser = localStorage.getItem("currentUser")
    const storedUserCompany = localStorage.getItem("userCompany")
    const storedUserType = localStorage.getItem("userType")

    if (auth === "true" && storedUser) {
      setIsAuthenticated(true)
      setCurrentUser(JSON.parse(storedUser))
      setUserCompany(storedUserCompany)
      setUserType(storedUserType)
      // Fetch data based on user type
      if (storedUserType === "admin") {
        fetchAllData()
      } else {
        fetchUserData(JSON.parse(storedUser).username, storedUserCompany)
      }
    }
  }, [])

  // Function to fetch all data for admin
  const fetchAllData = async () => {
    try {
      const dataUrl =
        "https://docs.google.com/spreadsheets/d/1TZVWkmASF7tG-QER17588sl4SvRgY7knFKFDtYFjB0Q/gviz/tq?tqx=out:json&sheet=Data"
      const response = await fetch(dataUrl)
      const text = await response.text()

      const jsonStart = text.indexOf("{")
      const jsonEnd = text.lastIndexOf("}") + 1
      const jsonData = text.substring(jsonStart, jsonEnd)
      const data = JSON.parse(jsonData)

      if (!data || !data.table || !data.table.rows) {
        showNotification("Failed to fetch data", "error")
        return
      }

      // Admin sees all data
      setUserData(data.table.rows)
    } catch (error) {
      console.error("Data fetching error:", error)
      showNotification("An error occurred while fetching data", "error")
    }
  }

  // Function to fetch data based on user's company only
  const fetchUserData = async (username, userCompany) => {
    try {
      const dataUrl =
        "https://docs.google.com/spreadsheets/d/1TZVWkmASF7tG-QER17588sl4SvRgY7knFKFDtYFjB0Q/gviz/tq?tqx=out:json&sheet=Data"
      const response = await fetch(dataUrl)
      const text = await response.text()

      const jsonStart = text.indexOf("{")
      const jsonEnd = text.lastIndexOf("}") + 1
      const jsonData = text.substring(jsonStart, jsonEnd)
      const data = JSON.parse(jsonData)

      if (!data || !data.table || !data.table.rows) {
        showNotification("Failed to fetch data", "error")
        return
      }

      // Regular users only see data for their company
      const filteredData = data.table.rows.filter((row) => row.c && row.c[11] && row.c[11].v === userCompany)
      setUserData(filteredData)
    } catch (error) {
      console.error("Data fetching error:", error)
      showNotification("An error occurred while fetching data", "error")
    }
  }

  const login = async (username, password) => {
    try {
      // Check for admin login first
      if (username === "divine" && password === "divine@2025") {
        const userInfo = {
          username: "divine",
          loginTime: new Date().toISOString(),
        }

        setIsAuthenticated(true)
        setCurrentUser(userInfo)
        setUserCompany("Admin")
        setUserType("admin")

        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("currentUser", JSON.stringify(userInfo))
        localStorage.setItem("userCompany", "Admin")
        localStorage.setItem("userType", "admin")

        const completeUserData = {
          username: "divine",
          companyName: "Admin",
          userType: "admin",
          loginTime: new Date().toISOString(),
        }

        localStorage.setItem("userData", JSON.stringify(completeUserData))

        // Fetch all data for admin
        await fetchAllData()

        showNotification(`Welcome Admin, ${username}!`, "success")
        return true
      }

      // Regular user login from DROPDOWN sheet
      const loginUrl =
        "https://docs.google.com/spreadsheets/d/1TZVWkmASF7tG-QER17588sl4SvRgY7knFKFDtYFjB0Q/gviz/tq?tqx=out:json&sheet=DROPDOWN"
      const response = await fetch(loginUrl)
      const text = await response.text()

      const jsonStart = text.indexOf("{")
      const jsonEnd = text.lastIndexOf("}") + 1
      const jsonData = text.substring(jsonStart, jsonEnd)
      const data = JSON.parse(jsonData)

      if (!data || !data.table || !data.table.rows) {
        showNotification("Failed to fetch user data", "error")
        return false
      }

      // Find matching user - Column M (index 12) for username, Column L (index 11) for password
      let foundUser = null
      data.table.rows.forEach((row) => {
        if (row.c && row.c[12] && row.c[12].v === username && row.c[11] && row.c[11].v === password) {
          foundUser = {
            username: row.c[12].v,
            password: row.c[11].v,
            companyName: row.c[12].v,
          }
        }
      })

      if (foundUser) {
        const userInfo = {
          username: foundUser.username,
          loginTime: new Date().toISOString(),
        }

        setIsAuthenticated(true)
        setCurrentUser(userInfo)
        setUserCompany(foundUser.companyName)
        setUserType("user")

        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("currentUser", JSON.stringify(userInfo))
        localStorage.setItem("userCompany", foundUser.companyName)
        localStorage.setItem("userType", "user")

        const completeUserData = {
          username: foundUser.username,
          companyName: foundUser.companyName,
          userType: "user",
          loginTime: new Date().toISOString(),
        }

        localStorage.setItem("userData", JSON.stringify(completeUserData))

        // Fetch data based on company
        await fetchUserData(foundUser.username, foundUser.companyName)

        showNotification(`Welcome, ${username}!`, "success")
        return true
      } else {
        showNotification("Invalid credentials", "error")
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      showNotification("An error occurred during login", "error")
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setUserData(null)
    setUserCompany(null)
    setUserType(null)
    setCurrentView("dashboard")
    setSelectedQuotation(null)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("currentUser")
    localStorage.removeItem("userCompany")
    localStorage.removeItem("userType")
    localStorage.removeItem("userData")
    showNotification("Logged out successfully", "success")
  }

  const handleViewQuotation = (quotationData) => {
    console.log("handleViewQuotation called with:", quotationData)
    if (!quotationData || !quotationData.quotationNo) {
      console.error("Invalid quotation data received:", quotationData)
      showNotification("Invalid quotation data. Please try again.", "error")
      return
    }
    setSelectedQuotation(quotationData)
    setCurrentView("view-quotation")
  }

  const handleNewQuotation = () => {
    console.log("handleNewQuotation called")
    setSelectedQuotation(null)
    setCurrentView("new-quotation")
  }

  const handleBackToDashboard = () => {
    console.log("handleBackToDashboard called")
    setCurrentView("dashboard")
    setSelectedQuotation(null)
  }

  const handleLogout = () => {
    console.log("handleLogout called")
    logout()
  }

  console.log("Current view:", currentView)
  console.log("Selected quotation:", selectedQuotation)

  // If not authenticated, show login
  if (!isAuthenticated) {
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated,
          login,
          logout,
          showNotification,
          currentUser,
          userCompany,
          userType,
        }}
      >
        <Router>
          <div className="min-h-screen flex flex-col bg-white text-gray-900">
            <Login />
            {notification && <Notification message={notification.message} type={notification.type} />}
          </div>
        </Router>
      </AuthContext.Provider>
    )
  }

  // Main authenticated app with view-based navigation
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        showNotification,
        currentUser,
        userCompany,
        userType,
      }}
    >
      <DataContext.Provider value={{ userData, fetchUserData, fetchAllData }}>
        <Router>
          <div className="min-h-screen flex flex-col bg-white text-gray-900">
            <MainNav
              logout={logout}
              username={currentUser?.username}
              userType={userType}
              currentView={currentView}
              onViewChange={setCurrentView}
              onNewQuotation={handleNewQuotation}
            />
            <main className="flex-1">
              {currentView === "view-quotation" ? (
                <div>
                  <button
                    onClick={handleBackToDashboard}
                    className="fixed top-4 left-4 z-50 bg-white shadow-md hover:shadow-lg px-4 py-2 rounded-lg border border-gray-200 flex items-center text-gray-600 hover:text-gray-800 transition-all"
                  >
                    ← Back to Dashboard
                  </button>
                  <Quotation initialData={selectedQuotation} />
                </div>
              ) : currentView === "new-quotation" ? (
                <div>
                  <button
                    onClick={handleBackToDashboard}
                    className="fixed top-4 left-4 z-50 bg-white shadow-md hover:shadow-lg px-4 py-2 rounded-lg border border-gray-200 flex items-center text-gray-600 hover:text-gray-800 transition-all"
                  >
                    ← Back to Dashboard
                  </button>
                  <QuotationCopy initialData={null} />
                </div>
              ) : (
                <Dashboard
                  onViewQuotation={handleViewQuotation}
                  onNewQuotation={handleNewQuotation}
                  onLogout={handleLogout}
                />
              )}
            </main>
            <Footer />
            {notification && <Notification message={notification.message} type={notification.type} />}
          </div>
        </Router>
      </DataContext.Provider>
    </AuthContext.Provider>
  )
}
