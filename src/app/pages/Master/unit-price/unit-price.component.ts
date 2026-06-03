import { Component } from '@angular/core';
import { BreadcrumComponent } from '../../../components/breadcrum/breadcrum.component';
import { AddFilterBtnComponent } from '../../../components/add-filter-btn/add-filter-btn.component';

@Component({
  selector: 'app-unit-price',
  imports: [BreadcrumComponent, AddFilterBtnComponent],
  templateUrl: './unit-price.component.html',
  styleUrl: './unit-price.component.css',
})
export class UnitPriceComponent {
  addUnitPrice() {}
}
