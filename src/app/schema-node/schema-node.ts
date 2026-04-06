import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { getEffectiveProperties, isSimpleField } from '../utils/schema.utils';
import schemaDataJson from '../../assets/processed-schema.json';

const schemaData: any = schemaDataJson;

@Component({
    selector: 'app-schema-node',
    imports: [CommonModule, FormsModule, NgSelectModule],
    templateUrl: './schema-node.html'
})
export class SchemaNodeComponent implements OnChanges {
    @Input() typeId!: string;
    @Input() value: any = {};
    @Input() level = 0;

    @Output() valueChange = new EventEmitter<{ key: string, value: any }>();

    properties: string[] = [];
    schemaData = schemaData;
    dropdownOptionsCache: { [key: string]: any[] } = {};

    ngOnChanges(changes: SimpleChanges) {
        if (changes['typeId'] && this.typeId) {
            this.properties = getEffectiveProperties(this.typeId);
            this.properties.forEach(propId => {
                const info = this.getPropInfo(propId);
                if (info && !this.isSimple(info)) {
                    this.dropdownOptionsCache[propId] = this.getDropdownOptions(info);
                }
            });
        }
    }

    getPropInfo(propId: string): any {
        return this.schemaData.properties[propId];
    }

    isSimple(propInfo: any): boolean {
        return isSimpleField(propInfo);
    }

    onFieldChange(propId: string, newValue: any) {
        this.valueChange.emit({ key: propId, value: newValue });
    }

    getDropdownOptions(propInfo: any): any[] {
        if (!propInfo.ranges) return [];
        return propInfo.ranges
            .filter((rangeType: string) => this.schemaData.classes[rangeType])
            .map((rangeType: string) => ({ value: rangeType, label: `+ Add ${rangeType}` }));
    }

    onDropdownChange(propId: string, selectedOption: any) {
        if (!selectedOption) return;
        this.onFieldChange(propId, { "@type": selectedOption.value });
    }

    onRemoveNested(propId: string) {
        this.onFieldChange(propId, undefined);
    }

    onNestedChange(propId: string, event: { key: string, value: any }, currentValue: any) {
        this.onFieldChange(propId, { ...currentValue, [event.key]: event.value });
    }
}
