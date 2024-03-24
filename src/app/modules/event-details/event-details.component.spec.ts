import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';
import { EventDetailsComponent } from './event-details.component';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { SessionId, Event, EventData, Root } from '../../../assets/models/event.model';

describe('EventDetailsComponent', () => {
  let spectator: Spectator<EventDetailsComponent>;
  let component: EventDetailsComponent;

  const mockEvent: Event = {
    id: '1',
    title: 'Event Title',
    subtitle: 'Event Subtitle',
    image: 'image.jpg',
    place: 'Event Place',
    startDate: '1445551200000',
    endDate: '1445551200000',
    description: 'Event Description',
    sessions: []
  };

  const mockSession: SessionId = {
    date: '1679484800000',
    availability: 10
  };

  const mockEventData: EventData = {
    event: mockEvent,
    sessions: [mockSession]
  };
  const createComponent = createComponentFactory({
    component: EventDetailsComponent,
    shallow: true,
    imports: [],
    providers: [],
    mocks: [ActivatedRoute],
    componentProviders: [
      mockProvider(Router, {
        navigate: () => (['/events'])
      })
    ]
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        entryAdded: new EventEmitter()
      }
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should getParamsMapId() call loadEventData with eventId', () => {
    const mockParamMap = {
      get: jest.fn().mockReturnValue('testId')
    };

    const mockRoute = spectator.inject(ActivatedRoute);
    Object.defineProperty(mockRoute, 'paramMap', { value: of(mockParamMap) });

    const loadEventDataSpy = jest.spyOn(spectator.component, 'loadEventData');

    component.getParamsMapId();

    expect(loadEventDataSpy).toHaveBeenCalledWith('testId');
  });

  it('should loadEventData() set locations, sessions, and sort session dates on loadEventData', () => {
    const sortSessionDatesSpy = jest.spyOn(component, 'sortSessionDates');

    component.loadEventData('1');

    expect(component.locations).toEqual(mockEvent);
    expect(component.sessions).toEqual([mockSession]);
    expect(sortSessionDatesSpy).toHaveBeenCalled();
  });

  it('should sortSessionDates() sort session dates in ascending order', () => {
    const unsortedSessions: SessionId[] = [
      { date: '2024-03-27', availability: 10 },
      { date: '2024-03-25', availability: 8 },
      { date: '2024-03-26', availability: 12 }
    ];

    component.sortSessionDates(unsortedSessions);

    expect(unsortedSessions).toEqual([
      { date: '2024-03-25', availability: 8 },
      { date: '2024-03-26', availability: 12 },
      { date: '2024-03-27', availability: 10 }
    ]);
  });

  it('should serializeAndStoreLocationMap() remove sessionStorage key if locationMap is empty', () => {
    component.locationMap = new Map<string, Root[]>();
    component.serializeAndStoreLocationMap();

    expect(sessionStorage.getItem('locationMap')).toBeNull();
  });

  it('should serializeAndStoreLocationMap() store serialized locationMap in sessionStorage if locationMap is not empty', () => {
    const locationMap = new Map<string, Root[]>();
    locationMap.set('event-1', [{ session: { date: '2024-03-25', availability: 10 }, quantity: 1, locations: {id: '68'} }]);
    component.locationMap = locationMap;

    component.serializeAndStoreLocationMap();

    const serializedMap = JSON.parse(sessionStorage.getItem('locationMap') || '');
    expect(serializedMap).toEqual({ 'event-1': [{ session: { date: '2024-03-25', availability: 10 }, quantity: 1, locations: null }] });
  });

  it('should comeBack() navigate to "/events" when comeBack is called', () => {
    const navigateSpy = jest.spyOn(spectator.inject(Router), 'navigate');

    component.comeBack();

    expect(navigateSpy).toHaveBeenCalledWith(['/events']);
});
});
