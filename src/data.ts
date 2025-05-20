import type { LucideIcon } from 'lucide-react'
import type { ValueOf } from './utils/types'
import { Power, Check, CheckCircle, Package, Repeat, Send } from 'lucide-react'

export const TCP_IP_LAYER_NAMES = {
  application: 'Application',
  transport: 'Transport',
  internet: 'Internet',
  network_interface: 'Network Interface',
  transmission: 'Transmission', // Not a real layer, but used for animation purposes
} as const

export type TCPIPLayerName = ValueOf<typeof TCP_IP_LAYER_NAMES>

export type TCPIPLayer = {
  name: TCPIPLayerName
  color: string
  header: string
}

export const TCP_IP_LAYERS: TCPIPLayer[] = [
  {
    name: TCP_IP_LAYER_NAMES.application,
    color: '#f97316',
    header: 'HTTP/FTP Header',
  },
  {
    name: TCP_IP_LAYER_NAMES.transport,
    color: '#8b5cf6',
    header: 'TCP Header',
  },
  {
    name: TCP_IP_LAYER_NAMES.internet,
    color: '#06b6d4',
    header: 'IP Header',
  },
  {
    name: TCP_IP_LAYER_NAMES.network_interface,
    color: '#22c55e',
    header: 'Ethernet Frame',
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
  icon: LucideIcon
  color: string
  description: string
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
  SYN: {
    name: 'SYN',
    icon: Send,
    color: '#f97316',
    description: 'Synchronize: Initiates a connection',
  },
  SYN_ACK: {
    name: 'SYN-ACK',
    icon: Repeat,
    color: '#8b5cf6',
    description: 'Synchronize-Acknowledge: Acknowledges SYN and sends SYN',
  },
  ACK: {
    name: 'ACK',
    icon: Check,
    color: '#06b6d4',
    description: 'Acknowledge: Confirms receipt of packets',
  },
  DATA: {
    name: 'DATA',
    icon: Package,
    color: '#22c55e',
    description: 'Data: Contains actual information being transferred',
  },
  FIN: {
    name: 'FIN',
    icon: Power,
    color: '#ef4444',
    description: 'Finish: Initiates connection termination',
  },
  FIN_ACK: {
    name: 'FIN-ACK',
    icon: CheckCircle,
    color: '#f59e0b',
    description: 'Finish-Acknowledge: Acknowledges FIN request',
  },
}
