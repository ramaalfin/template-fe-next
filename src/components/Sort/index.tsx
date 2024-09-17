import React from 'react'

import ArrowDown from '../ui/arrowDown'
import ArrowUp from '../ui/arrowUp'

interface SortProps {
  column: string;
  sortConfig: any;
  onSort: (column: string) => void;
}

const Sort: React.FC<SortProps> = ({ column, sortConfig, onSort }) => {
  const { key, direction } = sortConfig

  return (
    <div className=''>
      <ArrowUp
        className={`text-white w-3 p-0 cursor-pointer ${key === column && direction === 'asc' ? 'text-gray-500' : ''}`}
        onClick={() => onSort(column)}
      />
      <ArrowDown
        className={`text-white w-3 p-0 cursor-pointer ${key === column && direction === 'desc' ? 'text-gray-500' : ''}`}
        onClick={() => onSort(column)}
      />
    </div>
  )
}

export default Sort