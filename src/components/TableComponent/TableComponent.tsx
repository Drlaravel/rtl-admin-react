import React from 'react';

interface TableComponentProps<T> {
  headers: string[];
  data: T[];
  renderActions?: (item: T) => React.ReactNode;
}

const TableComponent = <T,>({ headers, data, renderActions }: TableComponentProps<T>) => {
  const columnCountClass = `grid-cols-${headers.length + (renderActions ? 1 : 0)}`;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1170px] text-center">
        {/* Table Header */}
        <div className={`grid ${columnCountClass} justify-items-center rounded-t-[10px] bg-primary px-5 py-4 lg:px-7.5 2xl:px-11`}>
          {headers.map((header, idx) => (
            <div key={idx} className="col">
              <h5 className="font-medium text-white">{header}</h5>
            </div>
          ))}
          {renderActions && (
            <div className="col">
              <h5 className="font-medium text-white">عملیات</h5>
            </div>
          )}
        </div>

        {/* Table Body */}
        <div className="bg-white dark:bg-boxdark rounded-b-[10px]">
          {data.map((item, rowIndex) => (
            <div key={rowIndex} className={`grid ${columnCountClass} justify-items-center border-t border-[#EEEEEE] px-5 py-4 dark:border-strokedark lg:px-7.5 2xl:px-11`}>
              {Object.values(item).map((field, colIndex) => (
                <div key={colIndex} className="col">
                  <p className="text-[#637381] dark:text-bodydark">{field}</p>
                </div>
              ))}
              {renderActions && (
                <div className="col">
                  {renderActions(item)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(TableComponent);
