import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizacionesDetailComponent } from './autorizaciones-detail.component';

describe('AutorizacionesDetailComponent', () => {
  let component: AutorizacionesDetailComponent;
  let fixture: ComponentFixture<AutorizacionesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutorizacionesDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizacionesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
