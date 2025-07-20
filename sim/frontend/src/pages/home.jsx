import React, { useState, useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Squares from "../components/Squares";
import "remixicon/fonts/remixicon.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [showContent, setShowContent] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const navigate = useNavigate();
  const splashRef = useRef(null);

  // Preload critical images
  useEffect(() => {
    const imageUrls = ["./test2.png", "./test.png", "./singh.png", "./sim.jpg"];
    const imagePromises = imageUrls.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(() => setImagesLoaded(true)); // Continue even if some images fail
  }, []);

  // Splash SVG Animation
  useGSAP(() => {
    if (showContent || !imagesLoaded) return;

    const tl = gsap.timeline();

    tl.to(".vi-mask-group", {
      rotate: 10,
      duration: 2,
      ease: "Power4.easeInOut",
      transformOrigin: "50% 50%",
    }).to(".vi-mask-group", {
      scale: 10,
      duration: 3,
      delay: -1.8,
      ease: "Expo.easeInOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onUpdate: function () {
        if (this.progress() >= 0.9) {
          setShowContent(true);
          this.kill();
        }
      },
    });
  }, [showContent, imagesLoaded]);

  // Main Content Animation & Mousemove parallax (desktop only)
  useGSAP(() => {
    if (!showContent) return;

    gsap.to(".main", {
      scale: 1,
      rotate: 0,
      duration: 2,
      ease: "Expo.easeInOut",
    });
    gsap.to(".sky", {
      scale: 1.05,
      rotate: 0,
      duration: 2,
      ease: "Expo.easeInOut",
    });
    gsap.to(".bg", {
      scale: 1.05,
      rotate: 0,
      duration: 2,
      ease: "Expo.easeInOut",
    });
    gsap.to(".character", {
      scale: 1,
      yPercent: 20,
      rotate: 0,
      duration: 2,
      ease: "Expo.easeInOut",
    });
    gsap.to(".text", {
      scale: 1,
      rotate: 0,
      duration: 2,
      ease: "Expo.easeInOut",
    });

    // Mousemove parallax effect (desktop only)
    const main = document.querySelector(".main");
    const onMove = (e) => {
      if (window.innerWidth < 768) return; // Disable on mobile
      const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
      gsap.to(".main .text", {
        x: `${xMove * 0.4}%`,
      });
      gsap.to(".sky", {
        x: xMove,
      });
      gsap.to(".bg", {
        x: xMove * 1.7,
      });
    };
    main?.addEventListener("mousemove", onMove);

    return () => {
      main?.removeEventListener("mousemove", onMove);
    };
  }, [showContent]);

  return (
    <>
      {/* Loading Screen */}
      {!imagesLoaded && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-[100]">
          <div className="text-white text-xl">Loading...</div>
        </div>
      )}

      {/* Splash SVG Animation */}
      {!showContent && imagesLoaded && (
        <div
          className="svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen bg-black"
          ref={splashRef}
        >
          <svg
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full"
          >
            <defs>
              <mask id="viMask">
                <rect width="100%" height="100%" fill="black" />
                <g className="vi-mask-group">
                  <text
                    x="50%"
                    y="50%"
                    fontSize="80"
                    textAnchor="middle"
                    fill="white"
                    dominantBaseline="middle"
                    fontFamily="Arial Black"
                  >
                    SIMMERJIT
                  </text>
                </g>
              </mask>
            </defs>
            <image
              href="./test2.png"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              mask="url(#viMask)"
            />
          </svg>
        </div>
      )}

      {/* Main Content */}
      {showContent && (
        <div className="main w-full min-h-screen overflow-hidden">
          <div className="landing relative w-full h-screen bg-black overflow-hidden">
            {/* Background Images */}
            <div className="imagesdiv absolute inset-0 w-full h-full">
              <img
                className="sky absolute top-0 left-0 w-full h-full object-cover scale-[1.2] sm:scale-[1.2] rotate-[-5deg] sm:rotate-[-5deg]"
                src="./test2.png"
                alt="Background Sky"
                loading="eager"
                fetchPriority="high" // ✅ Fixed: camelCase
              />
              <img
                className="bg absolute top-0 left-0 w-full h-full scale-[0.2] rotate-[-2deg] hidden sm:block"
                src="./test.png"
                alt="Background"
                loading="eager"
              />
              {/* GTA Text - Responsive */}
              <div className="text text-white text-center absolute top-[15%] sm:top-[12%] left-1/2 -translate-x-1/2 scale-[1] rotate-[-5deg] flex flex-col gap-1 sm:gap-2 px-4">
                <h1 className="text-[12vw] sm:text-[10vw] leading-none font-pricedown">
                  Simmerjit
                </h1>
                <h1 className="text-[12vw] sm:text-[9vw] leading-none font-pricedown">
                  SINGH SETHI
                </h1>
              </div>
              {/* Character - Mobile Optimized */}
              <img
                className="character absolute bottom-0 left-1/2 -translate-x-1/2 scale-[1.2] rotate-[-5deg] w-[50vw] sm:w-[35vw] max-w-[400px]"
                src="./singh.png"
                alt="Character"
                loading="eager"
                fetchPriority="high" // ✅ Fixed: camelCase
              />
            </div>
            {/* Bottom Scroll Prompt - Mobile Optimized */}
            <div className="btmbar absolute bottom-0 left-0 w-full py-4 sm:py-6 px-4 sm:px-10 text-white bg-gradient-to-t from-black to-transparent">
              <div className="flex gap-2 sm:gap-4 items-center">
                <i className="text-2xl sm:text-3xl ri-arrow-down-line"></i>
                <h3 className="text-base sm:text-lg font-sans">Scroll Down</h3>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2">
                <a href="https://www.linkedin.com/in/simmerjit/" className="block">
                  <img
                    className="h-[35px] sm:h-[45px]"
                    src="./link2.png"
                    alt="LinkedIn"
                    loading="lazy"
                  />
                </a>
                <a href="https://github.com/simmerjit" className="block">
                  <img
                    className="pl-2 border-l border-white h-[35px] sm:h-[45px]"
                    src="./git2.png"
                    alt="GitHub"
                    loading="lazy"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: Feature - Mobile Optimized */}
          <div className="relative w-full min-h-screen flex items-center justify-center bg-black px-4 sm:px-6">
            {/* Squares Animated Background */}
            <div className="absolute inset-0 z-10 opacity-100">
              <Squares
                speed={0.5}
                squareSize={window.innerWidth < 768 ? 25 : 40}
                direction="diagonal"
                borderColor="#271E37"
                hoverFillColor="#1F2223"
              />
            </div>
            <div className="cntnr flex flex-col lg:flex-row text-white w-full max-w-[1400px] gap-6 sm:gap-10 py-10 sm:py-20 relative z-20">
              {/* Left Image - Mobile Optimized */}
              <div className="limg relative w-full lg:w-1/2 h-[300px] sm:h-[400px] lg:h-auto flex items-center justify-center">
                <img
                  className="w-[80%] sm:w-[70%] rounded-3xl max-w-[600px] object-cover shadow-2xl"
                  src="./sim.jpg"
                  alt="Simmerjit Singh"
                  loading="lazy"
                />
              </div>
              {/* Right Text Content - Mobile Optimized */}
              <div className="rg w-full lg:w-1/2 space-y-4 sm:space-y-7 text-center lg:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans leading-tight">
                  Transforming curiosity into code,
                  <br className="hidden sm:block" />
                  One stack at a time
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl font-sans">
                  BCA First Year | MERN Stack Specialist
                  <br />
                  Future Java & AI/ML Developer | Web3 Enthusiast
                </p>
                <p className="text-base sm:text-lg lg:text-xl font-sans leading-relaxed">
                  As a driven first-year BCA student, I'm mastering the MERN stack while strategically expanding my expertise into Java, AI/ML, and Web3 technologies. My passion lies in bridging foundational development skills with next-generation innovations.
                </p>
                <div className="text-base sm:text-lg lg:text-xl font-sans space-y-2">
                  <h2 className="font-semibold text-lg sm:text-xl lg:text-2xl">Core Skills & Focus Areas:</h2>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>
                      <strong>Full-Stack:</strong> MongoDB, Express, React, Node.js
                    </li>
                    <li>
                      <strong>Emerging Tech:</strong> Java, AI/ML, Web3/blockchain
                    </li>
                    <li>
                      <strong>Academic:</strong> Strong CS fundamentals
                    </li>
                    <li>
                      <strong>Vision:</strong> AI-driven and decentralized apps
                    </li>
                  </ul>
                </div>
                <button
                  onClick={() => navigate("/me")}
                  className="bg-yellow-500 hover:bg-yellow-400 px-6 sm:px-8 font-pricedown py-3 sm:py-4 text-black text-xl sm:text-2xl lg:text-3xl mt-6 rounded transition-colors duration-300 w-full sm:w-auto"
                >
                  MORE INFO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
