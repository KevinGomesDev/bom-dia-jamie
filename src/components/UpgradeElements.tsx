import { motion } from "framer-motion";
import { Upgrade } from "./UpgradeShop";
import { useMemo } from "react";

interface UpgradeElementsProps {
  upgrades: Upgrade[];
  windowWidth: number;
  windowHeight: number;
}

// Gera posições pseudo-aleatórias mas consistentes baseadas no índice
const getRandomPosition = (index: number, seed: number) => {
  const x = (index * 137 + seed * 97) % 100;
  const y = ((index * 149 + seed * 83) % 80) + 10;
  return { x, y };
};

// Gera uma velocidade de animação baseada no índice
const getAnimationDuration = (index: number, base: number) => {
  return base + (index % 5) * 0.5;
};

function UpgradeElements({ upgrades, windowWidth }: UpgradeElementsProps) {
  // Gerar elementos para cada upgrade
  const elements = useMemo(() => {
    const allElements: JSX.Element[] = [];

    upgrades.forEach((upgrade) => {
      for (let i = 0; i < upgrade.owned; i++) {
        const pos = getRandomPosition(i, upgrade.id.charCodeAt(0));
        const duration = getAnimationDuration(i, 3);
        const delay = (i * 0.1) % 2;

        switch (upgrade.id) {
          case "coffee":
            // Xícaras de café flutuando e soltando fumaça
            allElements.push(
              <motion.div
                key={`coffee-${i}`}
                className="absolute pointer-events-none text-2xl sm:text-3xl"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [-5, 5, -5],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                }}
              >
                ☕
                <motion.span
                  className="absolute -top-2 left-1/2 text-sm opacity-50"
                  animate={{ y: [0, -15], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: delay }}
                >
                  💨
                </motion.span>
              </motion.div>,
            );
            break;

          case "alarm":
            // Despertadores tremendo e tocando
            allElements.push(
              <motion.div
                key={`alarm-${i}`}
                className="absolute pointer-events-none text-2xl sm:text-3xl"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                animate={{
                  rotate: [-15, 15, -15],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  delay: delay,
                }}
              >
                ⏰
                {i % 3 === 0 && (
                  <motion.span
                    className="absolute -top-4 -right-2 text-xs"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    🔔
                  </motion.span>
                )}
              </motion.div>,
            );
            break;

          case "breakfast":
            // Croissants e pães flutuando
            const breakfastEmojis = ["🥐", "🥯", "🥞", "🧇", "🍳", "🥖"];
            allElements.push(
              <motion.div
                key={`breakfast-${i}`}
                className="absolute pointer-events-none text-2xl sm:text-3xl"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: duration + 1,
                  repeat: Infinity,
                  delay: delay,
                }}
              >
                {breakfastEmojis[i % breakfastEmojis.length]}
              </motion.div>,
            );
            break;

          case "music":
            // Notas musicais dançando e flutuando
            const musicEmojis = [
              "🎵",
              "🎶",
              "🎼",
              "🎹",
              "🎸",
              "🥁",
              "🎺",
              "🎷",
            ];
            allElements.push(
              <motion.div
                key={`music-${i}`}
                className="absolute pointer-events-none text-xl sm:text-2xl"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                animate={{
                  y: [0, -20, 0],
                  x: [0, 10, -10, 0],
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: duration + 2,
                  repeat: Infinity,
                  delay: delay,
                }}
              >
                {musicEmojis[i % musicEmojis.length]}
              </motion.div>,
            );
            break;

          case "pet":
            // Gatos andando pela tela
            const petEmojis = ["🐱", "🐈", "😺", "😸", "🐈‍⬛", "😻", "🙀", "😹"];
            const catY = 70 + (i % 3) * 10;
            allElements.push(
              <motion.div
                key={`pet-${i}`}
                className="absolute pointer-events-none text-3xl sm:text-4xl"
                style={{ top: `${catY}%` }}
                initial={{ x: i % 2 === 0 ? -50 : windowWidth + 50 }}
                animate={{
                  x: i % 2 === 0 ? windowWidth + 50 : -50,
                }}
                transition={{
                  duration: 15 + (i % 10) * 2,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "linear",
                }}
              >
                <motion.span
                  style={{
                    display: "inline-block",
                    transform: i % 2 === 0 ? "scaleX(1)" : "scaleX(-1)",
                  }}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  {petEmojis[i % petEmojis.length]}
                </motion.span>
              </motion.div>,
            );
            break;

          case "sunshine":
            // Arco-íris, sóis e elementos brilhantes
            const sunEmojis = ["🌈", "☀️", "🌞", "⭐", "🌟", "💫", "✨", "🔆"];
            allElements.push(
              <motion.div
                key={`sunshine-${i}`}
                className="absolute pointer-events-none text-3xl sm:text-4xl"
                style={{ left: `${pos.x}%`, top: `${Math.min(pos.y, 40)}%` }}
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 360],
                  filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
                }}
                transition={{
                  duration: duration + 3,
                  repeat: Infinity,
                  delay: delay,
                }}
              >
                {sunEmojis[i % sunEmojis.length]}
              </motion.div>,
            );
            break;

          case "secret":
            // O Grande Mistério - efeito visual único e especial
            allElements.push(
              <motion.div
                key={`secret-${i}`}
                className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
              >
                {/* Diamante central gigante e brilhante */}
                <motion.div
                  className="text-8xl sm:text-9xl drop-shadow-2xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                    filter: [
                      "brightness(1) drop-shadow(0 0 20px #a855f7)",
                      "brightness(1.5) drop-shadow(0 0 40px #ec4899)",
                      "brightness(1.2) drop-shadow(0 0 30px #8b5cf6)",
                      "brightness(1) drop-shadow(0 0 20px #a855f7)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  💎
                </motion.div>

                {/* Partículas de diamante girando ao redor */}
                {Array.from({ length: 8 }).map((_, idx) => (
                  <motion.div
                    key={`secret-particle-${idx}`}
                    className="absolute text-2xl sm:text-3xl"
                    style={{
                      transformOrigin: "center center",
                    }}
                    animate={{
                      rotate: [idx * 45, idx * 45 + 360],
                      x: [
                        Math.cos((idx * Math.PI) / 4) * 100,
                        Math.cos((idx * Math.PI) / 4 + Math.PI * 2) * 100,
                      ],
                      y: [
                        Math.sin((idx * Math.PI) / 4) * 100,
                        Math.sin((idx * Math.PI) / 4 + Math.PI * 2) * 100,
                      ],
                      scale: [0.8, 1.2, 0.8],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      delay: idx * 0.2,
                      ease: "linear",
                    }}
                  >
                    {["💜", "💖", "✨", "⭐", "💫", "🌟", "💗", "💝"][idx]}
                  </motion.div>
                ))}

                {/* Texto secreto que aparece e some */}
                <motion.div
                  className="absolute bottom-20 text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400"
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [20, 0, 0, -20],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    times: [0, 0.2, 0.8, 1],
                  }}
                >
                  ✨ O Grande Mistério foi revelado! ✨
                </motion.div>
              </motion.div>,
            );
            break;
        }
      }
    });

    return allElements;
  }, [upgrades, windowWidth]);

  return <>{elements}</>;
}

export default UpgradeElements;
