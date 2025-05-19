import { useMemo } from 'react'
import { TCP_IP_LAYERS } from '@/data'
import { Mail } from 'lucide-react'
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
    const isClientToServer = props.packet.from === 'client'
    const clientX = 16
    const serverX = 84

    // Calculate positions for each stage
    const positions = [
      { x: isClientToServer ? clientX : serverX, y: 160 }, // Application
      { x: isClientToServer ? clientX : serverX, y: 260 }, // Transport
      { x: isClientToServer ? clientX : serverX, y: 360 }, // Internet
      { x: isClientToServer ? clientX : serverX, y: 460 }, // Network Interface
      {
        x: isClientToServer ? (clientX + serverX) / 2 : (serverX + clientX) / 2,
        y: 500,
      }, // Transmission
      { x: isClientToServer ? serverX : clientX, y: 460 }, // Network Interface (receiver)
      { x: isClientToServer ? serverX : clientX, y: 360 }, // Internet (receiver)
      { x: isClientToServer ? serverX : clientX, y: 260 }, // Transport (receiver)
      { x: isClientToServer ? serverX : clientX, y: 160 }, // Application (receiver)
    ]

    // Get position for current stage
    const position = positions[props.stage]

    return position
  }, [props.stage, props.packet.from])

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
        <div className="w-16 h-12 bg-white border-2 border-black rounded flex items-center justify-center">
          <Mail className="w-8 h-8 text-black" />
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
          className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[10px] font-bold px-1 rounded"
          style={{ backgroundColor: props.packet.type.color, color: 'white' }}
        >
          {props.packet.type.name}
        </div>
      </div>
    </div>
  )
}

export default EncapsulatedPacket
