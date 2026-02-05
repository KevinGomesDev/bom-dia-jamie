import { motion } from "framer-motion";
import { Upgrade } from "./UpgradeShop";
import { useMemo, memo } from "react";

interface UpgradeElementsProps {
  upgrades: Upgrade[];
  windowWidth: number;
  windowHeight: number;
  visualStage?: "happy" | "melancholy" | "cloudy" | "storm" | "abyss" | "void";
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

// Limite máximo de elementos visuais por tipo de upgrade para otimização
const MAX_VISUAL_ELEMENTS_PER_UPGRADE = 5;
const MAX_TOTAL_VISUAL_ELEMENTS = 25;

function UpgradeElements({
  upgrades,
  windowWidth,
  visualStage = "happy",
}: UpgradeElementsProps) {
  // Opacidade base diminui conforme fica mais escuro
  const baseOpacity =
    visualStage === "void"
      ? 0.3
      : visualStage === "abyss"
        ? 0.5
        : visualStage === "storm"
          ? 0.7
          : 1;

  // Criar uma string estável das quantidades de upgrades para dependência do useMemo
  const upgradesKey = upgrades.map((u) => `${u.id}:${u.owned}`).join(",");

  // Gerar elementos para cada upgrade
  const elements = useMemo(() => {
    const allElements: JSX.Element[] = [];
    let totalElements = 0;

    upgrades.forEach((upgrade) => {
      // Limitar elementos por upgrade e total para otimização de performance
      const maxForThisUpgrade = Math.min(
        upgrade.owned,
        MAX_VISUAL_ELEMENTS_PER_UPGRADE,
      );
      for (
        let i = 0;
        i < maxForThisUpgrade && totalElements < MAX_TOTAL_VISUAL_ELEMENTS;
        i++
      ) {
        totalElements++;
        const pos = getRandomPosition(i, upgrade.id.charCodeAt(0));
        const duration = getAnimationDuration(i, 3);
        const delay = (i * 0.1) % 2;

        switch (upgrade.id) {
          case "coffee":
            // Café frio - xícaras tremendo de frio
            allElements.push(
              <motion.div
                key={`coffee-${i}`}
                className="absolute pointer-events-none text-2xl sm:text-3xl"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  opacity: baseOpacity,
                  filter: visualStage === "void" ? "grayscale(0.8)" : "none",
                }}
                animate={{
                  x: [-2, 2, -2], // tremendo de frio
                  rotate: [-3, 3, -3],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  delay: delay,
                }}
              >
                🥶
                <motion.span
                  className="absolute -top-2 left-1/2 text-sm opacity-50"
                  animate={{ y: [0, -10], opacity: [0.3, 0], scale: [1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: delay }}
                >
                  ❄️
                </motion.span>
              </motion.div>,
            );
            break;

          case "alarm":
            // Insônia - olhos cansados e Zs
            allElements.push(
              <motion.div
                key={`alarm-${i}`}
                className="absolute pointer-events-none text-2xl sm:text-3xl"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  opacity: baseOpacity,
                }}
                animate={{
                  scale: [1, 0.9, 1],
                  opacity: [baseOpacity, baseOpacity * 0.7, baseOpacity],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: delay,
                }}
              >
                😵
                {i % 3 === 0 && (
                  <motion.span
                    className="absolute -top-4 -right-2 text-xs"
                    animate={{
                      y: [0, -15],
                      opacity: [0.5, 0],
                      rotate: [0, -20],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💤
                  </motion.span>
                )}
              </motion.div>,
            );
            break;

          case "breakfast":
            // Pão mofado - alimentos estragados
            const sadFoodEmojis = ["🍞", "🥀", "🍂", "🦠", "🪳", "🐛"];
            allElements.push(
              <motion.div
                key={`breakfast-${i}`}
                className="absolute pointer-events-none text-2xl sm:text-3xl"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  opacity: baseOpacity,
                  filter: "hue-rotate(60deg) saturate(0.5)",
                }}
                animate={{
                  y: [0, 3, 0], // quase não se move, estático
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: duration + 2,
                  repeat: Infinity,
                  delay: delay,
                }}
              >
                {sadFoodEmojis[i % sadFoodEmojis.length]}
              </motion.div>,
            );
            break;

          case "music":
            // Playlist triste - notas musicais caindo
            const sadMusicEmojis = [
              "🎻",
              "😢",
              "💔",
              "🎵",
              "😭",
              "🎶",
              "💧",
              "🥀",
            ];
            allElements.push(
              <motion.div
                key={`music-${i}`}
                className="absolute pointer-events-none text-xl sm:text-2xl"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  opacity: baseOpacity,
                }}
                animate={{
                  y: [0, 20, 0], // caindo
                  x: [0, -5, 5, 0],
                  rotate: [0, -10, 10, 0],
                  scale: [1, 0.9, 1],
                }}
                transition={{
                  duration: duration + 3,
                  repeat: Infinity,
                  delay: delay,
                }}
              >
                {sadMusicEmojis[i % sadMusicEmojis.length]}
              </motion.div>,
            );
            break;

          case "pet":
            // Gato preto - gatos sombrios pela tela
            const darkCatEmojis = ["🐈‍⬛", "🖤", "👻", "🦇", "🕷️", "🐀"];
            const catY = 70 + (i % 3) * 10;
            allElements.push(
              <motion.div
                key={`pet-${i}`}
                className="absolute pointer-events-none text-3xl sm:text-4xl"
                style={{
                  top: `${catY}%`,
                  opacity: baseOpacity,
                  filter: visualStage === "void" ? "brightness(0.5)" : "none",
                }}
                initial={{ x: i % 2 === 0 ? -50 : windowWidth + 50 }}
                animate={{
                  x: i % 2 === 0 ? windowWidth + 50 : -50,
                }}
                transition={{
                  duration: 20 + (i % 10) * 2, // mais lento
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
                  animate={{
                    y: [0, -3, 0],
                    opacity: [baseOpacity, baseOpacity * 0.8, baseOpacity],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {darkCatEmojis[i % darkCatEmojis.length]}
                </motion.span>
              </motion.div>,
            );
            break;

          case "sunshine":
            // Escuridão - lua, nuvens escuras, sombras
            const darkSkyEmojis = [
              "🌑",
              "🌚",
              "☁️",
              "🌫️",
              "🌒",
              "🌘",
              "⬛",
              "🖤",
            ];
            allElements.push(
              <motion.div
                key={`sunshine-${i}`}
                className="absolute pointer-events-none text-3xl sm:text-4xl"
                style={{
                  left: `${pos.x}%`,
                  top: `${Math.min(pos.y, 40)}%`,
                  opacity: baseOpacity,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [baseOpacity, baseOpacity * 0.5, baseOpacity],
                  filter: [
                    "brightness(0.8)",
                    "brightness(0.5)",
                    "brightness(0.8)",
                  ],
                }}
                transition={{
                  duration: duration + 4,
                  repeat: Infinity,
                  delay: delay,
                }}
              >
                {darkSkyEmojis[i % darkSkyEmojis.length]}
              </motion.div>,
            );
            break;

          case "secret":
            // O Vazio Eterno - efeito visual de buraco negro
            allElements.push(
              <motion.div
                key={`secret-${i}`}
                className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
              >
                {/* Buraco negro central */}
                <motion.div
                  className="text-8xl sm:text-9xl"
                  style={{
                    filter: "drop-shadow(0 0 30px rgba(0,0,0,0.9))",
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  🕳️
                </motion.div>

                {/* Almas sendo sugadas para o buraco negro - reduzido para 6 */}
                {Array.from({ length: 6 }).map((_, idx) => (
                  <motion.div
                    key={`secret-particle-${idx}`}
                    className="absolute text-2xl sm:text-3xl"
                    initial={{
                      x: Math.cos((idx * Math.PI * 2) / 6) * 200,
                      y: Math.sin((idx * Math.PI * 2) / 6) * 200,
                      scale: 1,
                      opacity: 1,
                    }}
                    animate={{
                      x: 0,
                      y: 0,
                      scale: 0,
                      opacity: 0,
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      delay: idx * 0.6,
                      ease: "easeIn",
                    }}
                  >
                    {["👻", "💀", "🖤", "😵", "👁️", "☠️"][idx]}
                  </motion.div>
                ))}

                {/* Texto sombrio que aparece e some */}
                <motion.div
                  className="absolute bottom-20 text-xl sm:text-2xl font-bold text-gray-500"
                  style={{
                    textShadow: "0 0 10px rgba(0,0,0,0.8)",
                  }}
                  animate={{
                    opacity: [0, 0.5, 0.5, 0],
                    y: [20, 0, 0, -20],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    times: [0, 0.2, 0.8, 1],
                  }}
                >
                  🕳️ O Vazio Eterno consome tudo... 🕳️
                </motion.div>
              </motion.div>,
            );
            break;
        }
      }
    });

    return allElements;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upgradesKey, windowWidth, baseOpacity, visualStage]);

  return <>{elements}</>;
}

export default memo(UpgradeElements);
