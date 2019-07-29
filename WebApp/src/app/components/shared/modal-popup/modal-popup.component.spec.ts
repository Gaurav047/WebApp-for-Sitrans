import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPopupComponent } from './modal-popup.component';
import { DialogModule } from 'primeng/dialog';
import { ModalService } from '@app/services/shared/modal.service';

describe('ModalPopupComponent', () => {
  let component: ModalPopupComponent;
  let fixture: ComponentFixture<ModalPopupComponent>;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPopupComponent],
      imports: [DialogModule],
      providers: [ModalService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPopupComponent);
    component = fixture.componentInstance;
    modalService = TestBed.get(ModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // sonarqube fix
  it('modalObservable function', () => {
    const close = false;
    modalService.modalObservable.subscribe(event => {
      // close = event = true;
      expect(event).toEqual(close);
    });
    component.close();
    expect(component.visible).toEqual(close);
  });
  it('loadComponent function', () => {
    expect(component.loadComponent).toBeTruthy();
  });
  it('loadTemplate function', () => {
    expect(component.loadTemplate).toBeTruthy();
  });
});
