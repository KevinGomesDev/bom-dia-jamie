import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

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
  extraInfo?: string;
  visualStage: VisualStage;
  variant?: "normal" | "prestige";
  onClick: () => void;
}

interface TooltipPosition {
  x: number;
  y: number;
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
  const [tooltipPos, setTooltipPos] = useState<TooltipPosition | null>(null);
  const cardRef = useRef<HTMLButtonElement>(null);

  const showTooltip = useCallback(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Sempre aparecer acima do botão
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltipPos(null);
  }, []);

  // Estilos do card - mais contrastados e visíveis
  const getCardStyles = () => {
    if (variant === "prestige") {
      if (isMaxed)
        return "bg-purple-700/80 border-purple-400 shadow-md shadow-purple-500/20";
      if (canBuy)
        return "bg-purple-600/70 border-purple-300 hover:bg-purple-500/80 shadow-md";
      return "bg-gray-600/50 border-gray-500/50";
    }

    if (isSecret) {
      if (isMaxed)
        return "bg-gradient-to-br from-purple-600/70 to-pink-600/70 border-purple-400 shadow-lg shadow-purple-500/30";
      if (canBuy)
        return "bg-gradient-to-br from-purple-700/70 to-pink-700/70 border-purple-400 hover:border-pink-400 animate-pulse shadow-md";
      return "bg-gray-700/60 border-gray-500";
    }

    // Normal por estágio visual - fundos mais sólidos
    switch (visualStage) {
      case "happy":
        if (isMaxed) return "bg-green-600/70 border-green-400 shadow-md";
        if (canBuy)
          return "bg-teal-600/60 border-yellow-400 hover:bg-teal-500/70 shadow-md";
        return "bg-gray-500/50 border-gray-400/50";
      case "melancholy":
        if (isMaxed) return "bg-gray-600/70 border-gray-400 shadow-md";
        if (canBuy)
          return "bg-gray-500/60 border-gray-300 hover:bg-gray-400/70 shadow-md";
        return "bg-gray-600/40 border-gray-500/50";
      case "cloudy":
        if (isMaxed) return "bg-blue-600/70 border-blue-400 shadow-md";
        if (canBuy)
          return "bg-slate-600/60 border-blue-400 hover:bg-slate-500/70 shadow-md";
        return "bg-gray-600/50 border-gray-500/50";
      case "storm":
        if (isMaxed) return "bg-purple-700/70 border-purple-400 shadow-md";
        if (canBuy)
          return "bg-purple-800/70 border-purple-400 hover:bg-purple-700/80 shadow-md";
        return "bg-gray-700/50 border-gray-600/50";
      case "abyss":
        if (isMaxed)
          return "bg-red-700/70 border-red-500 shadow-md shadow-red-500/20";
        if (canBuy)
          return "bg-red-800/70 border-red-500 hover:bg-red-700/80 shadow-md";
        return "bg-gray-800/60 border-gray-600/50";
      case "void":
        if (isMaxed) return "bg-gray-800/80 border-gray-600 shadow-md";
        if (canBuy)
          return "bg-gray-900/80 border-gray-600 hover:bg-gray-800/90 shadow-md";
        return "bg-black/60 border-gray-700/50";
      default:
        if (isMaxed) return "bg-green-600/70 border-green-400 shadow-md";
        if (canBuy)
          return "bg-teal-600/60 border-yellow-400 hover:bg-teal-500/70 shadow-md";
        return "bg-gray-500/50 border-gray-400/50";
    }
  };

  // Badge styles
  const getBadgeStyles = () => {
    if (isMaxed) return visualStage === "void" ? "bg-gray-600" : "bg-green-500";
    if (isSecret) return "bg-pink-500";
    if (variant === "prestige") return "bg-purple-500";
    if (visualStage === "abyss") return "bg-red-500";
    if (visualStage === "void") return "bg-gray-500";
    return "bg-yellow-500";
  };

  const maxedText =
    visualStage === "void" ? "∅" : variant === "prestige" ? "✨ MAX" : "✓ MAX";

  return (
    <>
      <motion.button
        ref={cardRef}
        onClick={() => canBuy && onClick()}
        className={`
          group relative p-2.5 sm:p-3 rounded-xl border-2 transition-all
          min-w-[95px] sm:min-w-[110px] backdrop-blur-sm
          ${getCardStyles()}
          ${canBuy ? "cursor-pointer" : isMaxed ? "cursor-default" : "cursor-not-allowed opacity-70"}
        `}
        whileHover={canBuy ? { scale: 1.05, y: -2 } : { scale: 1.02 }}
        whileTap={canBuy ? { scale: 0.95 } : {}}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onTouchStart={showTooltip}
        onTouchEnd={() => setTimeout(hideTooltip, 2000)}
      >
        {/* Badge de quantidade */}
        {owned > 0 && (
          <div
            className={`
            absolute -top-2 -right-2 text-white text-xs font-bold 
            w-6 h-6 rounded-full flex items-center justify-center shadow-lg
            ${getBadgeStyles()}
          `}
          >
            {isMaxed ? (visualStage === "void" ? "∅" : "✓") : owned}
          </div>
        )}

        {/* Emoji */}
        <motion.div
          className={`text-3xl sm:text-4xl mb-1 ${isSecret && !isMaxed ? "blur-sm" : ""}`}
          animate={
            isSecret && canBuy && !isMaxed
              ? { scale: [1, 1.1, 1] }
              : visualStage === "abyss"
                ? { rotate: [0, 5, -5, 0] }
                : visualStage === "void"
                  ? { opacity: [0.5, 1, 0.5] }
                  : undefined
          }
          transition={{ duration: 2, repeat: Infinity }}
        >
          {emoji}
        </motion.div>

        {/* Nome - fonte maior e mais legível */}
        <p className="font-bold text-sm sm:text-base truncate text-white drop-shadow-md">
          {isSecret && !isMaxed ? "???" : name}
        </p>

        {/* Info extra (multiplicador) - se houver */}
        {extraInfo && (
          <p className="text-[11px] sm:text-xs text-blue-200 truncate font-medium">
            {extraInfo}
          </p>
        )}

        {/* Preço - mais destacado */}
        <p
          className={`text-sm sm:text-base font-bold mt-0.5 ${
            isMaxed ? "text-green-300" : "text-yellow-300 drop-shadow-md"
          }`}
        >
          {isMaxed ? maxedText : `${priceIcon} ${price}`}
        </p>
      </motion.button>

      {/* Tooltip usando Portal para renderizar no body */}
      {tooltipPos &&
        createPortal(
          <div
            className="fixed z-[99999] pointer-events-none flex flex-col items-center"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 12,
              transform: "translate(-50%, -100%)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border-2 border-gray-600 rounded-xl shadow-2xl px-4 py-3 min-w-[180px] max-w-[260px] text-left"
            >
              {/* Nome */}
              <p
                className={`font-bold text-sm mb-1 ${
                  variant === "prestige"
                    ? "text-purple-300"
                    : isSecret
                      ? "text-pink-300"
                      : "text-yellow-300"
                }`}
              >
                {isSecret && !isMaxed ? "??? Segredo ???" : name}
              </p>

              {/* Descrição */}
              <p className="text-gray-200 text-xs leading-relaxed">
                {description}
              </p>

              {/* Info extra (multiplicador) */}
              {extraInfo && (
                <p className="text-blue-300 text-xs font-semibold mt-2">
                  📊 {extraInfo}
                </p>
              )}

              {/* Status de compra */}
              <div
                className={`text-xs font-medium mt-2 pt-2 border-t border-gray-700 ${
                  isMaxed
                    ? "text-green-400"
                    : canBuy
                      ? "text-green-400"
                      : "text-red-400"
                }`}
              >
                {isMaxed
                  ? "✓ Upgrade maximizado!"
                  : canBuy
                    ? "✓ Pode comprar!"
                    : "✗ Recursos insuficientes"}
              </div>
            </motion.div>

            {/* Seta do tooltip apontando para baixo */}
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900" />
          </div>,
          document.body,
        )}
    </>
  );
}

export default UpgradeCard;
