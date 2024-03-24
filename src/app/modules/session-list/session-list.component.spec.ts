import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';
import { EventEmitter } from '@angular/core';
import { SessionListComponent } from './session-list.component';
import { of } from 'rxjs';
import { EventService } from '../../services/event.service';
import { EmitFromCartEventData, EventData, Root, SessionId } from '../../../assets/models/event.model';

describe('SessionListComponent', () => {
  let spectator: Spectator<SessionListComponent>;
  let component: SessionListComponent;

  const sessionId: SessionId[] = [{
    date: '1442959200000',
    availability: 3
  }]

  const eventData: EventData = {
    sessions: [{
      date: '1442959200000',
      availability: 3
    }],
    event: {
      id: '68',
      title: 'JOAN MANUEL SERRAT',
      subtitle: 'Antología desordenada',
      image: '/assets/img/sample-image.jpg',
      place: 'Fòrum, Barcelona',
      startDate: '1439416800000',
      endDate: '1455836400000',
      description: 'Aparentar es una forma de mentir. Confiar sólo en la apariencia nos puede alejar de la esencia. Cama Incendiada, la nueva producción de Maná, no aparenta, es…',
      sessions: sessionId
    }
  }
  const createComponent = createComponentFactory({
    component: SessionListComponent,
    shallow: true,
    imports: [],
    providers: [],
    mocks: [],
    componentProviders: [
      mockProvider(EventService, {
        eventData$: () => of(eventData)
      })
    ]
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        sessions: [{
          date: '1442959200000',
          availability: 3
        }],
        locationMap: new Map<string, Root[]>()
      }
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should addToCart() emit entryAdded event with sessionId and index', () => {
    const sessionIdMock = { date: '1442959200000', availability: 10 };
    const indexMock = 1;

    const emittedData = {
      sessionId: sessionIdMock,
      index: indexMock
    };

    const entryAddedSpy = jest.spyOn(component.entryAdded, 'emit');
    component.addToCart(sessionIdMock, indexMock);

    expect(entryAddedSpy).toHaveBeenCalledWith(emittedData);
  });

  it('should removeFromCart() emit removeFromCartClicked event with sessionId and index', () => {
    const sessionIdMock = { date: '1442959200000', availability: 10 };
    const indexMock = 1;

    const emittedData = {
      sessionId: sessionIdMock,
      index: indexMock
    };

    const removeFromCartClickedSpy = jest.spyOn(component.removeFromCartClicked, 'emit');

    component.removeFromCart(sessionIdMock, indexMock);

    expect(removeFromCartClickedSpy).toHaveBeenCalledWith(emittedData);
  });

  it('should isAddButtonDisabled() return false if session availability is a non-zero number', () => {
    const session = { date: '1442959200000', availability: 5 };
    const result = component.isAddButtonDisabled(session);

    expect(result).toBe(false);
  });

  it('should isAddButtonDisabled() return false if session availability is a string representing a non-zero number', () => {
    const session = { date: '1442959200000', availability: 5 };
    const result = spectator.component.isAddButtonDisabled(session);

    expect(result).toBe(false);
  });

  it('should isAddButtonDisabled() return true if session availability is zero', () => {
    const session = { date: '1442959200000', availability: 0 };
    const result = component.isAddButtonDisabled(session);

    expect(result).toBe(true);
  });

  it('should getLocationMapQuantity() return zero if location map is empty', () => {
    const session = { date: '1442959200000', availability: 0 };
    const result = component.getLocationMapQuantity(session);
    expect(result).toBe(0);
  });

  it('should getLocationMapQuantity() return zero if no location matches session date', () => {
    component.eventId = 'eventId';
    component.locationMap.set('eventId', [{ session: { date: '1442959200000', availability: 5 }, quantity: 1, locations: {id: '68'}}]);
    const session = { date: '1442959200000', availability: 5 };
    const result = component.getLocationMapQuantity(session);
    expect(result).toBe(1);
  });
});
