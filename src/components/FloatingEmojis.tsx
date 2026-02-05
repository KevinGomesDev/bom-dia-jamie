import { motion } from "framer-motion";
import { useMemo } from "react";

function FloatingEmojis() {
  const emojis = ["☀️", "🌤️", "⭐", "✨", "🌈", "☁️", "🌸", "🦋", "🐝", "🌻"];

  const particles = useMemo(
    () =>
      [...Array(15)].map((_, i) => ({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 10,
        size: 20 + Math.random() * 20,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            fontSize: `${particle.size}px`,
          }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{
            y: "-100px",
            opacity: [0, 1, 1, 0],
            x: [0, 30, -30, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  );
}

export default FloatingEmojis;
