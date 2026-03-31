// src/schemaUtils.js
import schemaData from './processed-schema.json';

// Recursively fetches properties for a class and all its parents
export const getEffectiveProperties = (typeId) => {
    if (!schemaData.classes[typeId]) return [];

    const typeInfo = schemaData.classes[typeId];
    let allProps = [...typeInfo.properties];

    // Walk up the inheritance chain
    typeInfo.subClassOf.forEach(parentId => {
        // Ignore rdfs:Class or external references to prevent infinite loops
        if (schemaData.classes[parentId]) {
            allProps = [...allProps, ...getEffectiveProperties(parentId)];
        }
    });

    // Return a unique array of properties
    return [...new Set(allProps)].sort();
};

// Determines if a property is a basic input (text, number, date) or a nested schema
export const isSimpleField = (propInfo) => {
    if (!propInfo || !propInfo.ranges) return true; // Default to text if unknown

    const primitives = ['Text', 'Number', 'URL', 'Date', 'DateTime', 'Boolean', 'Integer'];
    return propInfo.ranges.some(r => primitives.includes(r));
};