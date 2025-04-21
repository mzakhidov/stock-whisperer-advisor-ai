
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

type ComparisonFeature = {
  feature: string;
  Freemium: boolean | string;
  Plus: boolean | string;
  Pro: boolean | string;
};

interface PlanComparisonTableProps {
  comparisonFeatures: ComparisonFeature[];
}

const PLANS = ["Freemium", "Plus", "Pro"];

const PlanComparisonTable: React.FC<PlanComparisonTableProps> = ({ comparisonFeatures }) => (
  <div className="overflow-x-auto">
    <Table className="min-w-[400px] w-full border rounded-xl bg-white shadow-md">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3 font-bold text-lg">Feature</TableHead>
          {PLANS.map((plan) => (
            <TableHead key={plan} className="text-center font-bold text-lg">{plan}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {comparisonFeatures.map((item) => (
          <TableRow key={item.feature}>
            <TableCell className="py-3 font-medium">{item.feature}</TableCell>
            {PLANS.map((plan) => (
              <TableCell key={plan} className="text-center">
                {typeof item[plan] === "boolean" ? (
                  item[plan] ? (
                    <span className="inline-block text-green-600 text-xl font-bold">&#10003;</span>
                  ) : (
                    <span className="inline-block text-gray-400 text-xl font-bold">&#8212;</span>
                  )
                ) : (
                  <span className="font-semibold">{item[plan]}</span>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default PlanComparisonTable;
