import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { loginUser } from "../../../server/auth";
import { useNavigate, Link } from "react-router-dom";

function AuthLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Please fill all fields!");
            return;
        }
        // debug: show the data being sent
        console.log('Login submit payload:', formData);

        try {
            const result = await dispatch(loginUser(formData));
            console.log('Login result action:', result);

            if (result?.payload?.success) {
                toast.success("Login successful!");

                setTimeout(() => {
                    navigate("/shop/home");
                }, 2000);
            } else {
                console.log('Login failed payload/error:', result?.payload || result?.error);
                toast.error(result?.payload?.message || result?.error?.message || "Invalid credentials!");
            }
        } catch (error) {
            toast.error("Something went wrong!");
            console.error('Login thrown error:', error);
        }
    };


    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Login to your account
                </h1>
                <p className="mt-2">
                    Don’t have an account?
                    <Link
                        className="font-medium ml-2 text-primary underline"
                        to="/auth/register"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    Login
                </button>
            </form>
        </div>
    );
}

export default AuthLogin;

