import React, { useEffect } from "react";
import { 
  IoAlertCircleOutline, 
  IoTrashOutline, 
  IoLogOutOutline, 
  IoCheckmarkCircleOutline 
} from "react-icons/io5";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi Tindakan",
  message = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  type = "primary",
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <IoTrashOutline />;
      case "logout":
        return <IoLogOutOutline />;
      case "warning":
        return <IoAlertCircleOutline />;
      default:
        return <IoCheckmarkCircleOutline />;
    }
  };

  const getIconStyles = () => {
    switch (type) {
      case "danger":
      case "logout":
        return {
          background: "#fee2e2",
          color: "#dc2626",
          boxShadow: "0 8px 20px rgba(239, 68, 68, 0.2)",
        };
      case "warning":
        return {
          background: "#fef3c7",
          color: "#d97706",
          boxShadow: "0 8px 20px rgba(245, 158, 11, 0.2)",
        };
      default:
        return {
          background: "#e0f2fe",
          color: "#0284c7",
          boxShadow: "0 8px 20px rgba(2, 132, 199, 0.2)",
        };
    }
  };

  const getConfirmBtnStyle = () => {
    if (type === "danger" || type === "logout") {
      return {
        background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        color: "#ffffff",
        border: "none",
        padding: "12px 24px",
        borderRadius: "999px",
        fontWeight: "700",
        fontSize: "13.5px",
        cursor: isLoading ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        flex: 1,
        boxShadow: "0 8px 20px rgba(239, 68, 68, 0.3)",
      };
    }
    return {
      flex: 1,
      padding: "12px 24px",
      fontSize: "13.5px",
    };
  };

  return (
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
        zIndex: 9999,
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
          maxWidth: "420px",
          width: "100%",
          borderRadius: "28px",
          padding: "32px 28px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          border: "1px solid rgba(226, 232, 240, 0.9)",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "20px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            marginBottom: "18px",
            ...getIconStyles(),
          }}
        >
          {getIcon()}
        </div>

        <h3
          style={{
            fontSize: "19px",
            fontWeight: "800",
            color: "var(--text-primary)",
            marginBottom: "8px",
            letterSpacing: "-0.3px",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: "13.5px",
            color: "var(--text-secondary)",
            lineHeight: "1.6",
            marginBottom: "26px",
          }}
        >
          {message}
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="btn-pill-light"
            style={{
              flex: 1,
              padding: "12px 20px",
              fontSize: "13.5px",
              justifyContent: "center",
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={type === "danger" || type === "logout" ? "" : "btn-pill-dark"}
            style={getConfirmBtnStyle()}
          >
            <span>{isLoading ? "Memproses..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
