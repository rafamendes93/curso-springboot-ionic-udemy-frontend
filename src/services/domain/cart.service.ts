import {Injectable} from "@angular/core";
import {StorageService} from "../storage_service";
import {Cart} from "../../models/cart";
import {ProdutoDTO} from "../../models/produto.dto";

@Injectable()
export class CartService {

  constructor(public storage: StorageService){
  }

  createOrClearCart() : Cart{
    let cart : Cart = {carItem:[]};
    this.storage.setCart(cart);
    return cart;
  }

  getCart():Cart{
    let cart: Cart = this.storage.getCart();
    if(cart== null){
      cart = this.createOrClearCart();
    }
    return cart;
  }

  addProduto(produto:ProdutoDTO){
    let cart = this.getCart();
    let position = cart.carItem.findIndex(x => x.produto.id == produto.id);
    if(position == -1){
      cart.carItem.push({quantidade: 1,produto:produto});
    }
    this.storage.setCart(cart);
    return cart;
  }

  removeProduto(produto : ProdutoDTO){
    let cart = this.getCart();
    let position = cart.carItem.findIndex(x => x.produto.id == produto.id);
    if(position != -1){
      cart.carItem.splice(position, 1);
    }
    this.storage.setCart(cart);
    return cart;
  }

  increaseQuantity(produto : ProdutoDTO){
    let cart = this.getCart();
    let position = cart.carItem.findIndex(x => x.produto.id == produto.id);
    if(position != -1){
      cart.carItem[position].quantidade++;
    }
    this.storage.setCart(cart);
    return cart;
  }

  decreaseQuantity(produto : ProdutoDTO){
    let cart = this.getCart();
    let position = cart.carItem.findIndex(x => x.produto.id == produto.id);
    if(position != -1){
      cart.carItem[position].quantidade--;
      if(cart.carItem[position].quantidade < 1){
        cart = this.removeProduto(produto);
      }
    }
    this.storage.setCart(cart);
    return cart;
  }

  total() : number{
    let cart = this.getCart();
    let sum = 0;
    for ( var i = 0; i<cart.carItem.length; i++){
      sum += cart.carItem[i].produto.preco * cart.carItem[i].quantidade;
    }
    return sum;
  }



}
