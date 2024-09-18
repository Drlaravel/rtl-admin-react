// src/components/DropdownMenu/DropdownMenu.jsx
import React, { useState } from 'react';

const DropdownMenu = ({ actions }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative h-full">
      <button
        className="shadow-11 float-right inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-black hover:text-primary dark:bg-meta-4 dark:text-white dark:shadow-none"
        onClick={toggleDropdown}
      >
        عملیات
        <svg
          className="fill-current"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.00039 11.4C7.85039 11.4 7.72539 11.35 7.60039 11.25L1.85039 5.60005C1.62539 5.37505 1.62539 5.02505 1.85039 4.80005C2.07539 4.57505 2.42539 4.57505 2.65039 4.80005L8.00039 10.025L13.3504 4.75005C13.5754 4.52505 13.9254 4.52505 14.1504 4.75005C14.3754 4.97505 14.3754 5.32505 14.1504 5.55005L8.40039 11.2C8.27539 11.325 8.15039 11.4 8.00039 11.4Z"
            fill=""
          ></path>
        </svg>
      </button>

      {isOpen && (
        <div className="max-w-39.5 shadow-12 absolute right-0 z-1 w-full rounded-[5px] bg-white py-2.5 dark:bg-boxdark top-full mt-1">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`flex w-full px-4 py-2 text-sm ${action.className} hover:bg-whiter hover:text-primary dark:hover:bg-meta-4`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
