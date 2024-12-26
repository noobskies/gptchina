import React, { forwardRef } from 'react';

type FileUploadProps = {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ children, handleFileChange }, ref) => {
    return (
      <>
        {children}
        <input
          ref={ref}
          multiple
          type="file"
          accept=".pdf,.doc,.docx,.txt,image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </>
    );
  },
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
