import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType
} from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import {Employee} from './Employee.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(emp: Employee) {
    const postData: Employee = {
      firstName: emp.firstName,
      email: emp.email,
      lastName: emp.lastName,
      id: 0
    };
    console.log(postData);
    this.http
      .post(
        'http://localhost:8080/api/employees',
        postData, {
          headers: new HttpHeaders().append('Access-Control-Allow-Origin', '*')
        }
      )
      .subscribe(
        responseData => {
          console.log(responseData);
        },
        error => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    return this.http
      .get<Employee[]>(
        'http://localhost:8080/api/employees', {
          headers: new HttpHeaders().append('Access-Control-Allow-Origin', '*')
        }
      )
      .pipe(
        map(responseData => {
          const postsArray: Employee[] = responseData;
          return postsArray;
        }),
        catchError(errorRes => {
          // Send to analytics server
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http
      .delete('http://localhost:8080/api/employees/all', {
        headers: new HttpHeaders().append('Access-Control-Allow-Origin', '*')
      });
  }
}
