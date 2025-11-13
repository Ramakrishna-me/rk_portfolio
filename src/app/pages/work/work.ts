import { Component } from '@angular/core';
import { WORK_ITEMS } from './work.config';

@Component({
  selector: 'app-work',
  standalone: false,
  templateUrl: './work.html',
  styleUrl: './work.scss',
})
export class Work {
  items = WORK_ITEMS;
  filteredItems = [...this.items];
  categories = ['All', 'Angular', 'Figma', 'Design'];
  selectedCategory = 'All';

  filterCategory(category: string) {
    this.selectedCategory = category;
    this.filteredItems =
      category === 'All'
        ? this.items
        : this.items.filter((i) => i.category.toLowerCase() === category.toLowerCase());
  }

  handleCardClick(item: any) {
    // If it's a PDF → open in new tab
    if (item.file.endsWith('.pdf')) {
      window.open(item.file, '_blank');
      return;
    }

    // If it's a video or image → do nothing (they are displayed inline)
    // Optional: You can log or add other actions here
  }
}
