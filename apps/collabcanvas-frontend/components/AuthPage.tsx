"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    if (!email || !password || (!isSignin && !name)) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      if (isSignin) {
        const response = await axios.post(`${HTTP_BACKEND}/signin`, {
          username: email,
          password,
        });
        localStorage.setItem("token", response.data.token);
        router.push("/rooms");
      } else {
        const response = await axios.post(`${HTTP_BACKEND}/signup`, {
          username: email,
          password,
          name,
        });
        if (response.data.userId) {
          // After signup, sign in automatically
          const signinResponse = await axios.post(`${HTTP_BACKEND}/signin`, {
            username: email,
            password,
          });
          localStorage.setItem("token", signinResponse.data.token);
          router.push("/rooms");
        }
      }
    } catch (e: any) {
      setError(
        e.response?.data?.message || "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="p-8 m-4 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {isSignin ? "Sign In" : "Sign Up"}
        </h1>
        
        {!isSignin && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Please wait..." : isSignin ? "Sign In" : "Sign Up"}
        </button>
        
        <div className="mt-4 text-center">
          <span className="text-gray-600">
            {isSignin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            onClick={() => router.push(isSignin ? "/signup" : "/signin")}
            className="ml-2 text-purple-600 hover:text-purple-700 font-semibold"
          >
            {isSignin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}