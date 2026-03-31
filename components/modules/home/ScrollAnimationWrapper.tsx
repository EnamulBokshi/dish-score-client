'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ScrollAnimationWrapperProps {
  children: ReactNode
}

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

export default function ScrollAnimationWrapper({ children }: ScrollAnimationWrapperProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
