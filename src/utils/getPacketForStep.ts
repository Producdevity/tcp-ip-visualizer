import { PACKET_TYPES } from '@/data'

export type PacketStep = {
  id: string
  type: {
    name: string
    color: string
  }
  from: 'client' | 'server'
  to: 'client' | 'server'
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
    },
    1: {
      // SYN-ACK
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.SYN_ACK,
      from: 'server',
      to: 'client',
    },
    2: {
      // ACK
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.ACK,
      from: 'client',
      to: 'server',
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
      data: `Data Packet ${Math.floor(step / 2)}`,
    },
    9: {
      // FIN from client
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.FIN,
      from: 'client',
      to: 'server',
    },
    10: {
      // ACK from server
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.ACK,
      from: 'server',
      to: 'client',
    },
    11: {
      // FIN from server
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.FIN,
      from: 'server',
      to: 'client',
    },
    12: {
      // ACK from client
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.ACK,
      from: 'client',
      to: 'server',
    },
  }

  return packetStepMap[step] || null
}

export default getPacketForStep
