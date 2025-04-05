
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const StockCardSkeleton: React.FC = () => {
  return (
    <Card className="w-full border-2 border-gray-200 shadow-md overflow-hidden">
      <CardHeader className="bg-finance-navy text-white pb-2">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-7 w-24 bg-white/20" />
            <Skeleton className="h-4 w-48 mt-2 bg-white/20" />
          </div>
          <div className="flex flex-col items-end">
            <Skeleton className="h-7 w-24 bg-white/20" />
            <Skeleton className="h-4 w-20 mt-2 bg-white/20" />
          </div>
        </div>
      </CardHeader>

      <div className="bg-gray-300 py-3 px-4 text-center animate-pulse-subtle">
        <Skeleton className="h-6 w-64 mx-auto bg-white/50" />
      </div>

      <CardContent className="pt-4">
        <div className="space-y-6">
          {/* Key Metrics Section */}
          <div>
            <Skeleton className="h-6 w-40 mb-3" />
            
            <div className="space-y-4">
              {Array(3).fill(0).map((_, sectionIndex) => (
                <div key={sectionIndex}>
                  <Skeleton className="h-5 w-36 mb-3" />
                  <div className="space-y-3">
                    {Array(3).fill(0).map((_, metricIndex) => (
                      <div key={`${sectionIndex}-${metricIndex}`} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-2.5 w-full rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          {/* Detailed Stats Section */}
          <div>
            <Skeleton className="h-6 w-40 mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                {Array(4).fill(0).map((_, i) => (
                  <div key={`left-${i}`}>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {Array(4).fill(0).map((_, i) => (
                  <div key={`right-${i}`}>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Analyst Ratings Section */}
          <div>
            <Skeleton className="h-6 w-40 mb-3" />
            <Skeleton className="h-4 w-full mb-1 rounded-full" />
            <div className="flex justify-between pt-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-6">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5 mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCardSkeleton;
