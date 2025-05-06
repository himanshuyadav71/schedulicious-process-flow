
import React from 'react';
import { Process } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface StatisticsDisplayProps {
  processes: Process[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  cpuUtilization: number;
  throughput: number;
}

const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({
  processes,
  averageWaitingTime,
  averageTurnaroundTime,
  averageResponseTime,
  cpuUtilization,
  throughput
}) => {
  if (!processes.length) return null;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Results & Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-muted rounded-md p-3 text-center">
            <p className="text-sm text-muted-foreground">Avg. Waiting</p>
            <p className="text-2xl font-semibold">{averageWaitingTime.toFixed(2)}</p>
          </div>
          <div className="bg-muted rounded-md p-3 text-center">
            <p className="text-sm text-muted-foreground">Avg. Turnaround</p>
            <p className="text-2xl font-semibold">{averageTurnaroundTime.toFixed(2)}</p>
          </div>
          <div className="bg-muted rounded-md p-3 text-center">
            <p className="text-sm text-muted-foreground">Avg. Response</p>
            <p className="text-2xl font-semibold">{averageResponseTime.toFixed(2)}</p>
          </div>
          <div className="bg-muted rounded-md p-3 text-center">
            <p className="text-sm text-muted-foreground">CPU Utilization</p>
            <p className="text-2xl font-semibold">{cpuUtilization.toFixed(1)}%</p>
          </div>
          <div className="bg-muted rounded-md p-3 text-center">
            <p className="text-sm text-muted-foreground">Throughput</p>
            <p className="text-2xl font-semibold">{throughput.toFixed(3)}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Process</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Burst</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Finish</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Waiting</TableHead>
                <TableHead>Turnaround</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`${process.color} w-3 h-3 rounded-full`}></div>
                      <span className="font-medium">{process.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{process.arrivalTime}</TableCell>
                  <TableCell>{process.burstTime}</TableCell>
                  <TableCell>{process.startTime}</TableCell>
                  <TableCell>{process.finishTime}</TableCell>
                  <TableCell>{process.responseTime}</TableCell>
                  <TableCell>{process.waitingTime}</TableCell>
                  <TableCell>{process.turnaroundTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsDisplay;
