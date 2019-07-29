import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskManagerComponent } from './task-manager.component';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';

describe('TaskManagerComponent', () => {
  let component: TaskManagerComponent;
  let fixture: ComponentFixture<TaskManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskManagerComponent ],
      imports: [TableModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
