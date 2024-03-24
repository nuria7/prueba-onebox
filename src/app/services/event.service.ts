import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventData, Root } from '../../assets/models/event.model';
 import { Event } from '../../assets/models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsUrl = 'assets/data/events.json';
  private baseUrl = 'assets/data/event-info-';
  private extension = '.json';
  private eventDataSubject = new BehaviorSubject<Map<string, Root[]>>(new Map<string, Root[]>());

  eventData$: Observable<Map<string, Root[]>> = this.eventDataSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.httpClient.get<Event[]>(this.eventsUrl);
  }

  getEventInfo(id: string): Observable<EventData> {
    const eventInfoUrl = `${this.baseUrl}${id}${this.extension}`;
    return this.httpClient.get<EventData>(eventInfoUrl);
  }

  updateEventData(eventData: Map<string, Root[]>) {
    this.eventDataSubject.next(eventData);
  }
}
