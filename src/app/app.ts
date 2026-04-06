import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SchemaNodeComponent } from './schema-node/schema-node';
import schemaDataJson from '../assets/processed-schema.json';

const schemaData: any = schemaDataJson;

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, NgSelectModule, SchemaNodeComponent],
  templateUrl: './app.html'
})
export class App {
  rootType = 'Article';
  formData: any = {
    "@context": "https://schema.org",
    "@type": "Article"
  };
  showToast = false;

  schemaOptions = Object.keys(schemaData.classes).sort().map(type => ({
    value: type,
    label: type
  }));

  get formattedJson() {
    return JSON.stringify(this.formData, null, 2);
  }

  handleRootTypeChange(selectedOption: any) {
    if (!selectedOption) return;
    const newType = selectedOption.value;
    this.rootType = newType;
    this.formData = {
      "@context": "https://schema.org",
      "@type": newType
    };
  }

  handleDataChange(event: { key: string, value: any }) {
    const { key, value } = event;
    const newData = { ...this.formData };
    if (value === undefined || value === '') {
      delete newData[key];
    } else {
      newData[key] = value;
    }
    this.formData = newData;
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.formattedJson);
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }
}
