import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, of, take } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  // Props
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User | null | undefined;
  userParams: UserParams | undefined;

  // Init
  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.userParams = new UserParams(user);
        } else {
          this.userParams = undefined;
        }
      },
    });
  }

  // Public Methods
  getMembers(userParams: UserParams) {
    // Check if in cache
    const cacheKey = Object.values(userParams).join('-');
    const response = this.memberCache.get(cacheKey);
    if (response) return of(response);

    // If not in cache, get from server
    // Build query params
    let params = this.getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.GetPaginatedResults<Member[]>('users', params).pipe(
      map((response) => {
        this.memberCache.set(cacheKey, response);
        return response;
      })
    );
  }

  getMember(username: string) {
    // const member = this.members.find((x) => x.userName === username);
    // if (member !== undefined) return of(member);

    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.userName === username);

    if (member) return of(member);

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

  // Private Methods
  private GetPaginatedResults<T>(url: string, params: HttpParams) {
    let paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http
      .get<T>(this.baseUrl + url, { observe: 'response', params })
      .pipe(
        map((response) => {
          if (response.body) {
            paginatedResult.result = response.body;
          }

          const pagination = response.headers.get('Pagination');

          if (pagination) {
            paginatedResult.pagination = JSON.parse(pagination);
          }
          return paginatedResult;
        })
      );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());

    return params;
  }

  // Photo Management
  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  // Getters and Setters for user params
  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
    return;
  }

  // Like Management

  addLike(username: string) {
    return this.http.post(this.baseUrl + 'likes/' + username, {});
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = this.getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);

    return this.GetPaginatedResults<Member[]>('likes', params);
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
