import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs';
import { MessageData } from './models/message-data.model';


@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$!: WebSocketSubject<any>;
  private human_socket$!: WebSocketSubject<any>;
  private readonly latestData$: Subject<MessageData> = new Subject<MessageData>();
  public readonly latestData = this.latestData$.asObservable();
  public receivedData: MessageData[] = [];
  public promptData: MessageData = { message: '' };
  public connect(sessionId: string): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket(`${environment.webSocketUrl}/${sessionId}`);
      this.human_socket$ = webSocket(`${environment.humanWebSocketUrl}/${sessionId}`);
      this.socket$.subscribe((data: MessageData) => {
        this.receivedData.push(data);
        this.latestData$.next(data);
      });
      this.human_socket$.subscribe((data: MessageData) => {
        this.promptData = data;
      });
    }
  }


  sendMessage(message: string) {
    this.promptData={ message: '' }
    this.human_socket$.next({ message });
  }

  close() {
    this.socket$.complete();
    this.human_socket$.complete();
  }
}
