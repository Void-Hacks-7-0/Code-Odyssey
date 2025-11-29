"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface TimelineNode {
  id: number
  title: string
  date: string
  content: string
  category: string
  icon: React.ComponentType<any>
  relatedIds: number[]
  status: string
  energy: number
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineNode[]
  className?: string
}

export default function RadialOrbitalTimeline({ timelineData, className }: RadialOrbitalTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Continuous rotation state
  const rotation = useMotionValue(0)
  const controls = useAnimation()

  const activeNode = timelineData[activeIndex]
  const totalNodes = timelineData.length
  const anglePerNode = 360 / totalNodes
  const radius = 42.5 // Percentage

  useEffect(() => {
    // Start the continuous rotation
    controls.start({
      rotate: 360,
      transition: {
        duration: 65, // Slow rotation
        ease: "linear",
        repeat: Infinity,
      }
    })
  }, [controls])

  // Pause on hover
  useEffect(() => {
    if (isHovered) {
      rotation.stop()
    } else {
      // Resume logic handled by rAF below
    }
  }, [isHovered, rotation])

  // Robust approach: rAF loop updating a motion value
  useEffect(() => {
    let animationFrameId: number
    let lastTime = performance.now()
    const speed = 0.005 // Degrees per ms (approx 18 deg/sec = 20s per rotation)

    const animate = (time: number) => {
      if (!isHovered) {
        const delta = time - lastTime
        const current = rotation.get()
        rotation.set(current + speed * delta)
      }
      lastTime = time
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isHovered, rotation])

  const handleNodeClick = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <div
      className={cn("relative w-full max-w-[600px] aspect-square mx-auto flex items-center justify-center my-12", className)}
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Orbits */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Main Orbit Path */}
        <div className="w-[85%] h-[85%] rounded-full border border-border" />

        {/* Subtle inner/outer glows */}
        <div className="absolute w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Center Core / Data Display */}
      <div className="relative z-20 w-[45%] aspect-square flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNode.id}
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 rounded-full bg-background/50 backdrop-blur-xl border border-border shadow-2xl"
          >
            <div className="mb-3 p-3 rounded-full bg-primary/10 border border-primary/30 shadow-[0_0_15px_hsl(var(--primary)/0.3)]">
              <activeNode.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">{activeNode.title}</h3>
            <p className="text-[10px] text-primary/80 mb-2 font-mono uppercase tracking-wider">{activeNode.category}</p>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 max-w-[90%]">{activeNode.content}</p>
          </motion.div>
        </AnimatePresence>

        {/* Decorative background for the core */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full -z-10 animate-pulse" />
      </div>

      {/* Orbital Nodes Container */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ rotate: rotation }}
      >
        {timelineData.map((node, i) => {
          // Calculate position
          const angleRad = (i * anglePerNode - 90) * (Math.PI / 180)
          const x = 50 + radius * Math.cos(angleRad)
          const y = 50 + radius * Math.sin(angleRad)

          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: '120px', // Fixed width for text centering
                height: '120px',
              }}
            >
              <motion.button
                onClick={() => handleNodeClick(i)}
                className={cn(
                  "relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border backdrop-blur-md transition-all duration-300 pointer-events-auto group",
                  i === activeIndex
                    ? "bg-primary/20 border-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                    : "bg-muted/60 text-muted-foreground border-border hover:border-primary/50 hover:bg-muted/80"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Counter-rotate icon and text to keep them upright */}
                <CounterRotate rotation={rotation}>
                  <div className="flex flex-col items-center gap-3">
                    <node.icon className={cn("w-5 h-5 md:w-6 md:h-6 transition-colors",
                      i === activeIndex ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )} />
                  </div>
                </CounterRotate>
              </motion.button>

              {/* Label below the node - also counter-rotated */}
              <div className="absolute top-full mt-2 pointer-events-none">
                <CounterRotate rotation={rotation}>
                  <span className={cn(
                    "text-xs md:text-sm font-medium whitespace-nowrap px-2 py-1 rounded-full backdrop-blur-sm transition-colors",
                    i === activeIndex
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {node.title}
                  </span>
                </CounterRotate>
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}

// Helper component to counter-rotate content
function CounterRotate({ children, rotation }: { children: React.ReactNode, rotation: any }) {
  const negativeRotation = useTransform(rotation, (r: number) => -r)
  return (
    <motion.div style={{ rotate: negativeRotation }}>
      {children}
    </motion.div>
  )
}
