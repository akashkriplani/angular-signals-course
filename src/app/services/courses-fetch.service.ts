import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Course } from "../models/course.model";


@Injectable({
  providedIn: "root"
})
export class CoursesServiceWithFetch {

  env = environment;

  createCourse = async (course: Partial<Course>): Promise<Course> => {
    const response = await fetch(`${this.env.apiRoot}/courses`, {
      method: 'POST',
      body: JSON.stringify(course),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }

  deleteCourse = async (courseId: string): Promise<void> => {
    await fetch(`${this.env.apiRoot}/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  loadAllCourses = async (): Promise<Course[]> => {
    const response = await fetch(`${this.env.apiRoot}/courses`);
    const payload = await response.json();

    return payload.courses;
  }

  saveCourse = async (courseId: string, changes: Partial<Course>): Promise<Course> => {
    const response = await fetch(`${this.env.apiRoot}/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }

}
