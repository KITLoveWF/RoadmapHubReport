import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoginVerify.css";
import EnterPin from "../../../components/EnterPin/EnterPin";
import AlertError from "#components/SignUp/AlertError.jsx";
import api from "../../../utils/api";

export default function LoginVerify() {
  // Lấy các tham số từ URL
  const location = useLocation();
  const navigate = useNavigate();
  const { hashedPin, encodeToken, encodeRefreshToken } = location.state;
  
  const [pin, setPin] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");

  useEffect(() => {
    // Clear error after 5 seconds
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleVerify = async () => {
    try {
      setError(""); // Clear previous errors
      
      const res = await api.post(
        "/auth/login/verify",
        { hashedPin, encodeToken, encodeRefreshToken, pin: pin.join("") },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data?.status === true) {
        // Lưu tokens vào localStorage
        if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
        }
        if (res.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.refreshToken);
        }
        navigate("/");
      } else {
        setError("Mã PIN không chính xác. Vui lòng thử lại.");
        setPin(new Array(6).fill(""));
      }
    } catch (err) {
      console.error("Verify error:", err.response?.data || err.message);
      setError("Xác thực không thành công. Vui lòng kiểm tra lại mã PIN.");
      setPin(new Array(6).fill(""));
    }
  };

  return (
    <div className="login-verify-page">
      <div className="login-verify-content">
        <EnterPin pin={pin} setPin={setPin} onClickFunction={handleVerify} />
        {error && (
          <div className="alert-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
