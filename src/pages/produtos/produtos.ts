import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ProdutoDTO} from "../../models/produto.dto";
import {ProdutoService} from "../../services/produto.service";
import {API_CONFIG} from "../../config/api.config";

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public produtoService : ProdutoService,
              public loading : LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  private loadData(){
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(categoria_id)
      .subscribe(response => {
          this.items = response['content'];
          this.loadProdutosImage();
          loader.dismiss();
        },
        error1 => {
          loader.dismiss();
        });
  }

  loadProdutosImage(){
    for (var i =0;i < this.items.length; i++){
      let item = this.items[i];

      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response =>{
          item.imageUrl = `${API_CONFIG.bucketUrl}/prod${item.id}-small.jpg`
        },error1 => {});

    }
  }

  showDetail(produto_id : string){
    this.navCtrl.push('ProdutoDetailPage',{produto_id: produto_id});
  }

  presentLoading(){
    let loader = this.loading.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  doRefresh(refresher){
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    },1000);
  }

}
