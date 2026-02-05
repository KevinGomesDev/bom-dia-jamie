import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import JamieAvatar from "./components/JamieAvatar";
import FloatingEmojis from "./components/FloatingEmojis";
import FunnyMessages from "./components/FunnyMessages";
import GameStats from "./components/GameStats";
import UpgradeShop, { Upgrade } from "./components/UpgradeShop";
import PrestigeShop, { PrestigeUpgrade } from "./components/PrestigeShop";
import VisualElements from "./components/VisualElements";
import UpgradeElements from "./components/UpgradeElements";

// Chave secreta para hash (do .env)
const GAME_SECRET = import.meta.env.VITE_GAME_SECRET || "fallback_secret_key";

// Versão do save - saves anteriores a esta versão serão resetados
const SAVE_VERSION = 4; // Atualizado para novo balanceamento
const MIN_SAVE_DATE = new Date("2026-02-05T00:00:00").getTime();

// Interface para o estado salvo
interface GameState {
  suns: number;
  level: number;
  currentXP: number;
  clickCount: number;
  upgrades: { id: string; owned: number }[];
  lastSaveTime: number;
  saveVersion?: number;
  // Novos campos de prestígio
  prestigePoints?: number;
  totalPrestigePoints?: number;
  prestigeUpgrades?: { id: string; owned: number }[];
  totalPrestiges?: number;
}

// Função para criar hash simples do estado do jogo
const createGameHash = (state: GameState): string => {
  const dataString = JSON.stringify({
    suns: Math.floor(state.suns * 1000) / 1000,
    level: state.level,
    currentXP: state.currentXP,
    clickCount: state.clickCount,
    upgrades: state.upgrades,
    lastSaveTime: state.lastSaveTime,
    saveVersion: state.saveVersion || 1,
    // Incluir prestígio no hash
    prestigePoints: state.prestigePoints || 0,
    totalPrestigePoints: state.totalPrestigePoints || 0,
    prestigeUpgrades: state.prestigeUpgrades || [],
    totalPrestiges: state.totalPrestiges || 0,
  });

  // Hash simples mas eficaz usando a chave secreta
  let hash = 0;
  const combined = dataString + GAME_SECRET;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
};

// Função para verificar se o hash é válido
const verifyGameHash = (state: GameState, hash: string): boolean => {
  return createGameHash(state) === hash;
};

// Função para salvar o jogo
const saveGame = (state: GameState): void => {
  const stateWithVersion = { ...state, saveVersion: SAVE_VERSION };
  const hash = createGameHash(stateWithVersion);
  localStorage.setItem("bomDiaJamie_save", JSON.stringify(stateWithVersion));
  localStorage.setItem("bomDiaJamie_hash", hash);
};

// Função para carregar o jogo
const loadGame = (): GameState | null => {
  try {
    const savedData = localStorage.getItem("bomDiaJamie_save");
    const savedHash = localStorage.getItem("bomDiaJamie_hash");

    if (!savedData || !savedHash) return null;

    const state: GameState = JSON.parse(savedData);

    // Verificar se o save é muito antigo (antes da atualização do tema sombrio)
    if (
      state.lastSaveTime < MIN_SAVE_DATE ||
      !state.saveVersion ||
      state.saveVersion < SAVE_VERSION
    ) {
      console.warn(
        "🌑 Save antigo detectado! O jogo foi atualizado. Iniciando novo jogo...",
      );
      localStorage.removeItem("bomDiaJamie_save");
      localStorage.removeItem("bomDiaJamie_hash");
      return null;
    }

    // Verificar hash anti-trapaça
    if (!verifyGameHash(state, savedHash)) {
      console.warn("🚨 Save corrompido ou modificado! Iniciando jogo novo.");
      localStorage.removeItem("bomDiaJamie_save");
      localStorage.removeItem("bomDiaJamie_hash");
      return null;
    }

    return state;
  } catch {
    return null;
  }
};

const INITIAL_UPGRADES: Upgrade[] = [
  {
    id: "coffee",
    name: "Café Frio",
    description: "+1 lua por clique",
    emoji: "🥶",
    baseCost: 10,
    costMultiplier: 1.12,
    effect: "clickPower",
    effectValue: 1,
    owned: 0,
  },
  {
    id: "alarm",
    name: "Insônia",
    description: "+0.5 luas/segundo",
    emoji: "😵",
    baseCost: 50,
    costMultiplier: 1.12,
    effect: "autoSuns",
    effectValue: 0.5,
    owned: 0,
  },
  {
    id: "breakfast",
    name: "Pão Mofado",
    description: "+5 luas por clique",
    emoji: "🍞",
    baseCost: 200,
    costMultiplier: 1.14,
    effect: "clickPower",
    effectValue: 5,
    owned: 0,
  },
  {
    id: "music",
    name: "Playlist Triste",
    description: "+3 luas/segundo",
    emoji: "🎻",
    baseCost: 1000,
    costMultiplier: 1.14,
    effect: "autoSuns",
    effectValue: 3,
    owned: 0,
  },
  {
    id: "pet",
    name: "Gato Preto",
    description: "+25 luas por clique",
    emoji: "🐈‍⬛",
    baseCost: 5000,
    costMultiplier: 1.15,
    effect: "clickPower",
    effectValue: 25,
    owned: 0,
  },
  {
    id: "darkness",
    name: "Escuridão",
    description: "+15 luas/segundo",
    emoji: "🌑",
    baseCost: 25000,
    costMultiplier: 1.15,
    effect: "autoSuns",
    effectValue: 15,
    owned: 0,
  },
  {
    id: "nightmare",
    name: "Pesadelo Eterno",
    description: "+100 luas por clique",
    emoji: "👁️",
    baseCost: 150000,
    costMultiplier: 1.12,
    effect: "clickPower",
    effectValue: 100,
    owned: 0,
  },
  {
    id: "abyss",
    name: "Abraço do Abismo",
    description: "+80 luas/segundo",
    emoji: "🕳️",
    baseCost: 500000,
    costMultiplier: 1.12,
    effect: "autoSuns",
    effectValue: 80,
    owned: 0,
  },
  {
    id: "secret",
    name: "O Vazio Eterno",
    description: "Algo terrível acontece...",
    emoji: "💀",
    baseCost: 10000000,
    costMultiplier: 1,
    effect: "secret",
    effectValue: 0,
    owned: 0,
    maxOwned: 1,
    isSecret: true,
  },
];

// Upgrades de Prestígio (permanentes)
const INITIAL_PRESTIGE_UPGRADES: PrestigeUpgrade[] = [
  {
    id: "prestige_click_1",
    name: "Toque Sombrio",
    emoji: "👆",
    description: "Multiplicador de clique +0.5x",
    baseCost: 1,
    costMultiplier: 1.8,
    effect: "clickMultiplier",
    effectValue: 0.5,
    owned: 0,
  },
  {
    id: "prestige_passive_1",
    name: "Sussurros Noturnos",
    emoji: "🌙",
    description: "Multiplicador passivo +0.5x",
    baseCost: 1,
    costMultiplier: 1.8,
    effect: "passiveMultiplier",
    effectValue: 0.5,
    owned: 0,
  },
  {
    id: "prestige_click_2",
    name: "Garra do Abismo",
    emoji: "🦇",
    description: "Multiplicador de clique +1.0x",
    baseCost: 3,
    costMultiplier: 2,
    effect: "clickMultiplier",
    effectValue: 1.0,
    owned: 0,
  },
  {
    id: "prestige_passive_2",
    name: "Eco da Escuridão",
    emoji: "🕯️",
    description: "Multiplicador passivo +1.0x",
    baseCost: 3,
    costMultiplier: 2,
    effect: "passiveMultiplier",
    effectValue: 1.0,
    owned: 0,
  },
  {
    id: "prestige_xp_1",
    name: "Sabedoria Antiga",
    emoji: "📜",
    description: "Multiplicador de XP +0.5x",
    baseCost: 5,
    costMultiplier: 2.5,
    effect: "xpMultiplier",
    effectValue: 0.5,
    owned: 0,
  },
  {
    id: "prestige_start_1",
    name: "Herança Sombria",
    emoji: "🎁",
    description: "Começa com +500 luas após reset",
    baseCost: 2,
    costMultiplier: 3,
    effect: "startBonus",
    effectValue: 500,
    owned: 0,
    maxOwned: 5,
  },
  {
    id: "prestige_click_3",
    name: "Fúria do Vazio",
    emoji: "💀",
    description: "Multiplicador de clique +2.0x",
    baseCost: 10,
    costMultiplier: 2.5,
    effect: "clickMultiplier",
    effectValue: 2.0,
    owned: 0,
  },
  {
    id: "prestige_passive_3",
    name: "Poder Eterno",
    emoji: "🔮",
    description: "Multiplicador passivo +2.0x",
    baseCost: 10,
    costMultiplier: 2.5,
    effect: "passiveMultiplier",
    effectValue: 2.0,
    owned: 0,
  },
];

function App() {
  // Carregar save existente
  const savedGame = useMemo(() => loadGame(), []);

  const [showConfetti, setShowConfetti] = useState(false);
  const [clickCount, setClickCount] = useState(savedGame?.clickCount ?? 0);
  const [suns, setSuns] = useState(savedGame?.suns ?? 0);
  const [level, setLevel] = useState(savedGame?.level ?? 0);
  const [currentXP, setCurrentXP] = useState(savedGame?.currentXP ?? 0);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
    if (!savedGame) return INITIAL_UPGRADES;
    // Restaurar owned dos upgrades salvos
    return INITIAL_UPGRADES.map((u) => {
      const saved = savedGame.upgrades.find((s) => s.id === u.id);
      return saved ? { ...u, owned: saved.owned } : u;
    });
  });
  const [floatingTexts, setFloatingTexts] = useState<
    {
      id: number;
      value: number | string;
      x: number;
      y: number;
      isLevelUp?: boolean;
    }[]
  >([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [offlineEarningsMessage, setOfflineEarningsMessage] = useState<
    string | null
  >(null);

  // Estados de Prestígio
  const [activeTab, setActiveTab] = useState<"upgrades" | "prestige">(
    "upgrades",
  );
  const [prestigePoints, setPrestigePoints] = useState(
    savedGame?.prestigePoints ?? 0,
  );
  const [totalPrestiges, setTotalPrestiges] = useState(
    savedGame?.totalPrestiges ?? 0,
  );
  const [prestigeUpgrades, setPrestigeUpgrades] = useState<PrestigeUpgrade[]>(
    () => {
      if (!savedGame?.prestigeUpgrades) return INITIAL_PRESTIGE_UPGRADES;
      return INITIAL_PRESTIGE_UPGRADES.map((u) => {
        const saved = savedGame.prestigeUpgrades?.find((s) => s.id === u.id);
        return saved ? { ...u, owned: saved.owned } : u;
      });
    },
  );

  // Ref para rastrear último tempo de save (para cálculo offline)
  const lastSaveTimeRef = useRef<number>(savedGame?.lastSaveTime ?? Date.now());

  // Calcular XP necessário para o próximo nível (crescimento exponencial)
  // Nível 1: 15, Nível 5: ~30, Nível 10: ~60, Nível 20: ~239
  const xpForNextLevel = Math.floor(15 * Math.pow(1.15, level));

  // Calcular recompensa de sóis ao subir de nível (escala melhor)
  // Níveis iniciais dão pouco, depois cresce mais significativamente
  const getLevelUpReward = (lvl: number): number => {
    return Math.floor(10 + lvl * 5 + Math.pow(lvl, 1.5));
  };

  // Calcular multiplicadores de prestígio
  const clickMultiplier =
    1 +
    prestigeUpgrades
      .filter((u) => u.effect === "clickMultiplier")
      .reduce((acc, u) => acc + u.effectValue * u.owned, 0);

  const passiveMultiplier =
    1 +
    prestigeUpgrades
      .filter((u) => u.effect === "passiveMultiplier")
      .reduce((acc, u) => acc + u.effectValue * u.owned, 0);

  const xpMultiplier =
    1 +
    prestigeUpgrades
      .filter((u) => u.effect === "xpMultiplier")
      .reduce((acc, u) => acc + u.effectValue * u.owned, 0);

  // Calcular stats baseado nos upgrades (com multiplicadores de prestígio)
  const baseClickPower =
    1 +
    upgrades
      .filter((u) => u.effect === "clickPower")
      .reduce((acc, u) => acc + u.effectValue * u.owned, 0);
  const sunsPerClick = Math.floor(baseClickPower * clickMultiplier);

  const basePassive = upgrades
    .filter((u) => u.effect === "autoSuns")
    .reduce((acc, u) => acc + u.effectValue * u.owned, 0);
  const sunsPerSecond = basePassive * passiveMultiplier;

  // Calcular potencial de prestígio (sqrt de suns / 100K - mais acessível)
  const potentialPrestigeGain = Math.floor(Math.sqrt(suns / 100000));

  // Calcular total de upgrades comprados
  const totalUpgrades = upgrades.reduce((acc, u) => acc + u.owned, 0);

  // Determinar o estágio visual baseado no progresso (INVERTIDO - cada vez mais sombrio)
  const visualStage = useMemo(() => {
    const progress = level + Math.floor(totalUpgrades / 2);
    if (progress >= 20) return "void"; // Vazio total
    if (progress >= 12) return "abyss"; // Abismo
    if (progress >= 7) return "storm"; // Tempestade
    if (progress >= 4) return "cloudy"; // Nublado
    if (progress >= 2) return "melancholy"; // Melancólico
    return "happy"; // Começa feliz
  }, [level, totalUpgrades]);

  // Classes de fundo baseadas no estágio
  const bgClass = useMemo(() => {
    switch (visualStage) {
      case "void":
        return "void-bg";
      case "abyss":
        return "abyss-bg";
      case "storm":
        return "storm-bg";
      case "cloudy":
        return "cloudy-bg";
      case "melancholy":
        return "melancholy-bg";
      default:
        return "happy-bg";
    }
  }, [visualStage]);

  // Determinar se deve mostrar elementos específicos
  const showClouds = level >= 2;
  const showFloatingEmojis = true;

  // Calcular e aplicar ganhos offline na primeira carga
  useEffect(() => {
    if (isLoaded) return;

    if (savedGame && sunsPerSecond > 0) {
      const now = Date.now();
      const elapsedSeconds = (now - savedGame.lastSaveTime) / 1000;

      // Limitar ganhos offline a no máximo 8 horas (28800 segundos)
      const maxOfflineSeconds = 8 * 60 * 60;
      const cappedSeconds = Math.min(elapsedSeconds, maxOfflineSeconds);

      if (cappedSeconds > 1) {
        const offlineEarnings = sunsPerSecond * cappedSeconds;
        setSuns((prev) => prev + offlineEarnings);

        // Mostrar mensagem de boas-vindas com ganhos offline
        const formatOffline = (num: number) => {
          if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B";
          if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
          if (num >= 1000) return (num / 1000).toFixed(1) + "K";
          return Math.floor(num).toString();
        };
        setOfflineEarningsMessage(
          `🌙 Bem-vinda de volta! +${formatOffline(offlineEarnings)} luas`,
        );
        setTimeout(() => setOfflineEarningsMessage(null), 5000);
      }
    }

    lastSaveTimeRef.current = Date.now();
    setIsLoaded(true);
  }, [isLoaded, savedGame, sunsPerSecond]);

  // Salvar jogo continuamente (a cada 1 segundo)
  useEffect(() => {
    if (!isLoaded) return;

    const saveInterval = setInterval(() => {
      const now = Date.now();
      const gameState: GameState = {
        suns,
        level,
        currentXP,
        clickCount,
        upgrades: upgrades.map((u) => ({ id: u.id, owned: u.owned })),
        lastSaveTime: now,
        prestigePoints,
        prestigeUpgrades: prestigeUpgrades.map((u) => ({
          id: u.id,
          owned: u.owned,
        })),
        totalPrestiges,
      };
      saveGame(gameState);
      lastSaveTimeRef.current = now;
    }, 1000);

    return () => clearInterval(saveInterval);
  }, [
    isLoaded,
    suns,
    level,
    currentXP,
    clickCount,
    upgrades,
    prestigePoints,
    prestigeUpgrades,
    totalPrestiges,
  ]);

  // Salvar ao fechar/sair da página
  useEffect(() => {
    const handleBeforeUnload = () => {
      const gameState: GameState = {
        suns,
        level,
        currentXP,
        clickCount,
        upgrades: upgrades.map((u) => ({ id: u.id, owned: u.owned })),
        lastSaveTime: Date.now(),
        prestigePoints,
        prestigeUpgrades: prestigeUpgrades.map((u) => ({
          id: u.id,
          owned: u.owned,
        })),
        totalPrestiges,
      };
      saveGame(gameState);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [
    suns,
    level,
    currentXP,
    clickCount,
    upgrades,
    prestigePoints,
    prestigeUpgrades,
    totalPrestiges,
  ]);

  // Detectar quando a aba fica visível/invisível e calcular ganhos
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Voltou para a aba - calcular ganhos offline
        const now = Date.now();
        const elapsedSeconds = (now - lastSaveTimeRef.current) / 1000;

        if (elapsedSeconds > 1 && sunsPerSecond > 0) {
          const offlineEarnings = sunsPerSecond * elapsedSeconds;
          setSuns((prev) => prev + offlineEarnings);
        }

        lastSaveTimeRef.current = now;
      } else {
        // Saiu da aba - salvar estado atual
        const gameState: GameState = {
          suns,
          level,
          currentXP,
          clickCount,
          upgrades: upgrades.map((u) => ({ id: u.id, owned: u.owned })),
          lastSaveTime: Date.now(),
          prestigePoints,
          prestigeUpgrades: prestigeUpgrades.map((u) => ({
            id: u.id,
            owned: u.owned,
          })),
          totalPrestiges,
        };
        saveGame(gameState);
        lastSaveTimeRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [
    suns,
    level,
    currentXP,
    clickCount,
    upgrades,
    sunsPerSecond,
    prestigePoints,
    prestigeUpgrades,
    totalPrestiges,
  ]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-geração de sóis (IDLE mechanic)
  useEffect(() => {
    if (sunsPerSecond <= 0) return;

    const interval = setInterval(() => {
      setSuns((prev) => prev + sunsPerSecond / 10);
    }, 100);

    return () => clearInterval(interval);
  }, [sunsPerSecond]);

  // Contador para IDs únicos de floating texts (evita colisão com Date.now em cliques rápidos)
  const floatingIdRef = useRef(0);

  const handleGreeting = useCallback(
    (e: React.MouseEvent) => {
      // Ignorar cliques em elementos interativos (botões de upgrade)
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("[data-no-click]")) {
        return;
      }

      // Adicionar sóis
      setSuns((prev) => prev + sunsPerClick);
      setClickCount((prev) => prev + 1);

      // Texto flutuante - limitar a 10 textos para performance
      // Usar ID incremental para evitar colisões em cliques rápidos
      const floatingId = ++floatingIdRef.current;
      const newFloating = {
        id: floatingId,
        value: sunsPerClick,
        x: e.clientX + (Math.random() - 0.5) * 50,
        y: e.clientY,
      };
      setFloatingTexts((prev) => {
        const updated = [...prev, newFloating];
        // Manter apenas os 10 textos mais recentes
        return updated.length > 10 ? updated.slice(-10) : updated;
      });
      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((t) => t.id !== floatingId));
      }, 1000);

      // Sistema de XP e Level Up - usar função de atualização para garantir consistência
      setCurrentXP((prevXP) => {
        const xpGain = Math.floor(1 * xpMultiplier);
        const newXP = prevXP + xpGain;
        if (newXP >= xpForNextLevel) {
          // Level Up! - agendar atualizações para evitar conflitos
          const reward = getLevelUpReward(level + 1);

          // Usar setTimeout para separar as atualizações de estado
          setTimeout(() => {
            setLevel((prev) => prev + 1);
            setSuns((prev) => prev + reward);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }, 0);

          // Texto flutuante de level up
          const levelUpId = ++floatingIdRef.current;
          const levelUpFloating = {
            id: levelUpId,
            value: `🎉 Nível ${level + 1}! +${reward} ☀️`,
            x: e.clientX,
            y: e.clientY - 30,
            isLevelUp: true,
          };
          setFloatingTexts((prev) => [...prev, levelUpFloating]);
          setTimeout(() => {
            setFloatingTexts((prev) => prev.filter((t) => t.id !== levelUpId));
          }, 2000);

          return 0; // Reset XP
        }
        return newXP;
      });
    },
    [sunsPerClick, xpForNextLevel, level, xpMultiplier],
  );

  const handleBuyUpgrade = useCallback(
    (upgradeId: string) => {
      // Usar setSuns com função para garantir atomicidade em cliques rápidos
      setSuns((currentSuns) => {
        // Buscar upgrade atual
        const upgrade = upgrades.find((u) => u.id === upgradeId);
        if (!upgrade) return currentSuns;

        // Anti-cheat: verificar se já atingiu o máximo permitido
        if (
          upgrade.maxOwned !== undefined &&
          upgrade.owned >= upgrade.maxOwned
        ) {
          return currentSuns;
        }

        const cost = Math.floor(
          upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned),
        );

        // Anti-cheat: verificar se tem sóis suficientes e se o custo é válido
        if (currentSuns < cost || cost <= 0 || !Number.isFinite(cost)) {
          return currentSuns;
        }

        // Anti-cheat: garantir que suns não vai negativo
        const newSuns = currentSuns - cost;
        if (newSuns < 0 || !Number.isFinite(newSuns)) return currentSuns;

        // Atualizar upgrades separadamente (após confirmar que tem saldo)
        setUpgrades((prev) =>
          prev.map((u) =>
            u.id === upgradeId ? { ...u, owned: u.owned + 1 } : u,
          ),
        );

        return newSuns;
      });
    },
    [upgrades],
  );

  // Função para fazer prestígio
  const handlePrestige = useCallback(() => {
    if (potentialPrestigeGain < 1) return;

    // Ganhar pontos de prestígio
    setPrestigePoints((prev) => prev + potentialPrestigeGain);
    setTotalPrestiges((prev) => prev + 1);

    // Calcular bônus inicial de prestígio (Herança Sombria)
    const startBonus = prestigeUpgrades
      .filter((u) => u.effect === "startBonus")
      .reduce((acc, u) => acc + u.effectValue * u.owned, 0);

    // Reset do progresso normal (com bônus inicial se houver)
    setSuns(startBonus);
    setLevel(0);
    setCurrentXP(0);
    setClickCount(0);
    setUpgrades(INITIAL_UPGRADES.map((u) => ({ ...u, owned: 0 })));

    // Mostrar confetti
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, [potentialPrestigeGain, prestigeUpgrades]);

  // Função para comprar upgrade de prestígio
  const handleBuyPrestigeUpgrade = useCallback(
    (upgradeId: string) => {
      setPrestigePoints((currentPoints) => {
        const upgrade = prestigeUpgrades.find((u) => u.id === upgradeId);
        if (!upgrade) return currentPoints;

        if (
          upgrade.maxOwned !== undefined &&
          upgrade.owned >= upgrade.maxOwned
        ) {
          return currentPoints;
        }

        const cost = Math.floor(
          upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned),
        );

        if (currentPoints < cost || cost <= 0) return currentPoints;

        const newPoints = currentPoints - cost;
        if (newPoints < 0) return currentPoints;

        setPrestigeUpgrades((prev) =>
          prev.map((u) =>
            u.id === upgradeId ? { ...u, owned: u.owned + 1 } : u,
          ),
        );

        return newPoints;
      });
    },
    [prestigeUpgrades],
  );

  return (
    <motion.div
      className={`h-screen relative overflow-hidden flex flex-col transition-all duration-1000 ${bgClass} cursor-pointer select-none`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={handleGreeting}
    >
      {/* Mensagem de ganhos offline */}
      <AnimatePresence>
        {offlineEarningsMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold px-6 py-3 rounded-full shadow-2xl"
          >
            {offlineEarningsMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={150}
          colors={["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"]}
        />
      )}

      {/* Elementos visuais dinâmicos */}
      <VisualElements
        level={level}
        totalUpgrades={totalUpgrades}
        windowWidth={windowSize.width}
      />

      {/* Elementos dos upgrades - CAOS TOTAL! */}
      <UpgradeElements
        upgrades={upgrades}
        windowWidth={windowSize.width}
        windowHeight={windowSize.height}
        visualStage={visualStage}
      />

      {/* Floating emojis (só aparecem após nível 2) */}
      {showFloatingEmojis && <FloatingEmojis visualStage={visualStage} />}

      {/* Nuvens decorativas (só aparecem após nível 3) */}
      {showClouds && (
        <>
          <motion.div
            className={`${visualStage === "storm" || visualStage === "abyss" || visualStage === "void" ? "cloud-dark" : "cloud"} absolute w-16 h-12 top-10 -left-20 opacity-80`}
            animate={{ x: [0, windowSize.width + 200] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className={`${visualStage === "storm" || visualStage === "abyss" || visualStage === "void" ? "cloud-dark" : "cloud"} absolute w-12 h-8 top-24 -left-20 opacity-60`}
            animate={{ x: [0, windowSize.width + 200] }}
            transition={{
              duration: 45,
              repeat: Infinity,
              ease: "linear",
              delay: 5,
            }}
          />
        </>
      )}

      <div className="container mx-auto px-2 sm:px-4 py-2 relative z-10 flex flex-col flex-1 justify-between max-w-4xl">
        {/* Stats do jogo */}
        <GameStats
          suns={suns}
          sunsPerSecond={sunsPerSecond}
          sunsPerClick={sunsPerClick}
          level={level}
          prestigePoints={prestigePoints}
          totalPrestiges={totalPrestiges}
          visualStage={visualStage}
        />

        {/* Título principal - mais compacto */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          className="text-center"
        >
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-pacifico text-white ${visualStage === "void" || visualStage === "abyss" ? "text-dim" : "text-glow"}`}
          >
            {visualStage === "void"
              ? "..."
              : visualStage === "abyss"
                ? "Boa... Noite...?"
                : visualStage === "storm"
                  ? "Bom... Dia...?"
                  : "Bom Dia,"}{" "}
            <span
              className={
                visualStage === "void" || visualStage === "abyss"
                  ? "text-gray-500"
                  : visualStage === "storm"
                    ? "text-gray-300"
                    : "text-yellow-300"
              }
            >
              Jamie
              {visualStage === "void"
                ? "..."
                : visualStage === "abyss"
                  ? "?"
                  : "!"}
            </span>{" "}
            {visualStage === "happy"
              ? "☀️"
              : visualStage === "melancholy"
                ? "😐"
                : visualStage === "cloudy"
                  ? "🌧️"
                  : visualStage === "storm"
                    ? "⛈️"
                    : visualStage === "abyss"
                      ? "💀"
                      : "🕳️"}
          </h1>
        </motion.div>

        {/* Avatar do Jamie */}
        <JamieAvatar
          clickCount={clickCount}
          level={level}
          currentXP={currentXP}
          xpForNextLevel={xpForNextLevel}
          visualStage={visualStage}
        />

        {/* Mensagens engraçadas */}
        <FunnyMessages clickCount={clickCount} visualStage={visualStage} />

        {/* Textos flutuantes de ganho - posição fixa na tela */}
        <AnimatePresence>
          {floatingTexts.map((ft) => (
            <motion.div
              key={ft.id}
              initial={{ opacity: 1, y: 0, scale: ft.isLevelUp ? 1.5 : 1 }}
              animate={{ opacity: 0, y: ft.isLevelUp ? -80 : -50 }}
              exit={{ opacity: 0 }}
              className={`fixed pointer-events-none font-bold whitespace-nowrap z-50 ${
                ft.isLevelUp
                  ? visualStage === "void" || visualStage === "abyss"
                    ? "text-red-500 text-xl drop-shadow-lg"
                    : "text-blue-300 text-xl drop-shadow-lg"
                  : visualStage === "void" || visualStage === "abyss"
                    ? "text-red-400 text-lg"
                    : "text-blue-300 text-lg"
              }`}
              style={{
                left: ft.x,
                top: ft.y - 40,
                transform: "translateX(-50%)",
              }}
            >
              {ft.isLevelUp ? ft.value : `+${ft.value} 💧`}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Indicador de clique */}
        <motion.div
          className="text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p
            className={`text-sm sm:text-base font-semibold ${
              visualStage === "void" || visualStage === "abyss"
                ? "text-red-400/80"
                : "text-white/80"
            }`}
          >
            {visualStage === "happy"
              ? "☀️"
              : visualStage === "void"
                ? "💀"
                : "💧"}
            {" Clique em qualquer lugar! "}
            (+{sunsPerClick})
            {visualStage === "happy"
              ? " ☀️"
              : visualStage === "void"
                ? " 💀"
                : " 💧"}
          </p>
        </motion.div>

        {/* Tabs de Upgrades e Prestígio */}
        <div className="mt-2">
          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-2">
            <button
              onClick={() => setActiveTab("upgrades")}
              className={`px-4 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "upgrades"
                  ? visualStage === "void" || visualStage === "abyss"
                    ? "bg-red-900/80 text-white"
                    : "bg-yellow-500/80 text-white"
                  : "bg-white/20 text-white/70 hover:bg-white/30"
              }`}
            >
              {visualStage === "void"
                ? "💀 Desgraças"
                : visualStage === "abyss"
                  ? "🕯️ Maldições"
                  : "🛒 Upgrades"}
            </button>
            <button
              onClick={() => setActiveTab("prestige")}
              className={`px-4 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "prestige"
                  ? "bg-purple-600/80 text-white"
                  : "bg-white/20 text-white/70 hover:bg-white/30"
              }`}
            >
              ⭐ Prestígio
              {prestigePoints > 0 && (
                <span className="ml-1 bg-purple-400 text-white px-1.5 py-0.5 rounded-full text-xs">
                  {prestigePoints}
                </span>
              )}
            </button>
          </div>

          {/* Conteúdo da tab ativa com animação */}
          <AnimatePresence mode="wait">
            {activeTab === "upgrades" ? (
              <motion.div
                key="upgrades"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <UpgradeShop
                  upgrades={upgrades}
                  suns={suns}
                  onBuyUpgrade={handleBuyUpgrade}
                  visualStage={visualStage}
                />
              </motion.div>
            ) : (
              <motion.div
                key="prestige"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <PrestigeShop
                  prestigePoints={prestigePoints}
                  prestigeUpgrades={prestigeUpgrades}
                  potentialPrestigeGain={potentialPrestigeGain}
                  totalPrestiges={totalPrestiges}
                  onPrestige={handlePrestige}
                  onBuyPrestigeUpgrade={handleBuyPrestigeUpgrade}
                  visualStage={visualStage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer compacto */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className={`text-center text-xs py-1 ${visualStage === "void" ? "text-red-500/60" : "text-white/60"}`}
        >
          <p>
            {visualStage === "void"
              ? "A escuridão consome tudo • ∞"
              : visualStage === "abyss"
                ? "Feito com 🖤 para Jamie • " + new Date().getFullYear()
                : "Feito com ❤️ para Jamie • " + new Date().getFullYear()}
          </p>
        </motion.footer>
      </div>
    </motion.div>
  );
}

export default App;
