import { useMemo } from 'react'
import { TCP_IP_LAYERS } from '@/data'
import type { PacketStep } from '@/utils/getPacketForStep'

const CLIENT_X = 20
const SERVER_X = 80
const TRANSMISSION_X = 50

const STAGE_TO_X = [
  CLIENT_X,
  CLIENT_X,
  CLIENT_X,
  CLIENT_X,
  TRANSMISSION_X,
  SERVER_X,
  SERVER_X,
  SERVER_X,
  SERVER_X,
] as const

interface Props {
  packet: PacketStep
  stage: number
}

function EncapsulatedPacket(props: Props) {
  const currentPosition = useMemo(
    () => ({
      x: STAGE_TO_X[props.stage],
      y: `calc(160px + ((var(--spacing) * 20) * ${props.stage}))`,
    }),
    [props.stage],
  )

  const visibleHeaders = useMemo(() => {
    const visibleHeaders: number[] = []

    if (props.stage >= 1 && props.stage <= 7) visibleHeaders.push(1) // Transport header
    if (props.stage >= 2 && props.stage <= 6) visibleHeaders.push(2) // Internet header
    if (props.stage >= 3 && props.stage <= 5) visibleHeaders.push(3) // Network Interface header

    return visibleHeaders
  }, [props.stage])

  const Icon = props.packet.type.icon

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
      {/* Base packet (envelope) */}
      <div className="relative">
        {/* Data payload (envelope) */}
        <div className="w-16 h-12 mt-2 bg-white border-2 border-black rounded flex items-center justify-center">
          <Icon className="w-8 h-8 text-black" />
        </div>

        {/* Layer headers (colored borders) */}
        {visibleHeaders.map((layerIndex) => (
          <div
            key={`header-${layerIndex}`}
            className="absolute inset-0 border-4 rounded"
            style={{
              borderColor: TCP_IP_LAYERS[layerIndex].color,
              transform: `scale(${1 + (visibleHeaders.length - visibleHeaders.indexOf(layerIndex)) * 0.15})`,
              zIndex: -layerIndex,
            }}
          >
            {/* Header label */}
            <div
              className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-[8px] font-bold px-1 rounded"
              style={{
                backgroundColor: TCP_IP_LAYERS[layerIndex].color,
                color: 'white',
              }}
            >
              {TCP_IP_LAYERS[layerIndex].header}
            </div>
          </div>
        ))}

        {/* Packet type label */}
        <div
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm font-bold text-center px-1 rounded"
          style={{ backgroundColor: props.packet.type.color, color: 'white' }}
        >
          {props.packet.type.name}
        </div>
      </div>
    </div>
  )
}

export default EncapsulatedPacket
