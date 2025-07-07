import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  text: string;
  link?: string;
  icon?: any;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return null;
  }

  const heading = items[items.length - 1].text;

  return (
    <div className="flex justify-between items-center text-gray-500 m-2">
      <div className="font-medium text-xl">{heading}</div>
      <div className="flex items-center">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div className="mx-2">
                <span>&gt;</span>
              </div>
            )}
            {item.link ? (
              <Link to={item.link} className="flex flex-row hover:underline text-sm">
                {item.icon && <div className="mt-1 pr-1">{item.icon}</div>}
                <div>{item.text}</div>
              </Link>
            ) : (
              <span className="text-sm">{item.text}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumb;
