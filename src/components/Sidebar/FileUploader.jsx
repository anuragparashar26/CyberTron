import React from 'react';

const FileUploader = ({ onFileUpload }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileUpload(file);
        }
    };

    return (
        <div className="mb-6">
            <h2 className="text-lg font-bold mb-4">File Uploader</h2>
            <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600"
            />
        </div>
    );
};

export default FileUploader;
