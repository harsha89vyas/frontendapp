import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { UploadService } from './upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, OnInit {
  message = '';
  sessionId = '';
  file_guid: string = '';
  isDisabled: boolean = false;
  constructor(public webSocketService: WebSocketService, 
    public uploadService: UploadService) {
    this.sessionId = crypto.randomUUID();
    this.webSocketService.connect(this.sessionId);
  }
  ngOnInit(): void {
    this.webSocketService.latestData.subscribe((msg) => {
      console.log('Response from websocket: ' + msg);
      if (msg.message.startsWith('file_guid:')){
        this.file_guid = msg.message.split(':')[1];
        this.downloadFile();
        this.isDisabled = false;
      }
    });
  }
  sendMessage(message: string) {
    this.webSocketService.sendMessage(message);
  }

  ngOnDestroy() {
    this.webSocketService.close();
  }
  uploadTableFile(event: any){
    this.uploadService.uploadFile(event.target.files[0], 'table', this.sessionId);
  }
  uploadTemplateFile(event: any){
    this.uploadService.uploadFile(event.target.files[0], 'template', this.sessionId);
  }

  startProcessing(){
    this.uploadService.processFiles(this.sessionId).subscribe();
    this.isDisabled = true;
  }
  
  downloadFile(){
    this.uploadService.downloadFile(this.sessionId, this.file_guid);
  }
}
