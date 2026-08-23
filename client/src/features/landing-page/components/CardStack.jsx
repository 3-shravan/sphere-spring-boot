/* eslint-disable react/no-unknown-property */

import Lenis from "lenis";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

// Smooth scroll hook
const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({ smooth: true });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, []);
};

const FlowerSvg = () => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {" "}
    <g clipPath="url(#clip0_118_198)">
      {" "}
      <path
        d="M100 0L102.665 74.6397L120.791 2.18524L107.88 75.7481L140.674 8.64545L112.75 77.9164L158.779 19.0983L117.063 81.0498L174.314 33.0869L120.63 85.0115L186.603 50L123.295 89.6282L195.106 69.0983L124.943 94.6982L199.452 89.5471L125.5 100L199.452 110.453L124.943 105.302L195.106 130.902L123.295 110.372L186.603 150L120.63 114.989L174.314 166.913L117.063 118.95L158.779 180.902L112.75 122.084L140.674 191.355L107.88 124.252L120.791 197.815L102.665 125.36L100 200L97.3345 125.36L79.2088 197.815L92.1201 124.252L59.3263 191.355L87.25 122.084L41.2215 180.902L82.9372 118.95L25.6855 166.913L79.3701 114.989L13.3975 150L76.7046 110.372L4.89435 130.902L75.0572 105.302L0.547813 110.453L74.5 100L0.547813 89.5471L75.0572 94.6982L4.89435 69.0983L76.7046 89.6282L13.3975 50L79.3701 85.0115L25.6855 33.0869L82.9372 81.0498L41.2215 19.0983L87.25 77.9164L59.3263 8.64545L92.1201 75.7481L79.2088 2.18524L97.3345 74.6397L100 0Z"
        fill="url(#paint0_linear_118_198)"
      />{" "}
    </g>{" "}
    <defs>
      {" "}
      <linearGradient
        id="paint0_linear_118_198"
        x1="100"
        y1="0"
        x2="100"
        y2="200"
        gradientUnits="userSpaceOnUse"
      >
        {" "}
        <stop stop-color="#B8DBFC" />{" "}
        <stop offset="1" stop-color="#F8FBFE" />{" "}
      </linearGradient>{" "}
      <clipPath id="clip0_118_198">
        {" "}
        <rect width="200" height="200" fill="white" />{" "}
      </clipPath>{" "}
    </defs>{" "}
  </svg>
);

const CardSection = ({ color, bg, text, zIndex = 10 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <section ref={ref} className="relative h-[150vh] sm:h-[500vh]">
      <motion.div
        style={{ y, scale, opacity, zIndex }}
        className={`sticky top-0 h-[50svh] w-full shadow-2xl sm:h-[30svh] md:h-screen ${bg} ${color} flex items-center justify-center overflow-hidden`}
      >
        <FlowerSvg className="top-10 left-10 h-64 w-64 opacity-10" />
        {/* <FlowerSVG className="w-48 h-48 bottom-10 right-10 opacity-10 rotate-45" /> */}
        <h1 className="stroke-outline-text text-[28vw]">{text}</h1>
      </motion.div>
    </section>
  );
};

const StackedCards = () => {
  useSmoothScroll();

  return (
    <div className="font-[Poppins]">
      <CardSection bg="" color="text-black" text="Connect" zIndex={30} />
      <CardSection bg="" text="Share" zIndex={20} />
      <CardSection bg="" text="Discover" zIndex={10} />
    </div>
  );
};

export default StackedCards;
