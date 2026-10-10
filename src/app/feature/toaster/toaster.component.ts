import { Component, inject } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';
import { MatIcon } from "@angular/material/icon";
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-toaster',
    imports: [MatIcon,NgClass],
    templateUrl: './toaster.component.html',
    styleUrl: './toaster.component.css'
})
export class ToasterComponent {
readonly toastService = inject(ToasterService);
}
