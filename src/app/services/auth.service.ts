import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

import jwt_decode from 'jwt-decode';
import * as moment from 'moment';

@Injectable()
export class AuthService {
    public payload;
    private apiRoot = 'http://localhost:8000/auth/';

    constructor(private http: HttpClient) {}

    private setSession(authResult) {
        const token = authResult.token;
        this.payload = <JWTPayload>jwt_decode(token);
        const expiresAt = moment.unix(this.payload.exp);
        localStorage.setItem('token', authResult.token);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
        console.log(localStorage.getItem('token'));
        console.log(localStorage.getItem('expires_at'));
        console.log(this.payload);
    }

    get token(): string {
        return localStorage.getItem('token');
    }

    login(username: string, password: string) {
        // if (this.isLoggedIn()) {
        return this.http
            .post(this.apiRoot.concat('login/'), { username, password })
            .pipe(
                tap((response) => this.setSession(response)),
                shareReplay()
            );
        // }
    }

    signup(
        username: string,
        email: string,
        password1: string,
        password2: string
    ) {
        return this.http
            .post(this.apiRoot.concat('signup/'), {
                username,
                email,
                password1,
                password2,
            })
            .pipe(
                tap((response) => this.setSession(response)),
                shareReplay()
            );
    }

    logout() {
        if (!localStorage.getItem('token')) {
            localStorage.removeItem('token');
            localStorage.removeItem('expires_at');
        }
    }

    refreshToken() {
        if (
            moment().isBetween(
                this.getExpiration().subtract(1, 'days'),
                this.getExpiration()
            )
        ) {
            return this.http
                .post(this.apiRoot.concat('refresh-token/'), {
                    token: this.token,
                })
                .pipe(
                    tap((response) => this.setSession(response)),
                    shareReplay()
                )
                .subscribe();
        }
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);

        return moment(expiresAt);
    }

    isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');

        if (token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', 'JWT '.concat(token)),
            });

            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate() {
        if (this.authService.isLoggedIn()) {
            this.authService.refreshToken();

            return true;
        } else {
            this.authService.logout();
            this.router.navigate(['login']);

            return false;
        }
    }
}

interface JWTPayload {
    user_id: number;
    username: string;
    email: string;
    exp: number;
}
