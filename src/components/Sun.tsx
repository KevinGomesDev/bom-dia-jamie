import { motion } from "framer-motion";

function Sun() {
  return (
    <motion.div
      className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto"
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {/* Raios do sol */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-5 sm:w-2 sm:h-6 md:h-7 bg-yellow-400 rounded-full left-1/2 -ml-1"
          style={{
            transformOrigin: "center 40px",
            transform: `rotate(${i * 45}deg)`,
          }}
          animate={{
            scaleY: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}

      {/* Corpo do sol */}
      <motion.div
        className="absolute top-5 left-1/2 -ml-7 sm:-ml-8 md:-ml-9 w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg"
        style={{
          width: "clamp(3.5rem, 5vw, 4.5rem)",
          height: "clamp(3.5rem, 5vw, 4.5rem)",
        }}
        animate={{
          boxShadow: [
            "0 0 30px rgba(255, 215, 0, 0.6)",
            "0 0 60px rgba(255, 215, 0, 0.8)",
            "0 0 30px rgba(255, 215, 0, 0.6)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Rosto do sol */}
        <div className="relative w-full h-full">
          {/* Olhos */}
          <motion.div
            className="absolute top-[25%] left-[20%] w-2.5 h-2.5 sm:w-3 sm:h-3 bg-orange-800 rounded-full"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
          <motion.div
            className="absolute top-[25%] right-[20%] w-2.5 h-2.5 sm:w-3 sm:h-3 bg-orange-800 rounded-full"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
          {/* Bochechas */}
          <div className="absolute top-[40%] left-[10%] w-2.5 h-1.5 bg-orange-300 rounded-full opacity-60" />
          <div className="absolute top-[40%] right-[10%] w-2.5 h-1.5 bg-orange-300 rounded-full opacity-60" />
          {/* Sorriso */}
          <motion.div
            className="absolute bottom-[20%] left-1/2 -ml-2.5 w-5 h-2.5 border-b-2 sm:border-b-3 border-orange-800 rounded-full"
            animate={{ scaleX: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Sun;
