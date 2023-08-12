import { InjectionToken } from '@angular/core';
import { ModalBreakpointEnum } from '../models/modal-breakpoint.enum';
import { BehaviorSubject } from 'rxjs';

export const MODAL_BREAKPOINT: InjectionToken<BehaviorSubject<ModalBreakpointEnum>> = new InjectionToken<BehaviorSubject<ModalBreakpointEnum>>('Размер модального окна')