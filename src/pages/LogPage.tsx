// src/pages/LogPage.tsx

import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import LogFileList from '../components/logs/LogFileList';
import LogViewer from '../components/logs/LogViewer';

const LogPage: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('');

  const handleFileSelect = (fileId: string) => {
    setSelectedFileId(fileId);
  };

  return (
    <>
      <Breadcrumb pageName="لاگ‌های سیستم" />
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div className="md:col-span-1">
          <div className="rounded-md bg-white p-4 shadow-default dark:border-gray-700 dark:bg-boxdark">
            <LogFileList onSelectFile={handleFileSelect} />
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="rounded-md bg-white p-4 shadow-default dark:border-gray-700 dark:bg-boxdark">
            <LogViewer fileIdentifier={selectedFileId} />
          </div>
        </div>
      </div>
    </>
  );
};

export default LogPage;
