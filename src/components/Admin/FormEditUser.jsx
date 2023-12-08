import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const FormEditUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [role, setRole] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${id}`);
        setUsername(response.data.username);
        setNama(response.data.nama);
        setJabatan(response.data.jabatan);
        setRole(response.data.role);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getUserById();
  }, [id]);

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/users/${id}`, {
        nama: nama,
        username: username,
        password: password,
        confPassword: confPassword,
        jabatan: jabatan,
        role: role,
      });
      navigate("/users");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Users</h1>
      <h2 className="subtitle">Update User</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateUser}>
              <p className="has-text-centered"></p>
              <div className="field">
                <label className="label">Name</label>
                <div className="control">
                  <input type="text" className="input" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Name" />
                </div>
              </div>
              <div className="field">
                <label className="label">Username</label>
                <div className="control">
                  <input type="text" className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                </div>
              </div>
              <div className="field">
                <label className="label">Password</label>
                <div className="control">
                  <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
                </div>
              </div>
              <div className="field">
                <label className="label">Confirm Password</label>
                <div className="control">
                  <input type="password" className="input" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} placeholder="******" />
                </div>
              </div>
              <div className="field">
                <label className="label">Jabatan</label>
                <div className="control">
                  <input type="text" className="input" value={jabatan} onChange={(e) => setJabatan(e.target.value)} placeholder="Jabatan" />
                </div>
              </div>
              <div className="field">
                <label className="label">Role</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="" selected disabled hidden>
                        Choose here
                      </option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Update
                  </button>

                  <Link to="/users/" className="button is-danger">
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormEditUser;
