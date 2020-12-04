import { Component, OnInit } from '@angular/core';
import { InterestsService } from '../../services/interests.service';
import { PostsService } from '../../services/posts.service';
import { NgForm } from '@angular/forms';
import { Post } from '../../../models/posts';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

interface HtmlInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component({
    selector: 'app-foro',
    templateUrl: './foro.component.html',
    styleUrls: ['./foro.component.scss'],
})
export class ForoComponent implements OnInit {
    filterInterests: any[];
    profile;

    constructor(
        public interestsService: InterestsService,
        public postsService: PostsService,
        private router: Router,
        public authService: AuthService
    ) {}

    ngOnInit(): void {
        // if (!this.authService.isLoggedIn()) {
        //     this.router.navigate(['login']);
        // }
        this.getAllInterests();
        this.getAllPosts();
        this.getProfile();
    }

    getAllInterests() {
        this.interestsService.getAllInterests().subscribe(
            (res) => {
                console.log(res);
                this.interestsService.interests = res;
                this.filterInterests = this.interestsService.interests.filter(
                    (item) => {
                        return item.completed == true;
                    }
                );
                console.log(this.filterInterests);
            },
            (err) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        this.router.navigate(['/login']);
                    }
                }
            }
        );
    }

    getProfile() {
        this.postsService.getProfile(1).subscribe(
            (res) => {
                this.profile = res;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    getAllPosts() {
        this.postsService.getAllPosts().subscribe(
            (res) => {
                this.postsService.posts = res;
                console.log(res);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    addPost(form: NgForm) {
        if (form.value.id) {
            this.postsService.updatePost(form.value).subscribe(
                (res) => {
                    console.log(res);
                },
                (err) => {
                    console.log(err);
                }
            );
        } else {
            this.postsService.createPost(form.value).subscribe(
                (res) => {
                    console.log('anadir al post');
                    // this.communityClicked.emit(this.community.id);
                    this.getAllPosts();
                    form.reset();
                    alert('pOst Creada');
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }

    postDetail(id: number) {
        this.router.navigate(['/comunidad/foro', id]);
        console.log('community');
        console.log(id);
        this.postsService.getPost(id).subscribe(
            (res) => console.log(res),
            (err) => console.log(err)
        );
    }
}
