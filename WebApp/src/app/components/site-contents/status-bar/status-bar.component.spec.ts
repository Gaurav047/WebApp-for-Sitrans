import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBarComponent } from './status-bar.component';
import { StatusTileComponent } from '@app/components/shared/status-tile/status-tile.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('StatusBarComponent', () => {
  let component: StatusBarComponent;
  let fixture: ComponentFixture<StatusBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusBarComponent, StatusTileComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
