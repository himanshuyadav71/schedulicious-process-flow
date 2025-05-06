
import { Process } from './types';
import { getProcessColor } from './schedulingAlgorithms';

export const sampleProcesses: Process[] = [
  {
    id: 'sample-1',
    name: 'P1',
    arrivalTime: 0,
    burstTime: 5,
    priority: 1,
    color: getProcessColor(0)
  },
  {
    id: 'sample-2',
    name: 'P2',
    arrivalTime: 1,
    burstTime: 3,
    priority: 2,
    color: getProcessColor(1)
  },
  {
    id: 'sample-3',
    name: 'P3',
    arrivalTime: 2,
    burstTime: 8,
    priority: 1,
    color: getProcessColor(2)
  },
  {
    id: 'sample-4',
    name: 'P4',
    arrivalTime: 3,
    burstTime: 2,
    priority: 3,
    color: getProcessColor(3)
  },
  {
    id: 'sample-5',
    name: 'P5',
    arrivalTime: 4,
    burstTime: 4,
    priority: 2,
    color: getProcessColor(4)
  }
];

export const loadSampleData = (): Process[] => {
  return sampleProcesses.map(process => ({
    ...process,
    id: `sample-${Date.now()}-${process.name}`
  }));
};
