import { useEffect, useState } from 'react';

// Define the structure for graph data
interface PropertyGraphData {
  trend: 'good' | 'bad';
  dataPoints: { year: number; value: number }[]; // Example data structure for graph points
}

// Define the props type
interface PropertyGraphProps {
  propertyId: string;
}

export function PropertyGraph({ propertyId }: PropertyGraphProps) {
  const [graphData, setGraphData] = useState<PropertyGraphData | null>(null);

  useEffect(() => {
    // Mock API call (replace with actual API integration later)
    setGraphData({
      trend: 'good',
      dataPoints: [
        { year: 2020, value: 100 },
        { year: 2021, value: 120 },
        { year: 2022, value: 140 },
        { year: 2023, value: 160 },
      ],
    });
  }, [propertyId]);

  if (!graphData) {
    return <p>Loading Property Graph...</p>;
  }

  return (
    <div className="rounded-lg border border-gray-300 bg-white shadow-lg overflow-hidden p-3 mt-4">
      <h2 className="text-lg font-semibold mb-2">Price Trends</h2>
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {graphData.trend === 'good' ? (
          <span className="text-green-500">Graph Placeholder (Good Trend)</span>
        ) : (
          <span className="text-red-500">Graph Placeholder (Bad Trend)</span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="font-medium mb-1">Yearly Data Points:</h3>
        <ul className="list-disc ml-6 text-sm">
          {graphData.dataPoints.map((point) => (
            <li key={point.year}>
              <span className="font-medium">{point.year}:</span> {point.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
