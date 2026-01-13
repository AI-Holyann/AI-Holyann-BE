"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function AnimatedText({
  text,
  className = "",
  delay = 0,
  duration = 0.08,
}: AnimatedTextProps) {
  // Split text into words to prevent word breaking
  const words = text.split(" ");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: duration,
        delayChildren: delay,
      },
    },
  };

  const item: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={item}
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
          className={index < words.length - 1 ? "mr-2" : ""}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}
