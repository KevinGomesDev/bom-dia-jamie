import { motion } from "framer-motion";

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  emoji: string;
  baseCost: number;
  costMultiplier: number;
  effect: "clickPower" | "autoSuns" | "secret";
  effectValue: number;
  owned: number;
  maxOwned?: number;
  isSecret?: boolean;
}

interface UpgradeShopProps {
  upgrades: Upgrade[];
  suns: number;
  onBuyUpgrade: (upgradeId: string) => void;
  visualStage?: "happy" | "melancholy" | "cloudy" | "storm" | "abyss" | "void";
}

function UpgradeShop({
  upgrades,
  suns,
  onBuyUpgrade,
  visualStage = "happy",
}: UpgradeShopProps) {
  const getUpgradeCost = (upgrade: Upgrade): number => {
    if (upgrade.maxOwned !== undefined && upgrade.owned >= upgrade.maxOwned) {
      return upgrade.baseCost;
    }
    return Math.floor(
      upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned),
    );
  };

  const formatNumber = (num: number): string => {
    if (!Number.isFinite(num) || Number.isNaN(num)) return "0";
    if (num < 0) return "0";
    if (num >= 1e15) return (num / 1e15).toFixed(1) + "Qa";
    if (num >= 1e12) return (num / 1e12).toFixed(1) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return Math.floor(num).toString();
  };

  // Estilos baseados no estágio visual
  const getStyles = () => {
    switch (visualStage) {
      case "happy":
        return {
          canBuy: "bg-white/20 border-yellow-400 hover:bg-white/30",
          cantBuy: "bg-white/10 border-white/20 opacity-60",
          maxed: "bg-green-500/20 border-green-400",
          text: "text-white",
          priceText: "text-yellow-300",
          priceIcon: "🌙",
        };
      case "melancholy":
        return {
          canBuy: "bg-gray-300/20 border-gray-400 hover:bg-gray-300/30",
          cantBuy: "bg-gray-400/10 border-gray-500/20 opacity-60",
          maxed: "bg-gray-500/20 border-gray-400",
          text: "text-gray-200",
          priceText: "text-gray-300",
          priceIcon: "😔",
        };
      case "cloudy":
        return {
          canBuy: "bg-gray-500/30 border-blue-400 hover:bg-gray-500/40",
          cantBuy: "bg-gray-600/20 border-gray-500/30 opacity-60",
          maxed: "bg-blue-500/20 border-blue-400",
          text: "text-gray-300",
          priceText: "text-blue-300",
          priceIcon: "💧",
        };
      case "storm":
        return {
          canBuy: "bg-purple-900/40 border-purple-400 hover:bg-purple-800/50",
          cantBuy: "bg-gray-800/30 border-gray-600/30 opacity-60",
          maxed: "bg-purple-600/30 border-purple-400",
          text: "text-gray-200",
          priceText: "text-purple-300",
          priceIcon: "⚡",
        };
      case "abyss":
        return {
          canBuy: "bg-red-900/40 border-red-500 hover:bg-red-800/50",
          cantBuy: "bg-gray-900/40 border-gray-700/30 opacity-60",
          maxed: "bg-red-800/30 border-red-500",
          text: "text-red-200",
          priceText: "text-red-300",
          priceIcon: "💀",
        };
      case "void":
        return {
          canBuy: "bg-black/60 border-gray-700 hover:bg-gray-900/70",
          cantBuy: "bg-black/40 border-black/50 opacity-50",
          maxed: "bg-gray-900/50 border-gray-700",
          text: "text-gray-500",
          priceText: "text-gray-400",
          priceIcon: "🕳️",
        };
      default:
        return {
          canBuy: "bg-white/20 border-yellow-400 hover:bg-white/30",
          cantBuy: "bg-white/10 border-white/20 opacity-60",
          maxed: "bg-green-500/20 border-green-400",
          text: "text-white",
          priceText: "text-yellow-300",
          priceIcon: "🌙",
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex gap-2 justify-center flex-wrap"
    >
      {upgrades.map((upgrade) => {
        const cost = getUpgradeCost(upgrade);
        const canAfford = suns >= cost;
        const isMaxed =
          upgrade.maxOwned !== undefined && upgrade.owned >= upgrade.maxOwned;
        const canBuy = canAfford && !isMaxed;

        return (
          <motion.button
            key={upgrade.id}
            onClick={() => canBuy && onBuyUpgrade(upgrade.id)}
            className={`
              group relative p-2 sm:p-3 rounded-xl border-2 transition-all min-w-[80px] sm:min-w-[100px]
              ${
                upgrade.isSecret
                  ? isMaxed
                    ? "bg-gradient-to-br from-purple-600/40 to-pink-600/40 border-purple-400 shadow-lg shadow-purple-500/30"
                    : canAfford
                      ? "bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500 hover:border-pink-400 cursor-pointer animate-pulse"
                      : "bg-gray-900/50 border-gray-600 opacity-70 cursor-not-allowed"
                  : canBuy
                    ? `${styles.canBuy} cursor-pointer`
                    : isMaxed
                      ? `${styles.maxed} cursor-default`
                      : `${styles.cantBuy} cursor-not-allowed`
              }
            `}
            whileHover={canBuy ? { scale: 1.05 } : {}}
            whileTap={canBuy ? { scale: 0.95 } : {}}
          >
            {/* Tooltip de descrição */}
            <div
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg ${
                visualStage === "abyss" || visualStage === "void"
                  ? "bg-black/95 text-gray-300"
                  : "bg-gray-900/95 text-white"
              }`}
            >
              <div
                className={`font-bold mb-1 ${
                  visualStage === "abyss"
                    ? "text-red-400"
                    : visualStage === "void"
                      ? "text-gray-400"
                      : "text-yellow-300"
                }`}
              >
                {upgrade.name}
              </div>
              <div>{upgrade.description}</div>
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent ${
                  visualStage === "abyss" || visualStage === "void"
                    ? "border-t-black/95"
                    : "border-t-gray-900/95"
                }`}
              ></div>
            </div>

            {/* Badge de quantidade */}
            {upgrade.owned > 0 && (
              <div
                className={`absolute -top-1.5 -right-1.5 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                  isMaxed
                    ? visualStage === "void"
                      ? "bg-gray-700"
                      : "bg-green-500"
                    : upgrade.isSecret
                      ? "bg-purple-500"
                      : visualStage === "abyss"
                        ? "bg-red-600"
                        : visualStage === "void"
                          ? "bg-gray-600"
                          : "bg-purple-500"
                }`}
              >
                {isMaxed ? (visualStage === "void" ? "∅" : "✓") : upgrade.owned}
              </div>
            )}

            <motion.div
              className={`text-2xl sm:text-3xl mb-1 ${upgrade.isSecret ? "animate-bounce" : ""}`}
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
              {upgrade.emoji}
            </motion.div>
            <p
              className={`font-medium text-xs sm:text-sm truncate ${
                upgrade.isSecret ? "text-purple-200" : styles.text
              }`}
            >
              {upgrade.isSecret ? "???" : upgrade.name}
            </p>
            <p
              className={`text-xs font-bold ${
                upgrade.isSecret ? "text-pink-300" : styles.priceText
              }`}
            >
              {isMaxed
                ? visualStage === "void"
                  ? "∅ Absorvido"
                  : "✨ Comprado!"
                : `${styles.priceIcon} ${formatNumber(cost)}`}
            </p>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export default UpgradeShop;
