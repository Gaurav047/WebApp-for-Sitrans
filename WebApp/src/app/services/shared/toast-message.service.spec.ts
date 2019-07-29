import { TestBed } from '@angular/core/testing';

import { ToastMessageService } from './toast-message.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';

describe('ToastMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule, RouterTestingModule],
    providers: [MessageService]
  }));

  it('should be created', () => {
    const service: ToastMessageService = TestBed.get(ToastMessageService);
    expect(service).toBeTruthy();
  });
});
