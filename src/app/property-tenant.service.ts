import { PropertyTenant } from './property-tenant';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyTenantService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public getPropertyTenants(): Observable<PropertyTenant[]>{
    return this.http.get<PropertyTenant[]>(`${this.apiServerUrl}/api/propertyTenant/all`);
  }

  public addPropertyTenant(propertyTenant: PropertyTenant): Observable<PropertyTenant>{
    return this.http.post<PropertyTenant>(`${this.apiServerUrl}/api/propertyTenant/add`, propertyTenant);
  }

  public updatePropertyTenant(propertyTenant: PropertyTenant): Observable<PropertyTenant>{
    return this.http.put<PropertyTenant>(`${this.apiServerUrl}/api/propertyTenant/update`, propertyTenant);
  }

  public deletePropertyTenant(propertyTenantID: number): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/api/propertyTenant/delete/${propertyTenantID}`);
  }

  public deleteByPropertyAndTenant(propertyID: number, tenantID: number): Observable<void>{
    return this.http.delete<void>(`${this.apiServerUrl}/api/propertyTenant/delete/property/${propertyID}/tenant/${tenantID}`);
  }
}
