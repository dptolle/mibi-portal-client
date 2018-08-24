import { Component } from '@angular/core';
import * as _ from 'lodash';
import 'tooltipster';
import { CanReloadComponent } from '../../../can-deactivate/can-reload.component';
import { SampleStore } from '../../services/sampleStore.service';
import { ValidationService } from '../../services/validation.service';
import { ITableDataOutput } from '../../presentation/data-grid/data-grid.component';

@Component({
    selector: 'app-data-grid-container',
    template: `
    <app-data-grid [sampleData] = "sampleStore.annotatedSampleData$ | async" (valueChanged)="onValueChanged($event)">
    </app-data-grid>`
})
export class DataGridContainerComponent extends CanReloadComponent {

    constructor(public sampleStore: SampleStore,
        private validationService: ValidationService) {
        super();
    }

    onValueChanged(tableData: ITableDataOutput) {
        if (tableData.changed) {
            const s = {
                ...this.sampleStore.state,
                ...{
                    entries: tableData.data
                }
            };
            this.sampleStore.setState(s);
        }
    }

    // TODO: IS this needed?
    canReload() {
        return !this.validationService.isValidating;
    }
}