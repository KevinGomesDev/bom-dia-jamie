import { motion } from "framer-motion";

interface JamieAvatarProps {
  clickCount: number;
  level: number;
  currentXP: number;
  xpForNextLevel: number;
  visualStage?: string;
}

function JamieAvatar({
  clickCount,
  level,
  currentXP,
  xpForNextLevel,
  visualStage = "happy",
}: JamieAvatarProps) {
  // Expressões invertidas - de feliz para cada vez mais triste/mórbido
  const expressions = [
    { emoji: "😊", text: "Bom dia!" },
    { emoji: "🙂", text: "Tudo bem..." },
    { emoji: "😐", text: "Ok..." },
    { emoji: "😕", text: "Hmm..." },
    { emoji: "😔", text: "Tô cansada..." },
    { emoji: "😢", text: "Triste..." },
    { emoji: "😭", text: "*chorando*" },
    { emoji: "😩", text: "Por quê?..." },
    { emoji: "😵", text: "Não aguento..." },
    { emoji: "🥀", text: "Murchando..." },
    { emoji: "💀", text: "..." },
    { emoji: "🕳️", text: "" },
  ];

  const expressionIndex = Math.min(
    Math.floor(level / 2),
    expressions.length - 1,
  );
  const currentExpression = expressions[expressionIndex];

  // Determinar estilo baseado no visual stage
  const isDark = visualStage === "abyss" || visualStage === "void";
  const isStorm = visualStage === "storm";
  const isCloudy = visualStage === "cloudy";

  // Cores do círculo baseadas no estágio
  const circleClass = isDark
    ? "bg-gray-900/50 border-red-900/50"
    : isStorm
      ? "bg-gray-700/50 border-gray-500/50"
      : isCloudy
        ? "bg-gray-500/30 border-gray-400/50"
        : "bg-white/30 border-white/50";

  // Cor do badge
  const badgeClass = isDark
    ? "bg-gradient-to-r from-red-900 to-gray-900"
    : isStorm
      ? "bg-gradient-to-r from-gray-600 to-gray-800"
      : isCloudy
        ? "bg-gradient-to-r from-gray-500 to-gray-600"
        : "bg-gradient-to-r from-purple-500 to-pink-500";

  // Cor da barra de XP
  const xpBarClass = isDark
    ? "from-red-900 to-gray-900"
    : isStorm
      ? "from-gray-500 to-gray-700"
      : isCloudy
        ? "from-blue-400 to-gray-500"
        : "from-purple-400 to-pink-400";

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
        animate={
          isDark
            ? { y: [0, 5, 0] } // Flutuando tristemente
            : isStorm
              ? { rotate: [0, -2, 2, 0] } // Tremendo
              : clickCount > 5
                ? { rotate: [0, -5, 5, 0] }
                : {}
        }
        transition={{
          duration: isDark ? 3 : 0.5,
          repeat: Infinity,
        }}
      >
        {/* Círculo de fundo */}
        <motion.div
          className={`w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full backdrop-blur-md flex items-center justify-center shadow-2xl border-4 ${circleClass}`}
          animate={{
            boxShadow: isDark
              ? [
                  "0 0 20px rgba(139, 0, 0, 0.3)",
                  "0 0 40px rgba(139, 0, 0, 0.5)",
                  "0 0 20px rgba(139, 0, 0, 0.3)",
                ]
              : isStorm
                ? [
                    "0 0 20px rgba(100, 100, 120, 0.3)",
                    "0 0 30px rgba(100, 100, 120, 0.5)",
                    "0 0 20px rgba(100, 100, 120, 0.3)",
                  ]
                : [
                    "0 0 20px rgba(255, 255, 255, 0.5)",
                    "0 0 40px rgba(255, 255, 255, 0.8)",
                    "0 0 20px rgba(255, 255, 255, 0.5)",
                  ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Emoji grande */}
          <motion.span
            key={level}
            initial={{ scale: 0, rotate: isDark ? 0 : -180 }}
            animate={{
              scale: 1,
              rotate: 0,
              filter: isDark ? "grayscale(0.5)" : "none",
            }}
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
            className={`absolute -top-1 -right-1 ${badgeClass} text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg`}
          >
            {isDark ? "💀" : ""} Nv. {level}
          </motion.div>
        )}

        {/* Lágrimas caindo (quando triste) */}
        {level >= 4 && (
          <>
            <motion.div
              className="absolute bottom-6 left-8 text-sm"
              animate={{ y: [0, 20], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              💧
            </motion.div>
            <motion.div
              className="absolute bottom-6 right-8 text-sm"
              animate={{ y: [0, 20], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            >
              💧
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Nome e status */}
      <motion.div
        className="mt-2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h3
          className={`text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-lg ${
            isDark ? "text-gray-400" : "text-white"
          }`}
        >
          Jamie{isDark ? "..." : ""}
        </h3>
        <motion.p
          key={level}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-base sm:text-lg md:text-xl font-medium ${
            isDark
              ? "text-red-400/70"
              : isStorm
                ? "text-gray-300"
                : isCloudy
                  ? "text-blue-200"
                  : "text-yellow-200"
          }`}
        >
          {currentExpression.text ? `"${currentExpression.text}"` : ""}
        </motion.p>
      </motion.div>

      {/* Barra de XP para próximo nível */}
      <motion.div
        className={`mt-2 w-32 sm:w-40 md:w-48 h-3 rounded-full overflow-hidden ${
          isDark ? "bg-gray-800/50" : "bg-white/30"
        }`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className={`h-full bg-gradient-to-r ${xpBarClass} rounded-full`}
          initial={{ width: "0%" }}
          animate={{ width: `${(currentXP / xpForNextLevel) * 100}%` }}
          transition={{ type: "spring" }}
        />
      </motion.div>
      <p
        className={`text-xs sm:text-sm mt-0.5 ${
          isDark ? "text-gray-500" : "text-white/80"
        }`}
      >
        {isDark ? "Sofrimento" : "XP"}: {currentXP}/{xpForNextLevel}{" "}
        {isDark ? "até o fim" : `para Nv. ${level + 1}`}
      </p>
    </motion.div>
  );
}

export default JamieAvatar;
