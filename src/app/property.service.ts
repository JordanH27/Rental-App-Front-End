import { Property } from './property';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(`${this.apiServerUrl}/api/property/all`);
  }

  public addProperty(property: Property): Observable<Property>{
    return this.http.post<Property>(`${this.apiServerUrl}/api/property/add`, property);
  }

  public updateProperty(property: Property): Observable<Property>{
    return this.http.put<Property>(`${this.apiServerUrl}/api/property/update`, property);
  }

  public deleteProperty(propertyID: number): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/api/property/delete/${propertyID}`);
  }

  public findProperty(propertyID: number): Observable<Property>{
    return this.http.get<Property>(`${this.apiServerUrl}/api/property/find/${propertyID}`);
  }
}
