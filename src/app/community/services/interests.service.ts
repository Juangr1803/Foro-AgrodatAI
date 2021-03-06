import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Interest } from '../../models/interests';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InterestsService {
    URL_API = 'http://localhost:8000/api/interests/';
    // URL_API = 'http://localhost:3000/interests/';

    interests: Interest[];
    selectInterest: Interest = {
        name: '',
        completed: false,
    };

    constructor(private http: HttpClient) {}

    getAllInterests(): Observable<Interest[]> {
        return this.http.get<Interest[]>(this.URL_API);
    }

    getInterest(id: number) {
        return this.http.get<Interest[]>(`${this.URL_API}${id}/`);
    }

    updateInterest(interest: Interest) {
        return this.http.put(`${this.URL_API}${interest.id}/`, interest);
    }
}
