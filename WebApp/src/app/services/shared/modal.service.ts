import { Injectable } from '@angular/core';
// import { UsersDetailComponent } from '@app/components/site-content/users-detail/users-detail.component';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new Subject<any>();
  public modalObservable: Observable<any>;
  constructor() {
    this.modalObservable = this.modalSubject.asObservable();
  }
  closeModal(event?) {
    this.modalSubject.next(event);
  }
}
