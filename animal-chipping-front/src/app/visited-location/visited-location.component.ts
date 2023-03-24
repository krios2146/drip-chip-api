import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VisitedLocationRequest } from '../model/visited-location/visited-location-request';
import { VisitedLocationResponse } from '../model/visited-location/visited-location-response';
import { VisitedLocationService } from '../service/visited-location.service';

@Component({
  selector: 'app-visited-location',
  templateUrl: './visited-location.component.html',
  styleUrls: ['./visited-location.component.css']
})
export class VisitedLocationComponent {
  addForm: FormGroup;
  updateForm: FormGroup;
  deleteForm: FormGroup;

  addedVisitedLocation: VisitedLocationResponse | undefined;
  updatedVisitedLocation: VisitedLocationResponse | undefined;
  isVisitedLocationDeleted: boolean = false;

  constructor(private formBuilder: FormBuilder, private visitedLocationService: VisitedLocationService) {
    this.addForm = this.formBuilder.group({
      animalId: [null, Validators.required],
      locationId: [null, Validators.required]
    });

    this.updateForm = this.formBuilder.group({
      animalId: [null, Validators.required],
      visitedLocationId: [null, Validators.required],
      locationId: [null, Validators.required]
    });

    this.deleteForm = this.formBuilder.group({
      visitedLocationId: [null, Validators.required],
    });
  }

  addVisitedLocation() {
    const animalId = this.addForm.get('animalId')!.value;
    const locationId = this.addForm.get('locationId')!.value;
    this.visitedLocationService.addVisitedLocationToAnimal(animalId, locationId).subscribe(
      (response: VisitedLocationResponse) => {
        this.addedVisitedLocation = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  updateVisitedLocation() {
    const animalId = this.updateForm.get('animalId')!.value;
    const request: VisitedLocationRequest = this.getRequestFromForm(this.updateForm);
    this.visitedLocationService.updateVisitedLocationOfAnimal(animalId, request).subscribe(
      (response: VisitedLocationResponse) => {
        this.updatedVisitedLocation = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  deleteVisitedLocation() {
    const animalId = this.deleteForm.get('animalId')!.value;
    const visitedLocationId = this.deleteForm.get('visitedLocationId')!.value;
    this.visitedLocationService.deleteVisitedLocationFromAnimal(animalId, visitedLocationId).subscribe(
      () => {
        this.isVisitedLocationDeleted = true;
        setTimeout(
          () => {
            this.isVisitedLocationDeleted = false;
          },
          3000
        );
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  private getRequestFromForm(visitedLocationForm: FormGroup): VisitedLocationRequest {
    return {
      visitedLocationId: visitedLocationForm.get('visitedLocationId')?.value,
      locationId: visitedLocationForm.get('locationId')?.value
    }
  }
}
