import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromCore from '../../state/core.reducer';
import * as coreActions from '../../state/core.actions';
import { Banner, AlertType } from '../../model/alert.model';
import { takeWhile, debounceTime } from 'rxjs/operators';
import { UserActionService } from '../../services/user-action.service';
import { UserActionType } from '../../../shared/model/user-action.model';

@Component({
    selector: 'mibi-banner-container',
    template: `<mibi-banner
    *ngIf="banner" [banner]="banner" (mainAction)="onMainAction($even)" (auxilliaryAction)="onAuxAction($even)"></mibi-banner>`
})
export class BannerContainerComponent implements OnInit {

    private banners: Record<string, Banner> = {
        defaultError: {
            message: 'Ein Fehler ist aufgetreten.',

            type: AlertType.ERROR,
            icon: 'error',
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }
        },
        defaultSuccess: {
            message: 'Operation erfolgreich durchgeführt.',

            type: AlertType.SUCCESS,
            icon: 'done',
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }
        },
        noAuthorizationOrActivation: {
            message: 'Nicht authorisiert oder nicht aktiviert. '
                + 'Wenn bereits registriert, überprüfen Sie bitte Ihre Email auf einen Aktivierungslink',
            type: AlertType.ERROR,
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        sendCancel: {
            message: 'Es wurden keine Probendaten an das BfR gesendet',
            type: AlertType.ERROR,
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        validationFailure: {
            message: 'Es gab einen Fehler beim Validieren.',
            type: AlertType.ERROR,
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        uploadFailure: {
            message: 'Es gab einen Fehler beim Importieren der Datei.',
            type: AlertType.ERROR,
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        sendFailure: {
            message: 'Es gab einen Fehler beim Versenden der Datei and das MiBi-Portal.',
            type: AlertType.ERROR,
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        sendSuccess: {
            type: AlertType.SUCCESS,
            message: `Der Auftrag wurde an das BfR gesendet.
            Bitte drucken Sie die Exceltabelle in Ihrem Mailanhang
            aus und legen sie Ihren Isolaten bei.`,
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        validationErrors: {
            message: 'Es gibt noch rot gekennzeichnete Fehler. Bitte vor dem Senden korrigieren.',
            type: AlertType.ERROR,
            auxilliaryAction: { ...this.userActionService.getConfigOfType(UserActionType.SEND), ...{ label: 'Nochmals Senden' } },
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },

        autocorrections: {
            message: 'Es wurden Felder autokorregiert. Bitte prüfen und nochmals senden.',
            type: AlertType.ERROR,
            auxilliaryAction: { ...this.userActionService.getConfigOfType(UserActionType.SEND), ...{ label: 'Nochmals Senden' } },
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        wrongUploadDatatype: {
            type: AlertType.ERROR,
            message: 'Falscher Dateityp: Dateien müssen vom Typ .xlsx sein.',
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        wrongUploadFilesize: {
            type: AlertType.ERROR,
            message: 'Zu grosse Datei: Dateien müssen kleiner als 2 Mb sein.',
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        accountActivationSuccess: {
            message: 'Kontoaktivierung erfolgreich!',
            type: AlertType.SUCCESS,
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        accountActivationFailure: {
            message: 'Unable to activate account.',
            type: AlertType.ERROR,
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        passwordChangeSuccess: {
            message: 'Bitte melden Sie sich mit Ihrem neuen Passwort an',
            type: AlertType.SUCCESS,
            auxilliaryAction: { ...this.userActionService.getNavigationConfig('/users/login'), ...{ label: 'Zum Login' } },
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        passwordChangeFailure: {
            // tslint:disable-next-line:max-line-length
            message: `Fehler beim Passwort zurücksetzten, Token ungültig. Bitte lassen Sie sich einen neuen 'Passwort-Reset' Link mit Hilfe der Option 'Passwort vergessen?' zuschicken.`,
            type: AlertType.ERROR,
            auxilliaryAction: { ...this.userActionService.getNavigationConfig('/users/recovery'), ...{ label: 'Zum Passwort-Reset' } },
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        loginFailure: {
            // tslint:disable-next-line:max-line-length
            message: 'Es gab einen Fehler beim einloggen.  Bitte registrieren Sie sich oder, wenn Sie sich schon registriert haben, kontaktieren Sie das MiBi-Portal team.',
            type: AlertType.ERROR,
            auxilliaryAction: { ...this.userActionService.getNavigationConfig('/users/register'), ...{ label: 'Zur Registrierung' } },
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        registrationFailure: {
            // tslint:disable-next-line:max-line-length
            message: 'Es gab einen Fehler beim registrieren.  Bitte kontaktieren Sie das MiBi-Portal team.',
            type: AlertType.ERROR,
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }

        },
        loginUnauthorized: {
            message: 'Nicht authorisiert, bitte einloggen.',
            type: AlertType.ERROR,
            auxilliaryAction: { ...this.userActionService.getNavigationConfig('/users/login'), ...{ label: 'Zum Login' } },
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }
        },
        exportFailure: {
            message: 'Es gab einen Fehler beim Exportieren der Datei.',
            type: AlertType.ERROR,
            mainAction: { ...this.userActionService.getConfigOfType(UserActionType.DISMISS_BANNER) }
        }
    };

    banner: Banner | null;
    private componentActive = true;
    constructor(private store: Store<fromCore.State>, private userActionService: UserActionService) { }

    ngOnInit() {
        this.store.pipe(select(fromCore.getBanner),
            debounceTime(600),
            takeWhile(() => this.componentActive)
        ).subscribe(bannerState => {
            if (bannerState) {
                this.banner = this.banners[bannerState.predefined] || bannerState.custom;
                if (this.banner) {
                    if (!this.banner.icon) {
                        switch (this.banner.type) {
                            case AlertType.ERROR:
                                this.banner.icon = 'error';
                                break;
                            case AlertType.SUCCESS:
                                this.banner.icon = 'done';
                                break;
                            case AlertType.WARNING:
                            default:
                                this.banner.icon = 'warning';
                        }
                    }
                }
            }
        });
    }

    onMainAction() {
        if (this.banner) {
            if (this.banner.mainAction) {
                this.banner.mainAction.onExecute();
            }
            this.store.dispatch(new coreActions.HideBanner());
        }
    }

    onAuxAction() {
        if (this.banner) {
            if (this.banner.auxilliaryAction) {
                this.banner.auxilliaryAction.onExecute();
            }
            this.store.dispatch(new coreActions.HideBanner());
        }
    }
}
