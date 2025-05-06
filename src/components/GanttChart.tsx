
import React from 'react';
import { GanttBlock } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GanttChartProps {
  blocks: GanttBlock[];
  currentTime: number | null;
}

const GanttChart: React.FC<GanttChartProps> = ({ blocks, currentTime }) => {
  if (!blocks.length) {
    return (
      <div className="h-16 border border-dashed rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No simulation data to display</p>
      </div>
    );
  }

  // Calculate total time for scaling
  const totalTime = blocks.reduce((max, block) => Math.max(max, block.endTime), 0);
  
  return (
    <div className="space-y-2">
      <div className="relative h-16 flex">
        {blocks.map((block, index) => {
          const width = ((block.endTime - block.startTime) / totalTime) * 100;
          const isActive = currentTime !== null && 
                          currentTime >= block.startTime && 
                          currentTime < block.endTime;
          
          return (
            <div
              key={index}
              className={cn(
                "process-block",
                block.color,
                isActive && "border-2 border-yellow-300"
              )}
              style={{ 
                width: `${width}%`,
                minWidth: width > 1 ? undefined : '1.5%' // Ensure tiny blocks are still visible
              }}
            >
              <div className="text-xs">
                {block.name !== "Idle" ? block.name : ""}
              </div>
              {isActive && <div className="execution-pointer"></div>}
            </div>
          );
        })}
      </div>
      
      <div className="relative h-6 border-t flex text-xs font-mono text-gray-600">
        {blocks.map((block, index) => {
          const width = ((block.endTime - block.startTime) / totalTime) * 100;
          
          return (
            <React.Fragment key={`time-${index}`}>
              {index === 0 && (
                <div className="absolute -top-3 -left-1 border-l border-gray-300 pl-1">
                  {block.startTime}
                </div>
              )}
              <div 
                className="flex-shrink-0"
                style={{ 
                  width: `${width}%`,
                  minWidth: width > 1 ? undefined : '1.5%'
                }}
              >
                <div className="absolute -top-3 border-l border-gray-300 pl-1">
                  {block.endTime}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default GanttChart;
