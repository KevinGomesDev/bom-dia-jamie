import { motion } from "framer-motion";
import UpgradeCard from "./UpgradeCard";

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

  // Ícone de preço baseado no estágio
  const getPriceIcon = () => {
    switch (visualStage) {
      case "happy":
        return "🌙";
      case "melancholy":
        return "😔";
      case "cloudy":
        return "💧";
      case "storm":
        return "⚡";
      case "abyss":
        return "💀";
      case "void":
        return "🕳️";
      default:
        return "🌙";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex gap-2 sm:gap-3 justify-center flex-wrap"
    >
      {upgrades.map((upgrade) => {
        const cost = getUpgradeCost(upgrade);
        const canAfford = suns >= cost;
        const isMaxed =
          upgrade.maxOwned !== undefined && upgrade.owned >= upgrade.maxOwned;

        return (
          <UpgradeCard
            key={upgrade.id}
            emoji={upgrade.emoji}
            name={upgrade.name}
            description={upgrade.description}
            price={formatNumber(cost)}
            priceIcon={getPriceIcon()}
            owned={upgrade.owned}
            canBuy={canAfford && !isMaxed}
            isMaxed={isMaxed}
            isSecret={upgrade.isSecret}
            visualStage={visualStage}
            variant="normal"
            onClick={() => onBuyUpgrade(upgrade.id)}
          />
        );
      })}
    </motion.div>
  );
}

export default UpgradeShop;
