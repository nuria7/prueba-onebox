import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EmitFromCartEventData, Root, SessionId, Event } from '../../../assets/models/event.model';
import { EventService } from '../../services/event.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [MatIconModule, DatePipe, CommonModule],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.scss'
})
export class SessionListComponent implements OnDestroy {
  @Input() sessions: SessionId[] = [];
  @Input() locationMap: Map<string, Root[]> = new Map();
  @Input() eventId: string = '';
  @Output() entryAdded = new EventEmitter<EmitFromCartEventData>();
  @Output() removeFromCartClicked = new EventEmitter<EmitFromCartEventData>();

  private $destroy = new Subject<void>();
  
  addToCart(sessionId: SessionId, index: number) {
    this.entryAdded.emit({ sessionId, index });
  }

  removeFromCart(sessionId: SessionId, index: number): void {
    this.removeFromCartClicked.emit({ sessionId, index });
  }

  isAddButtonDisabled(session: SessionId): boolean {
    if (typeof session.availability === 'string') {
      session.availability = parseInt(session.availability);
    }
    return session.availability === 0;
  }

  isRemoveButtonDisabled(session: SessionId): boolean {
    return this.getLocationMapQuantity(session) === 0;
  }

  getLocationMapQuantity(session: SessionId): number {
    let selectedQuantity = 0;
    const eventId = this.eventId;
    this.locationMap.forEach((value, key) => {
      if (eventId === key) {
        for (const location of value) {
          if (location.session.date === session.date) {
            selectedQuantity += location.quantity;
          }
        }
      }
    });
    return selectedQuantity;
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}