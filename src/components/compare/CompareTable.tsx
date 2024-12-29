import React from 'react';
import { Property } from '../../types';
import { CompareTableHeader } from './CompareTableHeader';
import { CompareTableBody } from './CompareTableBody';

interface CompareTableProps {
  properties: Property[];
  onRemove: (id: string) => void;
}

export function CompareTable({ properties, onRemove }: CompareTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="w-full">
        <CompareTableHeader properties={properties} onRemove={onRemove} />
        <CompareTableBody properties={properties} />
      </table>
    </div>
  );
}