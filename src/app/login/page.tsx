"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(true);

  // Enable button only if inputs are filled
  useEffect(() => {
    setButtonDisable(!(user.email && user.password));
  }, [user]);

  const onLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/users/login", user);

      toast.success("Login successful 🚀");
      console.log("Login Success:", response.data);

  if (response.data.isAdmin) {
  router.push("/admin/profile");
} else {
  router.push("/profile");
}
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {loading ? "Logging in..." : "Login"}
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
          />

          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
          />


          <button
            onClick={onLogin}
            disabled={buttonDisable || loading}
            className={`w-full py-2 rounded-md text-white font-semibold transition
              ${
                buttonDisable || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
