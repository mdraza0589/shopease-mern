import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { registerUser } from "../../../server/auth";
import { useNavigate, Link } from "react-router-dom";

function AuthRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.email || !formData.password) {
      toast.error("Please fill all fields!");
      return;
    }

    // debug: show the data being sent
    console.log('Register submit payload:', formData);

    try {
      const result = await dispatch(registerUser(formData));

      // debug: always log full result from thunk
      console.log('Register result action:', result);

      if (result?.payload?.success) {
        toast.success("Registered successfully!");
        console.log('Register payload:', result?.payload);
        +

          setTimeout(() => {
            navigate("/auth/login");
          }, 2000);
      } else {
        // If the thunk used rejectWithValue, the payload may contain error info
        console.log('Registration failed payload/error:', result?.payload || result?.error);
        toast.error(result?.payload?.message || result?.error?.message || "Registration failed!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error('Register thrown error:', error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Account
        </h1>
        <p className="mt-2">
          Already have an account?
          <Link
            className="font-medium ml-2 text-primary underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User Name
          </label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            placeholder="Enter your user name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default AuthRegister;
