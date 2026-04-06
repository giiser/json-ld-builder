import schemaDataJson from '../../assets/processed-schema.json';

// Cast the imported generic JSON to any so TypeScript doesn't complain about exact schemas 
// since it's dynamically generated
const schemaData: any = schemaDataJson;

export const getEffectiveProperties = (typeId: string): string[] => {
    if (!schemaData.classes[typeId]) return [];

    const typeInfo = schemaData.classes[typeId];
    let allProps = [...typeInfo.properties];

    typeInfo.subClassOf.forEach((parentId: string) => {
        if (schemaData.classes[parentId]) {
            allProps = [...allProps, ...getEffectiveProperties(parentId)];
        }
    });

    return [...new Set(allProps)].sort();
};

export const isSimpleField = (propInfo: any): boolean => {
    if (!propInfo || !propInfo.ranges) return true;

    const primitives = ['Text', 'Number', 'URL', 'Date', 'DateTime', 'Boolean', 'Integer'];
    return propInfo.ranges.some((r: string) => primitives.includes(r));
};
