import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
  totalPrestigePoints: number;
  prestigeUpgrades: PrestigeUpgrade[];
  currentSuns: number;
  onPrestige: () => void;
  onBuyPrestigeUpgrade: (upgradeId: string) => void;
  calculatePrestigeGain: (suns: number) => number;
  visualStage?: "happy" | "melancholy" | "cloudy" | "storm" | "abyss" | "void";
}

function PrestigeShop({
  prestigePoints,
  totalPrestigePoints,
  prestigeUpgrades,
  currentSuns,
  onPrestige,
  onBuyPrestigeUpgrade,
  calculatePrestigeGain,
  visualStage = "happy",
}: PrestigeShopProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const prestigeGain = calculatePrestigeGain(currentSuns);

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

  // Estilos para tema sombrio
  const isDark =
    visualStage === "void" ||
    visualStage === "abyss" ||
    visualStage === "storm";

  return (
    <div className="space-y-3">
      {/* Cabeçalho com pontos de prestígio */}
      <div
        className={`text-center p-3 rounded-xl ${isDark ? "bg-purple-900/40 border border-purple-500/30" : "bg-purple-500/20 border border-purple-300/30"}`}
      >
        <p
          className={`text-xs ${isDark ? "text-purple-300" : "text-purple-200"}`}
        >
          ⭐ Pontos de Prestígio
        </p>
        <p
          className={`text-2xl font-bold ${isDark ? "text-purple-200" : "text-purple-100"}`}
        >
          {formatNumber(prestigePoints)} ⭐
        </p>
        <p
          className={`text-xs ${isDark ? "text-purple-400" : "text-purple-300"}`}
        >
          Total ganho: {formatNumber(totalPrestigePoints)}
        </p>
      </div>

      {/* Botão de Prestígio */}
      <motion.div
        className={`p-4 rounded-xl border-2 ${
          prestigeGain >= 1
            ? isDark
              ? "bg-gradient-to-r from-purple-900/60 to-pink-900/60 border-purple-400"
              : "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-400"
            : "bg-gray-500/20 border-gray-500/30 opacity-60"
        }`}
      >
        <div className="text-center">
          <p
            className={`text-lg font-bold ${isDark ? "text-purple-200" : "text-purple-100"}`}
          >
            🌟 Renascer das Trevas 🌟
          </p>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-300"} mt-1`}
          >
            Resete seu progresso para ganhar pontos de prestígio
          </p>

          {prestigeGain >= 1 ? (
            <>
              <p
                className={`text-xl font-bold mt-2 ${isDark ? "text-yellow-300" : "text-yellow-200"}`}
              >
                +{formatNumber(prestigeGain)} ⭐
              </p>
              <motion.button
                onClick={() => setShowConfirmation(true)}
                className={`mt-3 px-6 py-2 rounded-full font-bold ${
                  isDark
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400"
                } text-white`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ⚡ Fazer Prestígio
              </motion.button>
            </>
          ) : (
            <p
              className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Precisa de mais luas para fazer prestígio
              <br />
              <span className="text-xs">(Mínimo: 10.000 luas)</span>
            </p>
          )}
        </div>
      </motion.div>

      {/* Modal de confirmação */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`p-6 rounded-2xl max-w-sm w-full ${
                isDark
                  ? "bg-gray-900 border border-purple-500"
                  : "bg-gray-800 border border-purple-400"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-center text-purple-300 mb-4">
                ⚠️ Confirmar Prestígio
              </h3>
              <p className="text-gray-300 text-center mb-4">Você irá perder:</p>
              <ul className="text-red-400 text-sm mb-4 space-y-1">
                <li>❌ Todas as suas luas</li>
                <li>❌ Todos os upgrades normais</li>
                <li>❌ Seu nível e XP</li>
              </ul>
              <p className="text-gray-300 text-center mb-4">Você irá ganhar:</p>
              <p className="text-2xl font-bold text-center text-yellow-300 mb-4">
                +{formatNumber(prestigeGain)} ⭐
              </p>
              <p className="text-gray-400 text-xs text-center mb-4">
                Upgrades de prestígio são permanentes!
              </p>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                  whileTap={{ scale: 0.95 }}
                >
                  Cancelar
                </motion.button>
                <motion.button
                  onClick={() => {
                    onPrestige();
                    setShowConfirmation(false);
                  }}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold"
                  whileTap={{ scale: 0.95 }}
                >
                  Confirmar!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrades de Prestígio */}
      <div className="space-y-2">
        <p
          className={`text-center text-xs ${isDark ? "text-purple-400" : "text-purple-300"}`}
        >
          🔮 Bênçãos Eternas
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          {prestigeUpgrades.map((upgrade) => {
            const cost = getUpgradeCost(upgrade);
            const canAfford = prestigePoints >= cost;
            const isMaxed =
              upgrade.maxOwned !== undefined &&
              upgrade.owned >= upgrade.maxOwned;
            const canBuy = canAfford && !isMaxed;

            return (
              <motion.button
                key={upgrade.id}
                onClick={() => canBuy && onBuyPrestigeUpgrade(upgrade.id)}
                disabled={!canBuy}
                className={`
                  group relative p-2 sm:p-3 rounded-xl border-2 transition-all min-w-[90px] sm:min-w-[110px]
                  ${
                    isMaxed
                      ? "bg-purple-500/30 border-purple-400"
                      : canBuy
                        ? isDark
                          ? "bg-purple-900/50 border-purple-400 hover:bg-purple-800/60"
                          : "bg-purple-500/30 border-purple-300 hover:bg-purple-500/40"
                        : "bg-gray-800/30 border-gray-600/30 opacity-60"
                  }
                `}
                whileHover={canBuy ? { scale: 1.05 } : {}}
                whileTap={canBuy ? { scale: 0.95 } : {}}
              >
                {/* Badge de quantidade */}
                {upgrade.owned > 0 && (
                  <div
                    className={`absolute -top-1.5 -right-1.5 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                      isMaxed ? "bg-green-500" : "bg-purple-500"
                    }`}
                  >
                    {isMaxed ? "✓" : upgrade.owned}
                  </div>
                )}

                <div className="text-2xl sm:text-3xl mb-1">{upgrade.emoji}</div>
                <p className="font-medium text-xs sm:text-sm truncate text-purple-200">
                  {upgrade.name}
                </p>
                <p className="text-[10px] text-purple-300/80 truncate">
                  {getMultiplierDisplay(upgrade)}
                </p>
                <p className="text-xs font-bold text-yellow-300">
                  {isMaxed ? "✨ MAX" : `⭐ ${formatNumber(cost)}`}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PrestigeShop;
