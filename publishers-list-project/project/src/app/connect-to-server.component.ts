import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { Publisher } from './components/publishers-container/publishers-container.component';

@Injectable({
    providedIn: 'root'
})

@Component({
    selector: 'app-connect-to-server',
    standalone: true,
    imports: [
    ],
    templateUrl: './connect-to-server.component.html',
    styleUrls: ['./connect-to-server.component.css']
})


export class ConnectToServer implements OnInit {
    private apiUrl = 'http://localhost:3000/api/';

    constructor(private http: HttpClient) { }
    ngOnInit(): void { }

    fetchData(): Observable<Publisher[]> {
        return this.http.get<Publisher[]>(`${this.apiUrl}data`);
    }

    addPublisher(publisherData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}addPublisher`, publisherData);
    }

    addDomain(domainData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}addDomain`, domainData);
    }

    updateDomain(originalDomain: any, inputDomain: any): Observable<any> {
        return this.http.put(`${this.apiUrl}updateDomain`, {
            originalDomain,
            inputDomain
        });
    }
}

