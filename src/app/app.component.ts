import {Component, HostListener, OnDestroy} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'gestion-lte';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('es');

  }

  // @HostListener('window:beforeunload')
  // onBeforeUnload() {
  //   return false;
  // }
}
