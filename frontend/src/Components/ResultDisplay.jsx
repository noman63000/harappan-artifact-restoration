import React from 'react';
import { FileText } from 'lucide-react';

const ResultDisplay = ({ preview, restoredImage, analysisReport }) => {
  if (!restoredImage) return null;

  return (
    <div className="bg-white rounded-xl shadow-md border border-blue-200 overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
        <h2 className="font-bold text-lg">Restoration Complete</h2>
      </div>
      
      <div className="p-6 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Original Upload</p>
              <div className="bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                <img src={preview} alt="Original" className="w-full h-auto object-cover" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider">Reconstructed</p>
              <div className="bg-blue-50 rounded-lg overflow-hidden border border-blue-200 shadow-inner">
                <img src={restoredImage} alt="Restored" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4 border-b pb-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Archaeological Inference Report
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {analysisReport}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;