import { TestBed } from '@angular/core/testing';

import { TranslateLangService } from './translate-lang.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService, TranslateStore, TranslateLoader, TranslateCompiler, TranslateParser, MissingTranslationHandler, USE_DEFAULT_LANG, USE_STORE } from '@ngx-translate/core';
import {NO_ERRORS_SCHEMA} from '@angular/core';
class InjectionTokenStub {

}
describe('TranslateLangService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [HttpClientModule, RouterTestingModule],
    providers: [TranslateLangService, TranslateService, TranslateStore, TranslateLoader, TranslateCompiler, TranslateParser, MissingTranslationHandler,
      { provide: USE_DEFAULT_LANG }, { provide: USE_STORE }],
    schemas: [NO_ERRORS_SCHEMA]
  }));

  it('should be created', () => {
    const service: TranslateLangService = TestBed.get(TranslateLangService);
    expect(service).toBeTruthy();
  });
});
