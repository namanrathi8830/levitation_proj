"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../components/Navigation";
import { authAPI } from "../../utils/api";
import styles from "./login.module.css";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import React from "react";
import styled from "styled-components";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData);

      // Store token and user data
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("isLoggedIn", "true");

      router.push("/products");
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    mode: "free-snap",
    slides: { perView: 1 },
  });

  const Button = () => {
    return (
      <StyledWrapper>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login now"}
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
    <div className={styles.loginContainer}>
      {/* Blur effects */}
      <div className={styles.blurEffect1}></div>
      <div className={styles.blurEffect2}></div>
      <div className={styles.blurEffect3}></div>

      <Navigation variant="login" />

      <div className={styles.content}>
        {/* Slider Images */}
        <div className={styles.sliderContainer}>
          <div ref={sliderRef} className="keen-slider" style={{ width: "100%", height: "100%" }}>
            <div className="keen-slider__slide">
              <img
                src="/slider/slider_1.jpg"
                alt="slider 1"
                className={styles.sliderImage}
              />
            </div>
            <div className="keen-slider__slide">
              <img
                src="/slider/slider_2.jpg"
                alt="slider 2"
                className={styles.sliderImage}
              />
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className={styles.formContainer}>
          <div className={styles.logoSection}>
            <svg
              width="216"
              height="74"
              viewBox="0 0 216 74"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M59.5182 36.6265L45.0202 66.3856H38.1527H14.9617L8.43995 53.4137L0 36.6265L14.498 6.86743H21.3655H45.0202L51.3398 19.8393L59.5182 36.6265Z"
                fill="white"
              />
              <path
                d="M38.1527 53.4138L46.5463 36.6266L38.1527 19.8394L51.8876 36.6266L38.1527 53.4138Z"
                fill="black"
              />
              <path
                d="M19.0763 22.8916L21.3655 19.8394L12.9719 36.6265L21.3655 53.4137L8.39355 36.6265L19.0763 22.8916Z"
                fill="black"
              />
              <text
                fill="white"
                xmlSpace="preserve"
                style={{ whiteSpace: "pre" }}
                fontFamily="Canva Sans"
                fontSize="30.5222"
                letterSpacing="0em"
              >
                <tspan x="74.7792" y="36.2585">
                  levitation
                </tspan>
              </text>
              <text
                fill="white"
                xmlSpace="preserve"
                style={{ whiteSpace: "pre" }}
                fontFamily="Canva Sans"
                fontSize="15.2611"
                letterSpacing="0em"
              >
                <tspan x="74.7792" y="66.9647">
                  infotech
                </tspan>
              </text>
            </svg>
          </div>

          <div className={styles.formSection}>
            <div className={styles.header}>
              <h1>Let the Journey Begin!</h1>
              <p>
                This is basic login page which is used for levitation assignment
                purpose.
              </p>
            </div>

            <form onSubmit={handleLogin} className={styles.form}>
              {error && <div className={styles.errorMessage}>{error}</div>}

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
                <label htmlFor="password">Current Password</label>
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
              </div>

              <div className={styles.actionRow}>
                <Button />
                <a href="/signup" className={styles.forgotPassword}>
                  Don't have an account? Sign up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
