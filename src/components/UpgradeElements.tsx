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

// ============ COMPONENTES MEMOIZADOS POR TIPO DE UPGRADE ============
// Cada tipo só re-renderiza quando sua própria contagem muda

interface UpgradeTypeProps {
  count: number;
  windowWidth: number;
  baseOpacity: number;
  visualStage: string;
}

// Café Frio - xícaras tremendo
const CoffeeElements = memo(function CoffeeElements({
  count,
  baseOpacity,
  visualStage,
}: UpgradeTypeProps) {
  const elements = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const pos = getRandomPosition(i, "coffee".charCodeAt(0));
      const delay = (i * 0.1) % 2;
      return (
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
            x: [-2, 2, -2],
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
        </motion.div>
      );
    });
  }, [count, baseOpacity, visualStage]);

  return <>{elements}</>;
});

// Insônia - olhos cansados
const AlarmElements = memo(function AlarmElements({
  count,
  baseOpacity,
}: UpgradeTypeProps) {
  const elements = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const pos = getRandomPosition(i, "alarm".charCodeAt(0));
      const delay = (i * 0.1) % 2;
      return (
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
        </motion.div>
      );
    });
  }, [count, baseOpacity]);

  return <>{elements}</>;
});

// Pão Mofado - alimentos estragados
const BreakfastElements = memo(function BreakfastElements({
  count,
  baseOpacity,
}: UpgradeTypeProps) {
  const sadFoodEmojis = ["🍞", "🥀", "🍂", "🦠", "🪳", "🐛"];

  const elements = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const pos = getRandomPosition(i, "breakfast".charCodeAt(0));
      const duration = getAnimationDuration(i, 3);
      const delay = (i * 0.1) % 2;
      return (
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
            y: [0, 3, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: duration + 2,
            repeat: Infinity,
            delay: delay,
          }}
        >
          {sadFoodEmojis[i % sadFoodEmojis.length]}
        </motion.div>
      );
    });
  }, [count, baseOpacity]);

  return <>{elements}</>;
});

// Playlist Triste - notas musicais
const MusicElements = memo(function MusicElements({
  count,
  baseOpacity,
}: UpgradeTypeProps) {
  const sadMusicEmojis = ["🎻", "😢", "💔", "🎵", "😭", "🎶", "💧", "🥀"];

  const elements = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const pos = getRandomPosition(i, "music".charCodeAt(0));
      const duration = getAnimationDuration(i, 3);
      const delay = (i * 0.1) % 2;
      return (
        <motion.div
          key={`music-${i}`}
          className="absolute pointer-events-none text-xl sm:text-2xl"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            opacity: baseOpacity,
          }}
          animate={{
            y: [0, 20, 0],
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
        </motion.div>
      );
    });
  }, [count, baseOpacity]);

  return <>{elements}</>;
});

// Gato Preto - gatos sombrios
const PetElements = memo(function PetElements({
  count,
  windowWidth,
  baseOpacity,
  visualStage,
}: UpgradeTypeProps) {
  const darkCatEmojis = ["🐈‍⬛", "🖤", "👻", "🦇", "🕷️", "🐀"];

  const elements = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const catY = 70 + (i % 3) * 10;
      return (
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
            duration: 20 + (i % 10) * 2,
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
        </motion.div>
      );
    });
  }, [count, windowWidth, baseOpacity, visualStage]);

  return <>{elements}</>;
});

// Escuridão - lua e nuvens escuras
const DarknessElements = memo(function DarknessElements({
  count,
  baseOpacity,
}: UpgradeTypeProps) {
  const darkSkyEmojis = ["🌑", "🌚", "☁️", "🌫️", "🌒", "🌘", "⬛", "🖤"];

  const elements = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const pos = getRandomPosition(i, "darkness".charCodeAt(0));
      const duration = getAnimationDuration(i, 3);
      const delay = (i * 0.1) % 2;
      return (
        <motion.div
          key={`darkness-${i}`}
          className="absolute pointer-events-none text-3xl sm:text-4xl"
          style={{
            left: `${pos.x}%`,
            top: `${Math.min(pos.y, 40)}%`,
            opacity: baseOpacity,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [baseOpacity, baseOpacity * 0.5, baseOpacity],
            filter: ["brightness(0.8)", "brightness(0.5)", "brightness(0.8)"],
          }}
          transition={{
            duration: duration + 4,
            repeat: Infinity,
            delay: delay,
          }}
        >
          {darkSkyEmojis[i % darkSkyEmojis.length]}
        </motion.div>
      );
    });
  }, [count, baseOpacity]);

  return <>{elements}</>;
});

// O Vazio Eterno - buraco negro (especial, máximo 1)
const SecretElements = memo(function SecretElements({
  count,
}: UpgradeTypeProps) {
  if (count === 0) return null;

  return (
    <motion.div
      key="secret-0"
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

      {/* Almas sendo sugadas para o buraco negro */}
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
    </motion.div>
  );
});

// ============ COMPONENTE PRINCIPAL ============

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

  // Extrair contagens de cada upgrade (memoizado para evitar recálculos)
  const upgradeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    upgrades.forEach((u) => {
      counts[u.id] = u.owned;
    });
    return counts;
  }, [upgrades]);

  // Props comuns para todos os componentes
  const commonProps = {
    windowWidth,
    baseOpacity,
    visualStage,
  };

  return (
    <>
      <CoffeeElements count={upgradeCounts.coffee || 0} {...commonProps} />
      <AlarmElements count={upgradeCounts.alarm || 0} {...commonProps} />
      <BreakfastElements
        count={upgradeCounts.breakfast || 0}
        {...commonProps}
      />
      <MusicElements count={upgradeCounts.music || 0} {...commonProps} />
      <PetElements count={upgradeCounts.pet || 0} {...commonProps} />
      <DarknessElements count={upgradeCounts.darkness || 0} {...commonProps} />
      <SecretElements count={upgradeCounts.secret || 0} {...commonProps} />
    </>
  );
}

export default memo(UpgradeElements);
