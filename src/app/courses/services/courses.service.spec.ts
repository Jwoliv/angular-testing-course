import {CoursesService} from './courses.service';
import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {COURSES} from "../../../../server/db-data";

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
    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual('GET');
    req.flush({
      payload: Object.values(COURSES),
    });
  });
});
