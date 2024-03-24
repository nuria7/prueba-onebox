import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator';
import { EventListComponent } from './event-list.component';
import { EventService } from '../../services/event.service';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

describe('EventListComponent', () => {
  let spectator: Spectator<EventListComponent>;
  let component: EventListComponent;

  const createComponent = createComponentFactory({
    component: EventListComponent,
    shallow: true,
    imports: [],
    providers: [],
    mocks: [],
    componentProviders: [
      mockProvider(Router, {
        navigate: () => (['/events/' + '68'])
      })
    ]
  })

  beforeEach(() => {
    spectator = createComponent({});
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getEvents() on ngOnInit', () => {
    const eventService = spectator.inject(EventService);
    const getEventsSpy = jest.spyOn(eventService, 'getEvents').mockReturnValue(of([]));

    component.ngOnInit();

    expect(getEventsSpy).toHaveBeenCalled();
  });
  
  it('should sortEventsByEndDate() sort events by end date', () => {
    const events = [
      { endDate: '2024-03-31' },
      { endDate: '2024-04-15' },
      { endDate: '2024-03-20' }
    ];

    const sortedEvents = component.sortEventsByEndDate(events);

    expect(sortedEvents).toEqual([
      { endDate: '2024-03-20' },
      { endDate: '2024-03-31' },
      { endDate: '2024-04-15' }
    ]);
  });

  it('should sortEventsByEndDate() handle events with undefined end date', () => {
    const events = [
      { endDate: '2024-03-31' },
      { endDate: undefined },
      { endDate: '2024-03-20' }
    ];

    const sortedEvents = component.sortEventsByEndDate(events);

    expect(sortedEvents).toEqual([
      { endDate: undefined },
      { endDate: '2024-03-20' },
      { endDate: '2024-03-31' }
    ]);
  });

  it('should goToDetailPage() navigate to detail page with cardId', () => {
    const routerSpy = jest.spyOn(spectator.inject(Router), 'navigate');
    const cardId = '123';

    component.goToDetailPage(cardId);

    expect(routerSpy).toHaveBeenCalledWith([cardId], { relativeTo: spectator.inject(ActivatedRoute) });
  });

  it('should goToDetailPage() navigate to detail page with undefined cardId', () => {
    const routerSpy = jest.spyOn(spectator.inject(Router), 'navigate');

    component.goToDetailPage(undefined);

    expect(routerSpy).toHaveBeenCalledWith([undefined], { relativeTo: spectator.inject(ActivatedRoute) });
  });
});
