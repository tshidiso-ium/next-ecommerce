"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SignUserIn from "@/lib/signin";

enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const LoginPage: React.FC = () => {
  const router = useRouter();

  const [mode, setMode] = useState<MODE>(MODE.LOGIN);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailCode, setEmailCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const formTitle =
    mode === MODE.LOGIN
      ? "Log in"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset Your Password"
      : "Verify Your Email";

  const buttonTitle =
    mode === MODE.LOGIN
      ? "Login"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset"
      : "Verify";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let response;

      switch (mode) {
        case MODE.LOGIN:
          console.log("signing user: ", await SignUserIn(email, password))
          const userDetails: unknown = await SignUserIn(email, password);
          response = await verifyUser(email);
          if (response.success) {
            setMessage("Login successful! Redirecting...");
            router.push("/");
          } else {
            setError("Invalid email or password!");
          }
          break;
        case MODE.REGISTER:
          // Add registration logic if needed
          break;
        case MODE.RESET_PASSWORD:
          setMessage("Password reset email sent. Please check your e-mail.");
          break;
        case MODE.EMAIL_VERIFICATION:
          // Add email verification logic if needed
          break;
        default:
          break;
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center">
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold">{formTitle}</h1>
        {mode === MODE.REGISTER && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input"
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        {mode !== MODE.EMAIL_VERIFICATION ? (
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <input
            type="text"
            name="emailCode"
            placeholder="Verification Code"
            className="input"
            onChange={(e) => setEmailCode(e.target.value)}
          />
        )}
        {(mode === MODE.LOGIN || mode === MODE.REGISTER) && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input"
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
        <button
          className="button"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : buttonTitle}
        </button>
        {error && <div className="text-red-600">{error}</div>}
        {message && <div className="text-green-600 text-sm">{message}</div>}
      </form>
    </div>
  );
};

const verifyUser = async (idToken: string): Promise<any> => {
  try {
    const url = new URL("http://localhost:3100/verifyUser");
    url.searchParams.append("idToken", idToken);

    const res = await fetch(url.toString(), {
      method: "GET", // Use POST for sensitive data
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!res.ok) {
      throw new Error("Failed to login");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("verifyUser: Error", err);
    throw err;
  }
};

export default LoginPage;
