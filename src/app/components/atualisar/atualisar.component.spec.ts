import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtualisarComponent } from './atualisar.component';

describe('AtualisarComponent', () => {
  let component: AtualisarComponent;
  let fixture: ComponentFixture<AtualisarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtualisarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtualisarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
