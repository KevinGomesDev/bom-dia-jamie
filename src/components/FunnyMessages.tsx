import { motion, AnimatePresence } from "framer-motion";

interface FunnyMessagesProps {
  clickCount: number;
  level?: number;
}

function FunnyMessages({ clickCount, level = 0 }: FunnyMessagesProps) {
  const messages = [
    {
      threshold: 0,
      messages: [
        "😴 Está tão escuro aqui...",
        "💤 *silêncio*",
        "🌑 Jamie ainda está dormindo...",
      ],
    },
    {
      threshold: 5,
      messages: [
        "🛏️ Ei, hora de acordar!",
        "O café não vai se beber sozinho...",
        "Vamos começar o dia com energia! ☕",
      ],
    },
    {
      threshold: 15,
      messages: [
        "🎉 Jamie tá acordando!",
        "Os sóis estão brilhando!",
        "Que dia lindo lá fora! ☀️",
      ],
    },
    {
      threshold: 30,
      messages: [
        "⚡ MODO TURBO ATIVADO!",
        "Jamie tá on fire!",
        "Ninguém segura essa energia!",
      ],
    },
    {
      threshold: 50,
      messages: [
        "🔥 COMBO INCRÍVEL!",
        "Jamie é imparável!",
        "Os sóis estão chovendo!",
      ],
    },
    {
      threshold: 80,
      messages: [
        "🚨 ALERTA: FELICIDADE MÁXIMA!",
        "Jamie transcendeu!",
        "O universo sorri pra você! ✨",
        "Você é pura luz! 🌟",
      ],
    },
  ];

  const getCurrentMessages = () => {
    const applicable = messages.filter((m) => clickCount >= m.threshold);
    return applicable[applicable.length - 1]?.messages || messages[0].messages;
  };

  const currentMessages = getCurrentMessages();
  const displayMessage = currentMessages[clickCount % currentMessages.length];

  // Determinar estilo baseado no nível
  const isDark = level < 2;

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
        <div
          className={`backdrop-blur-md rounded-2xl p-3 md:p-4 shadow-xl border ${
            isDark
              ? "bg-gray-800/50 border-gray-600/30"
              : "bg-white/20 border-white/30"
          }`}
        >
          <motion.p
            className={`text-base sm:text-lg md:text-xl font-medium ${
              isDark ? "text-gray-300" : "text-white"
            }`}
            animate={clickCount > 5 ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {displayMessage}
          </motion.p>
        </div>

        {/* Dica especial em certos níveis */}
        {clickCount === 5 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-white/70 mt-2"
          >
            💡 Dica: Continue clicando para acordar Jamie!
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default FunnyMessages;
