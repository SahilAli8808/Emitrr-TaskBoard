import React from 'react';
import './DashboardCard.css';

interface DashboardCardProps {
  bgColor: string;
  icon: any;
  value: string | number;
  description: string;
  additionalField?: any;
  loading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  bgColor,
  icon,
  value,
  description,
  additionalField,
  loading = false
}) => {
  return (
    <div className="lg:w-1/4 sm:w-1/2 mb-1">
      <div className="flex flex-wrap">
        <div
          style={{ width: '400px', height: '130px', backgroundColor: bgColor }}
          className="p-4 m-1 shadow-md rounded-md"
        >
          <div className="flex items-center">
            <div>
              <p className="text-white" style={{ fontSize: '30px' }}>
                <strong className={loading ? 'animate-pulse' : ''}>
                  {additionalField}
                </strong>
              </p>
              <h3 className="text-base font-semibold leading-tight text-white">{value}</h3>
              <p className="text-white text-sm">{description}</p>
            </div>
            <div className="flex-shrink-0 ml-auto">
              <div className="flex items-center justify-center h-12 w-12 icon">
                {icon}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
