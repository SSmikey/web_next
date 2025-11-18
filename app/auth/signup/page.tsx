"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./auth.module.css";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/auth/signin?message=Registration successful. Please sign in.");
      } else {
        setError(data.message || "An error occurred during registration");
      }
    } catch (error) {
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Create Account</h1>
        <p className={styles.authSubtitle}>
          Or{" "}
          <Link href="/auth/signin">
            sign in to your existing account
          </Link>
        </p>
        
        <form className={styles.authForm} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.authError}>
              {error}
            </div>
          )}
          
          <div className={styles.authField}>
            <label htmlFor="name" className={styles.authLabel}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={styles.authInput}
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className={styles.authField}>
            <label htmlFor="email-address" className={styles.authLabel}>
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={styles.authInput}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className={styles.authField}>
            <label htmlFor="password" className={styles.authLabel}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={styles.authInput}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className={styles.authField}>
            <label htmlFor="confirm-password" className={styles.authLabel}>
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              className={styles.authInput}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.authButton}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}