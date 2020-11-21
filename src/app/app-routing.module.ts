import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaquetaComponent } from '../app/maqueta/maqueta.component';
import { NoticiaComponent } from './noticia/noticia.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { ProductorComponent } from './productor/productor.component';
import { InterestsComponent } from './components/interests/interests.component';
import { PostsComponent } from './components/posts/posts.component';

const routes: Routes = [
  {
    path: 'noticias',
    component: MaquetaComponent,
  },
  {
    path: 'noticias/:title',
    component: NoticiaComponent,
  },
  {
    path: 'entidadpublica/:value',
    component: PerfilComponent,
  },
  {
    path: 'proveedor',
    component: ProveedorComponent,
  },
  {
    path: 'productor/:value',
    component: ProductorComponent,
  },
  {
    path: 'interests',
    component: InterestsComponent,
  },
  {
    path: 'post/:id',
    component: PostsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
