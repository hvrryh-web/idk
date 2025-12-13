/**
 * BackToTop - Floating button to return to top of page and access global nav
 * 
 * Provides a consistent way to return to the top of the page from anywhere.
 * Acts as a safety feature ensuring users can always access the global navigation.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, Home } from "lucide-react";

interface BackToTopProps {
  showHomeButton?: boolean;
}

export default function BackToTop({ showHomeButton = true }: BackToTopProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 200px
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goHome = () => {
    navigate("/home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Always show buttons, but with different opacity based on scroll
  const baseOpacity = isVisible ? 1 : 0.6;

  return (
    <div
      className="back-to-top-container"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        zIndex: 9999,
        transition: "opacity 0.3s ease",
        opacity: baseOpacity,
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Home Button - shows on hover or always if expanded */}
      {showHomeButton && (
        <button
          onClick={goHome}
          title="Go to Home"
          aria-label="Go to Home page"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--dynasty-red, #8b0000), var(--imperial-bronze, #cd7f32))",
            border: "3px solid var(--imperial-gold, #d4af37)",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(139,0,0,0.3)",
            transition: "all 0.3s ease",
            transform: isExpanded ? "scale(1)" : "scale(0.9)",
            opacity: isExpanded ? 1 : 0.8,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4), 0 0 30px rgba(139,0,0,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = isExpanded ? "scale(1)" : "scale(0.9)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(139,0,0,0.3)";
          }}
        >
          <Home size={22} />
        </button>
      )}

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        title="Scroll to Top (Access Global Navigation)"
        aria-label="Scroll to top of page"
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--imperial-gold, #d4af37), var(--imperial-bronze, #cd7f32))",
          border: "3px solid var(--dynasty-red, #8b0000)",
          color: "var(--dynasty-red, #8b0000)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3), 0 0 20px rgba(212,175,55,0.4)",
          transition: "all 0.3s ease",
          fontWeight: "bold",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.4), 0 0 30px rgba(212,175,55,0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.3), 0 0 20px rgba(212,175,55,0.4)";
        }}
      >
        <ArrowUp size={28} strokeWidth={3} />
      </button>

      {/* Tooltip label */}
      {isExpanded && (
        <div
          style={{
            position: "absolute",
            right: "70px",
            bottom: "0.5rem",
            background: "var(--parchment, #fdf6e3)",
            border: "2px solid var(--imperial-gold, #d4af37)",
            borderRadius: "8px",
            padding: "0.5rem 0.75rem",
            fontSize: "0.85rem",
            fontFamily: "Cinzel, serif",
            color: "var(--dynasty-red, #8b0000)",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          ↑ Global Nav
        </div>
      )}
    </div>
  );
}
