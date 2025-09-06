import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    console.log("Sign In form submitted with:", { email, password });
  };

  return (
    <>
      {/* Sign In Form */}
      <form onSubmit={handleSignInSubmit} className="space-y-6">
        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-1"
            htmlFor="signInEmail"
          >
            Email Address
          </label>
          <input
            type="email"
            id="signInEmail"
            placeholder="Your email address"
            className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-300 mb-1"
            htmlFor="signInPassword"
          >
            Password
          </label>
          <input
            type="password"
            id="signInPassword"
            placeholder="Your password"
            className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg"
        >
          Log In
        </button>
      </form>

      {/* Footer with a toggle link to sign up */}
      <div className="mt-8 text-center text-gray-400">
        Don't have an account?{" "}
        <Link
          to="/auth/sign-up"
          className="text-indigo-500 hover:text-indigo-400 font-semibold transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default SignIn;
