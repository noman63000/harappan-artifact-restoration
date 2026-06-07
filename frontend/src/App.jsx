import React, { useState } from 'react';
import { FlaskConical } from 'lucide-react';

// Import our new modular components (Capitalized to match your folders for Vercel!)
import UploadCard from './Components/UploadCard';
import ModificationsCard from './Components/ModificationsCard';
import ActionSidebar from './Components/ActionSidebar';
import ResultDisplay from './Components/ResultDisplay';

function App() {
  // State Management
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [targetMaterial, setTargetMaterial] = useState('Terracotta Red');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [restoredImage, setRestoredImage] = useState(null);
  const [analysisReport, setAnalysisReport] = useState('');

  // Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setRestoredImage(null); 
      setAnalysisReport('');
    }
  };

  const resetImage = () => {
    setImage(null);
    setPreview(null);
    setRestoredImage(null);
    setAnalysisReport('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", image);
    formData.append("target_material", targetMaterial); 

    try {
      const response = await fetch('https://mohsan-raza-harappan-backend.hf.space/api/restore-pigment', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      // Update states with the exact keys returned from FastAPI
      if (data.restored_image) {
        setRestoredImage(data.restored_image);
      }
      if (data.analysis_report) {
        setAnalysisReport(data.analysis_report);
      }
      
    } catch (error) {
      console.error("Error connecting to backend:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2 text-slate-800 tracking-tight">
              <FlaskConical className="text-blue-600 w-8 h-8" />
              Digital Pigment Reconstruction
            </h1>
          </div>
          <button onClick={resetImage} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            ↻ Reset App
          </button>
        </header>

        {/* System Status Bar */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <p className="font-semibold text-green-800 text-sm leading-tight">System Ready</p>
            <p className="text-green-600 text-xs">Connected to server • Local AI: Available</p>
          </div>
        </div>

        {/* Results pop up here at the top when finished! */}
        <ResultDisplay 
          preview={preview} 
          restoredImage={restoredImage} 
          analysisReport={analysisReport} 
        />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Controls */}
          <div className="lg:col-span-8 flex flex-col">
            <UploadCard 
              image={image} 
              preview={preview} 
              handleImageUpload={handleImageUpload} 
              resetImage={resetImage} 
            />
            
            <ModificationsCard 
              targetMaterial={targetMaterial} 
              setTargetMaterial={setTargetMaterial} 
            />
          </div>

          {/* RIGHT COLUMN: Sidebar Summary */}
          <div className="lg:col-span-4">
            <ActionSidebar 
              image={image}
              targetMaterial={targetMaterial}
              isProcessing={isProcessing}
              handleSubmit={handleSubmit}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
