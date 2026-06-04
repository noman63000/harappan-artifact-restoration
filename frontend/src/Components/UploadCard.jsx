import React from 'react';
import { UploadCloud, Image as ImageIcon, Trash2 } from 'lucide-react';

const UploadCard = ({ image, preview, handleImageUpload, resetImage }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-bold flex items-center gap-3 mb-6 text-slate-800">
        <span className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 flex items-center justify-center text-sm">1</span> 
        Upload Artifact Image
      </h2>

      {!preview ? (
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <UploadCloud className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <p className="text-slate-600 font-medium text-lg">Drop your artifact image here</p>
          <p className="text-slate-500 text-sm mt-1">or click to browse (JPEG, PNG, WebP)</p>
          
          <div className="mt-6 flex justify-center gap-4 relative z-10 pointer-events-none">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium">Select Image</button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
              <ImageIcon className="w-5 h-5 text-blue-500" />
              {image?.name || "artifact_image.png"}
            </div>
            <button onClick={resetImage} className="text-red-500 hover:text-red-700 p-1">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          <div className="relative h-64 w-full bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
            <img src={preview} alt="Upload preview" className="max-h-full max-w-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadCard;