import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  // Props
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

  // Init
  constructor(private http: HttpClient) {}

  // Public Methods
  getMembers(page?: number, itemsPerPage?: number) {
    //if (this.members.length > 0) return of(this.members);
    let params = new HttpParams();

    if (page && itemsPerPage) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    return this.http
      .get<Member[]>(
        this.baseUrl + 'users',
        { observe: 'response', params }
        //, this.getHttpOptions()
      )
      .pipe(
        // map((members) => {
        //   this.members = members;
        //   return members;
        // })
        map((response) => {
          if (response.body) {
            this.paginatedResult.result = response.body;
          }

          const pagination = response.headers.get('Pagination');

          if (pagination) {
            this.paginatedResult.pagination = JSON.parse(pagination);
          }
          return this.paginatedResult;
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
