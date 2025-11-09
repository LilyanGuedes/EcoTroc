import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclareRecyclingComponent } from './declare-recycling.component';

describe('DeclareRecyclingComponent', () => {
  let component: DeclareRecyclingComponent;
  let fixture: ComponentFixture<DeclareRecyclingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeclareRecyclingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclareRecyclingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
