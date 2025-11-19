'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface GridNode {
  id: string
  x: number
  y: number
  active: boolean
  pulseDelay: number
  connections: string[]
}

export function NeuralGrid() {
  const [mounted, setMounted] = useState(false)
  const [nodes, setNodes] = useState<GridNode[]>([])
  const [activeConnections, setActiveConnections] = useState<Set<string>>(new Set())

  useEffect(() => {
    setMounted(true)
    
    // Generate grid nodes
    const gridNodes: GridNode[] = []
    const nodeSpacing = 120
    const cols = 16 // Fixed grid size for SSR compatibility
    const rows = 12

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const id = `${row}-${col}`
        const x = col * nodeSpacing - nodeSpacing
        const y = row * nodeSpacing - nodeSpacing
        
        const connections: string[] = []
        // Connect to adjacent nodes
        if (col < cols - 1) connections.push(`${row}-${col + 1}`)
        if (row < rows - 1) connections.push(`${row + 1}-${col}`)
        if (col < cols - 1 && row < rows - 1 && Math.random() > 0.7) {
          connections.push(`${row + 1}-${col + 1}`)
        }

        gridNodes.push({
          id,
          x,
          y,
          active: Math.random() > 0.8,
          pulseDelay: Math.random() * 5,
          connections
        })
      }
    }

    setNodes(gridNodes)

    // Animate connection pulses
    const interval = setInterval(() => {
      if (gridNodes.length > 0) {
        const activeNode = gridNodes[Math.floor(Math.random() * gridNodes.length)]
        if (activeNode.connections.length > 0) {
          const connection = `${activeNode.id}-${activeNode.connections[Math.floor(Math.random() * activeNode.connections.length)]}`
          setActiveConnections(prev => new Set([...prev, connection]))
          
          setTimeout(() => {
            setActiveConnections(prev => {
              const newSet = new Set(prev)
              newSet.delete(connection)
              return newSet
            })
          }, 2000)
        }
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
      {/* Grid Lines */}
      <svg
        className="absolute inset-0 w-full h-full neural-grid-blur"
        viewBox="0 0 1920 1200"
      >
        {/* Horizontal lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.line
            key={`h-${i}`}
            x1="0"
            y1={i * 120}
            x2="1920"
            y2={i * 120}
            stroke="var(--neural-cyan)"
            strokeWidth="0.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: i * 0.1 }}
          />
        ))}
        
        {/* Vertical lines */}
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.line
            key={`v-${i}`}
            x1={i * 120}
            y1="0"
            x2={i * 120}
            y2="1200"
            stroke="var(--neural-cyan)"
            strokeWidth="0.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: i * 0.1 }}
          />
        ))}

        {/* Neural connections */}
        {nodes.map(node => 
          node.connections.map(connectionId => {
            const targetNode = nodes.find(n => n.id === connectionId)
            if (!targetNode) return null
            
            const connectionKey = `${node.id}-${connectionId}`
            const isActive = activeConnections.has(connectionKey)
            
            return (
              <motion.line
                key={connectionKey}
                x1={node.x}
                y1={node.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={isActive ? "var(--neural-electric)" : "var(--neural-cyan)"}
                strokeWidth={isActive ? "2" : "1"}
                opacity={isActive ? "0.8" : "0.4"}
                animate={{
                  opacity: isActive ? [0.4, 0.8, 0.4] : 0.4,
                  strokeWidth: isActive ? [1, 2, 1] : 1,
                }}
                transition={{
                  duration: isActive ? 2 : 0,
                  ease: "easeInOut"
                }}
              />
            )
          })
        )}

        {/* Neural nodes */}
        {nodes.map(node => (
          <motion.circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.active ? "3" : "2"}
            fill={node.active ? "var(--neural-electric)" : "var(--neural-cyan)"}
            opacity={node.active ? "0.8" : "0.6"}
            animate={{
              r: node.active ? [2, 4, 2] : 2,
              opacity: node.active ? [0.6, 1, 0.6] : 0.6,
            }}
            transition={{
              duration: 3,
              delay: node.pulseDelay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>

      {/* Neural scan lines */}
      <motion.div
        className="absolute inset-0"
        initial={{ y: "-100%" }}
        animate={{ y: "100%" }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 12
        }}
      >
        <div className="w-full h-px bg-gradient-to-r from-transparent via-neural-electric to-transparent opacity-60" />
      </motion.div>

      {/* Data flow particles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const startX = Math.random() * 1920
        const startY = Math.random() * 1200
        const endX = Math.random() * 1920
        const endY = Math.random() * 1200
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-neural-electric rounded-full shadow-neural-glow"
            initial={{
              x: startX,
              y: startY,
              opacity: 0
            }}
            animate={{
              x: endX,
              y: endY,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )
      })}
    </div>
  )
}
