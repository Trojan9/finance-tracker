import React from 'react';

interface ImageUploadProps {
    url: string;
    onUpload: (file: File) => void;
    onRemove: () => void;
    label: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ url, onUpload, onRemove, label }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };
    const renderFilePreview = (label: string, url: string) => {
        if (label === 'Upload Resume') {
          return <iframe src={url} width="100%" height="500px" className="border border-gray-300 rounded-md" title="PDF Preview" />;
        } else {
          return <img src={url} alt="Uploaded" className="w-full h-full object-cover" />;
        }
      };

    return (
        <div className="mb-4">
            <h3 className="text-lg mb-2">{label}</h3>
            <div className="border rounded-md overflow-hidden relative w-full h-64 flex items-center justify-center bg-gray-700">
                {url ? (
                    <div className="relative w-full h-full">
                        {/* <img src={url} alt="Uploaded" className="w-full h-full object-cover" /> */}
                        {renderFilePreview(label, url)}
                        <button
                            onClick={onRemove}
                            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <label className="w-full h-full flex items-center justify-center text-gray-400 cursor-pointer">
                        <input

                            type="file"
                            accept= {label=='Upload Resume'?"application/pdf":"image/*"}
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <div className="text-center">
                            <span className="block text-3xl">+</span>
                            <span className="block">Add an Image</span>
                        </div>
                    </label>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
