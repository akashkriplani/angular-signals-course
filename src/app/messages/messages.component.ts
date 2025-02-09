import { Component, inject } from "@angular/core";
import { NgClass } from "@angular/common";
import { MessagesService } from "./messages.service";

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  imports: [
    NgClass
  ]
})
export class MessagesComponent {
  messagesService = inject(MessagesService);

  message = this.messagesService.message;

  onClose = () => this.messagesService.clear();
}
