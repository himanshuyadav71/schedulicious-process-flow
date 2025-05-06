
export interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
  color?: string;
  remainingTime?: number;
  startTime?: number;
  finishTime?: number;
  waitingTime?: number;
  turnaroundTime?: number;
  responseTime?: number;
}

export interface GanttBlock {
  processId: string;
  name: string;
  startTime: number;
  endTime: number;
  color: string;
}

export interface ExecutionStep {
  time: number;
  activeProcess: string | null;
  remainingBurstTimes: Record<string, number>;
  waitingProcesses: string[];
  completedProcesses: string[];
}

export interface SchedulingResult {
  ganttChart: GanttBlock[];
  processes: Process[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number;
  throughput: number;
}

export type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'RoundRobin' | 'PriorityNP' | 'PriorityP';

export interface SimulationState {
  currentTime: number;
  isRunning: boolean;
  speed: number;
  executionSteps: ExecutionStep[];
  currentStepIndex: number;
}
