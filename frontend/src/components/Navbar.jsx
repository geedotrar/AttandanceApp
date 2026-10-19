import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  IoPersonOutline, 
  IoLogOutOutline, 
  IoChevronDownOutline
} from "react-icons/io5";
import { AiFillBank } from "react-icons/ai";
import { LogOut, reset } from "../features/authSlice";
import ConfirmModal from "./Common/ConfirmModal";
import ProfileModal from "./Common/ProfileModal";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutConfirm = () => {
    setLogoutModalOpen(false);
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

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
    <>
      <header className="glass-header">
        <Link to="/dashboard" className="header-brand">
          <div className="brand-symbol">
            <AiFillBank />
          </div>
          <span className="brand-text-name">AttendanceApp</span>
        </Link>

        <div className="header-controls">
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <div
              className="header-user-pill"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                cursor: "pointer",
                userSelect: "none",
                border: dropdownOpen ? "1.5px solid #0284c7" : undefined,
                boxShadow: dropdownOpen ? "0 0 0 3px rgba(2, 132, 199, 0.15)" : undefined,
                transition: "all 0.2s ease",
              }}
            >
              <div className="header-user-avatar">
                {getInitials(user?.nama || user?.username)}
              </div>
              <div className="header-user-info">
                <span className="header-user-name">{user?.nama || user?.username || "Guest User"}</span>
                <span className="header-user-role">{user?.jabatan || user?.divisi || "Karyawan"}</span>
              </div>
              <IoChevronDownOutline
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  marginLeft: "4px",
                  transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </div>

            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: "240px",
                  background: "#ffffff",
                  borderRadius: "20px",
                  padding: "10px",
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
                  border: "1px solid rgba(226, 232, 240, 0.9)",
                  zIndex: 200,
                  animation: "fadeIn 0.15s ease",
                }}
              >
                <div
                  style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid rgba(241, 245, 249, 0.9)",
                    marginBottom: "6px",
                  }}
                >
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)" }}>
                    {user?.nama || user?.username || "Pengguna"}
                  </div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginBottom: "4px" }}>
                    @{user?.username || "user"}
                  </div>
                  <span
                    className="pill-badge blue"
                    style={{ fontSize: "10px", padding: "1px 8px" }}
                  >
                    {user?.jabatan || "Staff"} • {user?.divisi || "General"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    setProfileModalOpen(true);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "none",
                    background: "transparent",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(241, 245, 249, 0.8)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <IoPersonOutline style={{ fontSize: "16px", color: "#0284c7" }} />
                  <span>Pengaturan Profil</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false);
                    setLogoutModalOpen(true);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "none",
                    background: "transparent",
                    color: "#ef4444",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <IoLogOutOutline style={{ fontSize: "17px" }} />
                  <span>Keluar (Log Out)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
      />

      <ConfirmModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Konfirmasi Keluar Akun"
        message="Apakah Anda yakin ingin keluar dari akun AttendanceApp Anda?"
        confirmText="Ya, Keluar"
        type="logout"
      />
    </>
  );
};

export default Navbar;
