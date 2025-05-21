import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { TCP_IP_LAYERS } from '@/data'
import type { PacketStep } from '@/utils/getPacketForStep'

interface Props {
  packet: PacketStep
  isPlaying: boolean
  speed: number
  onStageChange?: (stage: number) => void
  onComplete?: () => void
}

const TOTAL_STAGES = 9
const BASE_DURATION = 0.5 // Base duration for each stage
const HEADER_FADE_BASE_DURATION = 0.25
const HEADER_FADE_IN_BASE_DELAY = 0.5
const HEADER_FADE_OUT_BASE_DELAY = 0.25
export const DEFAULT_SPEED = 0.5

function EncapsulatedPacket(props: Props) {
  const { onComplete, onStageChange } = props
  const controls = useAnimation()
  const [stage, setStage] = useState(0)
  const stageRef = useRef(0)

  const positions = useMemo(() => {
    const fromClient = props.packet.from === 'client'
    const CLIENT_X = 21
    const SERVER_X = 79
    const TRANSMISSION_X = 50
    const SPACING = 4
    const START_Y = 160
    const STEP_Y = SPACING * 20
    return [
      { x: fromClient ? CLIENT_X : SERVER_X, y: START_Y },
      { x: fromClient ? CLIENT_X : SERVER_X, y: START_Y + STEP_Y },
      { x: fromClient ? CLIENT_X : SERVER_X, y: START_Y + STEP_Y * 2 },
      { x: fromClient ? CLIENT_X : SERVER_X, y: START_Y + STEP_Y * 3 },
      { x: TRANSMISSION_X, y: START_Y + STEP_Y * 3 },
      { x: fromClient ? SERVER_X : CLIENT_X, y: START_Y + STEP_Y * 3 },
      { x: fromClient ? SERVER_X : CLIENT_X, y: START_Y + STEP_Y * 2 },
      { x: fromClient ? SERVER_X : CLIENT_X, y: START_Y + STEP_Y },
      { x: fromClient ? SERVER_X : CLIENT_X, y: START_Y },
    ]
  }, [props.packet.from])

  // Animate through all stages
  useEffect(() => {
    let cancelled = false
    async function animateStages() {
      for (let s = stageRef.current; s < TOTAL_STAGES; s++) {
        if (cancelled) break
        setStage(s)
        await controls.start({
          left: `${positions[s].x}%`,
          top: positions[s].y,
          transition: {
            duration: BASE_DURATION / props.speed,
            ease: 'anticipate',
          },
        })
        onStageChange?.(s)
        stageRef.current = s + 1
        if (!props.isPlaying) break
      }
      if (!cancelled && stageRef.current >= TOTAL_STAGES && onComplete) {
        onComplete()
      }
    }
    if (props.isPlaying) {
      animateStages()
    } else {
      controls.stop()
    }
    return () => {
      cancelled = true
      controls.stop()
    }
  }, [
    props.isPlaying,
    props.speed,
    positions,
    controls,
    onComplete,
    onStageChange,
  ])

  const Icon = props.packet.type.icon
  const isClientToServer = props.packet.from === 'client'
  const isOnSenderSide = stage < 4
  const alignRight = isClientToServer ? isOnSenderSide : !isOnSenderSide
  const isOnTransmission = stage === 4

  return (
    <motion.div
      className="absolute"
      animate={controls}
      initial={{
        left: `${positions[0].x}%`,
        top: positions[0].y,
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
      }}
      style={{ transform: 'translate(-50%, -50%)', zIndex: 50 }}
    >
      <div className="relative">
        <div className="w-16 h-12 mt-2 bg-white border-2 border-black rounded flex items-start justify-center">
          <Icon className="mt-0.5 w-6 h-6 text-black" />
        </div>
        {[1, 2, 3].map((layerIndex, i) => {
          const layer = TCP_IP_LAYERS[layerIndex]
          const verticalSpacing = 20
          const verticalOffset = i * verticalSpacing
          let headerVisible = false
          if (layerIndex === 1) headerVisible = stage >= 1 && stage <= 7 // Transport: stages 1-7
          if (layerIndex === 2) headerVisible = stage >= 2 && stage <= 6 // Internet: stages 2-6
          if (layerIndex === 3) headerVisible = stage >= 3 && stage <= 5 // Network Interface: stages 3-5
          return (
            <div key={`header-${layerIndex}`}>
              <motion.div
                className="absolute inset-0 border-4 rounded"
                style={{
                  borderColor: layer.color,
                  transform: `scale(${1.15 + (layerIndex - 1) * 0.15})`,
                  zIndex: -layerIndex,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: headerVisible ? 1 : 0 }}
                transition={{
                  duration: HEADER_FADE_BASE_DURATION * (DEFAULT_SPEED / props.speed),
                  delay: headerVisible
                    ? HEADER_FADE_IN_BASE_DELAY * (DEFAULT_SPEED / props.speed)
                    : HEADER_FADE_OUT_BASE_DELAY * (DEFAULT_SPEED / props.speed),
                }}
              />
              {!isOnTransmission && (
                <motion.div
                  className="absolute text-[8px] font-bold px-1 py-0.5 rounded whitespace-nowrap text-white text-center min-w-18"
                  style={{
                    top: `${verticalOffset}px`,
                    left: alignRight ? '100%' : 'auto',
                    right: alignRight ? 'auto' : '100%',
                    transform: `translateX(${alignRight ? '16px' : '-16px'})`,
                    backgroundColor: layer.color,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: headerVisible ? 1 : 0 }}
                  transition={{
                    duration: HEADER_FADE_BASE_DURATION * (DEFAULT_SPEED / props.speed),
                    delay: headerVisible
                      ? HEADER_FADE_IN_BASE_DELAY * (DEFAULT_SPEED / props.speed)
                      : HEADER_FADE_OUT_BASE_DELAY * (DEFAULT_SPEED / props.speed),
                  }}
                >
                  {layer.header}
                </motion.div>
              )}
            </div>
          )
        })}
        {/* Packet type label */}
        <div
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-center px-1 rounded"
          style={{ backgroundColor: props.packet.type.color, color: 'white' }}
        >
          {props.packet.type.name}
        </div>
      </div>
    </motion.div>
  )
}

export default EncapsulatedPacket
