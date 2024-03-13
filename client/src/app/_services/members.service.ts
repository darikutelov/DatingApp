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
    const member = this.members.find((x) => x.userName === username);
    if (member !== undefined) return of(member);

    return this.http.get<Member>(
      this.baseUrl + 'users/' + username
      //,this.getHttpOptions()
    );
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
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