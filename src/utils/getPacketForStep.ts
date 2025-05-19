import { PACKET_TYPES } from '@/data'

export type PacketStep = {
  id: string
  type: {
    name: string
    color: string
  }
  from: 'client' | 'server'
  to: 'client' | 'server'
  layers: boolean[]
  data?: string
}

function getPacketForStep(step: number) {
  const packetStepMap: Record<number, PacketStep | null> = {
    0: {
      // SYN
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.SYN,
      from: 'client',
      to: 'server',
      layers: [true, true, true, true],
    },
    1: {
      // SYN-ACK
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.SYN_ACK,
      from: 'server',
      to: 'client',
      layers: [true, true, true, true],
    },
    2: {
      // ACK
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.ACK,
      from: 'client',
      to: 'server',
      layers: [true, true, true, true],
    },
    3: null, // DATA 1
    4: null, // DATA 2
    5: null, // DATA 3
    6: null, // DATA 4
    7: null, // DATA 5
    8: {
      // DATA 6
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.DATA,
      from: step % 2 === 1 ? 'client' : 'server',
      to: step % 2 === 1 ? 'server' : 'client',
      layers: [true, true, true, true],
      data: `Data Packet ${Math.floor(step / 2)}`,
    },
    9: {
      // FIN from client
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.FIN,
      from: 'client',
      to: 'server',
      layers: [true, true, true, true],
    },
    10: {
      // ACK from server
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.ACK,
      from: 'server',
      to: 'client',
      layers: [true, true, true, true],
    },
    11: {
      // FIN from server
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.FIN,
      from: 'server',
      to: 'client',
      layers: [true, true, true, true],
    },
    12: {
      // ACK from client
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.ACK,
      from: 'client',
      to: 'server',
      layers: [true, true, true, true],
    },
  }

  return packetStepMap[step] || null
}

export default getPacketForStep
