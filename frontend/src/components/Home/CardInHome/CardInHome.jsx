import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "./CardInHome.css";

const CardInHome = ({
  id,
  name = "",
  description = "",
  author = "",
  isUserCard = false,
}) => {
  const [hovered, setHovered] = useState(false);
  const [cardRect, setCardRect] = useState(null);
  const cardRef = useRef();


  const truncate = (text, max = 16) => {
    if (typeof text !== "string" || !text) return "";
    return text.length <= max ? text : text.slice(0, max) + "...";
  };


  // Update card position when hovered
  useEffect(() => {
    if (hovered && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardRect({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
  }, [hovered]);

  // Portal overlay
  const overlayPortal =
    hovered &&
    cardRect &&
    ReactDOM.createPortal(
      <div
        className="card-overlay-portal"
        style={{
          top: cardRect.top - 20,
          left: cardRect.left - 20,
          width: cardRect.width + 40,
          height: cardRect.height + 120,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="overlay-content">
          <div className="overlay-header">
            <h3 className="overlay-title">{name}</h3>
          </div>

          <p className="overlay-desc">{description}</p>

          <div className="overlay-row">
            <svg
              className="overlay-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4
                     -4 1.79-4 4 1.79 4 4 4z"
              />
              <path
                d="M6 20v-1c0-2.76 2.24-5 5-5h2
                     c2.76 0 5 2.24 5 5v1"
              />
            </svg>
            <span className="overlay-label">{author}</span>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <div
        ref={cardRef}
        className={`roadmap-card ${isUserCard ? "user-card" : "guest-card"}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Card Header */}
        <div className="card-header">
          <h3 className="card-title" title={name}>
            {truncate(name)}
          </h3>
        </div>

        {/* Author */}
        <div className="card-author">
          <svg
            className="author-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
            <path d="M6 20v-1c0-2.76 2.24-5 5-5h2c2.76 0 5 2.24 5 5v1" />
          </svg>
          <span className="author-text">{truncate(author, 20)}</span>
        </div>
      </div>

      {overlayPortal}
    </>
  );
};

export default CardInHome;
