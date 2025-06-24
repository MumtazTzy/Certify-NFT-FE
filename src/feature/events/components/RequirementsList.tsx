import React from 'react';

interface RequirementsListProps {
  requirements: string[];
}

const RequirementsList: React.FC<RequirementsListProps> = ({ requirements = [] }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
    <ul className="space-y-2">
      {requirements.map((req, index) => (
        <li key={index} className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
          <span className="text-gray-700">{req}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default RequirementsList;