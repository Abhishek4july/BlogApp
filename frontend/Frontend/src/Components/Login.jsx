import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authSlice";
import Input from "./Input";
import Button from "./Button";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const login = async (data) => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        data,
        { withCredentials: true }
      );

      const user = response.data?.data?.user;

      // if (!user || user.role !== "admin") {
      //   setError("Access denied. Only admins can log in.");
      //   localStorage.clear();
      //   return;
      // }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("auth", "true");

      dispatch(loginUser({ user, isAdmin: true }));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/login-bg.jpg')] bg-cover bg-center backdrop-blur-lg px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-gray-700 text-white">
        <h2 className="text-center text-3xl font-bold mb-2">Welcome Back, Admin 👑</h2>
        <p className="text-center text-gray-300 mb-6 text-sm">Only authorized access allowed.</p>

        {error && (
          <p className="bg-red-200 text-red-800 p-3 rounded-lg text-center text-sm font-medium mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(login)} className="space-y-5">
          <Input
            label="Email"
            placeholder="admin@example.com"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
