import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOperatorComponent } from './home-operator.component';

describe('HomeOperatorComponent', () => {
  let component: HomeOperatorComponent;
  let fixture: ComponentFixture<HomeOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeOperatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
