import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { EventService } from '../../services/event.service';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Event } from '../../../assets/models/event.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [DatePipe, MatCardModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit, OnDestroy {
  eventService = inject(EventService);
  events: Event[] = [];
  
  private $destroy = new Subject<void>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.getEvents()
    .subscribe((events: Event[]) => {
      this.events = this.sortEventsByEndDate(events);
    });
  }

  sortEventsByEndDate(events: Event[]): Event[] {
    return events.sort((a: Event, b: Event) => {
      const endDateA = a.endDate ? parseInt(a.endDate) : 0;
      const endDateB = b.endDate ? parseInt(b.endDate) : 0;
      return endDateA - endDateB;
    });
  }
  
  goToDetailPage(cardId: string | undefined) {
    this.router.navigate([cardId], { relativeTo: this.activatedRoute });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
