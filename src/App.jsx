import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Stores from "./pages/Stores";
import AvailableItems from "./pages/AvailableItems";
import LoginSignup from "./pages/LoginSignup";
import AppointItem from "./pages/AppointItem";
import ReturnItem from "./pages/ReturnItem";
import ApproveToolRequests from "./pages/ApproveToolRequests";
import UsersUsingTools from "./pages/UsersUsingTools";
import StockReport from "./pages/StockReport";
import MissingToolList from "./pages/MissingToolList";
import MaintainUsers from "./pages/MaintainUsers";
import MaintainToolsMaster from './pages/MaintainToolsMaster';
import MasterInfoReport from "./pages/MasterInfoReport";
const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/available" element={<AvailableItems />} />
            {user?.role === "User" && (
              <Route path="/return" element={<ReturnItem />} />
            )}
            {user?.role === "Toolskeeper" && (
              <Route path="/appoint" element={<AppointItem />} />
            )}
            {user?.role === "Admin" && (
              <Route path="/approve" element={<ApproveToolRequests />} />
            )}
            <Route path="/appoint" element={<AppointItem />} /> ✅ added
            <Route path="/return" element={<ReturnItem />} /> ✅ added
            <Route path="/approve" element={<ApproveToolRequests />} />{" "}
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UsersUsingTools />} />{" "}
            {/* ✅ ADD THIS */}
            <Route path="/stock-report" element={<StockReport />} />
            <Route path="/missing" element={<MissingToolList />} />
            {user?.role === "Toolskeeper" && (
              <Route path="/tools-master" element={<Stores />} />
            )}
            {user?.role === "Admin" && (
              <Route path="/users-master" element={<MaintainUsers />} />
            )}
            <Route path="/tools-master" element={<MaintainToolsMaster />} />
            <Route path="/master-report" element={<MasterInfoReport />} /> 


          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
