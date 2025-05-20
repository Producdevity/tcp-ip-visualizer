import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TCP_IP_LAYERS, PACKET_TYPES } from '@/data'

type Tab = 'overview' | 'layers' | 'packets'

type TabOption = {
  value: Tab
  label: string
}

const TABS: TabOption[] = [
  { value: 'overview', label: 'TCP/IP Protocol Overview' },
  { value: 'layers', label: 'TCP/IP Layers' },
  { value: 'packets', label: 'Packet Types' },
]

const [overviewTab, layersTab, packetsTab] = TABS

function ProtocolOverview() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as Tab)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3">
        {TABS.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={overviewTab.value} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{overviewTab.label}</CardTitle>
            <CardDescription>
              The Transmission Control Protocol/Internet Protocol (TCP/IP) is
              the basic communication language of the Internet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">TCP/IP uses a four-layer model:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>
                <span className="font-medium">Application Layer:</span>{' '}
                Interfaces with applications (HTTP, FTP, SMTP)
              </li>
              <li>
                <span className="font-medium">Transport Layer:</span> Provides
                end-to-end communication (TCP, UDP)
              </li>
              <li>
                <span className="font-medium">Internet Layer:</span> Handles
                packet routing (IP)
              </li>
              <li>
                <span className="font-medium">Network Interface Layer:</span>{' '}
                Transmits data between devices (Ethernet, Wi-Fi)
              </li>
            </ul>
            <p className="mt-4 text-sm">
              The visualization demonstrates three key processes:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>
                <span className="font-medium">Three-way Handshake:</span>{' '}
                Establishes a connection
              </li>
              <li>
                <span className="font-medium">Data Transfer:</span> Sends data
                packets between client and server
              </li>
              <li>
                <span className="font-medium">Connection Termination:</span>{' '}
                Closes the connection
              </li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value={layersTab.value} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{layersTab.label}</CardTitle>
            <CardDescription>
              The four layers of the TCP/IP model and their functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TCP_IP_LAYERS.map((layer, index: number) => (
                <div key={layer.name} className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: layer.color }}
                  />
                  <div>
                    <h4 className="font-medium">{layer.name} Layer</h4>
                    <p className="text-sm text-muted-foreground">
                      {index === 0 &&
                        'Interfaces with applications (HTTP, FTP, SMTP)'}
                      {index === 1 &&
                        'Provides end-to-end communication (TCP, UDP)'}
                      {index === 2 && 'Handles packet routing (IP)'}
                      {index === 3 &&
                        'Transmits data between devices (Ethernet, Wi-Fi)'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value={packetsTab.value} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{packetsTab.label}</CardTitle>
            <CardDescription>
              Different types of packets used in TCP/IP communication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(PACKET_TYPES).map((packet) => (
                <div key={packet.name} className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: packet.color }}
                  />
                  <div>
                    <h4 className="font-medium">{packet.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {packet.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default ProtocolOverview
