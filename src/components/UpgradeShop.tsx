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
  maxOwned?: number; // Se definido, limita quantas vezes pode ser comprado
  isSecret?: boolean; // Se é um upgrade secreto
}

interface UpgradeShopProps {
  upgrades: Upgrade[];
  suns: number;
  onBuyUpgrade: (upgradeId: string) => void;
}

function UpgradeShop({ upgrades, suns, onBuyUpgrade }: UpgradeShopProps) {
  const getUpgradeCost = (upgrade: Upgrade): number => {
    // Se já atingiu o máximo, retorna o custo base (não importa, não pode comprar)
    if (upgrade.maxOwned !== undefined && upgrade.owned >= upgrade.maxOwned) {
      return upgrade.baseCost;
    }
    return Math.floor(
      upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned),
    );
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return Math.floor(num).toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
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
                    ? "bg-white/20 border-yellow-400 hover:bg-white/30 cursor-pointer"
                    : isMaxed
                      ? "bg-green-500/20 border-green-400 cursor-default"
                      : "bg-white/10 border-white/20 opacity-60 cursor-not-allowed"
              }
            `}
            whileHover={canBuy ? { scale: 1.05 } : {}}
            whileTap={canBuy ? { scale: 0.95 } : {}}
          >
            {/* Tooltip de descrição */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900/95 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
              <div className="font-bold text-yellow-300 mb-1">
                {upgrade.name}
              </div>
              <div>{upgrade.description}</div>
              {/* Seta do tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"></div>
            </div>

            {/* Badge de quantidade */}
            {upgrade.owned > 0 && (
              <div
                className={`absolute -top-1.5 -right-1.5 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                  isMaxed
                    ? "bg-green-500"
                    : upgrade.isSecret
                      ? "bg-purple-500"
                      : "bg-purple-500"
                }`}
              >
                {isMaxed ? "✓" : upgrade.owned}
              </div>
            )}

            <div
              className={`text-2xl sm:text-3xl mb-1 ${upgrade.isSecret ? "animate-bounce" : ""}`}
            >
              {upgrade.emoji}
            </div>
            <p
              className={`font-medium text-xs sm:text-sm truncate ${upgrade.isSecret ? "text-purple-200" : "text-white"}`}
            >
              {upgrade.isSecret ? "???" : upgrade.name}
            </p>
            <p
              className={`text-xs font-bold ${upgrade.isSecret ? "text-pink-300" : "text-yellow-300"}`}
            >
              {isMaxed ? "✨ Comprado!" : `☀️ ${formatNumber(cost)}`}
            </p>
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export default UpgradeShop;
