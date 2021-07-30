import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TagFilterService } from 'src/.lib/portfolio/tag-filter.service';
import { TagFilter } from '../../../.lib/portfolio/tag-filter';

@Component({
  selector: 'gallery-filter-box',
  templateUrl: './gallery-filter-box.component.html',
  styleUrls: ['./gallery-filter-box.component.css']
})
export class GalleryFilterBoxComponent implements OnInit {

  tagFilterChangeSubscription!: Subscription;


  tagFilters: TagFilter[] = [];

  constructor(private tagFilterService: TagFilterService) { }

  ngOnInit(): void {
    this.tagFilterChangeSubscription = this.tagFilterService.onGetTagFilters()
    .subscribe(
      value => {
        this.tagFilters = value}
      );
      this.tagFilterService.loadTagFilters();
  }

  ngOnDestroy() {
    this.tagFilterChangeSubscription.unsubscribe();
  }

  checkChanged(tagFilter:TagFilter) {
    this.tagFilterService.toggleTagFilter(tagFilter.tag);
  }

  cropToTag(tagFilter:TagFilter) {
    this.tagFilterService.cropToTagFilter(tagFilter.tag);
  }

}
