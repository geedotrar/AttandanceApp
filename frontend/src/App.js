import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Users from "./pages/Users";
import Absen from "./pages/Absen";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import UserAbsen from "./pages/UserAbsen";
import AddAbsen from "./pages/AddAbsen";
import EditAbsen from "./pages/EditAbsen";
import AddKegiatan from "./pages/AddKegiatan";
import AbsenDetail from "./pages/AbsenDetail";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/absen/" element={<Absen />}></Route>
          <Route path="/absen/add" element={<AddAbsen />}></Route>
          <Route path="/absen/edit/:id" element={<EditAbsen />}></Route>
          <Route path="/absen/detail/:id" element={<AbsenDetail />}></Route>

          {/* ADMIN */}
          <Route path="/users" element={<Users />}></Route>
          <Route path="/users/add" element={<AddUser />}></Route>
          <Route path="/users/edit/:id" element={<EditUser />}></Route>
          <Route path="/userAbsen/:id" element={<UserAbsen />}></Route>

          <Route path="/kegiatan/add/:id" element={<AddKegiatan />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
