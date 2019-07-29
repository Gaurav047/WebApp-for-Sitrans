import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateLangService {
  currentLanguage: string;
  translator: any;
  constructor(private translateService: TranslateService) {
    this.currentLanguage = this.translateService.currentLang;
  }
  public translate(key: string) {
    if (this.currentLanguage !== undefined) {
      if (this.translateService.translations) {
        const data = this.translateService.translations;
        this.translator = data;
      }
    }
  }
}
