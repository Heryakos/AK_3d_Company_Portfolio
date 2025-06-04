import { motion } from "framer-motion"

interface ScrollingTextProps {
  text: string
  delay?: number
}

export default function ScrollingText({ text, delay = 0 }: ScrollingTextProps) {
  return (
    <motion.div
      className="inline-block"
      animate={{
        x: [2000, -2000]
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: "linear",
        delay: delay
      }}
    >
      <div className="text-2xl font-bold text-primary whitespace-nowrap px-6">
        {text}
      </div>
    </motion.div>
  )
} 