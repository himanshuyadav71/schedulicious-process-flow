
import { Process, GanttBlock, SchedulingResult } from "./types";

const processColors = [
  'bg-process-p1', 'bg-process-p2', 'bg-process-p3', 
  'bg-process-p4', 'bg-process-p5', 'bg-process-p6',
  'bg-process-p7', 'bg-process-p8'
];

export const getProcessColor = (index: number): string => {
  return processColors[index % processColors.length];
};

// First-Come, First-Served (FCFS) Algorithm
export const fcfs = (processes: Process[]): SchedulingResult => {
  // Sort processes by arrival time
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const result: Process[] = [];
  const ganttChart: GanttBlock[] = [];
  
  let currentTime = 0;
  let idleTime = 0;

  // Process each job in order of arrival
  for (let i = 0; i < sortedProcesses.length; i++) {
    const process = { ...sortedProcesses[i] };
    
    // If there's a gap between last process completion and this one's arrival
    if (process.arrivalTime > currentTime) {
      // Add idle time block to Gantt chart
      ganttChart.push({
        processId: 'idle',
        name: 'Idle',
        startTime: currentTime,
        endTime: process.arrivalTime,
        color: 'bg-process-idle'
      });
      
      idleTime += process.arrivalTime - currentTime;
      currentTime = process.arrivalTime;
    }
    
    // Set process start time
    process.startTime = currentTime;
    
    // Process executes for its burst time
    currentTime += process.burstTime;
    
    // Set process finish time
    process.finishTime = currentTime;
    
    // Calculate turnaround and waiting time
    process.turnaroundTime = process.finishTime - process.arrivalTime;
    process.waitingTime = process.turnaroundTime - process.burstTime;
    process.responseTime = process.startTime - process.arrivalTime;
    
    // Add to result and Gantt chart
    result.push(process);
    ganttChart.push({
      processId: process.id,
      name: process.name,
      startTime: process.startTime,
      endTime: process.finishTime,
      color: process.color || 'bg-process-p1'
    });
  }
  
  // Calculate averages
  const totalWaitingTime = result.reduce((sum, p) => sum + (p.waitingTime || 0), 0);
  const totalTurnaroundTime = result.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);
  const totalResponseTime = result.reduce((sum, p) => sum + (p.responseTime || 0), 0);
  const totalExecutionTime = currentTime;
  
  return {
    processes: result,
    ganttChart,
    averageWaitingTime: totalWaitingTime / result.length,
    averageTurnaroundTime: totalTurnaroundTime / result.length,
    averageResponseTime: totalResponseTime / result.length,
    cpuUtilization: ((totalExecutionTime - idleTime) / totalExecutionTime) * 100,
    throughput: result.length / totalExecutionTime
  };
};

// Round Robin Algorithm
export const roundRobin = (processes: Process[], timeQuantum: number = 2): SchedulingResult => {
  // Create deep copies to avoid modifying original data
  const processQueue: Process[] = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const result: Process[] = processQueue.map(p => ({ ...p, remainingTime: p.burstTime, startTime: undefined }));
  const ganttChart: GanttBlock[] = [];
  
  let currentTime = 0;
  let completed = 0;
  let idleTime = 0;
  const queue: Process[] = [];
  
  // Continue until all processes are completed
  while (completed < processes.length) {
    // Check for newly arrived processes
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      queue.push({ ...processQueue.shift()!, remainingTime: processQueue[0]?.burstTime });
    }
    
    // If queue is empty but processes are still arriving
    if (queue.length === 0 && processQueue.length > 0) {
      // Add idle time block
      const nextArrival = processQueue[0].arrivalTime;
      ganttChart.push({
        processId: 'idle',
        name: 'Idle',
        startTime: currentTime,
        endTime: nextArrival,
        color: 'bg-process-idle'
      });
      
      idleTime += nextArrival - currentTime;
      currentTime = nextArrival;
      continue;
    }
    
    if (queue.length === 0) break;
    
    // Get the next process from queue
    const currentProcess = queue.shift()!;
    const processIndex = result.findIndex(p => p.id === currentProcess.id);
    
    // Record start time if this is the first time the process runs
    if (result[processIndex].startTime === undefined) {
      result[processIndex].startTime = currentTime;
      result[processIndex].responseTime = currentTime - result[processIndex].arrivalTime;
    }
    
    // Calculate execution time in this quantum
    const executeTime = Math.min(timeQuantum, currentProcess.remainingTime!);
    
    // Add to Gantt chart
    ganttChart.push({
      processId: currentProcess.id,
      name: currentProcess.name,
      startTime: currentTime,
      endTime: currentTime + executeTime,
      color: currentProcess.color || 'bg-process-p1'
    });
    
    // Update current time
    currentTime += executeTime;
    
    // Update remaining time
    currentProcess.remainingTime! -= executeTime;
    result[processIndex].remainingTime = currentProcess.remainingTime;
    
    // Check for new arrivals during this time quantum
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      queue.push({ ...processQueue.shift()!, remainingTime: processQueue[0]?.burstTime });
    }
    
    // If process is not complete, add back to queue
    if (currentProcess.remainingTime! > 0) {
      queue.push(currentProcess);
    } else {
      // Process is complete
      completed++;
      result[processIndex].finishTime = currentTime;
      result[processIndex].turnaroundTime = currentTime - result[processIndex].arrivalTime;
      result[processIndex].waitingTime = result[processIndex].turnaroundTime - result[processIndex].burstTime;
    }
  }
  
  // Calculate averages
  const totalWaitingTime = result.reduce((sum, p) => sum + (p.waitingTime || 0), 0);
  const totalTurnaroundTime = result.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);
  const totalResponseTime = result.reduce((sum, p) => sum + (p.responseTime || 0), 0);
  const totalExecutionTime = currentTime;
  
  return {
    processes: result,
    ganttChart,
    averageWaitingTime: totalWaitingTime / result.length,
    averageTurnaroundTime: totalTurnaroundTime / result.length,
    averageResponseTime: totalResponseTime / result.length,
    cpuUtilization: ((totalExecutionTime - idleTime) / totalExecutionTime) * 100,
    throughput: result.length / totalExecutionTime
  };
};

// Non-preemptive Priority Scheduling
export const prioritySchedulingNP = (processes: Process[]): SchedulingResult => {
  // Create deep copies to avoid modifying original data
  const processQueue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const result: Process[] = processQueue.map(p => ({ ...p }));
  const ganttChart: GanttBlock[] = [];
  
  let currentTime = 0;
  let completed = 0;
  let idleTime = 0;
  
  const readyQueue: Process[] = [];
  
  // Continue until all processes are completed
  while (completed < processes.length) {
    // Add newly arrived processes to ready queue
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift()!);
    }
    
    // If ready queue is empty but processes are still coming
    if (readyQueue.length === 0 && processQueue.length > 0) {
      // Add idle time block
      const nextArrival = processQueue[0].arrivalTime;
      ganttChart.push({
        processId: 'idle',
        name: 'Idle',
        startTime: currentTime,
        endTime: nextArrival,
        color: 'bg-process-idle'
      });
      
      idleTime += nextArrival - currentTime;
      currentTime = nextArrival;
      continue;
    }
    
    if (readyQueue.length === 0) break;
    
    // Select process with highest priority (lower number = higher priority)
    readyQueue.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    const currentProcess = readyQueue.shift()!;
    const processIndex = result.findIndex(p => p.id === currentProcess.id);
    
    // Set start time and calculate response time
    result[processIndex].startTime = currentTime;
    result[processIndex].responseTime = currentTime - result[processIndex].arrivalTime;
    
    // Add to Gantt chart
    ganttChart.push({
      processId: currentProcess.id,
      name: currentProcess.name,
      startTime: currentTime,
      endTime: currentTime + currentProcess.burstTime,
      color: currentProcess.color || 'bg-process-p1'
    });
    
    // Update current time
    currentTime += currentProcess.burstTime;
    
    // Process is complete
    completed++;
    result[processIndex].finishTime = currentTime;
    result[processIndex].turnaroundTime = currentTime - result[processIndex].arrivalTime;
    result[processIndex].waitingTime = result[processIndex].turnaroundTime - result[processIndex].burstTime;
    
    // Check for new arrivals during process execution
    while (processQueue.length > 0 && processQueue[0].arrivalTime <= currentTime) {
      readyQueue.push(processQueue.shift()!);
    }
  }
  
  // Calculate averages
  const totalWaitingTime = result.reduce((sum, p) => sum + (p.waitingTime || 0), 0);
  const totalTurnaroundTime = result.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);
  const totalResponseTime = result.reduce((sum, p) => sum + (p.responseTime || 0), 0);
  const totalExecutionTime = currentTime;
  
  return {
    processes: result,
    ganttChart,
    averageWaitingTime: totalWaitingTime / result.length,
    averageTurnaroundTime: totalTurnaroundTime / result.length,
    averageResponseTime: totalResponseTime / result.length,
    cpuUtilization: ((totalExecutionTime - idleTime) / totalExecutionTime) * 100,
    throughput: result.length / totalExecutionTime
  };
};

// Run the selected algorithm
export const runSchedulingAlgorithm = (
  algorithm: string, 
  processes: Process[],
  timeQuantum?: number
): SchedulingResult => {
  // Apply colors to processes if not already assigned
  const processesWithColors = processes.map((process, index) => ({
    ...process,
    color: process.color || getProcessColor(index)
  }));

  switch (algorithm) {
    case 'FCFS':
      return fcfs(processesWithColors);
    case 'RoundRobin':
      return roundRobin(processesWithColors, timeQuantum || 2);
    case 'PriorityNP':
      return prioritySchedulingNP(processesWithColors);
    // Add more algorithms as needed
    default:
      return fcfs(processesWithColors);
  }
};
