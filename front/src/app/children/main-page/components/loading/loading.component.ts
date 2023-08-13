import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from '../../../../services/destroy/destroy.service';

@Component({
  selector: 'app-dots-loading',
  template: '<div class="loading">...</div>',
  styles: [
    '.loading {\n' +
    '  font-weight: bold;\n' +
    '  display:inline-block;\n' +
    '  font-family: monospace;\n' +
    '  font-size: 30px;\n' +
    '  clip-path: inset(0 3ch 0 0);\n' +
    '  animation: l 1s steps(4) infinite;\n' +
    '}\n' +
    '\n' +
    '@keyframes l {\n' +
    '  to {\n' +
    '    clip-path: inset(0 -1ch 0 0)\n' +
    '  }\n' +
    '}'
  ],
  providers: [
    DestroyService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
}
