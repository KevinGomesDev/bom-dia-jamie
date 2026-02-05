import { motion } from "framer-motion";

interface VisualElementsProps {
  level: number;
  totalUpgrades: number;
  windowWidth: number;
}

function VisualElements({
  level,
  totalUpgrades,
  windowWidth,
}: VisualElementsProps) {
  // Calcular progresso para elementos visuais
  const progress = level + Math.floor(totalUpgrades / 2);
  const isDark = progress < 2;
  const isSunrise = progress >= 4 && progress < 7;

  return (
    <>
      {/* Estrelas (aparecem no nível 1+ mas desaparecem gradualmente com a luz) */}
      {level >= 1 && progress < 12 && (
        <>
          {[...Array(Math.min(level * 2, 15))].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className={`absolute pointer-events-none ${isDark ? "text-blue-200" : "text-yellow-200"}`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isDark ? [0.4, 0.9, 0.4] : [0.2, 0.5, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                left: `${10 + ((i * 17) % 80)}%`,
                top: `${5 + ((i * 23) % 30)}%`,
                fontSize: `${8 + Math.random() * 8}px`,
              }}
            >
              {isDark ? "⭐" : "✨"}
            </motion.div>
          ))}
        </>
      )}

      {/* Lua (modo escuro) */}
      {progress < 4 && (
        <motion.div
          className="absolute top-8 right-8 text-4xl sm:text-5xl pointer-events-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: isDark ? 0.9 : 0.5, 
            y: 0,
            rotate: isDark ? 0 : 15,
          }}
          transition={{ duration: 1 }}
        >
          🌙
        </motion.div>
      )}

      {/* Sol nascendo (sunrise) */}
      {isSunrise && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 text-6xl sm:text-7xl pointer-events-none"
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
            y: [80, 60, 80],
            opacity: 1,
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 1 },
          }}
        >
          🌅
        </motion.div>
      )}

      {/* Sol do dia (morning - gradient) */}
      {progress >= 7 && progress < 20 && (
        <motion.div
          className="absolute top-8 right-8 text-4xl sm:text-5xl pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: [1, 1.1, 1],
            rotate: 360,
          }}
          transition={{
            scale: { duration: 3, repeat: Infinity },
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            opacity: { duration: 1 },
          }}
        >
          ☀️
        </motion.div>
      )}

      {/* Super Sol (radiante) */}
      {progress >= 20 && (
        <>
          {/* Raios de luz */}
          <div className="sun-rays" />
          
          <motion.div
            className="absolute top-6 right-6 text-5xl sm:text-6xl pointer-events-none"
            animate={{
              scale: [1, 1.3, 1],
              filter: ["brightness(1)", "brightness(1.8)", "brightness(1)"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            🌟
          </motion.div>
          
          {/* Aurora boreal */}
          <div className="aurora-effect" />
        </>
      )}

      {/* Horizonte com gradiente (sunrise) */}
      {isSunrise && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(255, 107, 107, 0.4), transparent)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}

      {/* Flores (aparecem com upgrades) */}
      {totalUpgrades >= 3 && (
        <>
          <motion.div
            className="absolute bottom-4 left-4 text-2xl pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🌸
          </motion.div>
          <motion.div
            className="absolute bottom-4 right-4 text-2xl pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            🌺
          </motion.div>
        </>
      )}

      {/* Mais flores com mais upgrades */}
      {totalUpgrades >= 6 && (
        <>
          <motion.div
            className="absolute bottom-8 left-16 text-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🌷
          </motion.div>
          <motion.div
            className="absolute bottom-6 right-16 text-xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🌻
          </motion.div>
          <motion.div
            className="absolute bottom-3 left-1/3 text-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            🌼
          </motion.div>
        </>
      )}

      {/* Grama animada (upgrades 10+) */}
      {totalUpgrades >= 10 && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 text-2xl pointer-events-none flex justify-around overflow-hidden"
          style={{ lineHeight: 0 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.span
              key={`grass-${i}`}
              animate={{ rotate: [-5, 5, -5] }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🌿
            </motion.span>
          ))}
        </motion.div>
      )}

      {/* Pássaros (nível 5+) - mais variedade */}
      {level >= 5 && (
        <>
          <motion.div
            className="absolute text-xl pointer-events-none"
            initial={{ x: -50, y: 60 }}
            animate={{ x: windowWidth + 50 }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            🐦
          </motion.div>
          {level >= 8 && (
            <motion.div
              className="absolute text-lg pointer-events-none"
              initial={{ x: windowWidth + 50, y: 90 }}
              animate={{ x: -50 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
                delay: 3,
              }}
            >
              🕊️
            </motion.div>
          )}
        </>
      )}

      {/* Borboletas (nível 7+) - mais cores */}
      {level >= 7 && (
        <>
          {["🦋", "🦋", "🦋"].map((butterfly, i) => (
            <motion.div
              key={`butterfly-${i}`}
              className="absolute text-lg pointer-events-none"
              style={{
                filter: i === 1 ? "hue-rotate(60deg)" : i === 2 ? "hue-rotate(180deg)" : "none",
              }}
              animate={{
                x: [100 + i * 80, 150 + i * 80, 100 + i * 80, 50 + i * 80, 100 + i * 80],
                y: [100 + i * 30, 80 + i * 30, 120 + i * 30, 90 + i * 30, 100 + i * 30],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5,
              }}
            >
              {butterfly}
            </motion.div>
          ))}
        </>
      )}

      {/* Arco-íris (nível 10+) */}
      {level >= 10 && (
        <motion.div
          className="absolute top-16 left-1/2 -translate-x-1/2 text-6xl sm:text-7xl pointer-events-none"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ 
            opacity: [0.4, 0.6, 0.4], 
            scale: 1,
            y: 0,
          }}
          transition={{ 
            opacity: { duration: 3, repeat: Infinity },
            scale: { duration: 1 },
            y: { duration: 1 },
          }}
        >
          🌈
        </motion.div>
      )}

      {/* Partículas mágicas flutuantes (nível 15+) */}
      {level >= 15 && (
        <>
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`magic-${i}`}
              className="absolute text-sm pointer-events-none"
              initial={{ 
                x: Math.random() * windowWidth,
                y: Math.random() * 400 + 100,
                opacity: 0,
              }}
              animate={{
                y: [null, Math.random() * -200],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            >
              {["✨", "💫", "⭐", "🌟", "💖", "💜", "💛"][i % 7]}
            </motion.div>
          ))}
        </>
      )}

      {/* Fogos de artifício ocasionais (nível 20+) */}
      {level >= 20 && (
        <motion.div
          className="absolute top-1/4 left-1/4 text-4xl pointer-events-none"
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 5,
          }}
        >
          🎆
        </motion.div>
      )}
    </>
  );
}

export default VisualElements;
