

"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [image, setImage] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // CREATE USER
  // =========================
  const createUser = async () => {
    try {
      setLoading(true);

      await axios.post(
        "/api/admin/create-user",
        { ...form, image },
        { withCredentials: true }
      );

      toast.success("User Created");

      setForm({
        username: "",
        email: "",
        password: "",
      });

      setImage("");

      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    try {
      await axios.post(
        "/api/users/logout",
        {},
        { withCredentials: true }
      );

      toast.success("Logged out");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "/api/admin/users",
        { withCredentials: true }
      );

      setUsers(res.data.users || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // IMAGE UPLOAD
  // =========================
  const uploadImage = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // =========================
  // DELETE USER
  // =========================
  const deleteUser = async (id) => {
    try {
      await axios.delete(
        `/api/admin/users/${id}`,
        { withCredentials: true }
      );

      toast.success("User deleted");

      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Delete failed"
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* CREATE USER FORM */}
      <div className="space-y-3 border p-4 rounded mb-8">

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
          className="border p-2 w-full"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          className="border p-2 w-full"
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          className="border p-2 w-full"
        />

        <input type="file" onChange={uploadImage} />

        <button
          onClick={createUser}
          disabled={loading}
          className="bg-black text-white px-5 py-2 w-full"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </div>

      {/* USERS LIST */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          All Users
        </h2>

        <div className="space-y-3">

          {users.length === 0 ? (
            <p className="text-gray-500">
              No users found
            </p>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="border p-4 rounded flex justify-between items-center"
              >

                {/* LEFT */}
                <div>
                  <p className="font-bold">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">

                  {/* ROLE */}
                  {user.isAdmin ? (
                    <span className="text-green-600 font-bold">
                      Admin
                    </span>
                  ) : (
                    <span className="text-blue-600">
                      User
                    </span>
                  )}

                  {/* TODAY COUNT (if backend provides) */}
                  {!user.isAdmin && (
                    <span className="bg-gray-200 px-2 py-1 text-sm rounded">
                      Today:{" "}
                      {user.todayCount ?? 0}
                    </span>
                  )}

                  {/* DELETE */}
                  {!user.isAdmin && (
                    <button
                      onClick={() =>
                        deleteUser(user._id)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
