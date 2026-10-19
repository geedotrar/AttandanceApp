import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoGridOutline, IoTimeOutline, IoPeopleOutline, IoLogOutOutline } from "react-icons/io5";
import { AiFillBank } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";
import ConfirmModal from "./Common/ConfirmModal";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
    <>
      <aside className="app-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand-icon">
            <AiFillBank />
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <IoGridOutline />
              <span>Dashboard</span>
            </NavLink>
            {user?.role !== "admin" && user?.role !== "superadmin" && (
              <NavLink to="/absen" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
                <IoTimeOutline />
                <span>Absensi</span>
              </NavLink>
            )}
            <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <IoPeopleOutline />
              <span>{user && (user.role === "superadmin" || user.role === "admin") ? "Karyawan" : "Divisi"}</span>
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button onClick={() => setShowLogoutModal(true)} className="sidebar-logout" title="Keluar">
            <IoLogOutOutline />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Konfirmasi Keluar Akun"
        message="Apakah Anda yakin ingin keluar dari akun AttendanceApp Anda?"
        confirmText="Ya, Keluar"
        type="logout"
      />
    </>
  );
};

export default Sidebar;
