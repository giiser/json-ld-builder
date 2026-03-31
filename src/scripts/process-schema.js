// scripts/process-schema.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Set up paths
const inputPath = path.join(__dirname, 'schemaorg-current-https.jsonld');
const outputPath = path.join(__dirname, '../processed-schema.json');

console.log('Parsing Schema.org JSON-LD...');
const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const graph = rawData['@graph'];

const db = { classes: {}, properties: {} };

const castToArray = (val) => {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
};

// NEW: Helper function to safely extract strings from language-tagged objects
const extractText = (field) => {
    if (!field) return null;
    if (typeof field === 'string') return field;
    // If it's an array (multiple languages), just grab the first one
    if (Array.isArray(field)) return extractText(field[0]);
    // If it's a language object, grab the value
    if (field['@value']) return field['@value'];
    return String(field);
};

// Pass 1: Extract all Classes and Properties
graph.forEach(node => {
    const id = node['@id'].replace('schema:', '');
    const types = castToArray(node['@type']);

    if (types.includes('rdfs:Class')) {
        db.classes[id] = {
            // Use the new extractor here
            label: extractText(node['rdfs:label']) || id,
            subClassOf: castToArray(node['rdfs:subClassOf']).map(s => s['@id'].replace('schema:', '')),
            properties: []
        };
    } else if (types.includes('rdf:Property')) {
        db.properties[id] = {
            // And use the new extractor here
            label: extractText(node['rdfs:label']) || id,
            ranges: castToArray(node['schema:rangeIncludes']).map(r => r['@id'].replace('schema:', ''))
        };
    }
});

// Pass 2: Map Properties to their respective Classes
graph.forEach(node => {
    if (castToArray(node['@type']).includes('rdf:Property') && node['schema:domainIncludes']) {
        const propId = node['@id'].replace('schema:', '');
        const domains = castToArray(node['schema:domainIncludes']);

        domains.forEach(d => {
            const classId = d['@id'].replace('schema:', '');
            if (db.classes[classId] && !db.classes[classId].properties.includes(propId)) {
                db.classes[classId].properties.push(propId);
            }
        });
    }
});

fs.writeFileSync(outputPath, JSON.stringify(db));
console.log(`Successfully generated database with ${Object.keys(db.classes).length} classes at ${outputPath}`);