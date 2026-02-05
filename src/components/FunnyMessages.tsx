import { motion, AnimatePresence } from "framer-motion";

interface FunnyMessagesProps {
  clickCount: number;
  level?: number;
  visualStage?: "happy" | "melancholy" | "cloudy" | "storm" | "abyss" | "void";
}

function FunnyMessages({
  clickCount,
  level = 0,
  visualStage = "happy",
}: FunnyMessagesProps) {
  // Mensagens que vão ficando cada vez mais tristes conforme o jogo progride
  const messagesByStage = {
    happy: [
      "☀️ Que dia lindo!",
      "🌈 Tudo vai dar certo!",
      "🦋 As borboletas estão voando!",
      "🌸 Que flores bonitas!",
      "😊 Jamie está tão feliz hoje!",
      "✨ O mundo é mágico!",
    ],
    melancholy: [
      "🌤️ O dia está... ok, eu acho.",
      "😐 Poderia ser pior...",
      "🍂 As folhas estão caindo...",
      "🥀 Essa flor já foi mais bonita.",
      "😕 Jamie está pensativo...",
      "💭 Será que vale a pena?",
    ],
    cloudy: [
      "☁️ O céu está cinza...",
      "💧 Parece que vai chover...",
      "😔 Jamie não está muito bem...",
      "🌫️ Tudo está tão nebuloso...",
      "😞 Nada parece fazer sentido.",
      "💔 Algo está errado...",
    ],
    storm: [
      "⛈️ A tempestade chegou.",
      "⚡ Os raios não param!",
      "😢 Jamie está chorando...",
      "💨 O vento leva tudo embora...",
      "🌧️ As lágrimas caem como chuva.",
      "😭 Por que dói tanto?",
    ],
    abyss: [
      "🌑 A escuridão consome tudo...",
      "💀 O fim está próximo...",
      "🦇 Criaturas sombrias rondam...",
      "👻 Os fantasmas sussurram...",
      "😵 Jamie não aguenta mais...",
      "🕯️ A última vela está apagando...",
      "☠️ O abismo chama...",
    ],
    void: [
      "🕳️ ...",
      "💀 ...",
      "⚫ O vazio é absoluto.",
      "🖤 Não há mais nada.",
      "👁️ Algo observa do escuro.",
      "∅ [ V A Z I O ]",
      "☠️ ᵗᵘᵈᵒ ᵃᶜᵃᵇᵒᵘ",
      "🔮 A eternidade aguarda...",
    ],
  };

  const currentMessages = messagesByStage[visualStage] || messagesByStage.happy;
  const displayMessage = currentMessages[clickCount % currentMessages.length];

  // Estilos dinâmicos baseados no stage
  const getStyles = () => {
    switch (visualStage) {
      case "happy":
        return {
          bg: "bg-white/20 border-white/30",
          text: "text-white",
          shadow: "shadow-xl",
        };
      case "melancholy":
        return {
          bg: "bg-gray-300/20 border-gray-400/30",
          text: "text-gray-200",
          shadow: "shadow-lg",
        };
      case "cloudy":
        return {
          bg: "bg-gray-500/30 border-gray-500/40",
          text: "text-gray-300",
          shadow: "shadow-md",
        };
      case "storm":
        return {
          bg: "bg-gray-700/40 border-gray-600/50",
          text: "text-gray-200",
          shadow: "shadow-lg shadow-purple-900/30",
        };
      case "abyss":
        return {
          bg: "bg-gray-900/60 border-red-900/40",
          text: "text-red-200",
          shadow: "shadow-xl shadow-red-900/50",
        };
      case "void":
        return {
          bg: "bg-black/80 border-black/90",
          text: "text-gray-500",
          shadow: "shadow-2xl shadow-black",
        };
      default:
        return {
          bg: "bg-white/20 border-white/30",
          text: "text-white",
          shadow: "shadow-xl",
        };
    }
  };

  const styles = getStyles();

  // Animação especial para void - texto distorcido
  const voidAnimation =
    visualStage === "void"
      ? {
          opacity: [0.3, 1, 0.3],
          scale: [0.98, 1.02, 0.98],
          filter: ["blur(0px)", "blur(1px)", "blur(0px)"],
        }
      : null;

  // Animação de tremor para storm
  const stormAnimation =
    visualStage === "storm"
      ? {
          x: [0, -2, 2, -1, 1, 0],
        }
      : null;

  // Flag para saber se deve animar
  const shouldAnimate = visualStage === "void" || visualStage === "storm";

  // Dicas progressivamente mais sombrias
  const getTip = () => {
    if (level >= 8) return "💀 Não há volta...";
    if (level >= 6) return "🕯️ A luz está morrendo...";
    if (level >= 4) return "⛈️ A tempestade só piora...";
    if (level >= 2) return "☁️ As nuvens estão chegando...";
    if (clickCount === 5) return "💡 Continue clicando... enquanto pode.";
    return null;
  };

  const tip = getTip();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayMessage}
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="max-w-md mx-auto text-center"
      >
        <motion.div
          animate={
            shouldAnimate
              ? {
                  ...(voidAnimation || {}),
                  ...(stormAnimation || {}),
                }
              : undefined
          }
          transition={
            shouldAnimate
              ? {
                  duration: visualStage === "void" ? 3 : 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : undefined
          }
          className={`backdrop-blur-md rounded-2xl p-3 md:p-4 border ${styles.bg} ${styles.shadow}`}
        >
          <motion.p
            className={`text-base sm:text-lg md:text-xl font-medium ${styles.text}`}
            animate={
              visualStage === "abyss" || visualStage === "void"
                ? {
                    textShadow: [
                      "0 0 10px rgba(255,0,0,0.5)",
                      "0 0 20px rgba(255,0,0,0.8)",
                      "0 0 10px rgba(255,0,0,0.5)",
                    ],
                  }
                : undefined
            }
            transition={
              visualStage === "abyss" || visualStage === "void"
                ? { duration: 2, repeat: Infinity }
                : undefined
            }
          >
            {displayMessage}
          </motion.p>
        </motion.div>

        {/* Dica que muda conforme o progresso */}
        {tip && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-xs mt-2 ${
              level >= 6
                ? "text-red-400/70"
                : level >= 4
                  ? "text-purple-300/70"
                  : "text-white/70"
            }`}
          >
            {tip}
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default FunnyMessages;
