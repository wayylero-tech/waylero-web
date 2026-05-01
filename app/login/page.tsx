"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch {
      alert("Login failed");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/admin");
    } catch {
      alert("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      
      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900 border border-gray-800 shadow-xl">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-center mb-2">
          Waylero Admin
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Sign in to manage content
        </p>

        {/* EMAIL */}
        <input
          className="w-full p-3 mb-3 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          className="w-full p-3 mb-4 rounded-lg bg-gray-800 border border-gray-700 outline-none focus:border-blue-500"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* EMAIL BUTTON */}
        <button
          onClick={loginWithEmail}
          className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold"
        >
          Sign in with Email
        </button>

        {/* DIVIDER */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        {/* GOOGLE */}
        <button
          onClick={loginWithGoogle}
          className="w-full p-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
        >
          Continue with Google
        </button>

        {/* FOOTER */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Secure admin access • Waylero CMS
        </p>

      </div>
    </div>
  );
}