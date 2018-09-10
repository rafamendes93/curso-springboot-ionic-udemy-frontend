import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CartItem} from "../../models/cart-item";
import {StorageService} from "../../services/storage_service";
import {API_CONFIG} from "../../config/api.config";
import {ProdutoService} from "../../services/produto.service";
import {CartService} from "../../services/domain/cart.service";


@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  items : CartItem[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage : StorageService,
              public produtoService : ProdutoService,
              public cartService: CartService) {
  }

  ionViewDidLoad() {
    let cart = this.cartService.getCart();
    this.items = cart.carItem;
    this.loadProdutosImage();
  }

  loadProdutosImage(){
    for (var i =0;i < this.items.length; i++){
      let item = this.items[i];

      this.produtoService.getSmallImageFromBucket(item.produto.id)
        .subscribe(response =>{
          item.produto.imageUrl = `${API_CONFIG.bucketUrl}/prod${item.produto.id}-small.jpg`
        },error1 => {});

    }
  }

}
