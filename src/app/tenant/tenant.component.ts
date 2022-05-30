import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TenantService } from '../tenant.service';
import { NgForm } from '@angular/forms';
import { ModalService } from '../_modal/modal.service';
import Swal from 'sweetalert2';
import { Tenant } from '../tenant';
import { Property } from '../property';
import { PropertyService } from '../property.service';
import { PropertyTenant } from '../property-tenant';
import { PropertyTenantService } from '../property-tenant.service';

@Component({
  selector: 'app-property',
  templateUrl: './tenant.component.html',
  styleUrls: ['./tenant.component.css']
})
export class TenantComponent implements OnInit {

  public tenants: Tenant[] = [];
  public propertyTenants: PropertyTenant[] = [];

  public editTenant?: Tenant;
  public deleteTenant?: Tenant;
  public tenant?: Tenant;
  public viewProperty: Property[] = [];
  public properties: Property[] = [];
  public tenantID?: number;

  constructor(private tenantService: TenantService, private propertyTenantService: PropertyTenantService, private propertyService: PropertyService, private modalService: ModalService) { }

  ngOnInit() {
    this.getAllTenants();
    this.getAllPropertyTenants();
  }

  public getAllTenants(): void {
    this.tenantService.getTenants().subscribe((response: Tenant[]) => {
      this.tenants = response;
    }, (error: HttpErrorResponse) => {
      alert(error.message);
    }
    );
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

  public getAllPropertyTenants(): void {
    this.propertyTenantService.getPropertyTenants().subscribe((response: PropertyTenant[]) => {
      this.propertyTenants = response;
    }, (error: HttpErrorResponse) => {
      alert(error.message);
    }
    );
  }

  onUpdate(editForm: NgForm): void{
    document.getElementById('edit-tenant-form')?.click();
    this.tenantService.updateTenant(editForm.value).subscribe(
      (response: Tenant) => {
        console.log(response);
        Swal.fire('Success!', 'Tenant has been updated!', 'success')
        this.getAllTenants();
      }, 
      (error: HttpErrorResponse) => {
        Swal.fire('Yikes!', 'Something went wrong!', 'error')
      }
    );
  }

  onDelete(tenantID: number):void {
    this.tenantService.deleteTenant(tenantID).subscribe(
      (response: void) => {
        console.log(response);
        Swal.fire('Success!', 'Tenant has been deleted!', 'success')
        this.getAllTenants();
      }, 
      (error: HttpErrorResponse) => {
        Swal.fire('Yikes!', 'Something went wrong!', 'error')
      }
    );
  }

  onAddProperty(addPropertyForm: NgForm): void {
    this.propertyTenantService.addPropertyTenant(addPropertyForm.value).subscribe(
      (response: PropertyTenant) => {
        Swal.fire('Success!', 'Tenant has been added!', 'success')
        this.getAllTenants();
        this.getAllPropertyTenants();
        addPropertyForm.reset();
        this.modalService.close('propertyAddModal');
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Yikes!', 'Something went wrong!', 'error')
        addPropertyForm.reset();
      }
    );
  }

  onDeletePropertyTenant(propertyID: number, tenantID: number): void {
    this.propertyTenantService.deleteByPropertyAndTenant(propertyID, tenantID).subscribe(
      (response: void) => {
        console.log(response);
        Swal.fire('Success!', 'Property has been removed!', 'success')
        document.getElementById('view-property-form')?.click();
        this.getAllTenants();
        this.getAllPropertyTenants();
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Yikes!', 'Something went wrong!', 'error')
      }
    );
  }

  onAdd(addForm: NgForm): void {
    this.tenantService.addTenant(addForm.value).subscribe(
      (response: Tenant) => {
        document.getElementById('add-tenant-form')?.click();
        Swal.fire('Success!', 'Tenant has been added!', 'success')
        console.log(response);
        this.getAllTenants();
        addForm.reset();
      },
      (error: HttpErrorResponse) => {
        Swal.fire('Yikes!', 'Something went wrong!', 'error')
        addForm.reset();
      }
    );
  }

  findProperty(tenantID: number): void {
    this.viewProperty = [];
    var propertyID: number;
    this.tenantID = tenantID
    var amountProperties: number = 0;
    this.propertyTenants.forEach((element) => {
      if (element.tenantID === tenantID) {
        propertyID = element.propertyID;
        console.log("propertyID is: " + element.propertyID)
        amountProperties++;
        this.propertyService.findProperty(propertyID).subscribe(
          (response: Property) => {
            this.viewProperty.push(response);
          },
          (error: HttpErrorResponse) => {
            Swal.fire('Yikes!', 'Something went wrong!', 'error')
          }
        );
      }
    });
    if (amountProperties === 0) {
      Swal.fire('Yikes!', 'No property was found!', 'error')
    } else {
      this.modalService.open("propertyViewModal");
    }
  }


  openModal(tenant: Tenant | undefined, id: string) {
    if (id === "addTenantModal") {
      this.modalService.open(id);
    } else if (id === "deleteModal") {
      this.deleteTenant = tenant;
      this.deleteWarningAlert(this.deleteTenant);
    } else if (id === "editModal") {
      this.editTenant = tenant;
      this.modalService.open(id);
    } else if (id === "propertyViewModal") {
      this.findProperty(tenant!.tenantID);
    }else if (id === "propertyAddModal") {
      this.getAllProperties();
      this.tenant = tenant;
      this.modalService.open(id);
    }
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  deleteWarningAlert(deleteTenant: Tenant | undefined) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will delete ' + deleteTenant?.firstName,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {

      if (result.isConfirmed) {

        this.onDelete(deleteTenant!.tenantID)

      }
    })

  }

  deletePropertyTenantWarningAlert(tenantID: number, propertyID: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will remove this property.',
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

