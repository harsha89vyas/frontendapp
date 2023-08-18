import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { R3SelectorScopeMode } from '@angular/compiler';
import {  } from '@angular/platform-browser';

interface MessageData {
  message: string;
  time?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  
    constructor(private http: HttpClient) {}
    fileName = '';
    public uploadFile(uploadedFile:File, type:string, session: string): void {
        const file:File = uploadedFile;
        if (file) {

            this.fileName = file.name;

            const formData = new FormData();

            formData.append("file", file);
            formData.append("fileName", file.name);
            formData.append("type", type);
            formData.append("session", session);

            const upload$ = this.http.post(`${environment.apiUrl}/upload`, formData);

            upload$.subscribe();
        }
    
  }

  /**
     * processFiles
     */
  public processFiles(session: string) {
    const formData = new FormData();
    formData.append("session", session);
    return this.http.post(`${environment.apiUrl}/process`, formData, {responseType: 'blob'});
  }


  public saveFile(blob: Blob, filename: string) {
    
    const blobUrl = URL.createObjectURL( blob);
    const aElement = document.createElement('a');
    aElement.href = blobUrl;
    aElement.download = filename;
    aElement.style.display = 'none';
    document.body.appendChild(aElement);
    aElement.click();
    URL.revokeObjectURL(blobUrl);
    aElement.remove();    
    
  }
  downloadFile(sessionId: string, file_guid: string) {
    const formData = new FormData();
    formData.append("session", sessionId);
    formData.append("file_guid", file_guid);
    this.http.post(`${environment.apiUrl}/process`, formData, {responseType: 'blob'}).subscribe((response:any) => {
        this.saveFile(response, "generated.csv");
    });
  }
}
