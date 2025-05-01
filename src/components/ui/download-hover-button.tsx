"use client"

import * as React from "react"
import { motion } from "framer-motion"

export default function AnimatedDownloadButton() {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <a 
      href="#Your Download Link" 
      download
      className="absolute center "
    >
      <motion.div
        initial={{ width: 64, height: 64 }}
        whileHover={{ width: 220 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        transition={{ duration: 0.3 }}
        className="bg-red-600 flex items-center justify-center overflow-hidden relative"
        style={{ borderRadius: 32 }}
      >
        <motion.div
          className="absolute"
          animate={{ 
            opacity: isHovered ? 0 : 1,
            scale: isHovered ? 0.8 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-white text-2xl">↓</span>
        </motion.div>

        <motion.div
          className="w-full flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
        >
          <span className="text-white text-lg font-bold whitespace-nowrap">
            Download 
          </span>
        </motion.div>
      </motion.div>
    </a>
  )
}
