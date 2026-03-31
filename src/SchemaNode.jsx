// src/SchemaNode.jsx
import React from 'react';
import schemaData from './processed-schema.json';
import { getEffectiveProperties, isSimpleField } from './schemaUtils';

export const SchemaNode = ({ typeId, value = {}, onChange, level = 0 }) => {
    const properties = getEffectiveProperties(typeId);

    // If the type isn't found in our DB, fail gracefully
    if (!schemaData.classes[typeId]) return null;

    return (
        <div className={`p-4 border-l-4 rounded-r-md ${level === 0 ? 'border-blue-500 bg-white' : 'border-gray-300 bg-gray-50 mt-2'}`}>
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                {typeId}
                {level > 0 && <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-1 rounded">Nested</span>}
            </h3>

            <div className="flex flex-col gap-4">
                {properties.map(propId => {
                    const propInfo = schemaData.properties[propId];
                    if (!propInfo) return null;

                    const currentValue = value[propId];

                    return (
                        <div key={propId} className="flex flex-col">
                            <label className="text-sm font-semibold text-gray-700 mb-1">{propInfo.label}</label>

                            {isSimpleField(propInfo) ? (
                                <input
                                    type="text"
                                    placeholder={`Enter ${propInfo.label}...`}
                                    className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={currentValue || ''}
                                    onChange={(e) => onChange(propId, e.target.value)}
                                />
                            ) : (
                                <div className="pl-4 border-l-2 border-dashed border-gray-300">
                                    {/* If value exists, it's an object, so we render the node recursively */}
                                    {currentValue ? (
                                        <div className="relative">
                                            <button
                                                onClick={() => onChange(propId, undefined)}
                                                className="absolute top-2 right-2 text-red-500 text-xs hover:underline"
                                            >
                                                Remove
                                            </button>
                                            <SchemaNode
                                                typeId={currentValue['@type']}
                                                value={currentValue}
                                                onChange={(childKey, childValue) => {
                                                    onChange(propId, { ...currentValue, [childKey]: childValue });
                                                }}
                                                level={level + 1}
                                            />
                                        </div>
                                    ) : (
                                        // If no value exists yet, show buttons to initialize the nested object
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {propInfo.ranges.map(rangeType => (
                                                schemaData.classes[rangeType] && (
                                                    <button
                                                        key={rangeType}
                                                        onClick={() => onChange(propId, { "@type": rangeType })}
                                                        className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded transition"
                                                    >
                                                        + Add {rangeType}
                                                    </button>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};