import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { LoaderService } from '@app/services/shared/loader.service';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {

  constructor(private loaderService: LoaderService, private messageService: MessageService) { }

  addSingleToast(transientMessage) {
    this.messageService.add({ severity: 'success', summary: transientMessage, detail: 'Via MessageService', life: 2000 });
  }
}
