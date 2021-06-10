import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from '../interfaces';

@Injectable({providedIn: 'root'})

export class PositionService {
  constructor(private http: HttpClient) {}

  public getAll(params = {}, type: string): Observable<Position[]> {
    return this.http.get<Position[]>(`api/positions/${type}`, {params: new HttpParams({fromObject: params})});
  }

  public create(position: Position): Observable<Position> {
    return this.http.post<Position>(`/api/positions`, position);
  }

  public update(position: Position): Observable<Position> {
    return this.http.patch<Position>(`/api/positions/${position._id}`, position);
  }

  public delete( id: string): Observable<Position> {
    return this.http.delete<Position>(`/api/positions/${id}`);
  }

  public totalPrice(): Observable<{status: boolean; total_price: number}> {
    return this.http.get<{status: boolean; total_price: number}>(`api/positions/total`);
  }

  public find(params: any = {}): Observable<Position[]> {
    return this.http.get<Position[]>(`api/positions/search`, {
      params: new HttpParams({
        fromObject: params
      })
    });
  }
}
