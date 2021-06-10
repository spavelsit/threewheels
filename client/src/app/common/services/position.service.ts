import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from '../interfaces';
import { MatTable } from '@angular/material/table';

@Injectable({providedIn: 'root'})

export class PositionService {
  constructor(
    private http: HttpClient
  ) {}

  public positions: Position[] = []

  public preloader = true
  public noMoreElement = false
  public loaderMore = false

  public table: MatTable<Element> = null

  public getAll(params = {}): Observable<{count: number; results: Position[]}> {
    return this.http.get<{count: number; results: Position[]}>('/api/v1/position/all', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }

  public create(position: Position): Observable<Position> {
    return this.http.post<Position>('/api/v1/position/create', position)
  }

  public edit(position: Position): Observable<Position> {
    return this.http.patch<Position>(`/api/v1/position/detail/${position.id}`, position)
  }

  public delete(id): Observable<{}> {
    return this.http.delete(`/api/v1/position/detail/${id}`)
  }
}