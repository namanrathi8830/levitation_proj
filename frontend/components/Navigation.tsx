import Link from "next/link";
import styles from "./Navigation.module.css";
import React from "react";
import styled from "styled-components";

interface NavigationProps {
  variant?: "login" | "signup" | "dashboard";
  onLogout?: () => void;
}

export default function Navigation({
  variant = "login",
  onLogout,
}: NavigationProps) {
  const AnimatedNavButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link href={href} passHref legacyBehavior>
      <StyledWrapperNav>
        <a className="animated-nav-btn">{children}</a>
      </StyledWrapperNav>
    </Link>
  );

  const StyledWrapperNav = styled.div`
    .animated-nav-btn {
      --green: #1BFD9C;
      font-size: 13px;
      padding: 0.5em 1.7em;
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
      text-decoration: none;
      display: inline-block;
      text-align: center;
      cursor: pointer;
    }
    .animated-nav-btn:hover {
      color: #82ffc9;
      box-shadow: inset 0 0 10px rgba(27, 253, 156, 0.6), 0 0 9px 3px rgba(27, 253, 156, 0.2);
    }
    .animated-nav-btn:before {
      content: "";
      position: absolute;
      left: -4em;
      width: 4em;
      height: 100%;
      top: 0;
      transition: transform .4s ease-in-out;
      background: linear-gradient(to right, transparent 1%, rgba(27, 253, 156, 0.1) 40%,rgba(27, 253, 156, 0.1) 60% , transparent 100%);
    }
    .animated-nav-btn:hover:before {
      transform: translateX(15em);
    }
  `;

  const renderButton = () => {
    switch (variant) {
      case "login":
        return (
          <AnimatedNavButton href="/signup">Register</AnimatedNavButton>
        );
      case "signup":
        return (
          <AnimatedNavButton href="/login">Login</AnimatedNavButton>
        );
      case "dashboard":
        return (
          <StyledWrapperNav>
            <button type="button" className="animated-nav-btn" onClick={onLogout}>
              Logout
            </button>
          </StyledWrapperNav>
        );
      default:
        return (
          <div className={styles.navButtonDefault}>
            <span>Connecting People With Technology</span>
          </div>
        );
    }
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <svg
            width="142"
            height="48"
            viewBox="0 0 142 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M39.5 24L30 43.5H25.5H10.3038L6.03038 35L0.5 24L10 4.5H14.5H30L34.141 13L39.5 24Z"
              fill="white"
            />
            <path d="M25.5 35L31 24L25.5 13L34.5 24L25.5 35Z" fill="black" />
            <path d="M13 15L14.5 13L9 24L14.5 35L6 24L13 15Z" fill="black" />
            <text
              fill="white"
              xmlSpace="preserve"
              style={{ whiteSpace: "pre" }}
              fontFamily="Canva Sans"
              fontSize="20"
              letterSpacing="0em"
            >
              <tspan x="49.5" y="23.7588">
                levitation
              </tspan>
            </text>
            <text
              fill="white"
              xmlSpace="preserve"
              style={{ whiteSpace: "pre" }}
              fontFamily="Canva Sans"
              fontSize="10"
              letterSpacing="0em"
            >
              <tspan x="49.5" y="43.8794">
                infotech
              </tspan>
            </text>
          </svg>
        </Link>
        {renderButton()}
      </div>
    </nav>
  );
}
