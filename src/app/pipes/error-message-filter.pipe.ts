import { Pipe, PipeTransform } from '@angular/core';
import { MessageData } from '../models/message-data.model';

@Pipe({
  name: 'filterMessage'
})
export class FilterMessagePipe implements PipeTransform {

  transform(values: MessageData[], ...args: unknown[]): any[] {
    return values.filter(v => v.message.startsWith(String(args[0])));
  }

}