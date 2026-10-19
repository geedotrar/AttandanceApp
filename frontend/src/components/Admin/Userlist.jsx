import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  IoArrowBackOutline,
  IoPersonAddOutline, 
  IoListOutline, 
  IoCalendarOutline, 
  IoPencilOutline, 
  IoTrashOutline,
  IoArrowForwardOutline,
  IoSearchOutline,
  IoCodeSlashOutline,
  IoPeopleOutline,
  IoWalletOutline,
  IoMegaphoneOutline,
  IoConstructOutline,
  IoBriefcaseOutline,
  IoBusinessOutline,
  IoGridOutline
} from "react-icons/io5";
import { API_URL } from "../../config";
import ConfirmModal from "../Common/ConfirmModal";

const BASE_DEPARTMENTS = [
  { 
    name: "IT & Teknologi", 
    desc: "Rekayasa perangkat lunak, infrastruktur server, dan IT support.", 
    grad: "var(--grad-blue)", 
    icon: IoCodeSlashOutline 
  },
  { 
    name: "Human Resources", 
    desc: "Manajemen talenta, perekrutan, absensi, dan relasi karyawan.", 
    grad: "var(--grad-pink)", 
    icon: IoPeopleOutline 
  },
  { 
    name: "Finance & Accounting", 
    desc: "Perencanaan anggaran, penggajian, perpajakan, dan pembukuan.", 
    grad: "var(--grad-teal)", 
    icon: IoWalletOutline 
  },
  { 
    name: "Marketing & Sales", 
    desc: "Strategi pemasaran, akuisisi klien, branding, dan pertumbuhan.", 
    grad: "var(--grad-amber)", 
    icon: IoMegaphoneOutline 
  },
  { 
    name: "Operasional", 
    desc: "Logistik, manajemen fasilitas kantor, dan operasional harian.", 
    grad: "var(--grad-purple)", 
    icon: IoConstructOutline 
  },
  { 
    name: "Management", 
    desc: "Direksi, kepemimpinan eksekutif, dan keputusan strategis.", 
    grad: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)", 
    icon: IoBriefcaseOutline 
  },
  { 
    name: "General", 
    desc: "Departemen umum dan administrasi perkantoran terintegrasi.", 
    grad: "linear-gradient(135deg, #64748b 0%, #475569 100%)", 
    icon: IoBusinessOutline 
  },
];

const Userlist = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlDivisi = searchParams.get("divisi");

  const [users, setUsers] = useState([]);
  const [openedDivisi, setOpenedDivisi] = useState(urlDivisi || null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.auth);

  const isSuperadmin = user?.role === "superadmin" || user?.role === "admin";

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    if (urlDivisi) {
      setOpenedDivisi(urlDivisi);
    } else if (!isSuperadmin && user) {
      setOpenedDivisi(user.divisi || "General");
    }
  }, [urlDivisi, isSuperadmin, user]);

  const handleOpenDivisi = (divName) => {
    setOpenedDivisi(divName);
    setSearchTerm("");
    if (divName) {
      setSearchParams({ divisi: divName });
    } else {
      setSearchParams({});
    }
  };

  const handleBackToCards = () => {
    setOpenedDivisi(null);
    setSearchTerm("");
    setSearchParams({});
  };

  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteUser = (userId, nama) => {
    setUserToDelete({ id: userId, nama: nama });
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/users/${userToDelete.id}`);
      setIsDeleting(false);
      setUserToDelete(null);
      getUsers();
    } catch (error) {
      setIsDeleting(false);
      console.error("Error deleting user:", error);
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

  const getRoleBadgeClass = (role) => {
    if (role === "superadmin") return "purple";
    if (role === "admin") return "blue";
    return "gray";
  };

  const departments = [...BASE_DEPARTMENTS];
  users.forEach((u) => {
    const divName = u.divisi || "General";
    if (!departments.some((d) => d.name.toLowerCase() === divName.toLowerCase())) {
      departments.push({
        name: divName,
        desc: `Divisi ${divName} perusahaan.`,
        grad: getTileGrad(departments.length),
        icon: IoBusinessOutline,
      });
    }
  });

  const displayedUsers = users.filter((u) => {
    const matchesDivisi =
      !openedDivisi ||
      openedDivisi === "Semua" ||
      (u.divisi || "General").toLowerCase() === openedDivisi.toLowerCase();

    const matchesSearch =
      searchTerm.trim() === "" ||
      u.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.jabatan && u.jabatan.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesDivisi && matchesSearch;
  });

  if (openedDivisi !== null) {
    return (
      <div>
        <div className="page-action-ribbon">
          <div className="ribbon-left">
            <span className="ribbon-breadcrumb">
              {isSuperadmin
                ? `Portal Perusahaan > Divisi > ${openedDivisi}`
                : `Portal Perusahaan > Divisi ${user?.divisi || "Saya"}`}
            </span>
            <div className="ribbon-title-wrap">
              {isSuperadmin && (
                <button
                  onClick={handleBackToCards}
                  className="ribbon-back-btn"
                  title="Kembali ke Daftar Kartu Divisi"
                >
                  <IoArrowBackOutline />
                </button>
              )}
              <h1 className="ribbon-title">
                {openedDivisi === "Semua"
                  ? "Daftar Semua Karyawan"
                  : `Divisi: ${openedDivisi}`}
              </h1>
              <span className="pill-badge teal" style={{ fontSize: "12px", marginLeft: "4px" }}>
                {displayedUsers.length} Karyawan
              </span>
            </div>
          </div>

          <div className="ribbon-right">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "white",
                padding: "8px 14px",
                borderRadius: "14px",
                border: "1px solid rgba(226, 232, 240, 0.9)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              }}
            >
              <IoSearchOutline style={{ color: "var(--text-muted)", fontSize: "16px" }} />
              <input
                type="text"
                placeholder="Cari nama, jabatan, username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: "13px",
                  width: "200px",
                  color: "var(--text-primary)",
                  background: "transparent",
                }}
              />
            </div>

            {isSuperadmin && (
              <>
                <button
                  onClick={handleBackToCards}
                  className="btn-pill-light"
                  title="Tampilan Kartu Divisi"
                >
                  <IoGridOutline style={{ fontSize: "16px" }} />
                  <span>Kartu Divisi</span>
                </button>
                <Link
                  to={openedDivisi && openedDivisi !== "Semua" ? `/users/add?divisi=${encodeURIComponent(openedDivisi)}` : "/users/add"}
                  className="btn-pill-dark"
                >
                  <IoPersonAddOutline style={{ fontSize: "18px" }} />
                  <span>Tambah Karyawan</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {displayedUsers.length === 0 ? (
          <div className="hero-stat-card" style={{ padding: "48px 24px", textAlign: "center", alignItems: "center" }}>
            <p style={{ color: "var(--text-secondary)", marginBottom: "18px", fontSize: "14px" }}>
              {searchTerm
                ? `Tidak ada karyawan yang cocok dengan pencarian "${searchTerm}".`
                : `Belum ada karyawan yang terdaftar di divisi "${openedDivisi}".`}
            </p>
            {isSuperadmin && (
              <Link
                to={openedDivisi && openedDivisi !== "Semua" ? `/users/add?divisi=${encodeURIComponent(openedDivisi)}` : "/users/add"}
                className="btn-pill-dark"
              >
                <IoPersonAddOutline />
                <span>Tambah Karyawan Baru</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="glass-table-container">
            <table className="glass-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>No</th>
                  <th>Karyawan</th>
                  <th>Username</th>
                  <th>Jabatan / Posisi</th>
                  {openedDivisi === "Semua" && <th>Divisi</th>}
                  <th>Hak Akses</th>
                  <th style={{ width: "200px" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div className="avatar-circle" style={{ background: getTileGrad(idx) }}>
                          {getInitials(item.nama)}
                        </div>
                        <div>
                          <strong style={{ fontSize: "14px", color: "var(--text-primary)" }}>{item.nama}</strong>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>@{item.username}</span>
                    </td>
                    <td>
                      <strong style={{ fontSize: "13px" }}>{item.jabatan || "-"}</strong>
                    </td>
                    {openedDivisi === "Semua" && (
                      <td>
                        <span className="pill-badge teal">{item.divisi || "General"}</span>
                      </td>
                    )}
                    <td>
                      <span className={`pill-badge ${getRoleBadgeClass(item.role)}`}>
                        {item.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <Link
                          to={`/userAbsen/${item.id}`}
                          className="btn-pill-light"
                          style={{ padding: "5px 12px", fontSize: "11.5px" }}
                        >
                          <IoCalendarOutline />
                          <span>Absen</span>
                        </Link>
                        {isSuperadmin && (
                          <>
                            <Link
                              to={`/users/edit/${item.id}`}
                              className="btn-pill-light"
                              style={{ padding: "5px 10px", fontSize: "12px" }}
                              title="Edit Data Karyawan"
                            >
                              <IoPencilOutline />
                            </Link>
                            <button
                              onClick={() => deleteUser(item.id, item.nama)}
                              className="btn-pill-light"
                              style={{ padding: "5px 10px", fontSize: "12px", color: "#ef4444" }}
                              title="Hapus Karyawan"
                            >
                              <IoTrashOutline />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmModal
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Konfirmasi Hapus Karyawan"
          message={`Apakah Anda yakin ingin menghapus data karyawan "${userToDelete?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Ya, Hapus"
          cancelText="Batal"
          type="danger"
          isLoading={isDeleting}
        />
      </div>
    );
  }


  return (
    <div>
      <div className="page-action-ribbon">
        <div className="ribbon-left">
          <span className="ribbon-breadcrumb">Portal Perusahaan &gt; Manajemen SDM &gt; Departemen</span>
          <div className="ribbon-title-wrap">
            <h1 className="ribbon-title">Departemen & Divisi Perusahaan</h1>
            <span className="pill-badge teal" style={{ fontSize: "12px", marginLeft: "4px" }}>
              {departments.length} Divisi
            </span>
          </div>
        </div>

        <div className="ribbon-right">
          <button
            onClick={() => handleOpenDivisi("Semua")}
            className="btn-pill-light"
            title="Lihat Semua Karyawan dalam Tabel List"
          >
            <IoListOutline style={{ fontSize: "18px" }} />
            <span>Lihat Semua Karyawan (List)</span>
          </button>

          <Link to="/users/add" className="btn-pill-dark">
            <IoPersonAddOutline style={{ fontSize: "18px" }} />
            <span>Tambah Karyawan Baru</span>
          </Link>
        </div>
      </div>

      <div className="cards-4col-grid">
        {departments.map((dept, idx) => {
          const deptUsers = users.filter(
            (u) => (u.divisi || "General").toLowerCase() === dept.name.toLowerCase()
          );
          const IconComponent = dept.icon || IoBusinessOutline;

          return (
            <div
              key={dept.name}
              onClick={() => handleOpenDivisi(dept.name)}
              className="class-mini-card"
              style={{
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "220px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 18px 38px rgba(15, 23, 42, 0.1)";
                e.currentTarget.style.borderColor = "rgba(2, 132, 199, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.03)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.8)";
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <div className="mini-tile-badge" style={{ background: dept.grad, width: "44px", height: "44px", fontSize: "20px" }}>
                    <IconComponent />
                  </div>
                  <span className="pill-badge teal" style={{ padding: "4px 10px", fontSize: "11px", fontWeight: "700" }}>
                    {deptUsers.length} Karyawan
                  </span>
                </div>

                <h3 style={{ fontSize: "16px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "6px" }}>
                  {dept.name}
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: "1.5", marginBottom: "16px" }}>
                  {dept.desc}
                </p>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "14px", borderTop: "1px solid rgba(241, 245, 249, 0.9)" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {deptUsers.slice(0, 3).map((u, i) => (
                      <div
                        key={u.id}
                        className="avatar-circle"
                        style={{
                          width: "28px",
                          height: "28px",
                          fontSize: "10px",
                          background: getTileGrad(i),
                          marginLeft: i > 0 ? "-8px" : "0",
                          border: "2px solid #ffffff",
                        }}
                        title={u.nama}
                      >
                        {getInitials(u.nama)}
                      </div>
                    ))}
                    {deptUsers.length > 3 && (
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "6px", fontWeight: "600" }}>
                        +{deptUsers.length - 3} lainnya
                      </span>
                    )}
                    {deptUsers.length === 0 && (
                      <span style={{ fontSize: "11.5px", color: "var(--text-muted)", fontStyle: "italic" }}>
                        Belum ada anggota
                      </span>
                    )}
                  </div>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontWeight: "700",
                      color: "#0284c7",
                    }}
                  >
                    <span>Buka Divisi</span>
                    <IoArrowForwardOutline />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Userlist;
