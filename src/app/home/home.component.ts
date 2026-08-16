import {
  afterNextRender,
  Component,
  computed,
  effect,
  inject,
  Injector,
  OnInit,
  signal,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, interval, startWith, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';

@Component({
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #courses = signal<Course[]>([]);

  coursesService = inject(CoursesService);

  beginnerCourses = computed(() => {
    const courses = this.#courses();

    return courses.filter((course) => course.category === 'BEGINNER');
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();

    return courses.filter((course) => course.category === 'ADVANCED');
  });

  dialog = inject(MatDialog);
  messageService = inject(MessagesService);
  injector = inject(Injector);

  constructor() {
    effect(() => {
      console.log(`Beginner Courses: `, this.beginnerCourses());
      console.log(`Advanced Courses: `, this.advancedCourses());
    });

    this.loadCourses().then(() =>
      console.log(`All courses loaded!`, this.#courses()),
    );
  }

  async loadCourses() {
    try {
      const courses = await this.coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (err) {
      this.messageService.showMessage('Error loading courses!', 'error');
      console.error(err);
    }
  }

  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses();

    const newCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course,
    );

    this.#courses.set(newCourses);
  }

  async onCourseDeleted(courseId: string) {
    try {
      await this.coursesService.deleteCourse(courseId);
      const courses = this.#courses();
      const newCourses = courses.filter((course) => course.id !== courseId);
      this.#courses.set(newCourses);
    } catch (err) {
      console.error(err);
      this.messageService.showMessage('Error deleting course.', 'error');
    }
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create New Course',
    });

    if (!newCourse) {
      return;
    }

    const newCourses = [...this.#courses(), newCourse];

    this.#courses.set(newCourses);
  }

  onToObservableExample() {
    // const courses$ = toObservable(this.#courses, { injector: this.injector });

    const numbers = signal(0);
    numbers.set(1);
    numbers.set(2);
    numbers.set(3);

    // Convert signal to observable
    // injector is required to let angular know the injection context
    // If we do this inside constructor, there is no need to insert the injector
    // For converting signals to observable on demand, we are required to inject the injector
    const numbers$ = toObservable(numbers, {
      injector: this.injector,
    });

    numbers.set(4);

    numbers$.subscribe((val) => console.log('number$: ', val));
    numbers.set(5);
    // toObservable() internally uses effects and handles signals and wait for them to stabilize
    // That's why if you set signal multiple times, only the last value (i.e. 5)
    // will be printed to console
  }

  // onToSignalExample() {
  //   const courses$ = from(this.coursesService.loadAllCourses());
  //   // Convert observable to signal
  //   const courses = toSignal(courses$, {
  //     injector: this.injector,
  //   });

  //   effect(
  //     () => {
  //       console.log('courses: ', courses());
  //     },
  //     {
  //       injector: this.injector,
  //     },
  //   );
  // }

  onToSignalExample() {
    const numbers$ = interval(1000).pipe(startWith(0));

    // Use requiresync if you want observable to provide the initial value
    // Use initial value if in the config of toSignal() if you want to provide
    // initial value to a signal
    // NOTE: Both CANNOT be used in parallel

    const numbers = toSignal(numbers$, {
      injector: this.injector,
      // initialValue: 0,
      requireSync: true,
    });

    effect(
      () => {
        console.log('Numbers: ', numbers());
      },
      {
        injector: this.injector,
      },
    );
  }
}
