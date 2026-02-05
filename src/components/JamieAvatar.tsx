import { motion } from "framer-motion";

interface JamieAvatarProps {
  clickCount: number;
  level: number;
  currentXP: number;
  xpForNextLevel: number;
}

function JamieAvatar({
  clickCount,
  level,
  currentXP,
  xpForNextLevel,
}: JamieAvatarProps) {
  const expressions = [
    { emoji: "😴", text: "Zzz..." },
    { emoji: "😪", text: "Hã? Que?" },
    { emoji: "🥱", text: "*boceja*" },
    { emoji: "😐", text: "Já acordei..." },
    { emoji: "😊", text: "Bom dia!" },
    { emoji: "😄", text: "Tô feliz!" },
    { emoji: "🤩", text: "CAFÉ!" },
    { emoji: "💃", text: "Dançando!" },
    { emoji: "💪", text: "Vamos nessa!" },
    { emoji: "🦸", text: "SuperJamie!" },
    { emoji: "👑", text: "Rainha!" },
    { emoji: "✨", text: "Brilhando!" },
  ];

  const expressionIndex = Math.min(
    Math.floor(level / 2),
    expressions.length - 1,
  );
  const currentExpression = expressions[expressionIndex];

  return (
    <motion.div
      className="flex flex-col items-center justify-center my-2"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.8, type: "spring" }}
    >
      {/* Avatar Container */}
      <motion.div
        className="relative"
        animate={clickCount > 5 ? { rotate: [0, -5, 5, 0] } : {}}
        transition={{ duration: 0.5, repeat: clickCount > 5 ? Infinity : 0 }}
      >
        {/* Círculo de fundo */}
        <motion.div
          className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center shadow-2xl border-4 border-white/50"
          animate={{
            boxShadow:
              clickCount > 0
                ? [
                    "0 0 20px rgba(255, 255, 255, 0.5)",
                    "0 0 40px rgba(255, 255, 255, 0.8)",
                    "0 0 20px rgba(255, 255, 255, 0.5)",
                  ]
                : "0 0 20px rgba(255, 255, 255, 0.5)",
          }}
          transition={{ duration: 1, repeat: level > 0 ? Infinity : 0 }}
        >
          {/* Emoji grande */}
          <motion.span
            key={level}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-4xl sm:text-5xl md:text-6xl"
          >
            {currentExpression.emoji}
          </motion.span>
        </motion.div>

        {/* Badge de nível */}
        {level > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg"
          >
            Nv. {level}
          </motion.div>
        )}
      </motion.div>

      {/* Nome e status */}
      <motion.div
        className="mt-2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
          Jamie
        </h3>
        <motion.p
          key={level}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-base sm:text-lg md:text-xl text-yellow-200 font-medium"
        >
          "{currentExpression.text}"
        </motion.p>
      </motion.div>

      {/* Barra de XP para próximo nível */}
      <motion.div
        className="mt-2 w-32 sm:w-40 md:w-48 h-3 bg-white/30 rounded-full overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentXP / xpForNextLevel) * 100}%` }}
          transition={{ type: "spring" }}
        />
      </motion.div>
      <p className="text-xs sm:text-sm text-white/80 mt-0.5">
        XP: {currentXP}/{xpForNextLevel} para Nv. {level + 1}
      </p>
    </motion.div>
  );
}

export default JamieAvatar;
