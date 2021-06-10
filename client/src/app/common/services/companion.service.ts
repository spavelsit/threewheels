import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Companion } from '../interfaces';
import { MatTable } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class CompanionService {

  constructor(
    private http: HttpClient
  ) { }

  public companions: Companion[] = []
  public preloader = true
  public table: MatTable<Element> = null
  


  public getAll(): Observable<Companion[]> {
    return this.http.get<Companion[]>('/api/v1/companion/all')
  }

  public create(companion: Companion): Observable<Companion> {
    return this.http.post<Companion>('/api/v1/companion/create', companion)
  }

  public edit(companion: Companion): Observable<Companion> {
    return this.http.patch<Companion>(`/api/v1/companion/detail/${companion.id}`, companion)
  }

  public delete(id: number): Observable<{}> {
    return this.http.delete(`/api/v1/companion/detail/${id}`)
  }
}
