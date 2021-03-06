import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Input, ViewChild, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EventEmitter } from 'events';
import { InterestsService } from 'src/app/interests/services/interests.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivitiesService } from '../../services/activities.service';
import { CommentsService } from '../../services/comments.service';
import { CommunityService } from '../../services/community.service';
import { JoinUserService } from '../../services/join-user.service';
import { PostsService } from '../../services/posts.service';

interface HtmlInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

@Component({
    selector: 'app-posts-community',
    templateUrl: './posts-community.component.html',
    styleUrls: ['./posts-community.component.scss'],
})
export class PostsCommunityComponent implements OnInit {
    filterInterests: any[];
    profile;
    dataUser;
    userPost;
    resUser;
    newUserPost;
    pushUser = [];
    stateComment: boolean = false;
    posts;
    // @Input() community; // Enviar
    community;
    // @Output() refreshPosts = new EventEmitter();
    postCommunity;
    postsCommunities: any;
    @ViewChild('busca')
    busca;
    filter: string = '';
    stateQuestions: boolean = false;
    photoSelected;
    file: File;
    activityId;
    activities;
    joinUsers;
    editCommunityAdmin;
    filterCommunity;
    validateJoinUsers;
    id;
    constructor(
        public interestsService: InterestsService,
        public postsService: PostsService,
        public commentsService: CommentsService,
        private router: Router,
        public authService: AuthService,
        public activitiesService: ActivitiesService,
        public joinuserService: JoinUserService,
        private activateRoute: ActivatedRoute,
        public communityService: CommunityService
    ) {}

    ngOnInit(): void {
        // if (!this.authService.isLoggedIn()) {
        //     this.router.navigate(['login']);
        // }
        this.getCommunityDetail();
    }

    async getCommunityDetail() {
        await this.activateRoute.params.subscribe((params: Params) => {
            this.id = params['id'];
            this.communityService.getCommunity(this.id).subscribe(
                (res) => {
                    this.community = res;
                    console.log(this.community);
                    this.dataUser = localStorage.getItem('dataUser');
                    this.getAllInterests();
                    this.getAllPosts();
                    this.getProfile(this.dataUser);
                    // this.postsCommunities = this.community.postscommunities;
                    this.getAllJoinUser();
                },
                (err) => console.log(err)
            );
        });
    }

    async getAllJoinUser() {
        await this.joinuserService.getAllJoinUser().subscribe(
            (res) => {
                this.joinUsers = res;
                this.validateProfileAdmin();
            },
            (err) => {
                console.log(err);
            }
        );
    }

    validateProfileAdmin() {
        if (this.community.profile.id === this.profile.id) {
            this.editCommunityAdmin = true;
        } else {
            this.editCommunityAdmin = false;
        }
        this.filterCommunity = this.joinUsers.filter((item) => {
            console.log();
            return item.community === this.community.id;
        });
        console.log(this.filterCommunity);

        this.validateJoinUsers = this.filterCommunity.filter((i) => {
            console.log(this.profile);
            console.log(i);
            return this.profile.id === i.profile.id;
        });

        console.log(this.validateJoinUsers);
        if (this.validateJoinUsers[0]) {
            this.validateJoinUsers = true;
        } else {
            this.validateJoinUsers = false;
        }
        // if (this.filterCommunity.length) {
        //     this.validateJoin = true;
        // } else {
        //     this.validateJoin = false;
        // }
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

    getProfile(user_id: number) {
        this.postsService.getProfile(user_id).subscribe(
            (res) => {
                this.profile = res;
            },
            (err) => {
                console.log(err);
            }
        );
    }

    getAllPosts() {
        this.postsService.getAllPostsCommunities().subscribe(
            (res) => {
                this.posts = res;
                console.log(this.posts);
                this.getPostCommunityDetail();
            },
            (err) => {
                console.log(err);
            }
        );
    }

    getPostCommunityDetail() {
        this.postCommunity = this.posts.filter((item) => {
            return item.community === this.community.id;
        });
        console.log(this.postCommunity);
    }

    // addPost(form: NgForm) {
    //     console.log(form);
    //     let formUser = {
    //         user: this.profile.id,
    //         profile: this.profile.id,
    //         content: form.value.content,
    //         profileId: this.profile.id,
    //         community: this.community.id,
    //     };
    //     console.log(formUser);
    //     if (form.value.id) {
    //         this.postsService.updatePost(formUser).subscribe(
    //             (res) => {
    //                 console.log(res);
    //             },
    //             (err) => {
    //                 console.log(err);
    //             }
    //         );
    //     } else {
    //         this.postsService.createPost(formUser).subscribe(
    //             (res) => {
    //                 console.log('anadir al post');
    //                 // this.communityClicked.emit(this.community.id);
    //                 this.getAllPosts();
    //                 form.reset();
    //                 this.pushUser = [];
    //                 // alert('pOst Creada');
    //             },
    //             (err) => {
    //                 console.log(err);
    //             }
    //         );
    //     }
    // }

    commentView() {}
    postDetail(id: number) {
        this.router.navigate(['/comunidad/foro', id]);
        this.postsService.getPost(id).subscribe(
            (res) => console.log(res),
            (err) => console.log(err)
        );
    }

    // Comments

    addComment(text, id: number) {
        let formUser = {
            text: text.value,
            profileId: this.profile.id,
            post: id,
        };
        console.log(formUser);
        // this.commentsService.createComment(formUser).subscribe(
        //     (res) => {
        //         this.getAllPosts();
        //         console.log(res);
        //     },
        //     (err) => {
        //         console.log(err);
        //     }
        // );
    }

    deleteComment(id: number) {
        this.commentsService.deleteComment(id).subscribe(
            (res) => {
                this.getAllPosts();
                console.log(res);
            },
            (err) => console.log(err)
        );
    }
    questionAsk() {
        if (!this.stateQuestions) {
            this.stateQuestions = true;
        } else {
            this.stateQuestions = false;
        }
    }

    getAllActivities() {
        this.activitiesService.getAllActivities().subscribe(
            (res) => {
                console.log(res);
                this.activities = res;
            },
            (err) => console.error(err)
        );
    }

    addPost(form: NgForm) {
        switch (form.value.activity) {
            case 'Agricola':
                this.activityId = 1;
                break;
            case 'Bovino':
                this.activityId = 2;
                break;
            case 'Porcino':
                this.activityId = 3;
                break;
            case 'Avicola':
                this.activityId = 4;
                break;
            case 'Acuicola - Pesca':
                this.activityId = 5;
                break;
            default:
                this.activityId = 1;
                break;
        }

        // let formUser = {
        //     user: this.profile.id,
        //     profile: this.profile.id,
        //     content: form.value.content,
        //     profileId: this.profile.id,
        //     activityId: this.activityId,
        //     title: form.value.title,
        //     photo: this.file,
        // };
        console.log(form.value);
        // console.log(formUser);
        if (form.value.id) {
            this.postsService
                .updatePostCommunity(
                    this.profile.id,
                    form,
                    this.activityId,
                    this.file,
                    form.value.id
                )
                .subscribe(
                    (res) => {
                        console.log(res);
                        this.router.navigate(['/comunidad/']);
                    },
                    (err) => {
                        console.log(err);
                    }
                );
        } else {
            this.postsService
                .createPostCommunity(
                    this.profile.id,
                    form,
                    this.activityId,
                    this.file,
                    this.community.id
                )
                .subscribe(
                    (res) => {
                        form.reset();
                        this.getCommunityDetail();
                        console.log('anadir al post');
                        this.getAllPosts();
                        // this.communityClicked.emit(this.community.id);
                        // this.getAllPosts();
                        this.pushUser = [];
                        // alert('pOst Creada');
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
            const reader = new FileReader();
            reader.onload = (e) => (this.photoSelected = reader.result);
            reader.readAsDataURL(this.file);
        }
    }
}
