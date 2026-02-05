import { motion } from "framer-motion";
import { useMemo, memo } from "react";

interface FloatingEmojisProps {
  visualStage?: "happy" | "melancholy" | "cloudy" | "storm" | "abyss" | "void";
}

// Função para gerar número pseudo-aleatório determinístico baseado em seed
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// Emojis por estágio - definidos fora do componente para evitar recriação
const EMOJIS_BY_STAGE = {
  happy: ["☀️", "🌤️", "⭐", "✨", "🌈", "🌸", "🦋", "🐝", "🌻", "💛"],
  melancholy: ["🌤️", "🍂", "🥀", "😔", "💭", "🌫️", "🍁", "💔", "😕", "🌾"],
  cloudy: ["☁️", "🌫️", "💧", "🌧️", "💦", "😢", "🌨️", "🪨", "🌬️", "❄️"],
  storm: ["⛈️", "⚡", "🌪️", "💨", "🌩️", "💀", "🦇", "👻", "🌑", "😱"],
  abyss: ["💀", "🦇", "👻", "🕯️", "☠️", "🖤", "🪦", "🕷️", "🐀", "👁️"],
  void: ["🕳️", "👁️", "⚫", "∅", "💀", "🖤", "👻", "☠️", "🌑", "⬛"],
};

// Configuração de animação por estágio
const ANIMATION_CONFIG = {
  happy: { direction: "up" as const, speed: 1, wobble: 30 },
  melancholy: { direction: "down" as const, speed: 0.8, wobble: 20 },
  cloudy: { direction: "down" as const, speed: 1.2, wobble: 10 },
  storm: { direction: "diagonal" as const, speed: 2, wobble: 50 },
  abyss: { direction: "random" as const, speed: 0.5, wobble: 15 },
  void: { direction: "inward" as const, speed: 0.3, wobble: 5 },
};

// Quantidade de partículas por estágio - REDUZIDO para performance
const PARTICLE_COUNT = {
  happy: 8,
  melancholy: 8,
  cloudy: 6,
  storm: 5,
  abyss: 4,
  void: 3,
};

// Gera partículas com posições determinísticas
const generateParticles = (stage: keyof typeof EMOJIS_BY_STAGE) => {
  const count = PARTICLE_COUNT[stage];
  const emojis = EMOJIS_BY_STAGE[stage];
  const config = ANIMATION_CONFIG[stage];

  return [...Array(count)].map((_, i) => ({
    id: i,
    emoji: emojis[Math.floor(seededRandom(i * 13 + 7) * emojis.length)],
    x: seededRandom(i * 17 + 3) * 100,
    delay: seededRandom(i * 23 + 11) * 5,
    duration: (10 + seededRandom(i * 31 + 19) * 10) / config.speed,
    size: 20 + seededRandom(i * 41 + 29) * 20,
  }));
};

function FloatingEmojis({ visualStage = "happy" }: FloatingEmojisProps) {
  // Memoizar partículas apenas quando o estágio muda
  const particles = useMemo(
    () => generateParticles(visualStage),
    [visualStage],
  );

  const config = ANIMATION_CONFIG[visualStage];

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
        // Usar valores determinísticos baseados no ID da partícula
        const randY1 = seededRandom(particle.id * 47) * window.innerHeight;
        const randY2 = seededRandom(particle.id * 53) * window.innerHeight;
        const randX1 = seededRandom(particle.id * 59) * 100 - 50;
        const randX2 = seededRandom(particle.id * 61) * 100 - 50;
        return {
          y: [randY1, randY2],
          x: [randX1, randX2],
          scale: [1, 1.2, 0.8, 1],
        };
      case "inward":
        return {
          x: [particle.x > 50 ? 100 : -100, 50],
          y: [seededRandom(particle.id * 67) * 100, 50],
          scale: [1, 0],
          opacity: [1, 0],
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
          key={`${visualStage}-${particle.id}`}
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

export default memo(FloatingEmojis);
