import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';
import { EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartComponent } from './shopping-cart.component';
import { Root, SessionId } from '../../../assets/models/event.model';

describe('ShoppingCartComponent', () => {
  let spectator: Spectator<ShoppingCartComponent>;
  let component: ShoppingCartComponent;

  const createComponent = createComponentFactory({
    component: ShoppingCartComponent,
    shallow: true,
    imports: [],
    providers: [],
    mocks: [],
    componentProviders: [
      mockProvider(Router, {
        navigate: () => (['/events'])
      })
    ]
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        removeFromCartClicked: new EventEmitter(),
        locationMap: new Map<string, Root[]>()
      }
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit removeFromCartClicked event with sessionId and index', () => {
    const sessionId: SessionId = {date: '1679484800000', availability: 3};
    const index = 1;

    component.removeFromCart(sessionId, index);

    expect(component.removeFromCartClicked.emit).toHaveBeenCalledWith({ sessionId, index });
  });
});
