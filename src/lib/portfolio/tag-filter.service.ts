import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Project } from './project';
import { ProjectService } from './project.service';
import { TagFilter } from './tag-filter';

@Injectable({
  providedIn: 'root',
})
export class TagFilterService {
  private subscription!: Subscription;

  private subject = new Subject<TagFilter[]>();
  private tagFilters: TagFilter[] = [];

  constructor(private projectService: ProjectService) {}

  public setTagFiltersFromProjects(
    projects: Project[]
  ): Observable<TagFilter[]> {
    this.tagFilters = this.buildTagFiltersFromProjects(projects);

    return this.subject.asObservable();
  }

  public update() {
    this.sendUpdate();
  }

  private sendUpdate(): void {
    this.subject.next(this.tagFilters);
  }

  private buildTagFiltersFromProjects(projects: Project[]) {
    let output: TagFilter[];

    output = [];
    projects.forEach((project) => {
      if (project) {
        Array.from(project.tags).forEach((tag) => {
          if (this.isNewTag(tag, output)) {
            output.push(this.buildNewTagFilter(tag));
          } else {
            this.increaseTagFilterCount(tag, output);
          }
        });
      }
    });
    output.sort((a, b) => {
      return b.count - a.count;
    });

    return output;
  }

  public toggleTagFilter(tag: string): void {
    let tagFilter = this.getTagFilter(tag);
    tagFilter.enabled = !tagFilter.enabled;

    this.sendUpdate();
  }

  public cropToTagFilter(tag: string): void {
    this.tagFilters.forEach((value) => {
      if (value.tag == tag) {
        value.enabled = true;
      } else {
        value.enabled = false;
      }
    });

    this.sendUpdate();
  }

  private getTagFilter(tag: string): TagFilter {
    return this.tagFilters.find((tagFilter) => tagFilter.tag == tag)!;
  }

  private buildNewTagFilter(tag: string): TagFilter {
    return {
      tag: tag,
      count: 1,
      enabled: true,
    };
  }

  private increaseTagFilterCount(tag: string, tags: TagFilter[]) {
    var tagToIncrease: TagFilter = tags.find(
      (insideTag) => insideTag.tag == tag
    )!;
    tagToIncrease.count++;
  }

  private isNewTag(tag: string, output: TagFilter[]) {
    return output.some((outputTag) => outputTag.tag === tag) === false;
  }
}
