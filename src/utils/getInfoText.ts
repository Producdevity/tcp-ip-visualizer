const infoTextMap: Record<number, string | null> = {
  0: 'Step 1: Client sends SYN packet to initiate connection',
  1: 'Step 2: Server responds with SYN-ACK packet',
  2: 'Step 3: Client sends ACK packet, completing the three-way handshake',
  3: 'Step 4: Connection established, data transfer begins',
  4: null, // Data packet 1
  5: null, // Data packet 2
  6: null, // Data packet 3
  7: null, // Data packet 4
  8: 'Step 9: Final data packet sent',
  9: 'Step 10: Client initiates connection termination with FIN packet',
  10: 'Step 11: Server acknowledges with ACK',
  11: 'Step 12: Server sends its own FIN packet',
  12: 'Step 13: Client acknowledges with final ACK',
  13: 'Step 14: Connection terminated',
}

export const TOTAL_STEPS = Object.keys(infoTextMap).length

function getInfoText(step: number) {
  const infoText = infoTextMap[step]

  return infoText
    ? infoText
    : `Step ${step + 1}: Data packet ${step - 3} being transferred`
}

export default getInfoText
