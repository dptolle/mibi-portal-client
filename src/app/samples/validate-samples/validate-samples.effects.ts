import { Injectable } from '@angular/core';
import {
    ValidateSamplesAction,
    ValidateSamplesMSA,
    ValidateSamplesActionTypes
} from './validate-samples.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { withLatestFrom, concatMap, map, catchError, concatAll } from 'rxjs/operators';
import { DataService } from '../../core/services/data.service';
import { Sample } from '../model/sample-management.model';
import { of, Observable } from 'rxjs';
import { DisplayBannerSOA, UpdateIsBusySOA, DestroyBannerSOA } from '../../core/state/core.actions';
import { LogService } from '../../core/services/log.service';
import { SamplesMainSlice } from '../samples.state';
import * as _ from 'lodash';
import { selectSamplesMainData } from '../state/samples.selectors';
import { UpdateSampleSOA } from '../state/samples.actions';

@Injectable()
export class ValidateSamplesEffects {

    constructor(
        private actions$: Actions<ValidateSamplesAction>,
        private dataService: DataService,
        private logger: LogService,
        private store$: Store<SamplesMainSlice>
    ) { }

    @Effect()
    validateSamples$: Observable<UpdateSampleSOA | DisplayBannerSOA | UpdateIsBusySOA | DestroyBannerSOA> = this.actions$.pipe(
        ofType<ValidateSamplesMSA>(ValidateSamplesActionTypes.ValidateSamplesMSA),
        withLatestFrom(this.store$),
        concatMap(([, state]) => {
            const sampleData = selectSamplesMainData(state);
            return this.dataService.validateSampleData(sampleData).pipe(
                map((annotatedSamples: Sample[]) => {
                    return of(
                        new UpdateSampleSOA(annotatedSamples),
                        new DestroyBannerSOA(),
                        new UpdateIsBusySOA({ isBusy: false })
                    );
                }),
                concatAll(),
                catchError((error) => {
                    this.logger.error('Failed to validate samples', error);
                    return of(
                        new UpdateIsBusySOA({ isBusy: false }),
                        new DisplayBannerSOA({ predefined: 'validationFailure' })
                    );
                })
            );
        })
    );
}