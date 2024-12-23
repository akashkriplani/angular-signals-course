import { Component, computed, effect, inject, Injector, signal } from '@angular/core';
import { CoursesService } from "../services/courses.service";
import { Course, sortCoursesBySeqNo } from "../models/course.model";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { CoursesCardListComponent } from "../courses-card-list/courses-card-list.component";
import { MatDialog } from "@angular/material/dialog";
import { MessagesService } from "../messages/messages.service";
import { catchError, from, throwError } from "rxjs";
import { toObservable, toSignal, outputToObservable, outputFromObservable } from "@angular/core/rxjs-interop";
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
  selector: 'home',
  imports: [
    MatTabGroup,
    MatTab,
    CoursesCardListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  advancedCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(({ category }) => category === 'ADVANCED')
  });

  beginnerCourses = computed(() => {
    const courses = this.#courses();
    return courses.filter(({ category }) => category === 'BEGINNER')
  });

  coursesService = inject(CoursesService);
  dialog = inject(MatDialog);

  #courses = signal<Course[]>([]);

  constructor() {
    this.loadCourses().then(() => console.log(`All courses loaded: `, this.#courses()));
  }

  onAddCourse = async () => {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create new course',
    });

    if (!newCourse) {
      return;
    }

    const newCourses = [...this.#courses(), newCourse];
    this.#courses.set(newCourses);
  }

  onCourseDeleted = async (courseId: string) => {
    try {
      await this.coursesService.deleteCourse(courseId);
      const courses = this.#courses();
      const newCourses = courses.filter(({ id }) => id !== courseId);
      this.#courses.set(newCourses);
    } catch (err) {
      alert('Error deleting course!');
      console.error(err);
    }
  }

  onCourseUpdated = (updatedCourse: Course) => {
    const courses = this.#courses();
    const newCourses = courses.map(course => course.id === updatedCourse.id ? updatedCourse : course);
    this.#courses.set(newCourses);
  }

  loadCourses = async () => {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (err) {
      alert('Error loading courses!');
      console.error(err);
    }
  }
}
