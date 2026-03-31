// src/App.jsx
import React, { useState } from 'react';
import { SchemaNode } from './SchemaNode';
import schemaData from './processed-schema.json';

function App() {
  const [rootType, setRootType] = useState('Article'); // Default starting schema
  const [formData, setFormData] = useState({
    "@context": "https://schema.org",
    "@type": "Article"
  });

  // Extract all class names for the top-level dropdown
  const allAvailableSchemas = Object.keys(schemaData.classes).sort();

  const handleRootTypeChange = (e) => {
    const newType = e.target.value;
    setRootType(newType);
    setFormData({
      "@context": "https://schema.org",
      "@type": newType
    });
  };

  const handleDataChange = (key, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (value === undefined || value === '') {
        delete newData[key]; // Clean up empty fields
      } else {
        newData[key] = value;
      }
      return newData;
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    alert('JSON-LD copied to clipboard!');
  };

  return (
      <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-900">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-blue-900">JSON-LD Schema Builder</h1>
          <p className="text-gray-600">Dynamically generated from the official Schema.org vocabulary.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* LEFT COLUMN: FORM BUILDER */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Root Schema Type:</label>
              <select
                  value={rootType}
                  onChange={handleRootTypeChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
              >
                {allAvailableSchemas.map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="overflow-y-auto max-h-[70vh] pr-2">
              <SchemaNode
                  typeId={rootType}
                  value={formData}
                  onChange={handleDataChange}
              />
            </div>
          </section>

          {/* RIGHT COLUMN: LIVE PREVIEW */}
          <section className="sticky top-8 bg-gray-900 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
              <h2 className="text-white font-mono text-sm">Output Preview</h2>
              <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold transition"
              >
                Copy JSON
              </button>
            </div>
            <pre className="p-6 text-green-400 font-mono text-sm overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
          </section>

        </div>
      </div>
  );
}

export default App;