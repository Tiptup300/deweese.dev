import { Component, OnInit } from '@angular/core';
import { interval, Observable, Subscription, pipe } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Project } from '../../../lib/portfolio/project';
import { FilteredProjectService } from '../../../lib/portfolio/filtered-project.service';
import { TagFilter } from 'src/lib/portfolio/tag-filter';
import { ProjectService } from 'src/lib/portfolio/project.service';
import { TagFilterService } from 'src/lib/portfolio/tag-filter.service';
import { ProjectFiltererService } from 'src/lib/portfolio/project-filterer.service';

@Component({
  selector: 'portfolio-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  projects!: Project[];
  projectsSub!: Subscription;
  projectsLoadError!: string;

  tagFilters$!: Observable<TagFilter[]>;
  tagFilters!: TagFilter[];
  tagFiltersSub!: Subscription;

  filteredProjects$!: Observable<Project[]>;
  filteredProjects!: Project[];
  filteredProjectsSub!: Subscription;

  constructor(
    private filteredProjectService: FilteredProjectService,
    private projectService: ProjectService,
    private tagFilterService: TagFilterService,
    private projectFiltererService: ProjectFiltererService
  ) {}

  ngOnInit(): void {
    this.subscribeToProjects();
  }

  private subscribeToProjects(): void {
    this.projectsSub = this.projectService.getProjects().subscribe(
      (freshProjects) => {
        freshProjects.sort((a, b) =>
          a.dateRange > b.dateRange ? 1 : b.dateRange > a.dateRange ? -1 : 0
        );
        this.loadFreshProjects(freshProjects);
        this.projectsSub.unsubscribe();
      },
      (error) => {
        this.projectsLoadError = error;
      }
    );
  }

  private loadFreshProjects(freshProjects: Project[]): void {
    this.projects = freshProjects;
    this.buildTagFilters();
    this.filterProjects();
    this.tagFilterService.update();
  }

  private buildTagFilters() {
    this.tagFilters$ = this.tagFilterService.setTagFiltersFromProjects(
      this.projects
    );

    this.tagFiltersSub = this.tagFilters$.subscribe((x) => {
      this.tagFilters = x;
    });
  }

  private filterProjects() {
    this.filteredProjects$ =
      this.filteredProjectService.onNextTagFilterFilterProjects(
        this.projects,
        this.tagFilters$
      );

    this.filteredProjectsSub = this.filteredProjects$.subscribe((x) => {
      this.filteredProjects = x;
    });
  }

  ngOnDestroy(): void {
    if (this.projectsSub) this.projectsSub.unsubscribe();
    if (this.tagFiltersSub) this.tagFiltersSub.unsubscribe();
    if (this.filteredProjectsSub) this.filteredProjectsSub.unsubscribe();
  }
}
