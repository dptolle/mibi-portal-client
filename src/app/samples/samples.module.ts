import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { HotTableModule } from '@handsontable/angular';
import { DataGridComponent } from './presentation/data-grid/data-grid.component';
import { DataGridContainerComponent } from './container/data-grid-container/data-grid-container.component';
import { SampleViewComponent } from './presentation/sample-view/sample-view.component';
import { SharedModule } from '../shared/shared.module';
import { UploadViewComponent } from './presentation/upload-view/upload-view.component';
import { EffectsModule } from '@ngrx/effects';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CoreModule } from '../core/core.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { SAMPLES_SLICE_NAME } from './samples.state';
import { samplesReducerMap, samplesEffects } from './samples.store';
import { NoSampleGuard } from './services/no-sample-guard.service';
import { SendDialogComponent } from './send-samples/components/send-dialog.component';
import { SendDialogViewComponent } from './send-samples/components/send-dialog-view.component';
import { AnalysisStepperComponent } from './analysis-stepper/components/analysis-stepper.component';
import { TestGridComponent } from './data-grid/testgrid';
import { CdkTableModule } from '@angular/cdk/table';
import { TestComponent } from './data-grid/testcomp';

const SAMPLES_ROUTES = [
    { path: 'upload', component: UploadViewComponent },
    { path: 'samples', component: TestGridComponent }
];

@NgModule({
    imports: [
        CommonModule,
        HotTableModule.forRoot(),
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatStepperModule,
        MatRadioModule,
        MatCheckboxModule,
        MatFormFieldModule,
        CdkTableModule,
        RouterModule.forChild(SAMPLES_ROUTES),
        StoreModule.forFeature(SAMPLES_SLICE_NAME, samplesReducerMap),
        EffectsModule.forFeature(samplesEffects),
        SharedModule,
        CoreModule
    ],
    declarations: [
        DataGridComponent,
        DataGridContainerComponent,
        SampleViewComponent,
        UploadViewComponent,
        SendDialogViewComponent,
        SendDialogComponent,
        AnalysisStepperComponent,
        TestGridComponent,
        TestComponent
    ],
    entryComponents: [SendDialogComponent, AnalysisStepperComponent],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SamplesModule { }
