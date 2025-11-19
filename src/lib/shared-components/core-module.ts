import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzModalModule } from "ng-zorro-antd/modal";
import { IcFileUploadComponent } from "./ic-file-upload.component";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzUploadModule } from "ng-zorro-antd/upload";
import { CommonModule } from "@angular/common";


@NgModule({
    declarations: [
        IcFileUploadComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NzModalModule,
        NzIconModule,
        NzLayoutModule,
        NzButtonModule,
        NzUploadModule,
    ],
    exports: [
        IcFileUploadComponent
    ]
})
export class CoreModule {}