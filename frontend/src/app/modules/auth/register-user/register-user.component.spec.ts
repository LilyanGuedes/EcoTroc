import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRegisterUserComponent } from './register-user.component';

describe('AppRegisterUserComponent', () => {
  let component: AppRegisterUserComponent;
  let fixture: ComponentFixture<AppRegisterUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppRegisterUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppRegisterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
