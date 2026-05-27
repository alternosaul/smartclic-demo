import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type BlurTextProps = {
  text: string
  className?: string
  delay?: number
}

/**
 * Texto que aparece con desenfoque — patrón inspirado en React Bits
 */
export function BlurText({ text, className, delay = 0 }: BlurTextProps) {
  const words = text.split(' ')

  return (
    <span className={cn('inline-flex flex-wrap gap-x-[0.3em]', className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ filter: 'blur(12px)', opacity: 0, y: 20 }}
          animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
