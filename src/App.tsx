import { useState, useCallback, useMemo, useEffect } from 'react'
import { Laptop, Server } from 'lucide-react'
import { ANIMATION_STATES, TCP_IP_LAYERS } from './data'
import getPacketForStep, { type PacketStep } from './utils/getPacketForStep'
import getInfoText, { TOTAL_STEPS } from './utils/getInfoText'
import getLayoutInfoForStage from './utils/getLayerInfoForStage'
import ProtocolOverview, { type Tab } from './components/ProtocolOverview'
import EncapsulatedPacket, {
  DEFAULT_SPEED,
} from './components/EncapsulatedPacket'
import ConnectionStatus from './components/ConnectionStatus'
import InfoPanel from './components/InfoPanel'
import ControlsPanel from './components/ControlsPanel'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [animationState, setAnimationState] = useState(ANIMATION_STATES.IDLE)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(DEFAULT_SPEED)
  const [currentStep, setCurrentStep] = useState(0)
  const [currentPacket, setCurrentPacket] = useState<PacketStep | null>(null)
  const [layerInfo, setLayerInfo] = useState('')
  const [infoText, setInfoText] = useState(getInfoText(null))
  const [pendingStep, setPendingStep] = useState(false)

  const createPacketForStep = useCallback((step: number) => {
    const newPacket = getPacketForStep(step)
    if (!newPacket) return null
    setCurrentPacket(newPacket)
    setLayerInfo(getLayoutInfoForStage(0, newPacket.from === 'client'))
    return newPacket
  }, [])

  const startAnimation = useCallback(() => {
    if (currentStep >= TOTAL_STEPS) {
      setIsPlaying(false)
      setAnimationState(ANIMATION_STATES.COMPLETE)
      setCurrentPacket(null)
      return
    }
    if (currentStep < 3) {
      setAnimationState(ANIMATION_STATES.HANDSHAKE)
    } else if (currentStep < 10) {
      setAnimationState(ANIMATION_STATES.DATA_TRANSFER)
    } else {
      setAnimationState(ANIMATION_STATES.TERMINATION)
    }
    setInfoText(getInfoText(currentStep))
    createPacketForStep(currentStep)
  }, [currentStep, createPacketForStep])

  const handleTogglePlay = () => {
    if (!isPlaying) setActiveTab('packets')
    if (currentStep >= TOTAL_STEPS) return handleResetAnimation()
    setIsPlaying((prev) => {
      const next = !prev
      if (next && !currentPacket) {
        startAnimation()
      }
      return next
    })
  }

  const handleStepForward = () => {
    if (currentStep >= TOTAL_STEPS) return
    if (currentPacket) {
      handlePacketComplete() // Instantly finish the current animation and move to the next step
    } else {
      setPendingStep(true)
      setInfoText(getInfoText(currentStep))
      createPacketForStep(currentStep)
    }
  }

  const handleResetAnimation = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setCurrentPacket(null)
    setAnimationState(ANIMATION_STATES.IDLE)
    setInfoText(getInfoText(null))
    setLayerInfo('')
    setPendingStep(false)
  }

  const handlePacketComplete = useCallback(() => {
    setCurrentPacket(null)
    setLayerInfo('')
    if (pendingStep) {
      setCurrentStep((prev) => prev + 1)
      setPendingStep(false)
    } else if (isPlaying) {
      setCurrentStep((prev) => prev + 1)
    }
  }, [isPlaying, pendingStep])

  useEffect(() => {
    if (
      (isPlaying || pendingStep) &&
      !currentPacket &&
      currentStep < TOTAL_STEPS
    ) {
      startAnimation()
    }
  }, [isPlaying, pendingStep, currentPacket, currentStep, startAnimation])

  const activePacketType = useMemo(
    () => (currentPacket ? currentPacket.type.name : null),
    [currentPacket],
  )

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
            <div className="absolute bottom-24 left-0 w-full flex justify-center">
              <div className="w-3/4 border-b-2 border-dashed border-gray-400 relative">
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 whitespace-nowrap">
                  Transmission at Physical Layer
                </div>
              </div>
            </div>
            {layerInfo && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-sm">
                <p className="text-sm font-medium">{layerInfo}</p>
              </div>
            )}
            {currentPacket && (
              <EncapsulatedPacket
                key={currentPacket.id}
                packet={currentPacket}
                isPlaying={isPlaying || pendingStep}
                speed={speed}
                onStageChange={(stage) => {
                  setLayerInfo(
                    getLayoutInfoForStage(
                      stage,
                      currentPacket.from === 'client',
                    ),
                  )
                }}
                onComplete={handlePacketComplete}
              />
            )}
            <ConnectionStatus animationState={animationState} />
          </div>

          <InfoPanel text={infoText} />

          <ControlsPanel
            isPlaying={isPlaying}
            currentStep={currentStep}
            speed={speed}
            onTogglePlay={handleTogglePlay}
            onChangeSpeed={setSpeed}
            onStepForward={handleStepForward}
            onResetAnimation={handleResetAnimation}
          />
        </div>
      </div>
    </main>
  )
}

export default App
