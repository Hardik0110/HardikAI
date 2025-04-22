import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { GradientButton } from "@/components/ui/gradient-button"
import { AnimatedText } from "@/components/ui/animated-text"

export default function IntroductionPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-dark to-dark/90 p-4 text-center">
      <motion.div
        className="max-w-3xl space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="font-extrabold  md:text-4xl text-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Welcome to{" "}
          <AnimatedText
            text="StockScript"
            className="inline-block"
            replay={true}
            delay={0.05}
            dualColor={true}
          />
        </motion.h1>
        <motion.p
          className="text-xl text-light/80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Optimize your code and analyze stocks with  AI 
        </motion.p>
        <motion.div
          className="pt-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link to="/login">
            <GradientButton
              variant="variant"
              className="relative overflow-hidden rounded-full px-6 py-4 text-lg font-semibold transition-all duration-500"
            >
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-green"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 0.5, 0.7],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              Login
            </GradientButton>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
