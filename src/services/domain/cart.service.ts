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
}
