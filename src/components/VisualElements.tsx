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
  // totalUpgrades é usado para determinar elementos visuais

  return (
    <>
      {/* Estrelas (aparecem no nível 1+) */}
      {level >= 1 && (
        <>
          {[...Array(Math.min(level * 2, 20))].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute text-yellow-200 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
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
              ✨
            </motion.div>
          ))}
        </>
      )}

      {/* Lua/Sol (transição conforme nível) */}
      {level < 3 && (
        <motion.div
          className="absolute top-8 right-8 text-4xl sm:text-5xl pointer-events-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1 }}
        >
          🌙
        </motion.div>
      )}

      {level >= 3 && level < 8 && (
        <motion.div
          className="absolute top-8 right-8 text-4xl sm:text-5xl pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          ☀️
        </motion.div>
      )}

      {level >= 8 && (
        <motion.div
          className="absolute top-6 right-6 text-5xl sm:text-6xl pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          🌟
        </motion.div>
      )}

      {/* Flores (aparecem com upgrades de pet ou mais) */}
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
        </>
      )}

      {/* Pássaros (nível 5+) */}
      {level >= 5 && (
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
      )}

      {/* Borboletas (nível 7+) */}
      {level >= 7 && (
        <>
          <motion.div
            className="absolute text-lg pointer-events-none"
            animate={{
              x: [100, 150, 100, 50, 100],
              y: [100, 80, 120, 90, 100],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            🦋
          </motion.div>
          <motion.div
            className="absolute text-lg pointer-events-none"
            animate={{
              x: [
                windowWidth - 100,
                windowWidth - 150,
                windowWidth - 100,
                windowWidth - 50,
                windowWidth - 100,
              ],
              y: [150, 130, 170, 140, 150],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            🦋
          </motion.div>
        </>
      )}

      {/* Arco-íris (nível 10+) */}
      {level >= 10 && (
        <motion.div
          className="absolute top-16 left-1/2 -translate-x-1/2 text-6xl sm:text-7xl pointer-events-none opacity-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1 }}
        >
          🌈
        </motion.div>
      )}

      {/* Confetti permanente (nível 15+) */}
      {level >= 15 && (
        <>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`confetti-${i}`}
              className="absolute text-sm pointer-events-none"
              initial={{ y: -20, opacity: 0 }}
              animate={{
                y: [0, 100, 200],
                opacity: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${5 + i * 10}%`,
              }}
            >
              {["🎉", "🎊", "✨", "💫", "⭐"][i % 5]}
            </motion.div>
          ))}
        </>
      )}
    </>
  );
}

export default VisualElements;
