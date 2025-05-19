import { TCP_IP_LAYER_NAMES, type TCPIPLayerName } from '@/data'

export type LayerDirection = 'up' | 'down' | 'across'

type LayerInfoMap = Record<TCPIPLayerName, { down: string; up: string }>

const layerInfoMap: LayerInfoMap = {
  [TCP_IP_LAYER_NAMES.application]: {
    down: 'Application Layer: Creating data payload',
    up: 'Application Layer: Processing data payload',
  },
  [TCP_IP_LAYER_NAMES.transport]: {
    down: 'Transport Layer: Adding TCP header (ports, sequence numbers)',
    up: 'Transport Layer: Removing TCP header (ports, sequence numbers)',
  },
  [TCP_IP_LAYER_NAMES.internet]: {
    down: 'Internet Layer: Adding IP header (addresses, routing)',
    up: 'Internet Layer: Removing IP header (addresses, routing)',
  },
  [TCP_IP_LAYER_NAMES.network_interface]: {
    down: 'Network Interface Layer: Adding MAC header (frame addressing)',
    up: 'Network Interface Layer: Removing MAC header (frame addressing)',
  },
}

function getLayerInfo(layerName: TCPIPLayerName, direction: LayerDirection) {
  if (direction === 'across') return 'Transmitting data across the network'

  const layerInfo = layerInfoMap[layerName]
  return layerInfo[direction] || ''
}

export default getLayerInfo
