import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { EmitFromCartEventData, EventData, Event, Root, SessionId } from '../../../assets/models/event.model';
import { CommonModule, DatePipe } from '@angular/common';
import { EventService } from '../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionListComponent } from '../session-list/session-list.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [DatePipe, SessionListComponent, ShoppingCartComponent, CommonModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})

export class EventDetailsComponent implements OnInit, OnDestroy {
  @Output() entryAdded = new EventEmitter<EmitFromCartEventData>();
  eventService = inject(EventService);
  sessions: SessionId[] = [];
  locations: Event = {};
  eventId: string = '';
  locationMap: Map<string, Root[]> = new Map();
  
  private $destroy = new Subject<void>();

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getParamsMapId();
    this.eventService.updateEventData(this.locationMap);
  }

  getParamsMapId() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.eventId = idParam;
        const map = sessionStorage.getItem('locationMap');
        if (map) {
          const obj = JSON.parse(map);

          for (const key in obj) {
            this.locationMap.set(key, obj[key]);
          }
        }
        this.loadEventData(this.eventId);
      }
    });
  }

  loadEventData(eventId: string): void {
    this.eventService.getEventInfo(eventId).subscribe((session: EventData) => {
      this.locations = session.event;
      const sessions = session.sessions;
      if (this.locationMap) {
        this.locationMap?.get(eventId)?.forEach(selected => {
          let sess = sessions.find(s => s.date === selected.session.date)
          if (sess) {
            sess.availability = selected.session.availability;
          }
        });
      }
        
      this.sessions = sessions;
      
      this.sortSessionDates(session.sessions);
    });
  }
  
  sortSessionDates(session: SessionId[]) {
    session.sort((a: SessionId, b: SessionId) => {
      const dateA = parseInt(a.date);
      const dateB = parseInt(b.date);
      return dateA - dateB;
    });
  }

  addToCart(session: SessionId): void {
    let roots = this.locationMap.get(this.eventId);
    if (!roots) {
      roots = [];
      this.locationMap.set(this.eventId, roots);
    }
    const rootIndex = roots.findIndex(loc => {
      return loc.locations.id === this.eventId && loc.session.date === session.date
    });
  
    session.availability--;
  
    if (rootIndex === -1) {
      roots.push({ session: session, quantity: 1, locations: this.locations });
    } else {
      roots[rootIndex].quantity++;
    }
  
    const obj: { [key: string]: Root[] } = {};
    this.locationMap.forEach((value, key) => {
        obj[key] = value;
    });
  
    const jsonString = JSON.stringify(obj);
    sessionStorage.setItem('locationMap', jsonString);
    this.eventService.updateEventData(this.locationMap);
  }

  removeFromCart(sessionId: SessionId) {
    this.locationMap.forEach((value, key) => {
      const existingLocationIndex = value.findIndex(loc => loc.session.date === sessionId.date);
      if (existingLocationIndex !== -1) {
        const location = value[existingLocationIndex];
        location.session.availability++;
        if (location.quantity > 1) {
          location.quantity--;
        } else {
          value.splice(existingLocationIndex, 1);
        }
        
        if (value.length === 0) {
          this.locationMap.delete(key);
        }
      }
    });

    this.serializeAndStoreLocationMap();
  }

  serializeAndStoreLocationMap() {
    if (this.locationMap.size === 0) {
      sessionStorage.removeItem('locationMap');
    } else {
      const entries = Array.from(this.locationMap);
      const serializedMap = this.serializeMap(entries);
      (Object.keys(serializedMap).length > 0) ? sessionStorage.setItem('locationMap', JSON.stringify(serializedMap)) : sessionStorage.removeItem('locationMap');
    }
    this.eventService.updateEventData(this.locationMap);
  }

  serializeMap(entries: [string, Root[]][]) {
    const serializedMap: { [key: string]: Root[] } = {};
    entries.forEach(([key, value]) => {
      serializedMap[key] = value;
    });
    return serializedMap;
  }

  comeBack(): void {
    this.router.navigate(['/events']);
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
