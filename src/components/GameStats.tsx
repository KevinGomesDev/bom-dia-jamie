import { motion } from "framer-motion";

interface GameStatsProps {
  suns: number;
  sunsPerSecond: number;
  sunsPerClick: number;
  level: number;
}

function GameStats({
  suns,
  sunsPerSecond,
  sunsPerClick,
  level,
}: GameStatsProps) {
  const formatNumber = (num: number, forceDecimals = false): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    // Mostrar decimais se o número tiver parte decimal ou se forçado
    if (forceDecimals || num % 1 !== 0) {
      return num.toFixed(1);
    }
    return Math.floor(num).toString();
  };

  // Determinar se está no modo escuro
  const isDark = level < 2;
  const cardClass = isDark
    ? "bg-gray-800/50 backdrop-blur-md rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-600/30"
    : "bg-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 border border-white/30";
  const textClass = isDark ? "text-gray-300" : "text-white";
  const subTextClass = isDark ? "text-gray-400" : "text-yellow-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap justify-center gap-2 sm:gap-4"
    >
      {/* Sóis totais */}
      <div className={cardClass}>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl">{isDark ? "🌙" : "☀️"}</span>
          <div className="text-left">
            <p
              className={`${textClass} font-bold text-lg sm:text-xl leading-tight`}
            >
              {formatNumber(suns)}
            </p>
            <p className={`${subTextClass} text-xs`}>
              {isDark ? "Luas" : "Sóis"}
            </p>
          </div>
        </div>
      </div>

      {/* Sóis por segundo */}
      <div className={cardClass}>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl">⏱️</span>
          <div className="text-left">
            <p
              className={`${textClass} font-bold text-lg sm:text-xl leading-tight`}
            >
              {formatNumber(sunsPerSecond, true)}/s
            </p>
            <p className={`${subTextClass} text-xs`}>Automático</p>
          </div>
        </div>
      </div>

      {/* Sóis por clique */}
      <div className={cardClass}>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl">👆</span>
          <div className="text-left">
            <p
              className={`${textClass} font-bold text-lg sm:text-xl leading-tight`}
            >
              +{formatNumber(sunsPerClick)}
            </p>
            <p className={`${subTextClass} text-xs`}>Por Clique</p>
          </div>
        </div>
      </div>

      {/* Nível */}
      <div
        className={
          isDark
            ? "bg-gradient-to-r from-gray-700/50 to-gray-600/50 backdrop-blur-md rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-500/30"
            : "bg-gradient-to-r from-purple-500/50 to-pink-500/50 backdrop-blur-md rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 border border-white/30"
        }
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xl sm:text-2xl">{isDark ? "💤" : "⭐"}</span>
          <div className="text-left">
            <p
              className={`${textClass} font-bold text-lg sm:text-xl leading-tight`}
            >
              Nv. {level}
            </p>
            <p className={`${subTextClass} text-xs`}>Nível</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default GameStats;
