import { TOTAL_STEPS } from '@/utils/getInfoText'
import { Pause, Play, SkipForward, RotateCcw } from 'lucide-react'
import { Slider } from './ui/slider'
import { Button } from './ui/button'

interface Props {
  isPlaying: boolean
  speed: number
  currentStep: number
  onChangeSpeed: (speed: number) => void
  onResetAnimation: () => void
  onStepForward: () => void
  onTogglePlay: () => void
}

function ControlsPanel(props: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={props.onTogglePlay}
          aria-label={props.isPlaying ? 'Pause' : 'Play'}
        >
          {props.isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={props.onStepForward}
          disabled={props.currentStep >= TOTAL_STEPS}
          aria-label="Step Forward"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={props.onResetAnimation}
          aria-label="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-4 flex-1">
        <span className="text-sm">Speed:</span>
        <Slider
          value={[props.speed]}
          min={0.1}
          max={1}
          step={0.1}
          onValueChange={([newSpeed]) => props.onChangeSpeed(newSpeed)}
          className="w-full max-w-xs"
        />
        <span className="text-sm w-8">{props.speed}x</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm whitespace-nowrap">
          Step: {props.currentStep}/{TOTAL_STEPS}
        </span>
      </div>
    </div>
  )
}

export default ControlsPanel
