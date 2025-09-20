import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRecyclerComponent } from './home-recycler.component';

describe('HomeRecyclerComponent', () => {
  let component: HomeRecyclerComponent;
  let fixture: ComponentFixture<HomeRecyclerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRecyclerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeRecyclerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
