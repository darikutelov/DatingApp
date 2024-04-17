import { Component, OnInit } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css'],
})
export class PhotoManagementComponent implements OnInit {
  photos: Photo[] = [];

  constructor(readonly adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getPhotosForApproval().subscribe({
      next: (photos) => {
        this.photos = photos;
      },
    });
  }

  approvePhoto(photo: Photo) {
    this.adminService.approvePhoto(photo.id).subscribe({
      next: () => {
        this.photos.splice(
          this.photos.findIndex((p) => p.id === photo.id),
          1
        );
      },
    });
  }

  rejectPhoto(photo: Photo) {
    this.adminService.rejectPhoto(photo.id).subscribe({
      next: () => {
        this.photos.splice(
          this.photos.findIndex((p) => p.id === photo.id),
          1
        );
      },
    });
  }
}
