// import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { catchError, Observable, of } from 'rxjs';
// import { Router } from '@angular/router';
// import { environment } from '../../environments/environment'; // ✅ imported environment

// @Injectable({
//   providedIn: 'root'
// })
// export class RestService {
//   url: string;
//   httpOptions: object;
//   Instid: any;
//   sessionvalue: any;
//   authcardprocesscode: any = '00';
//   cpckitprocesscode: any = '02';
//   cvvgenerateprocesscode: any = '10';
//   cvvgenerateprocode: any = '02';
//   issuecardprocesscode: any = '05';
//   Authissuecardprocesscode: any = '06';
//   noncpckitprocesscode: any = '02';
//   noncpckitprocesscodeAuth: any = '3I';
//   pingenerateprocesscode: any = '01';
//   instantcardauthprocesscode: any = '00';
//   instantcardpinprocesscode: any = '01';
//   instantissuecardprocesscode: any = '04';
//   instantissuecardprocesscodeAuth: any = '05';
//   instantauthcardprocesscode: any = '06';
//   closecardauth: any = '13';
//   noncpckitprocode: any = '03';

//   constructor(
//     private http: HttpClient,
//     public router: Router
//   ) {
//     // ✅ Use environment variable for base API URL
//     this.url = environment.apiBaseUrl + '/api/';
//     this.sessionvalue = this.readData('SESSIONID');
//   }

//   postValidate(reqData, urlValue): Observable<any> {
//     this.httpOptions = {
//       headers: new HttpHeaders({
//         'Access-Control-Allow-Origin': '*',
//         'Content-Type': 'application/json',
//         'Authorization': 'Token ' + localStorage.getItem('SESSIONID'),
//       })
//     };

//     const finalUrl = (urlValue === 'login' || urlValue === 'refreshtoken')
//       ? environment.apiBaseUrl + '/authentication/' + urlValue
//       : this.url + urlValue;

//     return this.http.post<any>(finalUrl, reqData, this.httpOptions).pipe(
//       catchError((error: any): Observable<any> => {
//         console.error('HTTP Error:', error);
//         return of({ error: true, message: error.message || 'Request failed' });
//       })
//     );
//   }

//   postValidate3(reqData: any, urlValue: string, options?: any): Observable<any> {
//     this.httpOptions = {
//       headers: new HttpHeaders({
//         'Access-Control-Allow-Origin': '*',
//         'Content-Type': 'application/json',
//         'Authorization': 'Token ' + localStorage.getItem('SESSIONID'),
//       }),
//       ...options
//     };

//     const finalUrl = (urlValue === 'login' || urlValue === 'refreshtoken')
//       ? environment.apiBaseUrl + '/authentication/' + urlValue
//       : this.url + urlValue;

//     return this.http.post<any>(finalUrl, reqData, this.httpOptions).pipe(
//       catchError((error: any): Observable<any> => {
//         console.error('HTTP Error:', error);
//         return of({ error: true, message: error.message || 'Request failed' });
//       })
//     );
//   }

//   getAll(urlValue): Observable<any> {
//     const finalUrl = this.url + urlValue;
//     return this.http.get<any>(finalUrl).pipe(
//       catchError((err: any): Observable<any> => {
//         return of({});
//       })
//     );
//   }

//   getwithHeader(urlValue): Observable<any> {
//     this.httpOptions = {
//       headers: new HttpHeaders({
//         'Access-Control-Allow-Origin': '*',
//         'Content-Type': 'application/json',
//         'Authorization': 'Token ' + localStorage.getItem('SESSIONID'),
//       })
//     };

//     const finalUrl = this.url + urlValue;
//     return this.http.get<any>(finalUrl, this.httpOptions).pipe(
//       catchError((err: any): Observable<any> => {
//         return of({});
//       })
//     );
//   }

//   saveData(name, data) {
//     localStorage.setItem(name, data);
//   }

//   readData(name) {
//     return localStorage.getItem(name);
//   }
// }


import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class RestService {
  url: string;
  httpOptions: object;
  Instid: any;
  sessionvalue: any;
  authcardprocesscode: any = '00';
  cpckitprocesscode: any = '02';
  cvvgenerateprocesscode: any = '10';
  cvvgenerateprocode: any = '02';
  issuecardprocesscode: any = '05';
  Authissuecardprocesscode: any = '06';
  noncpckitprocesscode: any = '02';
  noncpckitprocesscodeAuth: any = '3I';
  pingenerateprocesscode: any = '01';
  instantcardauthprocesscode: any = '00';
  instantcardpinprocesscode: any = '01';
  instantissuecardprocesscode: any = '04';
  instantissuecardprocesscodeAuth: any = '05';
  instantauthcardprocesscode: any = '06';
  closecardauth: any = '13';
  noncpckitprocode: any = '03';

  constructor(
    private http: HttpClient,
    public router: Router) {
    this.url = 'http://172.16.10.98:3000/api/';
    this.sessionvalue = this.readData('SESSIONID');
  }

  postValidate(reqData, urlValue): Observable<any> {

    this.httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('SESSIONID'),
      })
    };

    if (urlValue === 'login' || urlValue === 'refreshtoken') {
      var finalUrl = 'http://172.16.10.98:3000/authentication/' + urlValue
    } else {
      var finalUrl = this.url + urlValue;
    }
    return this.http.post<any>(finalUrl, reqData, this.httpOptions).pipe(
      catchError((error: any): Observable<any> => {
        console.error('HTTP Error:', error);
        return of({ error: true, message: error.message || 'Request failed' });
      })
    );

  }

  postValidate3(reqData: any, urlValue: string, options?: any): Observable<any> {

    this.httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('SESSIONID'),
      }),
      ...options
    };

    const finalUrl = urlValue === 'login'
      ? 'http://172.16.10.98:3000/authentication/' + urlValue
      : this.url + urlValue;

    return this.http.post<any>(finalUrl, reqData, this.httpOptions).pipe(
      catchError((error: any): Observable<any> => {
        console.error('HTTP Error:', error);
        return of({ error: true, message: error.message || 'Request failed' });
      })
    );
  }

  getAll(urlValue): Observable<any> {
    var finalUrl = this.url + urlValue
    return this.http.get<any>(finalUrl).pipe(catchError((err: any): Observable<any> => {
      return of({});
    })
    );
  }

  getwithHeader(urlValue): Observable<any> {

    this.httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('SESSIONID'),
      })
    };
    var finalUrl = this.url + urlValue;
    return this.http.get<any>(finalUrl, this.httpOptions).pipe(catchError((err: any): Observable<any> => {
      return of({});
    })
    );
  }

  saveData(name, data) {
    localStorage.setItem(name, data);
  }

  readData(name) {
    return localStorage.getItem(name);
  }

}