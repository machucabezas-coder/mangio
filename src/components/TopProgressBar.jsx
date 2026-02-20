import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TopProgressBar({ loading }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (loading) {
      setProgress(0)
      const t1 = setTimeout(() => setProgress(60), 80)
      const t2 = setTimeout(() => setProgress(85), 300)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    } else {
      setProgress(100)
    }
  }, [loading])

  return (
    <AnimatePresence>
      {(loading || progress < 100) && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 h-0.5"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.3, duration: 0.3 } }}
        >
          <motion.div
            className="h-full"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed)',
              boxShadow: '0 0 8px rgba(139,92,246,0.6)',
              backgroundSize: '200% 100%',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
