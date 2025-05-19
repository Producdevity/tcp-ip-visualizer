import type { ValueOf } from './utils/types'

export const TCP_IP_LAYER_NAMES = {
  application: 'Application',
  transport: 'Transport',
  internet: 'Internet',
  network_interface: 'Network Interface',
} as const

export type TCPIPLayerName = ValueOf<typeof TCP_IP_LAYER_NAMES>

export type TCPIPLayer = {
  name: TCPIPLayerName
  color: string
  action: string
}

export const TCP_IP_LAYERS: TCPIPLayer[] = [
  {
    name: TCP_IP_LAYER_NAMES.application,
    color: '#f97316',
    action: 'Creates data',
  },
  {
    name: TCP_IP_LAYER_NAMES.transport,
    color: '#8b5cf6',
    action: 'Adds TCP header',
  },
  {
    name: TCP_IP_LAYER_NAMES.internet,
    color: '#06b6d4',
    action: 'Adds IP header',
  },
  {
    name: TCP_IP_LAYER_NAMES.network_interface,
    color: '#22c55e',
    action: 'Adds MAC header',
  },
]

type AnimationStates = {
  IDLE: string
  HANDSHAKE: string
  DATA_TRANSFER: string
  TERMINATION: string
  COMPLETE: string
}

export const ANIMATION_STATES: AnimationStates = {
  IDLE: 'idle',
  HANDSHAKE: 'handshake',
  DATA_TRANSFER: 'data_transfer',
  TERMINATION: 'termination',
  COMPLETE: 'complete',
}

export type PacketTypeDefinition<T> = {
  name: T
  color: string
}

export type PacketTypes = {
  SYN: PacketTypeDefinition<'SYN'>
  SYN_ACK: PacketTypeDefinition<'SYN-ACK'>
  ACK: PacketTypeDefinition<'ACK'>
  DATA: PacketTypeDefinition<'DATA'>
  FIN: PacketTypeDefinition<'FIN'>
  FIN_ACK: PacketTypeDefinition<'FIN-ACK'>
}

export const PACKET_TYPES: PacketTypes = {
  SYN: { name: 'SYN', color: '#f97316' },
  SYN_ACK: { name: 'SYN-ACK', color: '#8b5cf6' },
  ACK: { name: 'ACK', color: '#06b6d4' },
  DATA: { name: 'DATA', color: '#22c55e' },
  FIN: { name: 'FIN', color: '#ef4444' },
  FIN_ACK: { name: 'FIN-ACK', color: '#f59e0b' },
}
