import { TCP_IP_LAYER_NAMES, type TCPIPLayerName } from '@/data'

/**
 * Up the stack = receiving data (e.g. parsing headers, delivering data to app)
 * Down the stack = sending data (e.g. wrapping data with headers to send)
 */
const layerInfoMap: Record<TCPIPLayerName, { down: string; up: string }> = {
  [TCP_IP_LAYER_NAMES.application]: {
    down: 'Application Layer: Creating data payload',
    up: 'Application Layer: Consuming data payload',
  },
  [TCP_IP_LAYER_NAMES.transport]: {
    down: 'Transport Layer: Adding TCP header (ports, sequence numbers)',
    up: 'Transport Layer: Parsing TCP header (ports, sequence numbers)',
  },
  [TCP_IP_LAYER_NAMES.internet]: {
    down: 'Internet Layer: Adding IP header (addresses, routing)',
    up: 'Internet Layer: Parsing IP header (addresses, routing)',
  },
  [TCP_IP_LAYER_NAMES.network_interface]: {
    down: 'Network Interface Layer: Adding Ethernet frame header (MAC addressing)',
    up: 'Network Interface Layer: Parsing Ethernet frame header (MAC addressing)',
  },
  [TCP_IP_LAYER_NAMES.transmission]: {
    down: 'Transmission Layer: Transmitting data across the network',
    up: 'Transmission Layer: Receiving data across the network',
  },
}

const STAGE_TO_LAYER: Record<number, TCPIPLayerName> = {
  0: TCP_IP_LAYER_NAMES.application,
  1: TCP_IP_LAYER_NAMES.transport,
  2: TCP_IP_LAYER_NAMES.internet,
  3: TCP_IP_LAYER_NAMES.network_interface,
  4: TCP_IP_LAYER_NAMES.transmission,
  5: TCP_IP_LAYER_NAMES.network_interface,
  6: TCP_IP_LAYER_NAMES.internet,
  7: TCP_IP_LAYER_NAMES.transport,
  8: TCP_IP_LAYER_NAMES.application,
}

function getLayerInfoForStage(stage: number, isClientToServer: boolean) {
  const layerName = STAGE_TO_LAYER[stage]
  const layerInfo = layerInfoMap[layerName]
  return isClientToServer ? layerInfo.down : layerInfo.up
}

export default getLayerInfoForStage
