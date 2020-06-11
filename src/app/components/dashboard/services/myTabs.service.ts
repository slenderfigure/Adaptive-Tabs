import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Tab } from '../../tabs/tab.model';


@Injectable()
export class MyTabsService {
  private url: string = '../../../../api/tabs.json';
  private url2: string = '../../../../api/tabs2.json';

  constructor(private http: HttpClient) { }

  getTabs(): Observable<Tab[]> {
    return this.http.get<Tab[]>(this.url).pipe(
      map(tabs => tabs.sort((a, b) => a.order - b.order))
    );
  }
}