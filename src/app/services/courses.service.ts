import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { firstValueFrom } from "rxjs";
import { Course } from "../models/course.model";
import { GetCoursesResponse } from "../models/get-courses.response";


@Injectable({
  providedIn: "root"
})
export class CoursesService {
  env = environment;
  http = inject(HttpClient);

  createCourse = async (course: Partial<Course>): Promise<Course> => {
    const course$ = this.http.post<Course>(`${this.env.apiRoot}/courses`, course);
    return firstValueFrom(course$);
  }

  deleteCourse = async (courseId: string): Promise<void> => {
    const delete$ = this.http.delete<void>(`${this.env.apiRoot}/courses/${courseId}`);
    return firstValueFrom(delete$);
  }

  saveCourse = async (courseId: string, changes: Partial<Course>): Promise<Course> => {
    const course$ = this.http.put<Course>(`${this.env.apiRoot}/courses/${courseId}`, changes);
    return firstValueFrom(course$);
  }

  loadAllCourses = async (): Promise<Course[]> => {
    const courses$ = this.http.get<GetCoursesResponse>(`${this.env.apiRoot}/courses`);
    const response = await firstValueFrom(courses$);
    return response.courses;
  }

}
