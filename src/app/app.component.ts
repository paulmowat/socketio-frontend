import { Component, OnInit, ViewChildren, ViewChild, QueryList, ElementRef } from '@angular/core';
import { Event } from './model/event';
import { Message } from './model/message';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  messages: any[] = [];
  messageContent: string;
  ioConnection: any;

  private backup: any[] = [];

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.initIoConnection()
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {        
        this.messages.push(message);
      });


    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        var message : Message = {
          type: 'info',
          content: 'Connected'
        }
        this.messages.push(message);
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {       
        var message : Message = {
          type: 'info',
          content: 'Disconnected'
        } 
        this.messages.push(message);
      });

  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
      type: 'info',
      content: message
    });
    this.messageContent = null;
  }  

  public closeMessage(message: Message) {
    const index: number = this.messages.indexOf(message);
    this.messages.splice(index, 1);
  }

  public reset() {
    this.messages = this.backup.map((message: Message) => Object.assign({}, alert));
  }

}
