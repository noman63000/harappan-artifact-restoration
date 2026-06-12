import React from 'react';
import { ShieldCheck } from 'lucide-react';

// NEW: Added the 'Auto' option at the very beginning of the array
const MATERIALS = [
  { id: 'Auto', label: '✨ Auto AI Detect', desc: 'Let AI choose the best material' },
  { id: 'Terracotta Red', label: 'Terracotta Red', desc: 'Iron-rich alluvial clay' },
  { id: 'Iron Oxide Dark', label: 'Iron Oxide Dark', desc: 'Hematite-based slip' },
  { id: 'Indigo Blue', label: 'Indigo Blue', desc: 'Indigofera tinctoria dye' },
  { id: 'Limestone Natural', label: 'Natural Limestone', desc: 'Raw, bleached steatite' },
  { id: 'Lapis Lazuli', label: 'Lapis Lazuli', desc: 'Luxury ultramarine' }
];

const ModificationsCard = ({ targetMaterial, setTargetMaterial, customPrompt, setCustomPrompt,preserveStructure, setPreserveStructure }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
      <h2 className="text-lg font-bold flex items-center gap-3 mb-6 text-slate-800">
        <span className="bg-blue-100 text-blue-600 rounded-full w-7 h-7 flex items-center justify-center text-sm">2</span> 
        Select Modifications
      </h2>

      {/* Section A: Material Selector Grid */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Target Material & Pigment</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {MATERIALS.map((mat) => (
            <div 
              key={mat.id}
              onClick={() => setTargetMaterial(mat.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                targetMaterial === mat.id 
                  ? 'border-blue-500 bg-blue-50 shadow-sm' 
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <p className={`font-semibold text-sm ${targetMaterial === mat.id ? 'text-blue-700' : 'text-slate-700'}`}>
                {mat.label}
              </p>
              <p className="text-xs text-slate-500 mt-1">{mat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section B: Custom AI Text Prompt Input */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Custom Restoration Prompt (Optional)
        </label>
        <textarea
          className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none shadow-inner bg-slate-50 text-slate-800"
          rows="3"
          placeholder="e.g., Add gold leaf filigree patterns or clear visible Harappan script details along the surface..."
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
        />
        <p className="text-xs text-slate-500 mt-1">
          If provided, this prompt will override the standard material template and direct the AI pipeline directly.
        </p>
      </div>

      {/* Section C: Safety & Guardrails Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-green-800 flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4" /> Structural Preservation
        </h3>
        <div className="flex items-start gap-3 mt-3 p-3 bg-white border border-green-100 rounded-lg">
          <input type="radio" readOnly checked className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500" />
          <div>
            <p className="text-sm font-medium text-slate-800">Complete Mathematical Preservation</p>
            <p className="text-xs text-slate-500">No changes to shapes, cracks, or geometry. Strictly pigment mapping.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModificationsCard;
