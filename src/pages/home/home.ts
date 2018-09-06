import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {MenuController} from "ionic-angular";
import {CredenciaisDTO} from "../../models/credenciais.dto";
import {AuthService} from "../../services/auth.service";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredenciaisDTO = {
    email: "",
    senha: ""
  };

  /**
   * No construtor da classe é possivel setar o elementos que serão injetados
   * nesse caso o NavController e o MenuController
   * @param navCtrl objeto de controle de navegação da página
   * @param menu menu lateral da página
   */
  constructor(public navCtrl: NavController,
              public menu: MenuController,
              public auth : AuthService) {

  }

  /**
   * Esse método é executado ao entrar na página home desabilitando o menu lateral.
   */
  ionViewWillEnter(){
    this.menu.swipeEnable(false);
  }

  /**
   * Esse método é executado ao sair da página home ativando o menu lateral
   */
  ionViewDidLeave(){
    this.menu.swipeEnable(true);
  }

  login(){
    this.auth.authenticated(this.creds).subscribe(response =>{
      this.auth.sucessfulLogin(response.headers.get('Authorization'));
      this.navCtrl.setRoot('CategoriasPage');
    },
      error => {});
  }

  ionViewDidEnter(){
    this.auth.refreshToken()
      .subscribe(response => {
        this.auth.sucessfulLogin(response.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage');
      }, error1 => {});
  }

  signup(){
    this.navCtrl.push("SignupPage");
  }



}
