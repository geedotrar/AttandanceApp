import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="app-shell">
      <div className="app-frame">
        <Sidebar />
        <main className="app-glass-main">
          <Navbar />
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
