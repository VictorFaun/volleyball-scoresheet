import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateJugadorPage } from './create-jugador.page';

describe('CreateJugadorPage', () => {
  let component: CreateJugadorPage;
  let fixture: ComponentFixture<CreateJugadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJugadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
