
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SchedulingAlgorithm } from '@/lib/types';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface AlgorithmSelectorProps {
  selectedAlgorithm: SchedulingAlgorithm;
  onAlgorithmChange: (algorithm: SchedulingAlgorithm) => void;
  timeQuantum: number;
  onTimeQuantumChange: (quantum: number) => void;
  onRunSimulation: () => void;
  onResetSimulation: () => void;
  isRunning: boolean;
  onToggleSimulation: () => void;
  disabled: boolean;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onAlgorithmChange,
  timeQuantum,
  onTimeQuantumChange,
  onRunSimulation,
  onResetSimulation,
  isRunning,
  onToggleSimulation,
  disabled
}) => {
  const handleAlgorithmChange = (value: string) => {
    onAlgorithmChange(value as SchedulingAlgorithm);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduling Algorithm</CardTitle>
        <CardDescription>
          Select an algorithm to visualize how it schedules processes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="algorithm">Algorithm</Label>
          <Select
            value={selectedAlgorithm}
            onValueChange={handleAlgorithmChange}
            disabled={disabled}
          >
            <SelectTrigger id="algorithm" className="w-full">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FCFS">First-Come, First-Served (FCFS)</SelectItem>
              <SelectItem value="RoundRobin">Round Robin</SelectItem>
              <SelectItem value="PriorityNP">Priority (Non-preemptive)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedAlgorithm === 'RoundRobin' && (
          <div className="space-y-2">
            <Label htmlFor="timeQuantum">Time Quantum</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="timeQuantum"
                type="number"
                min="1"
                value={timeQuantum}
                onChange={(e) => onTimeQuantumChange(parseInt(e.target.value) || 1)}
                disabled={disabled}
                className="w-20"
              />
              <span className="text-muted-foreground">time units</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={onRunSimulation}
            disabled={disabled || isRunning}
            className="flex-1"
          >
            Run Simulation
          </Button>
          
          <Button
            variant="outline"
            onClick={onToggleSimulation}
            disabled={disabled}
            className="w-12"
          >
            {isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onResetSimulation}
            className="w-12"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlgorithmSelector;
