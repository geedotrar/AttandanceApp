import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBackOutline, IoSaveOutline } from "react-icons/io5";
import { API_URL } from "../../config";

const FormAddUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [role, setRole] = useState("user");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const saveUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/users`, {
        nama: nama,
        username: username,
        password: password,
        confPassword: confPassword,
        jabatan: jabatan,
        role: role,
      });
      navigate("/users");
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <div className="page-action-ribbon">
        <div className="ribbon-left">
          <span className="ribbon-breadcrumb">Portal Perusahaan &gt; Karyawan &gt; Baru</span>
          <div className="ribbon-title-wrap">
            <Link to="/users" className="ribbon-back-btn" title="Kembali">
              <IoArrowBackOutline />
            </Link>
            <h1 className="ribbon-title">Tambah Karyawan Baru</h1>
          </div>
        </div>
      </div>

      <div className="glass-form-card">
        {msg && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px 18px", borderRadius: "14px", marginBottom: "20px", fontSize: "13px", fontWeight: "600" }}>
            {msg}
          </div>
        )}

        <form onSubmit={saveUser}>
          <div className="form-group-field">
            <label className="form-label-custom">Nama Lengkap</label>
            <input
              type="text"
              className="form-input-custom"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              required
            />
          </div>

          <div className="form-group-field">
            <label className="form-label-custom">Jabatan / Posisi</label>
            <input
              type="text"
              className="form-input-custom"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value)}
              placeholder="Contoh: Software Engineer, HR Specialist"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group-field">
              <label className="form-label-custom">Username</label>
              <input
                type="text"
                className="form-input-custom"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                required
              />
            </div>

            <div className="form-group-field">
              <label className="form-label-custom">Tingkat Hak Akses (Role)</label>
              <select
                className="form-select-custom"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User (Karyawan Biasa)</option>
                <option value="admin">Admin (Akses Penuh)</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="form-group-field">
              <label className="form-label-custom">Password</label>
              <input
                type="password"
                className="form-input-custom"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                required
              />
            </div>

            <div className="form-group-field">
              <label className="form-label-custom">Konfirmasi Password</label>
              <input
                type="password"
                className="form-input-custom"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
                placeholder="******"
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
            <Link to="/users" className="btn-pill-light">
              Batal
            </Link>
            <button type="submit" disabled={isLoading} className="btn-pill-dark">
              <IoSaveOutline style={{ fontSize: "18px" }} />
              <span>{isLoading ? "Menyimpan..." : "Simpan Karyawan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAddUser;
