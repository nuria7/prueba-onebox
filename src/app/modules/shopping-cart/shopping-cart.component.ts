import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { EmitFromCartEventData, Root, SessionId } from '../../../assets/models/event.model';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
    @Output() removeFromCartClicked = new EventEmitter<EmitFromCartEventData>();
    @Input() locationMap: Map<string, Root[]> = new Map();

    eventService = inject(EventService);

    removeFromCart(sessionId: SessionId, index: number): void {
      this.removeFromCartClicked.emit({sessionId, index});
    }
}
