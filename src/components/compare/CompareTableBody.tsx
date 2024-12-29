import React from 'react';
import { Property } from '../../types';
import { PROPERTY_FEATURES } from '../../constants/propertyFeatures';

interface CompareTableBodyProps {
  properties: Property[];
}

export function CompareTableBody({ properties }: CompareTableBodyProps) {
  return (
    <tbody>
      {PROPERTY_FEATURES.map(({ label, key }) => (
        <tr key={key} className="border-t">
          <td className="p-4 font-medium bg-gray-50">{label}</td>
          {properties.map(property => (
            <td key={property.id} className="p-4">
              {key === 'price' 
                ? `$${property[key].toLocaleString()}`
                : property[key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}