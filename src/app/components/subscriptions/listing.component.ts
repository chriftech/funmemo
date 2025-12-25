import { Component } from '@angular/core';

import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableSortFn,
  NzTableSortOrder
} from 'ng-zorro-antd/table';

interface ItemData {
  plan: string;
  amount: number;
  createdAt: Date;
  status: string
}

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<ItemData> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<ItemData> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'nz-demo-table-sort-filter',
  standalone: false,
  template: `
   <div class="px-2 ml:px-10 lg:xl:px-20">
    <div class="flex justify-between items-center">
      <p class="text-[16pt] font-semibold text-gray-500">Subscription Reports</p>
      <div class="flex">
        <input nz-input placeholder="Search subscription" class="w-100! text-gray-800! font-semibold! rounded-r-none"/>
        <button class="rounded-l-none px-2! border-l! border-l-white!" nz-button variant="primary"><nz-icon nzType="search"/> Search</button>
      </div>
    </div>
    <nz-table #filterTable [nzData]="listOfData" nzTableLayout="fixed" class="border-r! border-l! border-gray-100 px-1! min-h-1/4">
      <thead>
        <tr>
          @for (column of listOfColumns; track column) {
            <th
            >
              {{ column.name }}
            </th>
          }
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        @for (data of filterTable.data; track data) {
          <tr>
            <td>{{ data.plan }}</td>
            <td>{{ data.amount | currency: 'ZMW ' }}</td>
            <td>{{ data.createdAt | date }}</td>
            <td>{{ data.status }}</td>
            <td>
              <div class="flex gap-1">
                <button class="border-none!" nz-button variant="primary" (click)="reportPreview()"><nz-icon nzType="eye"/></button>
                <button class="border-none!" nz-button variant="primary" (click)="reportPreview()"><nz-icon nzType="download"/></button>
              </div>
            </td>
          </tr>
        }
      </tbody>
    </nz-table>
  </div>

  <nz-modal
      [(nzVisible)]="isVisible"
      nzTitle="Report Preview"
      (nzOnCancel)="handleCancel()"
      (nzOnOk)="handleOk()"
      [nzOkLoading]="isOkLoading"
    >
      <p *nzModalContent></p>
    </nz-modal>
  `
})
export class SubscriptionListingPage {
  isVisible = false;
  isOkLoading = false;

  reportPreview(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  listOfColumns: ColumnItem[] = [
    {
      name: 'Plan',
      sortOrder: null,
      sortFn: (a: ItemData, b: ItemData) => a.plan.localeCompare(b.plan),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [
        { text: 'Joe', value: 'Joe' },
        { text: 'Jim', value: 'Jim', byDefault: true }
      ],
      filterFn: (list: string[], item: ItemData) => list.some(plan => item.plan.indexOf(plan) !== -1)
    },
    {
      name: 'Amount',
      sortOrder: 'descend',
      sortFn: (a: ItemData, b: ItemData) => a.amount - b.amount,
      sortDirections: ['descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: true
    },
    {
      name: 'Subscription date',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: ItemData, b: ItemData) => a.createdAt.toDateString().length - b.createdAt.toDateString().length,
      filterMultiple: false,
      listOfFilter: [
        { text: 'London', value: 'London' },
        { text: 'Sidney', value: 'Sidney' }
      ],
      filterFn: (createdAt: string, item: ItemData) => createdAt.length - item.createdAt.toDateString().length === -1,
    },
    {
      name: 'Status',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: ItemData, b: ItemData) => a.createdAt.toDateString().length - b.createdAt.toDateString().length,
      filterMultiple: false,
      listOfFilter: [
        { text: 'London', value: 'London' },
        { text: 'Sidney', value: 'Sidney' }
      ],
      filterFn: (address: string, item: ItemData) => item.createdAt.toDateString().indexOf(address) !== -1
    }
  ];
  listOfData: ItemData[] = [
    {
      plan: 'Basic',
      amount: 14.99,
      createdAt: new Date(),
      status: 'Completed'
    },
    {
      plan: 'Standard',
      amount: 24.99,
      createdAt: new Date(),
      status: 'Completed'
    },
    {
      plan: 'Annual',
      amount: 78.99,
      createdAt: new Date(),
      status: 'Completed'
    },
  ];
}
