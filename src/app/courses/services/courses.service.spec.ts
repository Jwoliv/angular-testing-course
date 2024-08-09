import {CoursesService} from './courses.service';
import {TestBed} from '@angular/core/testing';
import {HttpErrorResponse, HttpEventType, provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {COURSES, LESSONS} from "../../../../server/db-data";
import {Course} from "../model/course";

describe('Testing CoursesService', () => {
  let service: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CoursesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return all courses', () => {
    service.findAllCourses().subscribe({
      next: (items) => {
        expect(items).toBeTruthy();
        expect(items.length).toBe(Object.values(COURSES).length);
        const title = items.find(item => item.id === 12)?.titles.description;
        expect(title).toBe('Angular Testing Course');
      },
    });
    const request = httpTestingController.expectOne('/api/courses');
    expect(request.request.method).toEqual('GET');
    request.flush({
      payload: Object.values(COURSES),
    });
  });

  it('should return one course', () => {
    service.findCourseById(1).subscribe({
      next: (item) => {
        expect(item).toBeTruthy();
        expect(item.titles.description).toContain('Serverless Angular')
      }
    })

    const request = httpTestingController.expectOne(`/api/courses/1`);
    expect(request.request.method).toEqual('GET');
    request.flush(COURSES[1]);
  });

  it('should save one course', () => {
    const id = 1;
    const changes: Partial<Course> = { titles: { description: 'example' } };

    service.saveCourse(id, changes).subscribe({
      next: (course) => {
        expect(course).toBeTruthy();
        expect(course.titles.description).toBe('example');
      }
    });

    const request = httpTestingController.expectOne(`/api/courses/${id}`);
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body.titles.description).toBe('example');

    request.flush({
      ...COURSES[0],
      ...changes
    });
  });

  it('should throw error during find one course', () => {
    const id = 1;
    const changes: Partial<Course> = { titles: { description: 'example' } };

    service.saveCourse(id, changes).subscribe({
      next: () => fail('next should have error'),
      error: (err: HttpErrorResponse) => {
        expect(err).toBeInstanceOf(HttpErrorResponse);
        expect(err.status).toBe(500);
        expect(err.statusText).toBe('Something went wrong');
      }
    });

    const request = httpTestingController.expectOne(`/api/courses/${id}`);
    expect(request.request.method).toEqual('PUT');
    expect(request.request.body.titles.description).toBe('example');

    request.flush('', {
      status: 500,
      statusText: 'Something went wrong'
    });
  });

  it('should find lessons', () => {
    service.findLessons(1, "", 'desc').subscribe({
      next: lessons => {
        expect(lessons).toBeTruthy()
        expect(lessons.length).toBe(3)
      }
    })
    const request = httpTestingController.expectOne('/api/lessons?courseId=1&filter=&sortOrder=desc&pageNumber=0&pageSize=3');
    expect(request.request.method).toEqual('GET');
    expect(request.request.params.get('sortOrder')).toBe('desc');
    expect(request.request.params.get('pageNumber')).toBe('0');
    expect(request.request.params.get('pageSize')).toBe('3');
    request.flush({
      payload: Object.values(LESSONS).slice(0, 3)
    })
  });

  afterEach(() => {
    httpTestingController.verify();
  })

});
