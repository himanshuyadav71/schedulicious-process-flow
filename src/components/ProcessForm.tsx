
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Process } from '@/lib/types';
import { getProcessColor } from '@/lib/schedulingAlgorithms';
import { Plus, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ProcessFormProps {
  onAddProcess: (process: Process) => void;
  showPriority: boolean;
}

const ProcessForm: React.FC<ProcessFormProps> = ({ onAddProcess, showPriority }) => {
  const { toast } = useToast();
  const [processCount, setProcessCount] = useState(0);
  const [processName, setProcessName] = useState('');
  const [arrivalTime, setArrivalTime] = useState('0');
  const [burstTime, setBurstTime] = useState('');
  const [priority, setPriority] = useState('0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!processName.trim()) {
      toast({
        title: "Process name required",
        description: "Please enter a name for the process.",
        variant: "destructive"
      });
      return;
    }

    if (parseInt(burstTime) <= 0) {
      toast({
        title: "Invalid burst time",
        description: "Burst time must be greater than 0.",
        variant: "destructive"
      });
      return;
    }

    // Create new process
    const newProcess: Process = {
      id: `p-${Date.now()}`,
      name: processName.trim(),
      arrivalTime: parseInt(arrivalTime) || 0,
      burstTime: parseInt(burstTime),
      priority: showPriority ? parseInt(priority) || 0 : undefined,
      color: getProcessColor(processCount),
    };

    // Add process
    onAddProcess(newProcess);
    toast({
      title: "Process added",
      description: `${newProcess.name} has been added to the queue.`
    });
    
    // Reset form
    setProcessName('');
    setBurstTime('');
    setPriority('0');
    setProcessCount(prev => prev + 1);
  };

  const resetForm = () => {
    setProcessName('');
    setArrivalTime('0');
    setBurstTime('');
    setPriority('0');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-medium">Add New Process</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="processName">Process Name</Label>
          <Input
            id="processName"
            placeholder="P1"
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="arrivalTime">Arrival Time</Label>
          <Input
            id="arrivalTime"
            type="number"
            min="0"
            placeholder="0"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="burstTime">Burst Time</Label>
          <Input
            id="burstTime"
            type="number"
            min="1"
            placeholder="4"
            value={burstTime}
            onChange={(e) => setBurstTime(e.target.value)}
            required
          />
        </div>

        {showPriority && (
          <div className="space-y-2">
            <Label htmlFor="priority">Priority (lower = higher priority)</Label>
            <Input
              id="priority"
              type="number"
              min="0"
              placeholder="0"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-end">
        <Button variant="outline" type="button" onClick={resetForm}>
          <Trash className="mr-2 h-4 w-4" /> Clear
        </Button>
        <Button type="submit">
          <Plus className="mr-2 h-4 w-4" /> Add Process
        </Button>
      </div>
    </form>
  );
};

export default ProcessForm;
