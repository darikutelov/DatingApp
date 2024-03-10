import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  // Props
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  // Init
  constructor(private http: HttpClient) {}

  // Public Methods
  getMembers() {
    if (this.members.length > 0) return of(this.members);

    return this.http
      .get<Member[]>(
        this.baseUrl + 'users'
        //, this.getHttpOptions()
      )
      .pipe(
        map((members) => {
          this.members = members;
          return members;
        })
      );
  }

  getMember(username: string) {
    return this.http.get<Member>(
      this.baseUrl + 'users/' + username
      //,this.getHttpOptions()
    );
  }

  // Private Methods
  // private getHttpOptions() {
  //   const userString = localStorage.getItem('user');
  //   if (!userString) return;
  //   const user = JSON.parse(userString);
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: `Bearer ${user.token}`,
  //     }),
  //   };
  // }
}
