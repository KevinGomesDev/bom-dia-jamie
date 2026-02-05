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

  // Determinar estágio
  const isHappy = progress < 2;
  const isMelancholy = progress >= 2 && progress < 4;
  const isCloudy = progress >= 4 && progress < 7;
  const isStorm = progress >= 7 && progress < 12;
  const isAbyss = progress >= 12 && progress < 20;
  const isVoid = progress >= 20;

  return (
    <>
      {/* ========== FASE FELIZ ========== */}
      {isHappy && (
        <>
          {/* Sol brilhante */}
          <motion.div
            className="absolute top-8 right-8 text-5xl sm:text-6xl pointer-events-none"
            animate={{
              scale: [1, 1.1, 1],
              rotate: 360,
            }}
            transition={{
              scale: { duration: 2, repeat: Infinity },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            }}
          >
            ☀️
          </motion.div>

          {/* Borboletas coloridas */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`butterfly-${i}`}
              className="absolute text-2xl pointer-events-none"
              animate={{
                x: [100 + i * 100, 150 + i * 100, 100 + i * 100],
                y: [100 + i * 50, 80 + i * 50, 100 + i * 50],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🦋
            </motion.div>
          ))}

          {/* Flores */}
          <motion.div className="absolute bottom-4 left-4 text-3xl pointer-events-none">
            🌸
          </motion.div>
          <motion.div className="absolute bottom-4 right-4 text-3xl pointer-events-none">
            🌺
          </motion.div>
          <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-3xl pointer-events-none">
            🌻
          </motion.div>

          {/* Arco-íris */}
          <motion.div
            className="absolute top-16 left-1/2 -translate-x-1/2 text-6xl pointer-events-none opacity-70"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌈
          </motion.div>
        </>
      )}

      {/* ========== FASE MELANCÓLICA ========== */}
      {isMelancholy && (
        <>
          {/* Sol ficando fraco */}
          <motion.div
            className="absolute top-8 right-8 text-4xl sm:text-5xl pointer-events-none opacity-60"
            animate={{ opacity: [0.6, 0.4, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌤️
          </motion.div>

          {/* Flores murchando */}
          <motion.div className="absolute bottom-4 left-8 text-2xl pointer-events-none opacity-70">
            🥀
          </motion.div>
          <motion.div className="absolute bottom-4 right-8 text-2xl pointer-events-none opacity-70">
            🍂
          </motion.div>

          {/* Folhas caindo */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`leaf-${i}`}
              className="absolute text-xl pointer-events-none"
              initial={{ x: 50 + i * 80, y: -20 }}
              animate={{
                y: [0, 400],
                x: [50 + i * 80, 70 + i * 80, 40 + i * 80],
                rotate: [0, 360],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                delay: i * 1.5,
              }}
            >
              🍂
            </motion.div>
          ))}
        </>
      )}

      {/* ========== FASE NUBLADA ========== */}
      {isCloudy && (
        <>
          {/* Nuvens cinzas */}
          <motion.div
            className="absolute top-10 text-5xl pointer-events-none"
            animate={{ x: [-50, windowWidth + 50] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            ☁️
          </motion.div>
          <motion.div
            className="absolute top-20 text-4xl pointer-events-none opacity-80"
            animate={{ x: [windowWidth + 50, -50] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            🌫️
          </motion.div>

          {/* Gotas de chuva leve */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`drop-${i}`}
              className="absolute text-sm pointer-events-none opacity-60"
              initial={{ y: -20 }}
              animate={{ y: [0, 500] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{ left: `${10 + i * 12}%` }}
            >
              💧
            </motion.div>
          ))}

          {/* Poças d'água */}
          <motion.div
            className="absolute bottom-2 left-1/4 text-2xl pointer-events-none opacity-50"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💦
          </motion.div>
        </>
      )}

      {/* ========== FASE TEMPESTADE ========== */}
      {isStorm && (
        <>
          {/* Nuvens de tempestade */}
          <motion.div
            className="absolute top-5 left-1/4 text-6xl pointer-events-none"
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ⛈️
          </motion.div>

          {/* Relâmpagos */}
          <motion.div
            className="absolute top-20 left-1/2 text-4xl pointer-events-none"
            animate={{ opacity: [0, 1, 0, 0, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              times: [0, 0.1, 0.15, 0.5, 1],
            }}
          >
            ⚡
          </motion.div>

          {/* Chuva forte */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`rain-${i}`}
              className="absolute text-xs pointer-events-none"
              initial={{ y: -20 }}
              animate={{ y: [0, 600] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
              }}
              style={{ left: `${5 + i * 6}%` }}
            >
              💧
            </motion.div>
          ))}

          {/* Vento */}
          <motion.div
            className="absolute top-1/2 text-2xl pointer-events-none opacity-40"
            animate={{ x: [-100, windowWidth + 100] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            💨
          </motion.div>

          {/* Efeito de névoa */}
          <div className="fog-effect" />
        </>
      )}

      {/* ========== FASE ABISMO ========== */}
      {isAbyss && (
        <>
          {/* Lua sangrenta */}
          <motion.div
            className="absolute top-8 right-8 text-5xl pointer-events-none"
            animate={{
              filter: ["brightness(1)", "brightness(0.7)", "brightness(1)"],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🌑
          </motion.div>

          {/* Morcegos voando */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`bat-${i}`}
              className="absolute text-2xl pointer-events-none"
              initial={{ x: i % 2 === 0 ? -50 : windowWidth + 50 }}
              animate={{ x: i % 2 === 0 ? windowWidth + 50 : -50 }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 2,
              }}
              style={{ top: `${10 + i * 15}%` }}
            >
              🦇
            </motion.div>
          ))}

          {/* Fantasmas */}
          <motion.div
            className="absolute text-3xl pointer-events-none opacity-30"
            animate={{
              x: [100, 150, 100],
              y: [200, 180, 200],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            👻
          </motion.div>

          {/* Caveiras */}
          <motion.div
            className="absolute bottom-8 left-8 text-2xl pointer-events-none opacity-60"
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💀
          </motion.div>
          <motion.div
            className="absolute bottom-8 right-8 text-2xl pointer-events-none opacity-60"
            animate={{ rotate: [10, -10, 10] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ☠️
          </motion.div>

          {/* Velas tremulando */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`candle-${i}`}
              className="absolute bottom-4 text-xl pointer-events-none"
              style={{ left: `${25 + i * 25}%` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1 + i * 0.3, repeat: Infinity }}
            >
              🕯️
            </motion.div>
          ))}

          {/* Efeito de escuridão */}
          <div className="darkness-effect" />
        </>
      )}

      {/* ========== FASE VAZIO ========== */}
      {isVoid && (
        <>
          {/* Buraco negro central */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl pointer-events-none"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              scale: { duration: 4, repeat: Infinity },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            }}
          >
            🕳️
          </motion.div>

          {/* Almas sendo sugadas */}
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 150;
            return (
              <motion.div
                key={`soul-${i}`}
                className="absolute text-xl pointer-events-none"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                animate={{
                  x: [Math.cos(angle) * radius, 0],
                  y: [Math.sin(angle) * radius, 0],
                  opacity: [0.8, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              >
                👻
              </motion.div>
            );
          })}

          {/* Partículas de trevas */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-red-900 rounded-full pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}

          {/* Olhos na escuridão */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`eyes-${i}`}
              className="absolute text-2xl pointer-events-none"
              style={{
                left: `${15 + i * 20}%`,
                top: `${20 + (i % 2) * 50}%`,
              }}
              animate={{
                opacity: [0, 0.6, 0.6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 1.5,
                times: [0, 0.1, 0.9, 1],
              }}
            >
              👁️
            </motion.div>
          ))}

          {/* Texto assustador */}
          <motion.div
            className="absolute bottom-20 left-1/2 -translate-x-1/2 text-red-800 text-sm font-bold pointer-events-none"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            O vazio consome tudo...
          </motion.div>

          {/* Escuridão total pulsante */}
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </>
      )}
    </>
  );
}

export default VisualElements;
