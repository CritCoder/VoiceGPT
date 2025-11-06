"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface PremiumFrameProps {
  className?: string
  children: React.ReactNode
  radius?: number
}

export function PremiumFrame({ className, children, radius = 16 }: PremiumFrameProps) {
  const r = radius
  return (
    <div className={cn('relative', className)}>
      {/* Animated gradient border */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl p-[1.5px]"
        style={{ borderRadius: r }}
      >
        <div
          className="absolute inset-0 rounded-2xl opacity-60"
          style={{
            background:
              'conic-gradient(from 0deg, #dff000, #8b5cf6, #06b6d4, #dff000)',
            filter: 'blur(8px) saturate(1.2)',
            animation: 'premium-rotate 14s linear infinite',
            borderRadius: r,
          }}
        />
      </div>

      {/* Moving border particles (SVG) */}
      <svg
        className="pointer-events-none absolute inset-0"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <path id="borderPath" d="M 2 2 H 98 A 2 2 0 0 1 100 4 V 96 A 2 2 0 0 1 98 98 H 2 A 2 2 0 0 1 0 96 V 4 A 2 2 0 0 1 2 2 Z" />
        </defs>
        {[
          { color: '#dff000', delay: 0 },
          { color: '#8b5cf6', delay: 2.3 },
          { color: '#06b6d4', delay: 4.7 },
        ].map((p, i) => (
          <g key={i} filter="url(#glow)">
            <circle r="1.2" fill={p.color}>
              <animateMotion
                dur="10s"
                repeatCount="indefinite"
                keyPoints="0;1"
                keyTimes="0;1"
                begin={`${p.delay}s`}
                rotate="auto"
              >
                <mpath href="#borderPath" />
              </animateMotion>
            </circle>
          </g>
        ))}
      </svg>

      {/* Content container */}
      <div
        className="relative rounded-2xl bg-background/90 backdrop-blur-xl border border-border shadow-2xl"
        style={{ borderRadius: r }}
      >
        {children}
      </div>

      <style jsx global>{`
        @keyframes premium-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

