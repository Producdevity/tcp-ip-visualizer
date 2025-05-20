import { PACKET_TYPES, type PacketTypes } from '@/data'
import type { ValueOf } from './types'

export type PacketStep = {
  id: string
  type: ValueOf<PacketTypes>
  from: 'client' | 'server'
  to: 'client' | 'server'
  data?: string
}

function getPacketForStep(step: number) {
  const packetStepMap: Record<number, PacketStep | null> = {
    0: {
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.SYN,
      from: 'client',
      to: 'server',
    },
    1: {
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.SYN_ACK,
      from: 'server',
      to: 'client',
    },
    2: {
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.ACK,
      from: 'client',
      to: 'server',
    },
    3: {
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.DATA,
      from: step % 2 === 1 ? 'client' : 'server',
      to: step % 2 === 1 ? 'server' : 'client',
      data: 'Data Packer 1',
    },
    4: {
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.DATA,
      from: step % 2 === 1 ? 'client' : 'server',
      to: step % 2 === 1 ? 'server' : 'client',
      data: 'Data Packer 2',
    },

    5: {
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.DATA,
      from: step % 2 === 1 ? 'client' : 'server',
      to: step % 2 === 1 ? 'server' : 'client',
      data: 'Data Packer 3',
    },

    6: {
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.DATA,
      from: step % 2 === 1 ? 'client' : 'server',
      to: step % 2 === 1 ? 'server' : 'client',
      data: 'Data Packer 4',
    },

    7: {
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.DATA,
      from: step % 2 === 1 ? 'client' : 'server',
      to: step % 2 === 1 ? 'server' : 'client',
      data: 'Data Packer 5',
    },
    8: {
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.DATA,
      from: step % 2 === 1 ? 'client' : 'server',
      to: step % 2 === 1 ? 'server' : 'client',
      data: 'Data Packer 5',
    },
    9: {
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.FIN,
      from: 'client',
      to: 'server',
    },
    10: {
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.ACK,
      from: 'server',
      to: 'client',
    },
    11: {
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.FIN,
      from: 'server',
      to: 'client',
    },
    12: {
      id: `packet-${Date.now()}`,
      type: PACKET_TYPES.ACK,
      from: 'client',
      to: 'server',
    },
  }

  return packetStepMap[step] || null
}

export default getPacketForStep
