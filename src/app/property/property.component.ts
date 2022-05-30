import { PropertyTenant } from './../property-tenant';
import { Property } from './../property';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../property.service';
import { NgForm } from '@angular/forms';
import { ModalService } from '../_modal/modal.service';
import Swal from 'sweetalert2';
import { PropertyTenantService } from '../property-tenant.service';
import { Tenant } from '../tenant';
import { TenantService } from '../tenant.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {

  public properties: Property[] = [];
  public tenants: Tenant[] = [];
  public propertyTenants: PropertyTenant[] = [];
  public propertyTypes: any = ["apartment", "house", "flat"];
  public provinces: any = ["Western Province", "Eastern Province", "Eastern Province", "North West", "Limpopo", "Kwa-Zulu Natal", "Gauteng", "Free State", "Mpumalanga"];

  public viewTenant: Tenant[] = [];
  public property?: Property;
  public editProperty?: Property;
  public deleteProperty?: Property;
  public deletePropertyTenant?: PropertyTenant;
  public propertyID?: number;

  constructor(private propertyService: PropertyService, private tenantService: TenantService, private propertyTenantService: PropertyTenantService, private modalService: ModalService) { }

  ngOnInit() {
    this.getAllProperties();
    this.getAllPropertyTenants();
  }

  public getAllProperties(): void {
    this.propertyService.getProperties().subscribe((response: Property[]) => {
      this.properties = response;
      console.log(this.properties);
    }, (error: HttpErrorResponse) => {
      alert(error.message);
    }
    );
  }

  public getAllTenants(): void {
    this.tenantService.getTenants().subscribe((response: Tenant[]) => {
      this.tenants = response;
      console.log(this.tenants);
    }, (error: HttpErrorResponse) => {
      alert(error.message);
    }
    );
  }

  public getAllPropertyTenants(): void {
    this.propertyTenantService.getPropertyTenants().subscribe((response: PropertyTenant[]) => {
      this.propertyTenants = response;
    }, (error: HttpErrorResponse) => {
      alert(error.message);
    }
    );
  }

  onUpdate(editForm: NgForm): void {
    document.getElementById('edit-property-form')?.click();
    this.propertyService.updateProperty(editForm.value).subscribe(
      (response: Property) => {
        console.log(response);
        Swal.fire('Success!', 'Property has been updated!', 'success')
        this.getAllProperties();
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Yikes!', 'Something went wrong!', 'error')
      }
    );
  }

  onDelete(propertyID: number): void {
    this.propertyService.deleteProperty(propertyID).subscribe(
      (response: void) => {
        console.log(response);
        Swal.fire('Success!', 'Property has been deleted!', 'success')
        this.getAllProperties();
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Yikes!', 'Something went wrong!', 'error')
      }
    );
  }

  onDeletePropertyTenant(propertyID: number, tenantID: number): void {
    this.propertyTenantService.deleteByPropertyAndTenant(propertyID, tenantID).subscribe(
      (response: void) => {
        console.log(response);
        Swal.fire('Success!', 'Tenant has been removed!', 'success')
        document.getElementById('view-tenant-form')?.click();
        this.getAllProperties();
        this.getAllPropertyTenants();
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Yikes!', 'Something went wrong!', 'error')
      }
    );
  }

  onAdd(addForm: NgForm): void {
    this.propertyService.addProperty(addForm.value).subscribe(
      (response: Property) => {
        document.getElementById('add-property-form')?.click();
        Swal.fire('Success!', 'Property has been added!', 'success')
        console.log(response);
        this.getAllProperties();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Yikes!', 'Something went wrong!', 'error')
        addForm.reset();
      }
    );
  }

  onAddTenant(addTenantForm: NgForm): void {
    console.log(addTenantForm)
    this.propertyTenantService.addPropertyTenant(addTenantForm.value).subscribe(
      (response: PropertyTenant) => {
        Swal.fire('Success!', 'Tenant has been added!', 'success')
        this.getAllProperties();
        this.getAllPropertyTenants();
        addTenantForm.reset();
        this.modalService.close('tenantAddModal');
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Yikes!', 'Something went wrong!', 'error')
        addTenantForm.reset();
      }
    );
  }

  findTenant(propertyID: number): void {
    this.viewTenant = [];
    var tenantID: number;
    this.propertyID = propertyID;
    var amountTenants: number = 0;
    this.propertyTenants.forEach((element) => {
      if (element.propertyID === propertyID) {
        tenantID = element.tenantID;
        amountTenants++;
        this.tenantService.findTenant(tenantID).subscribe(
          (response: Tenant) => {
            this.viewTenant.push(response);
          },
          (error: HttpErrorResponse) => {
            Swal.fire('Yikes!', 'Something went wrong!', 'error')
          }
        );
      }
    });
    if (amountTenants === 0) {
      Swal.fire('Yikes!', 'No tenants were found!', 'error')
    } else {
      this.modalService.open("tenantViewModal");
    }
  }


  openModal(property: Property | undefined, id: string) {
    if (id === "addPropertyModal") {
      this.modalService.open(id);
    } else if (id === "deleteModal") {
      this.deleteProperty = property;
      this.deleteWarningAlert(this.deleteProperty);
    }
    else if (id === "editModal") {
      this.editProperty = property;
      this.modalService.open(id);
    }
    else if (id === "tenantViewModal") {
      this.findTenant(property!.propertyID);
    }
    else if (id === "tenantAddModal") {
      this.getAllTenants();
      this.property = property;
      this.modalService.open(id);
    }
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  deleteWarningAlert(deleteProperty: Property | undefined) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will delete ' + deleteProperty?.addressLine1,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {

      if (result.isConfirmed) {

        this.onDelete(deleteProperty!.propertyID)

      }
    })

  }

  deletePropertyTenantWarningAlert(propertyID: number, tenantID: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will remove this tenant.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove tenant!',
      cancelButtonText: 'No, keep tenant',
    }).then((result) => {
  
      if (result.isConfirmed) {
  
        this.onDeletePropertyTenant(propertyID, tenantID)
  
      }
    })
  }

}



