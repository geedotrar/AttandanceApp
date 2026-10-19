import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoGridOutline, IoTimeOutline, IoPeopleOutline, IoLogOutOutline } from "react-icons/io5";
import { AiFillBank } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
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
          <NavLink to="/absen" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <IoTimeOutline />
            <span>Absensi</span>
          </NavLink>
          {user && user.role === "admin" && (
            <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
              <IoPeopleOutline />
              <span>Karyawan</span>
            </NavLink>
          )}
        </nav>
      </div>

      <div className="sidebar-bottom">
        <button onClick={logout} className="sidebar-logout" title="Sign Out">
          <IoLogOutOutline />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
