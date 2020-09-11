import { Injectable } from '@angular/core';
import { Division } from 'src/app/interfaces';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_URL } from 'src/app/config';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class DivisionService {
  private url = 'divisions';

  constructor(private http: HttpClient) {

  }

  getAll(): Observable<Division> {
    return this.http.get<Division>(`${API_URL+this.url}`).pipe(catchError(this.handleError));
  }

  getById(id): Observable<Division> {
    return this.http.get<Division>(`${API_URL+this.url}/${id}`).pipe(catchError(this.handleError));
  }

  insert(body: Division){
    return this.http.post(`${API_URL+this.url}`, body).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, body: Division){
    return this.http.put(`${API_URL+this.url}/${id}`, body).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Terjadi error :', error.error.message);
    } else {
      console.error(
        `Code dari backend : ${error.status}, ` +
        `body yang dikirim: ${error.error}`
      );
    }
    return throwError('Terjadi kesalahan, coba lagi!');
  }
}
