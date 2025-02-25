import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import cookies from "js-cookie";

function AuthLayout({ children }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  useEffect(() => {
    const token = cookies.get("token");
    if (token || authStatus) {
      console.log("user is already logged in");
    } else {
      console.log("user is not logged in");
      console.log("please login first");
      navigate("/login");
    }
  }, []);
  return <>{children}</>;
}

export default AuthLayout;
