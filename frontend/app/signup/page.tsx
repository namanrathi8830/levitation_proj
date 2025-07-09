"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";
import { authAPI } from "../../utils/api";
import styles from "./signup.module.css";
import React from "react";
import styled from "styled-components";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await authAPI.register(formData);
      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const Button = ({ isLoading }: { isLoading: boolean }) => {
    return (
      <StyledWrapper>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Register"}
        </button>
      </StyledWrapper>
    );
  };

  const StyledWrapper = styled.div`
    button {
      --green: #1BFD9C;
      font-size: 15px;
      padding: 0.7em 2.7em;
      letter-spacing: 0.06em;
      position: relative;
      font-family: inherit;
      border-radius: 0.6em;
      overflow: hidden;
      transition: all 0.3s;
      line-height: 1.4em;
      border: 2px solid var(--green);
      background: linear-gradient(to right, rgba(27, 253, 156, 0.1) 1%, transparent 40%,transparent 60% , rgba(27, 253, 156, 0.1) 100%);
      color: var(--green);
      box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.4), 0 0 9px 3px rgba(27, 253, 156, 0.1);
    }

    button:hover {
      color: #82ffc9;
      box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.6), 0 0 9px 3px rgba(27, 253, 156, 0.2);
    }

    button:before {
      content: "";
      position: absolute;
      left: -4em;
      width: 4em;
      height: 100%;
      top: 0;
      transition: transform .4s ease-in-out;
      background: linear-gradient(to right, transparent 1%, rgba(27, 253, 156, 0.1) 40%,rgba(27, 253, 156, 0.1) 60% , transparent 100%);
    }

    button:hover:before {
      transform: translateX(15em);
    }
  `;

  return (
    <div className={styles.signupContainer}>
      {/* Blur effects */}
      <div className={styles.blurEffect1}></div>
      <div className={styles.blurEffect2}></div>
      <div className={styles.blurEffect3}></div>

      <Navigation variant="signup" />

      <div className={styles.content}>
        {/* Form Container */}
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1>Sign up to begin journey</h1>
            <p>
              This is basic signup page which is used for levitation assignment
              purpose.
            </p>
          </div>

          <form onSubmit={handleSignup} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            {success && <div className={styles.successMessage}>{success}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="name">Enter your name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
              <span className={styles.helpText}>
                This name will be displayed with your inquiry
              </span>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Email ID"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
              <span className={styles.helpText}>
                This email will be displayed with your inquiry
              </span>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter the Password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
              <span className={styles.helpText}>
                Any further updates will be forwarded on this Email ID
              </span>
            </div>

            <div className={styles.actionRow}>
              <Button isLoading={isLoading} />
              <a href="/login" className={styles.alreadyAccount}>
                Already have account? Login
              </a>
            </div>
          </form>
        </div>

        {/* Image Container */}
        <div className={styles.imageContainer}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/71962921e24d652c044f86b977f4f2431eb7073c?width=1660"
            alt="Frame 1707478360"
            className={styles.signupImage}
          />
        </div>
      </div>
    </div>
  );
}
