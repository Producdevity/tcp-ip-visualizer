import { ANIMATION_STATES } from '@/data'
import type { ValueOf } from '@/utils/types'

type AnimationState = ValueOf<typeof ANIMATION_STATES>

const animationStateTextMap: Record<AnimationState, string> = {
  [ANIMATION_STATES.IDLE]: 'Ready',
  [ANIMATION_STATES.HANDSHAKE]: 'Establishing Connection',
  [ANIMATION_STATES.DATA_TRANSFER]: 'Transferring Data',
  [ANIMATION_STATES.TERMINATION]: 'Terminating Connection',
  [ANIMATION_STATES.COMPLETE]: 'Connection Closed',
}

interface Props {
  animationState: AnimationState
}

function ConnectionStatus(props: Props) {
  const pulseClassName =
    props.animationState === ANIMATION_STATES.IDLE
      ? 'bg-yellow-500'
      : props.animationState === ANIMATION_STATES.COMPLETE
        ? 'bg-green-500'
        : 'bg-blue-500 animate-pulse'

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-sm">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${pulseClassName}`} />
        <span className="text-sm font-medium">
          {animationStateTextMap[props.animationState]}
        </span>
      </div>
    </div>
  )
}

export default ConnectionStatus
