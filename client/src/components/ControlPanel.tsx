import { Html } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { Separator } from "../components/ui/separator";

interface ControlPanelProps {
  isRunning: boolean;
  simulationTime: number;
  velocityA: number;
  velocityB: number;
  onToggleSimulation: () => void;
  onReset: () => void;
  onVelocityAChange: (value: number) => void;
  onVelocityBChange: (value: number) => void;
}

export default function ControlPanel({
  isRunning,
  simulationTime,
  velocityA,
  velocityB,
  onToggleSimulation,
  onReset,
  onVelocityAChange,
  onVelocityBChange
}: ControlPanelProps) {
  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Html position={[-25, 15, 0]} transform occlude>
      <Card className="w-80 bg-gray-900 text-white border-gray-700">
        <CardHeader>
          <CardTitle className="text-center text-lg">
            Simulation Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Simulation time */}
          <div className="text-center">
            <p className="text-sm text-gray-300 mb-1">Simulation Time</p>
            <p className="text-xl font-mono text-blue-400">
              {formatTime(simulationTime)}
            </p>
          </div>

          <Separator className="bg-gray-700" />

          {/* Control buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onToggleSimulation}
              variant={isRunning ? "destructive" : "default"}
              className="flex-1"
            >
              {isRunning ? "Pause" : "Play"}
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1 border-gray-600 text-white hover:bg-gray-800"
            >
              Reset
            </Button>
          </div>

          <Separator className="bg-gray-700" />

          {/* Ship A velocity control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-green-400">
                Ship A Velocity
              </label>
              <span className="text-sm text-gray-300">
                {(velocityA * 100).toFixed(1)}% c
              </span>
            </div>
            <Slider
              value={[velocityA]}
              onValueChange={(value) => onVelocityAChange(value[0])}
              max={0.95}
              min={0.1}
              step={0.01}
              className="w-full"
            />
          </div>

          {/* Ship B velocity control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-red-400">
                Ship B Velocity
              </label>
              <span className="text-sm text-gray-300">
                {(velocityB * 100).toFixed(1)}% c
              </span>
            </div>
            <Slider
              value={[velocityB]}
              onValueChange={(value) => onVelocityBChange(value[0])}
              max={0.95}
              min={0.1}
              step={0.01}
              className="w-full"
            />
          </div>

          <Separator className="bg-gray-700" />

          {/* Physics info */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Green ship: Straight spacetime path</p>
            <p>• Red ship: Curved spacetime path</p>
            <p>• Time dilation: t' = t/γ</p>
            <p>• γ = 1/√(1 - v²/c²)</p>
          </div>

          {/* Keyboard shortcuts */}
          <div className="text-xs text-gray-500">
            <p>Shortcuts: SPACE = Pause/Play, R = Reset</p>
          </div>
        </CardContent>
      </Card>
    </Html>
  );
}
