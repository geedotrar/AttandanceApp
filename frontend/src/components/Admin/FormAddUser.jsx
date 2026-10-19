import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IoArrowBackOutline, IoSaveOutline } from "react-icons/io5";
import { API_URL } from "../../config";

import SearchableSelect from "../Common/SearchableSelect";
import ConfirmModal from "../Common/ConfirmModal";

const DIVISI_OPTIONS = [
  { value: "IT & Teknologi", label: "IT & Teknologi" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Finance & Accounting", label: "Finance & Accounting" },
  { value: "Marketing & Sales", label: "Marketing & Sales" },
  { value: "Operasional", label: "Operasional" },
  { value: "Management", label: "Management" },
  { value: "General", label: "General" },
];

const ROLE_OPTIONS = [
  { value: "user", label: "User (Karyawan)" },
  { value: "admin", label: "Admin Divisi" },
  { value: "superadmin", label: "Super Admin (Akses Penuh Perusahaan)" },
];

const FormAddUser = () => {
  const [searchParams] = useSearchParams();
  const queryDivisi = searchParams.get("divisi");
  const isDivisiDisabled = Boolean(queryDivisi);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [divisi, setDivisi] = useState(queryDivisi || "IT & Teknologi");
  const [role, setRole] = useState("user");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (queryDivisi) {
      setDivisi(queryDivisi);
    }
  }, [queryDivisi]);

  const currentDivisiOptions = useMemo(() => {
    if (queryDivisi && !DIVISI_OPTIONS.some((opt) => opt.value.toLowerCase() === queryDivisi.toLowerCase())) {
      return [{ value: queryDivisi, label: queryDivisi }, ...DIVISI_OPTIONS];
    }
    return DIVISI_OPTIONS;
  }, [queryDivisi]);

  const backUrl = queryDivisi ? `/users?divisi=${encodeURIComponent(queryDivisi)}` : "/users";

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setMsg("");
    if (password !== confPassword) {
      setMsg("Password dan Konfirmasi Password tidak cocok!");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmedSave = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/users`, {
        nama: nama,
        username: username,
        password: password,
        confPassword: confPassword,
        jabatan: jabatan,
        divisi: divisi,
        role: role,
      });
      navigate(backUrl);
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
          <span className="ribbon-breadcrumb">
            Portal Perusahaan &gt; {queryDivisi ? `Divisi ${queryDivisi}` : "Karyawan"} &gt; Baru
          </span>
          <div className="ribbon-title-wrap">
            <Link to={backUrl} className="ribbon-back-btn" title="Kembali">
              <IoArrowBackOutline />
            </Link>
            <h1 className="ribbon-title">
              {queryDivisi ? `Tambah Karyawan (${queryDivisi})` : "Tambah Karyawan Baru"}
            </h1>
          </div>
        </div>
      </div>

      <div className="glass-form-card">
        {msg && (
          <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px 18px", borderRadius: "14px", marginBottom: "20px", fontSize: "13px", fontWeight: "600" }}>
            {msg}
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
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

            <div className="form-group-field">
              <label className="form-label-custom">
                Divisi / Departemen {isDivisiDisabled && (
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "500", marginLeft: "4px" }}>
                    (Terkunci otomatis)
                  </span>
                )}
              </label>
              <SearchableSelect
                options={currentDivisiOptions}
                value={divisi}
                onChange={(val) => setDivisi(val)}
                placeholder="Pilih Divisi..."
                searchPlaceholder="Cari divisi..."
                disabled={isDivisiDisabled}
              />
            </div>
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
              <SearchableSelect
                options={ROLE_OPTIONS}
                value={role}
                onChange={(val) => setRole(val)}
                placeholder="Pilih Role..."
                searchPlaceholder="Cari role hak akses..."
              />
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
            <Link to={backUrl} className="btn-pill-light">
              Batal
            </Link>
            <button type="submit" disabled={isLoading} className="btn-pill-dark">
              <IoSaveOutline style={{ fontSize: "18px" }} />
              <span>{isLoading ? "Menyimpan..." : "Simpan Karyawan"}</span>
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmedSave}
        title="Konfirmasi Tambah Karyawan"
        message={`Apakah Anda yakin ingin menambahkan data karyawan baru "${nama}" ke dalam sistem?`}
        confirmText="Ya, Simpan"
        cancelText="Batal"
        type="primary"
        isLoading={isLoading}
      />
    </div>
  );
};

export default FormAddUser;
