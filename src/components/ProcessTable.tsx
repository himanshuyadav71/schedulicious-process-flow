
import React from 'react';
import { Process } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProcessTableProps {
  processes: Process[];
  onDeleteProcess: (id: string) => void;
  onMoveProcess: (id: string, direction: 'up' | 'down') => void;
  showPriority: boolean;
}

const ProcessTable: React.FC<ProcessTableProps> = ({ 
  processes, 
  onDeleteProcess, 
  onMoveProcess,
  showPriority
}) => {
  if (!processes.length) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No processes added yet</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Arrival Time</TableHead>
            <TableHead>Burst Time</TableHead>
            {showPriority && <TableHead>Priority</TableHead>}
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {processes.map((process, index) => (
            <TableRow key={process.id}>
              <TableCell>
                <div className={`${process.color} w-6 h-6 rounded-full`}></div>
              </TableCell>
              <TableCell className="font-medium">{process.name}</TableCell>
              <TableCell>{process.arrivalTime}</TableCell>
              <TableCell>{process.burstTime}</TableCell>
              {showPriority && <TableCell>{process.priority}</TableCell>}
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onMoveProcess(process.id, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onMoveProcess(process.id, 'down')}
                    disabled={index === processes.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteProcess(process.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProcessTable;
