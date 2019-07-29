import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSettingsComponent } from './system-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from '@app/components/shared/confirmation-dialog/confirmation-dialog.component';
import { ConfirmDialogModule, ConfirmationService, MessageService } from 'primeng/primeng';
import { HttpClientModule } from '@angular/common/http';

describe('SystemSettingsComponent', () => {
  let component: SystemSettingsComponent;
  let fixture: ComponentFixture<SystemSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemSettingsComponent, ConfirmationDialogComponent ],
      imports: [FormsModule, ReactiveFormsModule, ConfirmDialogModule, HttpClientModule],
      providers: [ConfirmationService, MessageService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
