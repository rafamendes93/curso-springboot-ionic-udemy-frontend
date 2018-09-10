import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ProdutoDTO} from "../../models/produto.dto";
import {ProdutoService} from "../../services/produto.service";
import {API_CONFIG} from "../../config/api.config";

@IonicPage()
@Component({
  selector: 'page-produto-detail',
  templateUrl: 'produto-detail.html',
})
export class ProdutoDetailPage {

  item: ProdutoDTO;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public produtoService : ProdutoService) {
  }

  ionViewDidLoad() {
    let produto_id = this.navParams.get('produto_id');
    this.produtoService.findProduto(produto_id)
      .subscribe(response =>{
        this.item = response;
        this.loadProdutoImage();
      },error1 => {});

  }

  loadProdutoImage(){
    this.produtoService.getImageFromBucket(this.item.id)
      .subscribe(response => {
        this.item.imageUrl= `${API_CONFIG.bucketUrl}/prod${this.item.id}.jpg`;
      },error1 => {})
  }



}
