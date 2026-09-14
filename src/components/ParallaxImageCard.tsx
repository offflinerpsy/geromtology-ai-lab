import React, { useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { luxuryEase } from "../utils/motion";

export interface ParallaxImageCardProps {
  imageSrc: string;
  imageAlt: string;
  className?: string;
  imageClassName?: string;
  containerClassName?: string;
  maxTilt?: number; // max tilt degrees (e.g. 3.5 - 5 deg for quiet luxury)
  imageParallaxFactor?: number; // percentage shift of inner image (e.g. 2)
  glare?: boolean;
  glareTone?: "dark" | "light";
  perspective?: number;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const ParallaxLayer: React.FC<{
  children: React.ReactNode;
  depth?: number; // in pixels translateZ
  className?: string;
  style?: React.CSSProperties;
}> = ({ children, depth = 24, className = "", style = {} }) => {
  return (
    <div
      className={className}
      style={{
        transform: `translateZ(${depth}px)`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const ParallaxImageCard: React.FC<ParallaxImageCardProps> = ({
  imageSrc,
  imageAlt,
  className = "",
  imageClassName = "",
  containerClassName = "",
  maxTilt = 4,
  imageParallaxFactor = 2.5,
  glare = true,
  glareTone = "dark",
  perspective = 1200,
  children,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Normalized cursor coordinates (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for fluid, weighted quiet luxury momentum
  const springConfig = { stiffness: 220, damping: 26, mass: 0.85 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  // 3D rotation angles
  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    prefersReducedMotion ? [0, 0] : [maxTilt, -maxTilt]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    prefersReducedMotion ? [0, 0] : [-maxTilt, maxTilt]
  );

  // Counter-parallax translation of the image itself
  const imageX = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    prefersReducedMotion ? ["0%", "0%"] : [`-${imageParallaxFactor}%`, `${imageParallaxFactor}%`]
  );
  const imageY = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    prefersReducedMotion ? ["0%", "0%"] : [`-${imageParallaxFactor}%`, `${imageParallaxFactor}%`]
  );

  // Specular light position
  const glarePercentX = useTransform(mouseXSpring, [-0.5, 0.5], [15, 85]);
  const glarePercentY = useTransform(mouseYSpring, [-0.5, 0.5], [15, 85]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) return;

      const mouseXFromCenter = e.clientX - (rect.left + width / 2);
      const mouseYFromCenter = e.clientY - (rect.top + height / 2);

      x.set(mouseXFromCenter / width);
      y.set(mouseYFromCenter / height);
    },
    [x, y, prefersReducedMotion]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: `${perspective}px`,
      }}
      className={`relative select-none ${containerClassName}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        transition={{ ease: luxuryEase }}
        className={`relative w-full h-full overflow-hidden transition-shadow duration-500 will-change-transform ${className}`}
      >
        {/* Parallax Background Image Container */}
        <motion.div
          style={{
            x: imageX,
            y: imageY,
            scale: prefersReducedMotion ? 1 : 1.06,
          }}
          className="absolute inset-0 w-full h-full will-change-transform pointer-events-none"
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-opacity duration-500 ${imageClassName}`}
          />
        </motion.div>

        {/* Dynamic Specular Sheen (Quiet Luxury Glare) */}
        {glare && !prefersReducedMotion && (
          <motion.div
            style={{
              background: useTransform(
                [glarePercentX, glarePercentY],
                ([gx, gy]) =>
                  glareTone === "light"
                    ? `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.05) 45%, transparent 70%)`
                    : `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.12) 0%, rgba(16, 185, 129, 0.04) 35%, transparent 65%)`
              ),
            }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.45, ease: luxuryEase }}
            className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
          />
        )}

        {/* Floating Content / Layers in 3D Space */}
        <div
          style={{
            transformStyle: "preserve-3d",
          }}
          className="relative w-full h-full z-10"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};
