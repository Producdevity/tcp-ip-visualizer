import { Info } from 'lucide-react'

interface Props {
  text: string
}

function InfoPanel(props: Props) {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <div className="flex items-start space-x-2">
        <Info className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <p className="text-sm">{props.text}</p>
      </div>
    </div>
  )
}

export default InfoPanel
