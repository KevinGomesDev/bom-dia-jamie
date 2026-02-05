import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import UpgradeCard from "./UpgradeCard";

export interface PrestigeUpgrade {
  id: string;
  name: string;
  description: string;
  emoji: string;
  baseCost: number;
  costMultiplier: number;
  effect:
    | "clickMultiplier"
    | "passiveMultiplier"
    | "xpMultiplier"
    | "offlineMultiplier";
  effectValue: number;
  owned: number;
  maxOwned?: number;
}

interface PrestigeShopProps {
  prestigePoints: number;
  prestigeUpgrades: PrestigeUpgrade[];
  potentialPrestigeGain: number;
  totalPrestiges: number;
  onPrestige: () => void;
  onBuyPrestigeUpgrade: (upgradeId: string) => void;
  visualStage?: "happy" | "melancholy" | "cloudy" | "storm" | "abyss" | "void";
}

function PrestigeShop({
  prestigePoints,
  prestigeUpgrades,
  potentialPrestigeGain,
  totalPrestiges,
  onPrestige,
  onBuyPrestigeUpgrade,
  visualStage = "happy",
}: PrestigeShopProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const getUpgradeCost = (upgrade: PrestigeUpgrade): number => {
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

  const getMultiplierDisplay = (upgrade: PrestigeUpgrade): string => {
    const current = 1 + upgrade.effectValue * upgrade.owned;
    const next = 1 + upgrade.effectValue * (upgrade.owned + 1);
    return `${current.toFixed(1)}x → ${next.toFixed(1)}x`;
  };

  const isDark =
    visualStage === "void" ||
    visualStage === "abyss" ||
    visualStage === "storm";

  return (
    <div className="space-y-3">
      {/* Header com pontos + botão de prestígio */}
      <div
        className={`flex items-center justify-between gap-4 p-3 rounded-xl ${
          isDark
            ? "bg-purple-900/60 border-2 border-purple-500/50"
            : "bg-purple-600/50 border-2 border-purple-400/50"
        }`}
      >
        {/* Pontos de Prestígio */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">⭐</span>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
              {formatNumber(prestigePoints)}
            </p>
            <p className="text-xs sm:text-sm text-purple-200">
              {totalPrestiges > 0
                ? `${totalPrestiges} resets`
                : "Pontos de Prestígio"}
            </p>
          </div>
        </div>

        {/* Botão de Prestígio */}
        {potentialPrestigeGain >= 1 ? (
          <motion.button
            onClick={() => setShowConfirmation(true)}
            className="px-4 py-2 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 
              bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 
              text-white shadow-lg shadow-purple-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🌟 Renascer</span>
            <span className="bg-white/20 px-2 py-1 rounded-lg text-sm font-bold">
              +{formatNumber(potentialPrestigeGain)} ⭐
            </span>
          </motion.button>
        ) : (
          <div className="text-xs sm:text-sm text-right text-purple-300 bg-purple-900/40 px-3 py-2 rounded-lg">
            <p className="font-semibold">Mínimo: 1M luas</p>
            <p className="text-purple-400">para prestigiar</p>
          </div>
        )}
      </div>

      {/* Modal de confirmação */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="p-6 rounded-2xl max-w-sm w-full bg-gray-900 border-2 border-purple-500 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-center text-purple-300 mb-4">
                ⚠️ Confirmar Prestígio
              </h3>
              <p className="text-gray-200 text-center mb-4 font-medium">
                Você irá perder:
              </p>
              <ul className="text-red-400 text-sm mb-4 space-y-1.5 bg-red-900/30 p-3 rounded-lg">
                <li>❌ Todas as suas luas</li>
                <li>❌ Todos os upgrades normais</li>
                <li>❌ Seu nível e XP</li>
              </ul>
              <p className="text-gray-200 text-center mb-4 font-medium">
                Você irá ganhar:
              </p>
              <p className="text-3xl font-bold text-center text-yellow-300 mb-4 bg-yellow-900/30 py-3 rounded-lg">
                +{formatNumber(potentialPrestigeGain)} ⭐
              </p>
              <p className="text-green-400 text-sm text-center mb-4 font-medium">
                ✓ Upgrades de prestígio são permanentes!
              </p>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold"
                  whileTap={{ scale: 0.95 }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  onClick={() => {
                    onPrestige();
                    setShowConfirmation(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg"
                  whileTap={{ scale: 0.95 }}
                >
                  ✨ Confirmar!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrades de Prestígio */}
      <div>
        <p className="text-center text-sm font-semibold mb-2 text-purple-200">
          🔮 Bênçãos Eternas
        </p>
        <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
          {prestigeUpgrades.map((upgrade) => {
            const cost = getUpgradeCost(upgrade);
            const canAfford = prestigePoints >= cost;
            const isMaxed =
              upgrade.maxOwned !== undefined &&
              upgrade.owned >= upgrade.maxOwned;

            return (
              <UpgradeCard
                key={upgrade.id}
                emoji={upgrade.emoji}
                name={upgrade.name}
                description={upgrade.description}
                price={formatNumber(cost)}
                priceIcon="⭐"
                owned={upgrade.owned}
                canBuy={canAfford && !isMaxed}
                isMaxed={isMaxed}
                visualStage={visualStage}
                variant="prestige"
                extraInfo={getMultiplierDisplay(upgrade)}
                onClick={() => onBuyPrestigeUpgrade(upgrade.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PrestigeShop;
