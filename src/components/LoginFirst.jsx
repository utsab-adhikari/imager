import GoogleLoginPage from "@/app/auth/login/page";
import React from "react";

const LoginFirst = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">

    <div className="w-full mx-auto flex-1 bg-white/5 backdrop-blur-lg  border border-indigo-600 p-6 rounded-2xl shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-center text-lime-200">
        Please login to continue
      </h2>
      <GoogleLoginPage />
    </div>
    </div>
  );
};

export default LoginFirst;
