import React, { useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  User,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ⚠️ named import, not default

const LoginForm = ({ onClose, onNavigateToContact }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountRequest, setShowAccountRequest] = useState(false);

  const navigate = useNavigate();

  // Handle inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Main login handler - unified for employee & client - adjust your API endpoint accordingly
  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Employee login
      const resEmp = await axios.post("http://localhost:8086/api/v1/user/login", {
        email: formData.email,
        password: formData.password,
      });

      const tokenEmp = resEmp.data.token;
      if (!tokenEmp) throw new Error("Token not provided from login");

      localStorage.setItem("token", tokenEmp);

      const decodedEmp = jwtDecode(tokenEmp);
      console.log("Decoded JWT (employee):", decodedEmp);

      alert("Login Successful");

      const role = decodedEmp.type;
      console.log("User role:", role);
      const employeeId = decodedEmp.employeeId;
      const clientId = decodedEmp.clientId;
      const adminId = decodedEmp.adminId;
      const supplierId = decodedEmp.supplierId;

      console.log("Suppiler ID:", supplierId);

      switch (role) {
        case "Site_Supervisor":
          navigate(`/site_supervisor/${employeeId}`);
          break;
        case "Financial_Officer":
          navigate(`/financial_officer/${employeeId}`);
          break;
        case "Designer":
          navigate(`/designer/${employeeId}`);
          break;
        case "Director":
          navigate(`/director/${employeeId}`);
          break;
        case "Legal_Officer":
          navigate(`/legalofficer/${employeeId}`);
          break;
        case "Supplier":
          navigate(`/supplier/${supplierId}`);
          break;
        case "Client":
          navigate(`/project_owner/${clientId}`);
          break;
        case "Project_Manager":
          navigate(`/projectmanager/${employeeId}`);
          break;
        case "QS_Officer":
          navigate(`/designer/${employeeId}`);
          break;
        case "Senior_QS_Officer":
          navigate(`/designer/${employeeId}`);
          break;
        case "Admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/unauthorized");
      }

      onClose();
      return; // stop processing after success
    } catch (empErr) {
      console.log("Login failed!", empErr);
    }
    // If no login succeeded
    alert("Login failed. Please check your credentials.");

    setIsLoading(false);
  };



  const toggleAccountRequest = () => {
    setShowAccountRequest(!showAccountRequest);
  };

  const handleContactFormClick = () => {
    onClose();
    if (onNavigateToContact) {
      setTimeout(() => {
        onNavigateToContact();
      }, 100);
    }
  };



  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm backdrop-brightness-75 flex items-center justify-center z-[100] p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h1 className="text-black md:text-4xl text-3xl font-bold font-rubik">
            Structura<span className="text-yellow-500 italic">X</span>
          </h1>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="text-xl" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700 block"
            >
              Username / Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-yellow-200 focus:border-yellow-500"
                  }`}
                placeholder="Enter email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700 block"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-yellow-200 focus:border-yellow-500"
                  }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-200"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-sm text-yellow-500 hover:text-yellow-600 font-semibold">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform ${isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600 hover:scale-105 active:scale-95"
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Account Request Section */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <button
                  type="button"
                  onClick={toggleAccountRequest}
                  className="px-2 bg-white text-yellow-500 hover:text-yellow-600 font-semibold transition-colors duration-200 flex items-center space-x-1"
                >
                  <span>Need an account?</span>
                  {showAccountRequest ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Expandable Account Request Info */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${showAccountRequest
                ? "max-h-96 opacity-100"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="mt-3 pt-3 border-t border-yellow-300">
                  <p className="text-sm text-gray-600">
                    For account creation, contact via{" "}
                    <button
                      type="button"
                      onClick={handleContactFormClick}
                      className="text-yellow-500 hover:text-yellow-600 font-semibold underline transition-colors duration-200"
                    >
                      contact form
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;