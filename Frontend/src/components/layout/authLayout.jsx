import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function AuthLayout({ children }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  useEffect(()=>{
    console.log("current auth status: " + authStatus);
    if (!authStatus) {
      console.log("please login first");
      navigate("/login");
    }
  },[])
  return <>{children}</>;
}

export default AuthLayout;
