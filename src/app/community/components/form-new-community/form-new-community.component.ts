import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Community } from '../../../models/new_communities';
import Swal from 'sweetalert2';

import { CommunityService } from '../../services/community.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface HtmlInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component({
    selector: 'app-form-new-community',
    templateUrl: './form-new-community.component.html',
    styleUrls: ['./form-new-community.component.scss'],
})
export class FormNewCommunityComponent implements OnInit {
    @Input() community: Community; // Enviar  datos
    @Output() communityClicked: EventEmitter<any> = new EventEmitter();
    @Output() communidades: EventEmitter<any> = new EventEmitter();
    // @Input() communidades;

    file: File;
    name;
    description;
    photoSelected: string | ArrayBuffer;
    cover: File;
    uploadedFiles: Array<File>;
    image = '../../../../assets/images/borde-logo.png';
    activitySelect = 1;

    constructor(
        public communityService: CommunityService,
        public http: HttpClient,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getAllCommunities();
    }

    guardar() {
        Swal.fire({
            icon: 'success',
            title: 'gracias',
            showConfirmButton: true,
        }).then(function () {
            console.log('Se hizo clic en el botón Aceptar.');
        });
    }

    // resetForm(name, description) {
    //     name.value.reset();
    //     description.value.reset();
    // }

    getAllCommunities() {
        this.communityService.getAllCommunities().subscribe(
            (res) => {
                this.communityService.communities = res;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    editCommunity(community: Community) {
        this.communityService.selectedCommunity = community;
    }

    deleteCommunity(id: number) {
        const res = confirm('Estas seguro de querer eliminarlo');
        if (res) {
            this.communityService.deleteCommunity(id).subscribe(
                (res) => {
                    console.log(res);
                    this.getAllCommunities();
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }

    onPhotoSelected(event: HtmlInputEvent): void {
        if (event.target.files && event.target.files[0]) {
            this.file = <File>event.target.files[0];
            // image preview
            console.log(this.file);
            const reader = new FileReader();
            reader.onload = (e) => (this.photoSelected = reader.result);
            reader.readAsDataURL(this.file);
        }
    }

    uploadPhoto(
        name: HTMLInputElement,
        description: HTMLTextAreaElement,
        id
    ): boolean {
        this.communityService
            .createCommunity(
                name.value,
                description.value,
                this.file,
                localStorage.getItem('dataUser'),
                this.activitySelect
            )
            .subscribe(
                (res) => {
                    console.log(res);
                },
                (err) => console.log(err)
            );
        return false;
    }

    selectActivity(e) {
        this.activitySelect = parseInt(e.target.value);
    }
}
