import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {StorageService} from "../../services/storage_service";
import {ClienteDTO} from "../../models/cliente.dto";
import {ClienteService} from "../../services/cliente.service";
import {API_CONFIG} from "../../config/api.config";
import {Camera} from "@ionic-native/camera";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente : ClienteDTO;

  picture : string;

  cameraOn: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage : StorageService,
              public clienteService : ClienteService,
              public camera : Camera,
              public loading : LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData(){
    let localUser = this.storage.getLocalUser();
    if(localUser && localUser.email){
      this.clienteService.findByEmail(localUser.email)
        .subscribe(response => {
            this.cliente = response as ClienteDTO;
            this.getImageIfExists();

          },
          error => {
            if(error.status == 403){
              this.navCtrl.setRoot('HomePage');
            }

          })
    }
    else{
      this.navCtrl.setRoot('HomePage');
    }
  }

  getImageIfExists() {
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(response => {
          this.cliente.imageUrl = `${API_CONFIG.bucketUrl}/cp${this.cliente.id}.jpg`;
        },
        error => {
        });
  }

  getCameraPicture(){
    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.picture = 'data:image/png;base64,' + imageData;
      this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });
  }

  sendPicture(){
    let loader = this.presentLoading();
    this.clienteService.uploadPicture(this.picture)
      .subscribe(response => {
        this.picture = null;
        this.loadData();
        loader.dismissAll();
      },
        error1 => {loader.dismissAll();});
  }

  descartarImagem(){
    this.picture = null;
  }

  presentLoading(){
    let loader = this.loading.create({
      content: "Aguarde"
    });
    loader.present();
    return loader;
  }

  getGalleryPicture(){
    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.picture = 'data:image/png;base64,' + imageData;
      this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });
  }

}
