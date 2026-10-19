import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
  IoPersonAddOutline, 
  IoAppsOutline, 
  IoListOutline, 
  IoCalendarOutline, 
  IoPencilOutline, 
  IoTrashOutline,
  IoPersonOutline,
  IoBriefcaseOutline
} from "react-icons/io5";
import { API_URL } from "../../config";

const Userlist = () => {
  const [users, setUsers] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (userId, nama) => {
    if (window.confirm(`Apakah kamu yakin ingin menghapus karyawan "${nama}"?`)) {
      try {
        await axios.delete(`${API_URL}/users/${userId}`);
        getUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const getTileGrad = (index) => {
    const grads = ["var(--grad-pink)", "var(--grad-teal)", "var(--grad-blue)", "var(--grad-amber)", "var(--grad-purple)"];
    return grads[index % grads.length];
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
    <div>
      <div className="page-action-ribbon">
        <div className="ribbon-left">
          <span className="ribbon-breadcrumb">Portal Perusahaan &gt; Manajemen SDM</span>
          <div className="ribbon-title-wrap">
            <h1 className="ribbon-title">Daftar Karyawan</h1>
          </div>
        </div>

        <div className="ribbon-right">
          <div className="view-toggle-wrap">
            <button 
              className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Tampilan Grid"
            >
              <IoAppsOutline />
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Tampilan Tabel"
            >
              <IoListOutline />
            </button>
          </div>

          <Link to="/users/add" className="btn-pill-dark">
            <IoPersonAddOutline style={{ fontSize: "18px" }} />
            <span>Tambah Karyawan Baru</span>
          </Link>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="hero-stat-card" style={{ padding: "48px 24px", textAlign: "center", alignItems: "center" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "18px", fontSize: "14px" }}>
            Belum ada karyawan yang terdaftar.
          </p>
          <Link to="/users/add" className="btn-pill-dark">
            <IoPersonAddOutline />
            <span>Tambah Karyawan Pertama</span>
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="cards-4col-grid">
          {users.map((item, idx) => (
            <div key={item.id} className="class-mini-card">
              <div className="mini-card-top">
                <div className="mini-tile-badge" style={{ background: getTileGrad(idx) }}>
                  {getInitials(item.nama)}
                </div>
                <div className="mini-card-info">
                  <div className="mini-card-meta">@{item.username}</div>
                  <div className="mini-card-title">{item.nama}</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", background: "rgba(241, 245, 249, 0.5)", padding: "10px 14px", borderRadius: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Jabatan</span>
                  <strong>{item.jabatan || "-"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <span style={{ color: "var(--text-muted)" }}>Role</span>
                  <span className={`pill-badge ${item.role === "admin" ? "blue" : "gray"}`} style={{ padding: "2px 8px", fontSize: "10px" }}>
                    {item.role}
                  </span>
                </div>
              </div>

              <div className="mini-card-actions">
                <Link to={`/userAbsen/${item.id}`} className="btn-pill-light" style={{ padding: "6px 12px", fontSize: "11px" }}>
                  <IoCalendarOutline />
                  <span>Absen</span>
                </Link>

                <div style={{ display: "flex", gap: "6px" }}>
                  <Link to={`/users/edit/${item.id}`} className="header-icon-btn" style={{ width: "32px", height: "32px", fontSize: "14px" }} title="Edit">
                    <IoPencilOutline />
                  </Link>
                  <button onClick={() => deleteUser(item.id, item.nama)} className="header-icon-btn" style={{ width: "32px", height: "32px", fontSize: "14px", color: "#ef4444" }} title="Hapus">
                    <IoTrashOutline />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-table-container">
          <table className="glass-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Karyawan</th>
                <th>Username</th>
                <th>Jabatan</th>
                <th>Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="avatar-circle" style={{ background: getTileGrad(idx) }}>
                        {getInitials(item.nama)}
                      </div>
                      <strong>{item.nama}</strong>
                    </div>
                  </td>
                  <td>@{item.username}</td>
                  <td>{item.jabatan || "-"}</td>
                  <td>
                    <span className={`pill-badge ${item.role === "admin" ? "blue" : "gray"}`}>
                      {item.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link to={`/userAbsen/${item.id}`} className="btn-pill-light" style={{ padding: "4px 10px", fontSize: "11px" }}>
                        Lihat Absen
                      </Link>
                      <Link to={`/users/edit/${item.id}`} className="btn-pill-light" style={{ padding: "4px 8px", fontSize: "11px" }}>
                        <IoPencilOutline />
                      </Link>
                      <button onClick={() => deleteUser(item.id, item.nama)} className="btn-pill-light" style={{ padding: "4px 8px", fontSize: "11px", color: "#ef4444" }}>
                        <IoTrashOutline />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Userlist;
