import { motion } from "framer-motion";

interface GameStatsProps {
  suns: number;
  sunsPerSecond: number;
  sunsPerClick: number;
  level: number;
  visualStage?: "happy" | "melancholy" | "cloudy" | "storm" | "abyss" | "void";
}

function GameStats({
  suns,
  sunsPerSecond,
  sunsPerClick,
  level,
  visualStage = "happy",
}: GameStatsProps) {
  const formatNumber = (num: number, forceDecimals = false): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    if (forceDecimals || num % 1 !== 0) {
      return num.toFixed(1);
    }
    return Math.floor(num).toString();
  };

  // Estilos baseados no estágio visual
  const getStyles = () => {
    switch (visualStage) {
      case "happy":
        return {
          cardBg: "bg-white/20 backdrop-blur-md border-white/30",
          levelBg:
            "bg-gradient-to-r from-yellow-400/50 to-orange-400/50 border-yellow-200/30",
          text: "text-white",
          subText: "text-yellow-200",
          icon: "🌙",
          currencyName: "Luas",
          levelIcon: "⭐",
        };
      case "melancholy":
        return {
          cardBg: "bg-gray-300/20 backdrop-blur-md border-gray-400/30",
          levelBg:
            "bg-gradient-to-r from-gray-400/50 to-gray-500/50 border-gray-300/30",
          text: "text-gray-200",
          subText: "text-gray-300",
          icon: "😔",
          currencyName: "Suspiros",
          levelIcon: "🌙",
        };
      case "cloudy":
        return {
          cardBg: "bg-gray-500/30 backdrop-blur-md border-gray-500/40",
          levelBg:
            "bg-gradient-to-r from-gray-500/50 to-gray-600/50 border-gray-400/30",
          text: "text-gray-300",
          subText: "text-gray-400",
          icon: "💧",
          currencyName: "Lágrimas",
          levelIcon: "☁️",
        };
      case "storm":
        return {
          cardBg: "bg-gray-700/40 backdrop-blur-md border-purple-500/30",
          levelBg:
            "bg-gradient-to-r from-purple-600/50 to-indigo-700/50 border-purple-400/30",
          text: "text-gray-200",
          subText: "text-purple-300",
          icon: "⚡",
          currencyName: "Trovões",
          levelIcon: "⛈️",
        };
      case "abyss":
        return {
          cardBg: "bg-gray-900/60 backdrop-blur-md border-red-900/40",
          levelBg:
            "bg-gradient-to-r from-red-900/50 to-gray-900/50 border-red-700/30",
          text: "text-red-200",
          subText: "text-red-400",
          icon: "💀",
          currencyName: "Cadáveres",
          levelIcon: "🕯️",
        };
      case "void":
        return {
          cardBg: "bg-black/80 backdrop-blur-md border-black/90",
          levelBg:
            "bg-gradient-to-r from-black/80 to-gray-900/80 border-gray-800/50",
          text: "text-gray-500",
          subText: "text-gray-600",
          icon: "🕳️",
          currencyName: "Vazio",
          levelIcon: "👁️",
        };
      default:
        return {
          cardBg: "bg-white/20 backdrop-blur-md border-white/30",
          levelBg:
            "bg-gradient-to-r from-yellow-400/50 to-orange-400/50 border-yellow-200/30",
          text: "text-white",
          subText: "text-yellow-200",
          icon: "🌙",
          currencyName: "Luas",
          levelIcon: "⭐",
        };
    }
  };

  const styles = getStyles();

  // Animação sombria para abyss/void
  const darkAnimation =
    visualStage === "abyss" || visualStage === "void"
      ? {
          opacity: [0.7, 1, 0.7],
        }
      : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0, ...darkAnimation }}
      transition={{
        duration: visualStage === "void" ? 2 : 0.5,
        repeat: visualStage === "void" ? Infinity : 0,
      }}
      className="flex flex-wrap justify-center gap-2 sm:gap-4"
    >
      {/* Moeda principal */}
      <div
        className={`${styles.cardBg} rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 border`}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.span
            className="text-xl sm:text-2xl"
            animate={visualStage === "storm" ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {styles.icon}
          </motion.span>
          <div className="text-left">
            <p
              className={`${styles.text} font-bold text-lg sm:text-xl leading-tight`}
            >
              {formatNumber(suns)}
            </p>
            <p className={`${styles.subText} text-xs`}>{styles.currencyName}</p>
          </div>
        </div>
      </div>

      {/* Por segundo */}
      <div
        className={`${styles.cardBg} rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 border`}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl">
            {visualStage === "void" ? "∞" : "⏱️"}
          </span>
          <div className="text-left">
            <p
              className={`${styles.text} font-bold text-lg sm:text-xl leading-tight`}
            >
              {formatNumber(sunsPerSecond, true)}/s
            </p>
            <p className={`${styles.subText} text-xs`}>
              {visualStage === "void" ? "Eternidade" : "Automático"}
            </p>
          </div>
        </div>
      </div>

      {/* Por clique */}
      <div
        className={`${styles.cardBg} rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 border`}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl">
            {visualStage === "abyss" || visualStage === "void" ? "🖐️" : "👆"}
          </span>
          <div className="text-left">
            <p
              className={`${styles.text} font-bold text-lg sm:text-xl leading-tight`}
            >
              +{formatNumber(sunsPerClick)}
            </p>
            <p className={`${styles.subText} text-xs`}>
              {visualStage === "void" ? "Por Toque" : "Por Clique"}
            </p>
          </div>
        </div>
      </div>

      {/* Nível */}
      <div
        className={`${styles.levelBg} backdrop-blur-md rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 border`}
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <motion.span
            className="text-xl sm:text-2xl"
            animate={visualStage === "abyss" ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {styles.levelIcon}
          </motion.span>
          <div className="text-left">
            <p
              className={`${styles.text} font-bold text-lg sm:text-xl leading-tight`}
            >
              {visualStage === "void" ? "∞" : `Nv. ${level}`}
            </p>
            <p className={`${styles.subText} text-xs`}>
              {visualStage === "void"
                ? "Transcendência"
                : visualStage === "abyss"
                  ? "Descida"
                  : "Nível"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default GameStats;
