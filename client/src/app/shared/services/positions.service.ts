import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from '../intefaces';

@Injectable({ providedIn: 'root' })

export class PositionsService {

  constructor(private http: HttpClient) {}

  public fetch(params: any = {}, type: string): Observable<Position[]> {
    return this.http.get<Position[]>(`api/positions/${type}`, {
      params: new HttpParams({
        fromObject: params
      })
    });
  }
  public qrcode(id: string): Observable<Position> {
    return this.http.get<Position>(`api/positions/qr_code/${id}`);
  }

  public find(params: any = {}): Observable<Position[]> {
    return this.http.get<Position[]>(`api/positions/search`, {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  public create(position: Position): Observable<Position> {
    return this.http.post<Position>('/api/positions/', position);
  }

  public update(position: Position): Observable<Position> {
    return this.http.patch<Position>(`/api/positions/${position._id}`, position);
  }

  public quantity(id: string): Observable<Position> {
    return this.http.patch<Position>(`/api/positions/quantity/${id}`, id);
  }

  public delete(item: Position): Observable<Position> {
    return this.http.delete<Position>(`/api/positions/${item._id}`);
  }
}
