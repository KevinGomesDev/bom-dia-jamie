import { motion } from "framer-motion";

export type VisualStage =
  | "happy"
  | "melancholy"
  | "cloudy"
  | "storm"
  | "abyss"
  | "void";

interface UpgradeCardProps {
  emoji: string;
  name: string;
  description: string;
  price: string;
  priceIcon: string;
  owned: number;
  canBuy: boolean;
  isMaxed: boolean;
  isSecret?: boolean;
  extraInfo?: string; // Para mostrar multiplicador em prestígio
  visualStage: VisualStage;
  variant?: "normal" | "prestige";
  onClick: () => void;
}

function UpgradeCard({
  emoji,
  name,
  description,
  price,
  priceIcon,
  owned,
  canBuy,
  isMaxed,
  isSecret = false,
  extraInfo,
  visualStage,
  variant = "normal",
  onClick,
}: UpgradeCardProps) {
  const isDark =
    visualStage === "void" ||
    visualStage === "abyss" ||
    visualStage === "storm";

  // Estilos baseados no variant e visualStage
  const getCardStyles = () => {
    if (variant === "prestige") {
      if (isMaxed) return "bg-purple-600/60 border-purple-400";
      if (canBuy)
        return isDark
          ? "bg-purple-800/70 border-purple-400 hover:bg-purple-700/80"
          : "bg-purple-600/60 border-purple-300 hover:bg-purple-500/70";
      return "bg-gray-700/60 border-gray-500/60 opacity-70";
    }

    // Variant normal - estilos por estágio visual
    if (isSecret) {
      if (isMaxed)
        return "bg-gradient-to-br from-purple-600/50 to-pink-600/50 border-purple-400 shadow-lg shadow-purple-500/30";
      if (canBuy)
        return "bg-gradient-to-br from-purple-900/60 to-pink-900/60 border-purple-500 hover:border-pink-400 animate-pulse";
      return "bg-gray-900/60 border-gray-600 opacity-70";
    }

    switch (visualStage) {
      case "happy":
        if (isMaxed) return "bg-green-500/50 border-green-400";
        if (canBuy) return "bg-white/50 border-yellow-400 hover:bg-white/60";
        return "bg-white/40 border-white/50 opacity-60";
      case "melancholy":
        if (isMaxed) return "bg-gray-500/50 border-gray-400";
        if (canBuy)
          return "bg-gray-300/50 border-gray-400 hover:bg-gray-300/60";
        return "bg-gray-400/40 border-gray-500/50 opacity-60";
      case "cloudy":
        if (isMaxed) return "bg-blue-500/50 border-blue-400";
        if (canBuy)
          return "bg-gray-500/60 border-blue-400 hover:bg-gray-500/70";
        return "bg-gray-600/50 border-gray-500/60 opacity-60";
      case "storm":
        if (isMaxed) return "bg-purple-600/60 border-purple-400";
        if (canBuy)
          return "bg-purple-900/70 border-purple-400 hover:bg-purple-800/80";
        return "bg-gray-800/60 border-gray-600/60 opacity-60";
      case "abyss":
        if (isMaxed) return "bg-red-800/60 border-red-500";
        if (canBuy) return "bg-red-900/70 border-red-500 hover:bg-red-800/80";
        return "bg-gray-900/70 border-gray-700/60 opacity-60";
      case "void":
        if (isMaxed) return "bg-gray-900/80 border-gray-700";
        if (canBuy) return "bg-black/85 border-gray-700 hover:bg-gray-900/90";
        return "bg-black/70 border-black/80 opacity-50";
      default:
        if (isMaxed) return "bg-green-500/50 border-green-400";
        if (canBuy) return "bg-white/50 border-yellow-400 hover:bg-white/60";
        return "bg-white/40 border-white/50 opacity-60";
    }
  };

  // Cores de texto
  const getTextColors = () => {
    if (variant === "prestige") {
      return {
        name: "text-white",
        price: "text-yellow-300",
        extra: "text-purple-200",
      };
    }

    if (isSecret) {
      return {
        name: "text-purple-200",
        price: "text-pink-300",
        extra: "text-purple-300",
      };
    }

    switch (visualStage) {
      case "happy":
        return {
          name: "text-white",
          price: "text-yellow-300",
          extra: "text-yellow-200",
        };
      case "melancholy":
        return {
          name: "text-gray-200",
          price: "text-gray-300",
          extra: "text-gray-400",
        };
      case "cloudy":
        return {
          name: "text-gray-300",
          price: "text-blue-300",
          extra: "text-blue-200",
        };
      case "storm":
        return {
          name: "text-gray-200",
          price: "text-purple-300",
          extra: "text-purple-200",
        };
      case "abyss":
        return {
          name: "text-red-200",
          price: "text-red-300",
          extra: "text-red-200",
        };
      case "void":
        return {
          name: "text-gray-400",
          price: "text-gray-400",
          extra: "text-gray-500",
        };
      default:
        return {
          name: "text-white",
          price: "text-yellow-300",
          extra: "text-yellow-200",
        };
    }
  };

  // Badge de quantidade
  const getBadgeStyles = () => {
    if (isMaxed) {
      if (visualStage === "void") return "bg-gray-700";
      return "bg-green-500";
    }
    if (isSecret) return "bg-purple-500";
    if (variant === "prestige") return "bg-purple-500";
    if (visualStage === "abyss") return "bg-red-600";
    if (visualStage === "void") return "bg-gray-600";
    return "bg-purple-500";
  };

  // Tooltip styles
  const getTooltipStyles = () => {
    return isDark ? "bg-black/95 text-gray-300" : "bg-gray-900/95 text-white";
  };

  const textColors = getTextColors();
  const maxedText =
    visualStage === "void"
      ? "∅ Absorvido"
      : variant === "prestige"
        ? "✨ MAX"
        : "✨ Comprado!";

  return (
    <motion.button
      onClick={() => canBuy && onClick()}
      disabled={!canBuy && !isMaxed}
      className={`
        group relative p-2 sm:p-3 rounded-xl border-2 transition-all min-w-[90px] sm:min-w-[110px]
        ${getCardStyles()}
        ${canBuy ? "cursor-pointer" : isMaxed ? "cursor-default" : "cursor-not-allowed"}
      `}
      whileHover={canBuy ? { scale: 1.05 } : {}}
      whileTap={canBuy ? { scale: 0.95 } : {}}
    >
      {/* Tooltip */}
      <div
        className={`absolute bottom-full left-1/2 mb-2 px-3 py-2 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg w-max max-w-[160px] text-center ${getTooltipStyles()}`}
        style={{ transform: "translateX(-50%)" }}
      >
        <div
          className={`font-bold mb-1 ${variant === "prestige" ? "text-purple-300" : visualStage === "abyss" ? "text-red-400" : visualStage === "void" ? "text-gray-400" : "text-yellow-300"}`}
        >
          {name}
        </div>
        <div className="text-[11px]">{description}</div>
        <div
          className={`absolute top-full left-1/2 border-4 border-transparent ${isDark ? "border-t-black/95" : "border-t-gray-900/95"}`}
          style={{ transform: "translateX(-50%)" }}
        ></div>
      </div>

      {/* Badge */}
      {owned > 0 && (
        <div
          className={`absolute -top-1.5 -right-1.5 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${getBadgeStyles()}`}
        >
          {isMaxed ? (visualStage === "void" ? "∅" : "✓") : owned}
        </div>
      )}

      {/* Emoji */}
      <motion.div
        className={`text-2xl sm:text-3xl mb-1 ${isSecret ? "animate-bounce" : ""}`}
        animate={
          visualStage === "abyss"
            ? { rotate: [0, 5, -5, 0] }
            : visualStage === "void"
              ? { opacity: [0.5, 1, 0.5] }
              : undefined
        }
        transition={
          visualStage === "abyss" || visualStage === "void"
            ? { duration: 2, repeat: Infinity }
            : undefined
        }
      >
        {emoji}
      </motion.div>

      {/* Nome */}
      <p
        className={`font-semibold text-xs sm:text-sm truncate ${textColors.name}`}
      >
        {isSecret && !isMaxed ? "???" : name}
      </p>

      {/* Info extra (multiplicador em prestígio) */}
      {extraInfo && (
        <p className={`text-[10px] sm:text-xs truncate ${textColors.extra}`}>
          {extraInfo}
        </p>
      )}

      {/* Preço */}
      <p className={`text-xs sm:text-sm font-bold ${textColors.price}`}>
        {isMaxed ? maxedText : `${priceIcon} ${price}`}
      </p>
    </motion.button>
  );
}

export default UpgradeCard;
