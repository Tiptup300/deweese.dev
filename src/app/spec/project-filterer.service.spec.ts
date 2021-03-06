import { TestBed } from '@angular/core/testing';
import { ProjectFiltererService } from 'src/lib/portfolio/project-filterer.service';
import { Project } from '../../lib/portfolio/project';

import { TagFilter } from '../../lib/portfolio/tag-filter';

describe('ProjectFiltererService', () => {
  let service: ProjectFiltererService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectFiltererService);
  });

  it('shouldfiltertags', () => {
    let projects: Project[] = [
      {
        id: "project-will-be-enabled",
        title: "",
        description: "",
        dateRange: "",
        dateRangeDescription: "",
        tags: [
          "tagToEnable"
        ]
      },
      {
        id: "project-will-be-disabled",
        title: "",
        description: "",
        dateRange: "",
        dateRangeDescription: "",
        tags: ["tagToDisable"]
      }
    ];
    let tagFilters: TagFilter[] = [
      {
        tag: "tagToEnable",
        count: 1,
        enabled: true
      },
      {
        tag: "tagToDisable",
        count: 1,
        enabled: false
      }
    ];
    expect(service.filterProjects(projects, tagFilters).length).toBe(1);
  });
});
