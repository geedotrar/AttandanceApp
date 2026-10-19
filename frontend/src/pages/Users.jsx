import React, { useEffect } from "react";
import Layout from "./Layout";
import Userlist from "../components/Admin/Userlist";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  if (isLoading || (!user && !isError)) {
    return (
      <Layout>
        <div className="hero-stat-card" style={{ padding: "48px 24px", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Memverifikasi sesi pengguna...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Userlist />
    </Layout>
  );
};

export default Users;
