
import React, { useState, useEffect } from 'react';
import { Process, GanttBlock, SchedulingAlgorithm, SchedulingResult } from '@/lib/types';
import { runSchedulingAlgorithm } from '@/lib/schedulingAlgorithms';
import { loadSampleData } from '@/lib/sampleData';
import ProcessForm from '@/components/ProcessForm';
import ProcessTable from '@/components/ProcessTable';
import AlgorithmSelector from '@/components/AlgorithmSelector';
import GanttChart from '@/components/GanttChart';
import StatisticsDisplay from '@/components/StatisticsDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Database } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [simulationResults, setSimulationResults] = useState<SchedulingResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1000); // milliseconds per time unit
  
  // Handle adding a new process
  const handleAddProcess = (process: Process) => {
    setProcesses([...processes, process]);
    // Reset simulation when processes change
    setSimulationResults(null);
    setCurrentTime(null);
  };

  // Handle deleting a process
  const handleDeleteProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
    // Reset simulation when processes change
    setSimulationResults(null);
    setCurrentTime(null);
  };

  // Handle reordering processes
  const handleMoveProcess = (id: string, direction: 'up' | 'down') => {
    const index = processes.findIndex(p => p.id === id);
    if (index === -1) return;
    
    const newProcesses = [...processes];
    if (direction === 'up' && index > 0) {
      [newProcesses[index - 1], newProcesses[index]] = [newProcesses[index], newProcesses[index - 1]];
    } else if (direction === 'down' && index < processes.length - 1) {
      [newProcesses[index], newProcesses[index + 1]] = [newProcesses[index + 1], newProcesses[index]];
    }
    
    setProcesses(newProcesses);
    // Reset simulation when processes change
    setSimulationResults(null);
    setCurrentTime(null);
  };

  // Load sample data
  const handleLoadSample = () => {
    const sampleData = loadSampleData();
    setProcesses(sampleData);
    setSimulationResults(null);
    setCurrentTime(null);
    toast({
      title: "Sample data loaded",
      description: "5 sample processes have been added to the queue."
    });
  };

  // Run the simulation
  const runSimulation = () => {
    if (processes.length === 0) {
      toast({
        title: "No processes to simulate",
        description: "Add at least one process before running the simulation.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const results = runSchedulingAlgorithm(algorithm, processes, timeQuantum);
      setSimulationResults(results);
      setCurrentTime(0); // Start at time 0
      toast({
        title: "Simulation complete",
        description: `Successfully ran ${algorithm} algorithm on ${processes.length} processes.`
      });
    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "Simulation error",
        description: "An error occurred while running the simulation.",
        variant: "destructive"
      });
    }
  };

  // Reset the simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentTime(null);
    setSimulationResults(null);
  };

  // Toggle the simulation running state
  const toggleSimulation = () => {
    if (!simulationResults) {
      runSimulation();
      setIsRunning(true);
      return;
    }
    setIsRunning(!isRunning);
  };

  // Animation effect for running simulation
  useEffect(() => {
    if (!isRunning || !simulationResults) return;
    
    // Find the maximum time in the simulation
    const maxTime = simulationResults.ganttChart.reduce(
      (max, block) => Math.max(max, block.endTime),
      0
    );
    
    // If current time is at or past the max time, stop simulation
    if (currentTime !== null && currentTime >= maxTime) {
      setIsRunning(false);
      return;
    }
    
    // Advance time
    const timer = setTimeout(() => {
      if (currentTime !== null) {
        setCurrentTime(currentTime + 1);
      }
    }, simulationSpeed);
    
    return () => clearTimeout(timer);
  }, [isRunning, currentTime, simulationResults, simulationSpeed]);

  // Check if the current algorithm requires priority values
  const showPriority = algorithm === 'PriorityNP' || algorithm === 'PriorityP';

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">CPU Process Scheduling Simulator</h1>
        <p className="text-muted-foreground mt-2">
          Visualize how different scheduling algorithms work in operating systems
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Process Queue</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLoadSample}
                className="flex items-center gap-1"
              >
                <Database className="h-4 w-4" />
                Load Sample Data
              </Button>
            </div>
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="table">Process List</TabsTrigger>
                <TabsTrigger value="form">Add Process</TabsTrigger>
              </TabsList>
              <TabsContent value="table">
                <ProcessTable 
                  processes={processes}
                  onDeleteProcess={handleDeleteProcess}
                  onMoveProcess={handleMoveProcess}
                  showPriority={showPriority}
                />
              </TabsContent>
              <TabsContent value="form">
                <ProcessForm 
                  onAddProcess={handleAddProcess} 
                  showPriority={showPriority}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Gantt Chart</h2>
            <GanttChart 
              blocks={simulationResults?.ganttChart || []} 
              currentTime={currentTime}
            />
          </div>
        </div>

        <div>
          <AlgorithmSelector 
            selectedAlgorithm={algorithm}
            onAlgorithmChange={setAlgorithm}
            timeQuantum={timeQuantum}
            onTimeQuantumChange={setTimeQuantum}
            onRunSimulation={runSimulation}
            onResetSimulation={resetSimulation}
            isRunning={isRunning}
            onToggleSimulation={toggleSimulation}
            disabled={processes.length === 0}
          />
        </div>
      </div>

      {simulationResults && (
        <StatisticsDisplay 
          processes={simulationResults.processes}
          averageWaitingTime={simulationResults.averageWaitingTime}
          averageTurnaroundTime={simulationResults.averageTurnaroundTime}
          averageResponseTime={simulationResults.averageResponseTime}
          cpuUtilization={simulationResults.cpuUtilization}
          throughput={simulationResults.throughput}
        />
      )}
    </div>
  );
};

export default Index;
