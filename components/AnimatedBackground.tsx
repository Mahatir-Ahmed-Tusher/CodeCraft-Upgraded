import React from "react";

// Modern, soft, animated SVG blobs background
const AnimatedBackground: React.FC = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    style={{
      width: "100vw",
      height: "100vh",
    }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1920 1080"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      style={{ filter: "blur(40px) opacity(0.7)" }}
    >
      <g>
        <ellipse
          cx="400"
          cy="300"
          rx="300"
          ry="200"
          fill="#60a5fa"
        >
          <animate
            attributeName="cx"
            values="400;600;400"
            dur="12s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="300;500;300"
            dur="10s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse
          cx="1500"
          cy="800"
          rx="250"
          ry="180"
          fill="#f472b6"
        >
          <animate
            attributeName="cx"
            values="1500;1300;1500"
            dur="14s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="800;600;800"
            dur="11s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse
          cx="1000"
          cy="200"
          rx="200"
          ry="120"
          fill="#34d399"
        >
          <animate
            attributeName="cx"
            values="1000;1200;1000"
            dur="13s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="200;400;200"
            dur="9s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>
    </svg>
  </div>
);

export default AnimatedBackground; 