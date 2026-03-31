// src/App.jsx
import React, { useState } from 'react';
import Select from 'react-select';
import { SchemaNode } from './SchemaNode';
import schemaData from './processed-schema.json';

function App() {
    const [rootType, setRootType] = useState('Article');
    const [formData, setFormData] = useState({
        "@context": "https://schema.org",
        "@type": "Article"
    });

    // 1. New State for the subtle notification
    const [showToast, setShowToast] = useState(false);

    const schemaOptions = Object.keys(schemaData.classes).sort().map(type => ({
        value: type,
        label: type
    }));

    const handleRootTypeChange = (selectedOption) => {
        const newType = selectedOption.value;
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
                delete newData[key];
            } else {
                newData[key] = value;
            }
            return newData;
        });
    };

    // 2. Updated Copy Function
    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(formData, null, 2));

        // Show the toast, then hide it after 2.5 seconds
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-900 relative">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-emerald-800">JSON-LD Schema Builder</h1>
                <p className="text-emerald-950">Dynamically generated from the official Schema.org vocabulary.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* LEFT COLUMN: FORM BUILDER */}
                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="mb-6 pb-6 border-b border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Select Root Schema Type:</label>
                        <Select
                            options={schemaOptions}
                            value={{ value: rootType, label: rootType }}
                            onChange={handleRootTypeChange}
                            isSearchable={true}
                            placeholder="Type to search schemas..."
                            className="text-base"
                            classNamePrefix="react-select"
                        />
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
                <section className="sticky top-8 bg-emerald-100 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
                    <div className="bg-emerald-900 p-4 flex justify-between items-center border-b border-gray-700">
                        <h2 className="text-white font-mono text-sm">Output Preview</h2>
                        <button
                            onClick={copyToClipboard}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded text-sm font-bold transition flex items-center gap-2"
                        >
                            {/* Changed button text slightly to feel more dynamic */}
                            {showToast ? 'Copied!' : 'Copy JSON'}
                        </button>
                    </div>
                    <pre className="p-6 text-emerald-950 font-mono text-sm overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
                </section>
            </div>

            {/* 3. The Subtle Toast Notification Component */}
            {showToast && (
                <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in-up z-50">
                    {/* SVG Checkmark icon */}
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium text-sm">JSON copied to clipboard</span>
                </div>
            )}

            <footer>
                <div className="text-center font-semibold py-4 mx-auto text-emerald-950 text-xl">© Sergii Ignatov, 2026</div>
            </footer>

        </div>
    );
}

export default App;