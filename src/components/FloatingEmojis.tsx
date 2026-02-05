import { motion } from "framer-motion";
import { useMemo } from "react";

interface FloatingEmojisProps {
  visualStage?: "happy" | "melancholy" | "cloudy" | "storm" | "abyss" | "void";
}

function FloatingEmojis({ visualStage = "happy" }: FloatingEmojisProps) {
  // Emojis que mudam conforme o estágio
  const getEmojis = () => {
    switch (visualStage) {
      case "happy":
        return ["☀️", "🌤️", "⭐", "✨", "🌈", "🌸", "🦋", "🐝", "🌻", "💛"];
      case "melancholy":
        return ["🌤️", "🍂", "🥀", "😔", "💭", "🌫️", "🍁", "💔", "😕", "🌾"];
      case "cloudy":
        return ["☁️", "🌫️", "💧", "🌧️", "💦", "😢", "🌨️", "🪨", "🌬️", "❄️"];
      case "storm":
        return ["⛈️", "⚡", "🌪️", "💨", "🌩️", "💀", "🦇", "👻", "🌑", "😱"];
      case "abyss":
        return ["💀", "🦇", "👻", "🕯️", "☠️", "🖤", "🪦", "🕷️", "🐀", "👁️"];
      case "void":
        return ["🕳️", "👁️", "⚫", "∅", "💀", "🖤", "👻", "☠️", "🌑", "⬛"];
      default:
        return ["☀️", "🌤️", "⭐", "✨", "🌈", "🌸", "🦋", "🐝", "🌻", "💛"];
    }
  };

  const emojis = getEmojis();

  // Quantidade de partículas diminui conforme fica mais escuro
  const particleCount =
    visualStage === "void"
      ? 5
      : visualStage === "abyss"
        ? 8
        : visualStage === "storm"
          ? 10
          : 15;

  // Velocidade e direção mudam conforme o estágio
  const getAnimationConfig = () => {
    switch (visualStage) {
      case "happy":
        return { direction: "up", speed: 1, wobble: 30 };
      case "melancholy":
        return { direction: "down", speed: 0.8, wobble: 20 };
      case "cloudy":
        return { direction: "down", speed: 1.2, wobble: 10 };
      case "storm":
        return { direction: "diagonal", speed: 2, wobble: 50 };
      case "abyss":
        return { direction: "random", speed: 0.5, wobble: 15 };
      case "void":
        return { direction: "inward", speed: 0.3, wobble: 5 };
      default:
        return { direction: "up", speed: 1, wobble: 30 };
    }
  };

  const config = getAnimationConfig();

  const particles = useMemo(
    () =>
      [...Array(particleCount)].map((_, i) => ({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: (10 + Math.random() * 10) / config.speed,
        size: 20 + Math.random() * 20,
      })),
    [visualStage],
  );

  // Animação baseada na direção
  const getAnimation = (particle: (typeof particles)[0]) => {
    switch (config.direction) {
      case "up":
        return {
          y: [window.innerHeight, -100],
          x: [0, config.wobble, -config.wobble, 0],
        };
      case "down":
        return {
          y: [-100, window.innerHeight],
          x: [0, config.wobble, -config.wobble, 0],
        };
      case "diagonal":
        return {
          y: [-100, window.innerHeight],
          x: [0, config.wobble * 2, -config.wobble * 2, config.wobble],
          rotate: [0, 360],
        };
      case "random":
        return {
          y: [
            Math.random() * window.innerHeight,
            Math.random() * window.innerHeight,
          ],
          x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
          scale: [1, 1.2, 0.8, 1],
        };
      case "inward":
        // Partículas são sugadas para o centro
        return {
          x: [particle.x > 50 ? 100 : -100, 50],
          y: [Math.random() * 100, 50],
          scale: [1, 0],
          opacity: [1, 0],
        };
      default:
        return {
          y: [window.innerHeight, -100],
          x: [0, config.wobble, -config.wobble, 0],
        };
    }
  };

  // Opacidade diminui no void
  const baseOpacity =
    visualStage === "void" ? 0.3 : visualStage === "abyss" ? 0.6 : 1;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            fontSize: `${particle.size}px`,
            opacity: baseOpacity,
            filter: visualStage === "void" ? "blur(1px)" : "none",
          }}
          initial={{
            y: config.direction === "up" ? "100vh" : "-100px",
            opacity: 0,
          }}
          animate={{
            ...getAnimation(particle),
            opacity:
              config.direction === "inward"
                ? [baseOpacity, 0]
                : [0, baseOpacity, baseOpacity, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: visualStage === "storm" ? "easeIn" : "linear",
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}

      {/* Efeito especial para void - partículas sendo sugadas para o centro */}
      {visualStage === "void" && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          🕳️
        </motion.div>
      )}
    </div>
  );
}

export default FloatingEmojis;
