import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Course } from "../models/course.model";
import { MatDialog } from "@angular/material/dialog";
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
  selector: 'courses-card-list',
  imports: [
    RouterLink
  ],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss'
})
export class CoursesCardListComponent {
  courses = input.required<Course[]>();

  courseDeleted = output<string>();
  courseUpdated = output<Course>();

  dialog = inject(MatDialog);

  onDeleteCourse = ({ id }: Course) => this.courseDeleted.emit(id);

  onEditCourse = async (course: Course) => {
    const newCourse = await openEditCourseDialog(
      this.dialog,
      {
        course,
        mode: 'update',
        title: 'Update existing course',
      });

    if (!newCourse) {
      return;
    }

    this.courseUpdated.emit(newCourse);
  }
}
