import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { 
  IoCloseOutline, 
  IoPersonOutline, 
  IoSaveOutline 
} from "react-icons/io5";
import { API_URL } from "../../config";
import { getMe } from "../../features/authSlice";
import ConfirmModal from "./ConfirmModal";

const ProfileModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const [nama, setNama] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setNama(user.nama || "");
      setUsername(user.username || "");
      setPassword("");
      setConfPassword("");
      setMsg("");
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmitAttempt = (e) => {
    e.preventDefault();
    setMsg("");

    if (password && password !== confPassword) {
      setMsg("Password baru dan konfirmasi password tidak cocok!");
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmedSave = async () => {
    setIsLoading(true);
    setShowConfirm(false);
    try {
      await axios.put(`${API_URL}/users/${user.id}`, {
        nama: nama,
        username: username,
        password: password,
        confPassword: confPassword,
      });

      dispatch(getMe());
      setIsLoading(false);
      onClose();
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Gagal memperbarui profil. Periksa koneksi Anda.");
      }
    }
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.55)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget && !isLoading) {
            onClose();
          }
        }}
      >
        <div
          style={{
            background: "#ffffff",
            maxWidth: "520px",
            width: "100%",
            borderRadius: "28px",
            padding: "32px 30px",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(226, 232, 240, 0.9)",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "20px",
                }}
              >
                <IoPersonOutline />
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "var(--text-primary)" }}>
                  Pengaturan Profil Saya
                </h3>
                <p style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
                  Kelola informasi akun dan kata sandi Anda
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isLoading}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(241, 245, 249, 0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "20px",
                color: "var(--text-muted)",
              }}
            >
              <IoCloseOutline />
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              background: "rgba(241, 245, 249, 0.6)",
              padding: "12px 18px",
              borderRadius: "16px",
              marginBottom: "20px",
              fontSize: "12.5px",
            }}
          >
            <div>
              <span style={{ color: "var(--text-muted)", display: "block", fontSize: "11.5px", marginBottom: "2px" }}>Jabatan</span>
              <strong style={{ fontSize: "13px" }}>{user.jabatan || "-"}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)", display: "block", fontSize: "11.5px", marginBottom: "2px" }}>Divisi</span>
              <strong style={{ fontSize: "13px" }}>{user.divisi || "General"}</strong>
            </div>
          </div>

          {msg && (
            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "10px 14px",
                borderRadius: "12px",
                marginBottom: "16px",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmitAttempt}>
            <div className="form-group-field">
              <label className="form-label-custom">Nama Lengkap</label>
              <input
                type="text"
                className="form-input-custom"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                required
              />
            </div>

            <div className="form-group-field">
              <label className="form-label-custom">Username</label>
              <input
                type="text"
                className="form-input-custom"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group-field">
                <label className="form-label-custom">Password Baru (Opsional)</label>
                <input
                  type="password"
                  className="form-input-custom"
                  placeholder="Kosongkan jika tidak ganti"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group-field">
                <label className="form-label-custom">Konfirmasi Password</label>
                <input
                  type="password"
                  className="form-input-custom"
                  placeholder="Konfirmasi password baru"
                  value={confPassword}
                  onChange={(e) => setConfPassword(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-pill-light"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-pill-dark"
              >
                <IoSaveOutline style={{ fontSize: "16px" }} />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmedSave}
        title="Konfirmasi Perubahan Profil"
        message="Apakah Anda yakin ingin menyimpan perubahan data profil akun Anda?"
        confirmText="Ya, Simpan"
        type="primary"
        isLoading={isLoading}
      />
    </>
  );
};

export default ProfileModal;
