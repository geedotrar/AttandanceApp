import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoSearchOutline, IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { AiFillBank } from "react-icons/ai";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="glass-header">
      <Link to="/dashboard" className="header-brand">
        <div className="brand-symbol">
          <AiFillBank />
        </div>
        <span className="brand-text-name">AttendanceApp</span>
      </Link>

      <div className="header-controls">
        <div className="header-search-wrap">
          <IoSearchOutline className="header-search-icon" />
          <input type="text" className="header-search-input" placeholder="Cari data atau karyawan..." />
        </div>

        <button className="header-icon-btn" title="Notifikasi">
          <IoNotificationsOutline />
        </button>

        <button className="header-icon-btn" title="Pengaturan">
          <IoSettingsOutline />
        </button>

        <div className="header-user-pill">
          <div className="header-user-avatar">
            {getInitials(user?.nama || user?.username)}
          </div>
          <div className="header-user-info">
            <span className="header-user-name">{user?.nama || user?.username || "Guest User"}</span>
            <span className="header-user-role">{user?.role || "Karyawan"} • {user?.jabatan || "Staff"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
