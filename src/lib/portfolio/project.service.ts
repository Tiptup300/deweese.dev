import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, Subscription } from 'rxjs';
import { Project } from './project';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private subscription!: Subscription;

  private apiUrl = 'assets/projects/projects.json';
  private projectImagesPath = 'assets/projects/';

  constructor(private httpClient: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.apiUrl);
  }

  getProject(id: string): Observable<Project> {
    let foundProject: Project;
    var subject = new Subject<Project>();

    this.subscription = this.getProjects().subscribe((projects) => {
      foundProject = projects.find((project) => project.id === id)!;

      subject.next(foundProject);
    });

    return subject.asObservable();
  }

  getProjectsImagePath(projectId: string): string {
    return this.projectImagesPath + projectId + '.jpg';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
