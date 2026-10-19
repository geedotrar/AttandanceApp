import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  IoPersonOutline, 
  IoLockClosedOutline, 
  IoArrowForwardOutline,
  IoAlertCircleOutline 
} from "react-icons/io5";
import { AiFillBank } from "react-icons/ai";
import { LoginUser, reset } from "../features/authSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ username, password }));
  };

  return (
    <div className="app-shell" style={{ alignItems: "center", justifyContent: "center" }}>
      <div 
        className="glass-form-card" 
        style={{ 
          maxWidth: "460px", 
          width: "100%", 
          padding: "44px 38px", 
          borderRadius: "36px", 
          boxShadow: "0 28px 70px rgba(18, 38, 63, 0.12)",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(30px)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div 
            style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "18px", 
              background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)", 
              display: "inline-flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "white", 
              fontSize: "28px",
              boxShadow: "0 10px 22px rgba(2, 132, 199, 0.3)",
              marginBottom: "16px"
            }}
          >
            <AiFillBank />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.4px" }}>
            Sign In
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
            AttendanceApp
          </p>
        </div>

        {isError && (
          <div style={{ 
            background: "#fee2e2", 
            color: "#b91c1c", 
            padding: "12px 16px", 
            borderRadius: "14px", 
            marginBottom: "20px", 
            fontSize: "13px", 
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <IoAlertCircleOutline style={{ fontSize: "18px", flexShrink: 0 }} />
            <span>{message || "Login gagal, periksa username dan password Anda"}</span>
          </div>
        )}

        <form onSubmit={Auth}>
          <div className="form-group-field">
            <label className="form-label-custom">Username</label>
            <div style={{ position: "relative" }}>
              <IoPersonOutline style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "17px" }} />
              <input
                type="text"
                className="form-input-custom"
                style={{ paddingLeft: "44px" }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
              />
            </div>
          </div>

          <div className="form-group-field" style={{ marginBottom: "28px" }}>
            <label className="form-label-custom">Password</label>
            <div style={{ position: "relative" }}>
              <IoLockClosedOutline style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "17px" }} />
              <input
                type="password"
                className="form-input-custom"
                style={{ paddingLeft: "44px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="btn-pill-dark" 
            style={{ 
              width: "100%", 
              height: "48px", 
              justifyContent: "center", 
              fontSize: "14.5px",
              borderRadius: "18px"
            }}
          >
            <span>{isLoading ? "Memproses Masuk..." : "Masuk ke Sistem"}</span>
            {!isLoading && <IoArrowForwardOutline />}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "18px", borderTop: "1px solid rgba(226, 232, 240, 0.7)" }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Attendance Management System &bull; Enterprise Edition
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
