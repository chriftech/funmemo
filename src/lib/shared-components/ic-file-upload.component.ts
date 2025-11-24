import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
  });

@Component({
  selector: 'ic-file-upload',
  template: `
    <nz-upload
      nzAction="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      nzListType="picture-card"
      [(nzFileList)]="fileList"
      [nzShowButton]="fileList.length < 8"
      [nzPreview]="handlePreview"
      class="flex"
      nzAccept="image/*"
      nzCapture="environment"
    >
      <div>
        <nz-icon nzType="plus" />
        <div style="margin-top: 8px">Upload</div>
      </div>
    </nz-upload>
    <nz-modal
      [nzVisible]="previewVisible"
      [nzContent]="modalContent"
      [nzFooter]="null"
      (nzOnCancel)="previewVisible = false"
    >
      <ng-template #modalContent>
        <img [src]="previewImage" style="width: 100%" />
      </ng-template>
    </nz-modal>
  `,
  standalone: false,
})
export class IcFileUploadComponent {
  fileList: NzUploadFile[] = [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    },
  ];
  previewImage: string | undefined = '';
  previewVisible = false;

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };
}
