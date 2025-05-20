import { useMemo } from 'react'
import { TCP_IP_LAYERS } from '@/data'
import type { PacketStep } from '@/utils/getPacketForStep'

interface Props {
  packet: PacketStep
  stage: number
}

function EncapsulatedPacket(props: Props) {
  const visibleHeaders = useMemo(() => {
    const visibleHeaders: number[] = []

    if (props.stage >= 1 && props.stage <= 7) visibleHeaders.push(1) // Transport header
    if (props.stage >= 2 && props.stage <= 6) visibleHeaders.push(2) // Internet header
    if (props.stage >= 3 && props.stage <= 5) visibleHeaders.push(3) // Network Interface header

    return visibleHeaders
  }, [props.stage])

  const currentPosition = useMemo(() => {
    const fromClient = props.packet.from === 'client'
    const CLIENT_X = 20
    const SERVER_X = 80
    const TRANSMISSION_X = 50
    const SPACING = 4
    const START_Y = 160
    const STEP_Y = SPACING * 20

    const positions = [
      { x: fromClient ? CLIENT_X : SERVER_X, y: START_Y }, // Application
      { x: fromClient ? CLIENT_X : SERVER_X, y: START_Y + STEP_Y }, // Transport
      { x: fromClient ? CLIENT_X : SERVER_X, y: START_Y + STEP_Y * 2 }, // Internet
      { x: fromClient ? CLIENT_X : SERVER_X, y: START_Y + STEP_Y * 3 }, // Network Interface
      { x: TRANSMISSION_X, y: START_Y + STEP_Y * 3 }, // Transmission
      { x: fromClient ? SERVER_X : CLIENT_X, y: START_Y + STEP_Y * 3 }, // Network Interface (receiver)
      { x: fromClient ? SERVER_X : CLIENT_X, y: START_Y + STEP_Y * 2 }, // Internet (receiver)
      { x: fromClient ? SERVER_X : CLIENT_X, y: START_Y + STEP_Y * 1 }, // Transport (receiver)
      { x: fromClient ? SERVER_X : CLIENT_X, y: START_Y }, // Application (receiver)
    ]

    return positions[props.stage]
  }, [props.stage, props.packet.from])

  const Icon = props.packet.type.icon
  const isClientToServer = props.packet.from === 'client'
  const isOnSenderSide = props.stage < 4
  const alignRight = isClientToServer ? isOnSenderSide : !isOnSenderSide
  const isOnTransmission = props.stage === 4

  return (
    <div
      className="absolute transition-all duration-500"
      style={{
        left: `${currentPosition.x}%`,
        top: currentPosition.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
      }}
    >
      <div className="relative">
        <div className="w-16 h-12 mt-2 bg-white border-2 border-black rounded flex items-start justify-center">
          <Icon className="mt-0.5 w-6 h-6 text-black" />
        </div>

        {visibleHeaders.map((layerIndex, i) => {
          const layer = TCP_IP_LAYERS[layerIndex]

          const verticalSpacing = 20
          const verticalOffset = i * verticalSpacing

          return (
            <div key={`header-${layerIndex}`}>
              <div
                className="absolute inset-0 border-4 rounded"
                style={{
                  borderColor: layer.color,
                  transform: `scale(${1 + (visibleHeaders.length - i) * 0.12})`,
                  zIndex: -layerIndex,
                }}
              />
              {!isOnTransmission && (
                <div
                  className="absolute text-[8px] font-bold px-1 py-0.5 rounded whitespace-nowrap text-white text-center min-w-18"
                  style={{
                    top: `${verticalOffset}px`,
                    left: alignRight ? '100%' : 'auto',
                    right: alignRight ? 'auto' : '100%',
                    transform: `translateX(${alignRight ? '16px' : '-16px'})`,
                    backgroundColor: layer.color,
                  }}
                >
                  {layer.header}
                </div>
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
    </div>
  )
}

export default EncapsulatedPacket
