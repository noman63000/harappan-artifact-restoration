import React from 'react';
import { Wand2, CheckCircle2 } from 'lucide-react';

const ActionSidebar = ({ image, targetMaterial, isProcessing, handleSubmit }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-6">
      <h2 className="text-lg font-bold flex items-center gap-3 mb-6 text-slate-800">
        <span className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 flex items-center justify-center text-sm">3</span> 
        Generate Result
      </h2>
      
      <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl mb-6">
        <h3 className="font-semibold text-sm mb-4 text-slate-700 flex items-center gap-2">
          Selected Options
        </h3>
        <ul className="text-sm space-y-3 text-slate-600">
          <li className="flex justify-between border-b border-slate-200 pb-2">
            <span>Material:</span> 
            <span className="font-semibold text-blue-600">{targetMaterial}</span>
          </li>
          <li className="flex justify-between border-b border-slate-200 pb-2">
            <span>Topology:</span> 
            <span className="font-medium text-slate-800">Steatite/Terracotta</span>
          </li>
          <li className="text-green-600 font-medium flex items-center gap-1 pt-1">
            <CheckCircle2 className="w-4 h-4" /> Preserve Artifact Aspect
          </li>
        </ul>
      </div>

      <button 
        onClick={handleSubmit}
        disabled={!image || isProcessing}
        className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl transition-all ${
          !image 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
            : isProcessing 
              ? 'bg-blue-400 text-white cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing AI...
          </span>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate Modified Artifact
          </>
        )}
      </button>

      <div className="mt-6 pt-6 border-t border-slate-100">
        <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">?</div>
          How to Use
        </h4>
        <ul className="text-xs text-slate-500 space-y-2">
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Upload a clear artifact photo.</li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Select your historical material.</li>
          <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Click Generate to run the local AI pipeline.</li>
        </ul>
      </div>
    </div>
  );
};

export default ActionSidebar;