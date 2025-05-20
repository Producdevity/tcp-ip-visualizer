import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Info,
  Laptop,
  Pause,
  Play,
  RotateCcw,
  Server,
  SkipForward,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ANIMATION_STATES, TCP_IP_LAYERS } from './data'
import getPacketForStep, { type PacketStep } from './utils/getPacketForStep'
import getInfoText, { TOTAL_STEPS } from './utils/getInfoText'
import getLayoutInfoForStage from './utils/getLayerInfoForStage'
import ProtocolOverview, { type Tab } from './components/ProtocolOverview'
import EncapsulatedPacket from './components/EncapsulatedPacket'
import ConnectionStatus from './components/ConnectionStatus'

const BASE_DURATION = 4000

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [animationState, setAnimationState] = useState(ANIMATION_STATES.IDLE)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(0.5)
  const [currentStep, setCurrentStep] = useState(0)
  const [packets, setPackets] = useState<PacketStep[]>([])
  const [layerInfo, setLayerInfo] = useState('')
  const [currentPacketStage, setCurrentPacketStage] = useState(0)
  const [infoText, setInfoText] = useState(
    'Click Play to start the TCP/IP visualization',
  )

  const animationTimer = useRef<NodeJS.Timeout | null>(null)
  // Clear any existing timers on unmount
  useEffect(() => {
    return () => {
      if (!animationTimer.current) return
      clearTimeout(animationTimer.current)
    }
  }, [])

  // Start packet animation sequence
  const startPacketAnimation = useCallback(
    (packet: PacketStep) => {
      const TOTAL_STAGES = 9
      const STAGE_DURATION = BASE_DURATION / (speed * TOTAL_STAGES)

      // Reset current stage
      setCurrentPacketStage(0)

      // Recursively advance through stages
      const advanceStage = (stage: number) => {
        if (stage >= TOTAL_STAGES) {
          // Animation complete, remove packet
          setPackets((prev) => prev.filter((p) => p.id !== packet.id))
          return
        }

        setCurrentPacketStage(stage)

        setLayerInfo(getLayoutInfoForStage(stage, packet.from === 'client'))

        // Schedule next stage
        setTimeout(() => {
          advanceStage(stage + 1)
        }, STAGE_DURATION)
      }

      advanceStage(0)
    },
    [speed],
  )

  const createPacketForStep = useCallback(
    (step: number) => {
      const newPacket = getPacketForStep(step)

      if (!newPacket) return

      setPackets((prev) => [...prev, newPacket])
      setCurrentPacketStage(0)
      startPacketAnimation(newPacket)
    },
    [startPacketAnimation],
  )

  // Handle animation steps
  useEffect(() => {
    if (!isPlaying) return

    const stepDuration = BASE_DURATION / speed

    const handleStep = () => {
      if (currentStep >= TOTAL_STEPS) {
        setIsPlaying(false)
        setAnimationState(ANIMATION_STATES.COMPLETE)
        return
      }

      if (currentStep < 3) {
        setAnimationState(ANIMATION_STATES.HANDSHAKE)
      } else if (currentStep < 10) {
        setAnimationState(ANIMATION_STATES.DATA_TRANSFER)
      } else {
        setAnimationState(ANIMATION_STATES.TERMINATION)
      }

      createPacketForStep(currentStep)
      setInfoText(getInfoText(currentStep))
      setCurrentStep((prev) => prev + 1)
    }

    animationTimer.current = setTimeout(
      handleStep,
      currentPacketStage === 0 ? stepDuration / 2 : stepDuration,
    )

    return () => {
      if (!animationTimer.current) return
      clearTimeout(animationTimer.current)
    }
  }, [isPlaying, currentStep, speed, currentPacketStage, createPacketForStep])

  const activePacketType = useMemo(
    () => (packets.length > 0 ? packets[packets.length - 1].type.name : null),
    [packets],
  )

  const togglePlay = () => {
    if (!isPlaying) setActiveTab('packets')

    if (currentStep >= TOTAL_STEPS) return resetAnimation()

    setIsPlaying(!isPlaying)
  }

  const stepForward = () => {
    if (currentStep < TOTAL_STEPS) {
      setIsPlaying(false)

      // Update animation state based on next step
      if (currentStep < 3) {
        setAnimationState(ANIMATION_STATES.HANDSHAKE)
      } else if (currentStep < 10) {
        setAnimationState(ANIMATION_STATES.DATA_TRANSFER)
      } else {
        setAnimationState(ANIMATION_STATES.TERMINATION)
      }

      createPacketForStep(currentStep)
      setInfoText(getInfoText(currentStep))
      setCurrentStep((prev) => prev + 1)
    }
  }

  const resetAnimation = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setPackets([])
    setAnimationState(ANIMATION_STATES.IDLE)
    setInfoText('Click Play to start the TCP/IP visualization')
    setLayerInfo('')
    setCurrentPacketStage(0)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center">
          TCP/IP Protocol Visualizer
        </h1>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          An interactive visualization of how the TCP/IP protocol works,
          including the three-way handshake, data transmission, and connection
          termination.
        </p>
        <div className="space-y-6">
          <ProtocolOverview
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activePacketType={activePacketType}
          />

          <div className="relative w-full h-[550px] border rounded-lg bg-background/50 overflow-hidden">
            {/* Client and Server */}
            <div className="absolute top-0 left-0 w-full h-full flex justify-between p-6">
              <div className="flex flex-col items-center">
                <Laptop className="w-16 h-16 text-primary" />
                <span className="mt-2 font-medium">Client</span>

                {/* Client TCP/IP Stack */}
                <div className="mt-4 space-y-6">
                  {TCP_IP_LAYERS.map((layer) => (
                    <div
                      key={`client-${layer.name}`}
                      className="w-40 h-14 flex items-center justify-center rounded border-2 text-xs font-medium"
                      style={{
                        borderColor: layer.color,
                        backgroundColor: `${layer.color}10`,
                      }}
                    >
                      {layer.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <Server className="w-16 h-16 text-primary" />
                <span className="mt-2 font-medium">Server</span>

                {/* Server TCP/IP Stack */}
                <div className="mt-4 space-y-6">
                  {TCP_IP_LAYERS.map((layer) => (
                    <div
                      key={`server-${layer.name}`}
                      className="w-40 h-14 flex items-center justify-center rounded border-2 text-xs font-medium"
                      style={{
                        borderColor: layer.color,
                        backgroundColor: `${layer.color}10`,
                      }}
                    >
                      {layer.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Physical Layer Connection */}
            <div className="absolute bottom-24 left-0 w-full flex justify-center">
              <div className="w-3/4 border-b-2 border-dashed border-gray-400 relative">
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 whitespace-nowrap">
                  Transmission at Physical Layer
                </div>
              </div>
            </div>

            {/* Layer Info */}
            {layerInfo && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-sm">
                <p className="text-sm font-medium">{layerInfo}</p>
              </div>
            )}

            {/* Packets */}
            {packets.map((packet) => (
              <EncapsulatedPacket
                key={packet.id}
                packet={packet}
                stage={currentPacketStage}
              />
            ))}

            <ConnectionStatus animationState={animationState} />
          </div>

          {/* Info Panel */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{infoText}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={stepForward}
                disabled={currentStep >= TOTAL_STEPS}
                aria-label="Step Forward"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={resetAnimation}
                aria-label="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            
            {/* TODO: Fix speed change during animation */}
            <div className="flex items-center space-x-4 flex-1">
              <span className="text-sm">Speed:</span>
              <Slider
                value={[speed]}
                min={0.1}
                max={1}
                step={0.1}
                onValueChange={([newSpeed]) => setSpeed(newSpeed)}
                className="w-full max-w-xs"
              />
              <span className="text-sm w-8">{speed}x</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm whitespace-nowrap">
                Step: {currentStep}/{TOTAL_STEPS}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
