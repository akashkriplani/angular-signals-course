import { Component, effect, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../models/course.model";
import { EditCourseDialogData } from "./edit-course-dialog.data.model";
import { CoursesService } from "../services/courses.service";
import { LoadingIndicatorComponent } from "../loading/loading.component";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CourseCategoryComboboxComponent } from "../course-category-combobox/course-category-combobox.component";
import { CourseCategory } from "../models/course-category.model";
import { firstValueFrom } from 'rxjs';
import { MessagesService } from '../messages/messages.service';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss'
})
export class EditCourseDialogComponent {
  courseService = inject(CoursesService);
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  fb = inject(FormBuilder);
  messagesService = inject(MessagesService);

  form = this.fb.group({
    title: [''],
    longDescription: [''],
    category: [''],
    iconUrl: [''],
  });

  constructor() {
    this.form.patchValue({
      title: this.data.course?.title,
      longDescription: this.data.course?.longDescription,
      category: this.data.course?.category,
      iconUrl: this.data.course?.iconUrl,
    });
  }

  createCourse = async (courseProps: Partial<Course>) => {
    try {
      const newCourse = await this.courseService.createCourse(courseProps);
      this.dialogRef.close(newCourse);
    } catch (err) {
      console.error('Error creating course', err);
      this.messagesService.showMessage('Failed to create course.', 'error');
    }
  }

  onClose = () => this.dialogRef.close();

  onSave = async () => {
    const courseProps = this.form.value as Partial<Course>;

    if (this.data?.mode === 'update') {
      await this.saveCourse(this.data.course!.id, courseProps);
    } else if (this.data?.mode === 'create') {
      await this.createCourse(courseProps);
    }
  }

  saveCourse = async (courseId: string, courseProps: Partial<Course>) => {
    try {
      const updatedCourse = await this.courseService.saveCourse(courseId, courseProps);
      this.dialogRef.close(updatedCourse);
    } catch (error) {
      console.error('Error saving course', error);
      this.messagesService.showMessage('Failed to save course.', 'error');
    }
  }
}

export const openEditCourseDialog = async (dialog: MatDialog, data: EditCourseDialogData) => {
  const config = new MatDialogConfig();
  config.autoFocus = true;
  config.disableClose = true;
  config.data = data;
  config.width = '400px';

  const close$ = dialog.open(EditCourseDialogComponent, config).afterClosed();

  return firstValueFrom(close$);
}
