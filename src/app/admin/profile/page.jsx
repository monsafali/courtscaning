"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminProfile() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [image, setImage] = useState("");

  const createUser = async () => {
    try {
      await axios.post(
        "/api/admin/create-user",
        {
          ...form,
          image,
            withCredentials: true
        }
      );

      toast.success("User Created");

      setForm({
        username: "",
        email: "",
        password: "",
      });

      setImage("");
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Failed"
      );
    }
  };

  const uploadImage = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-5">
        Admin Dashboard
      </h1>

      <div className="space-y-4">

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

        <input
          type="file"
          onChange={uploadImage}
        />

        <button
          onClick={createUser}
          className="bg-black text-white px-5 py-2"
        >
          Create User
        </button>

      </div>
    </div>
  );
}
