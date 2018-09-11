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

  items : ProdutoDTO[] = [];
  page : number = 0;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public produtoService : ProdutoService,
              public loading : LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  /**
   * Carrega os dados da lista de produtos de forma paginada
   */
  private loadData(doLoadingEffect : boolean = true){
    let categoria_id = this.navParams.get('categoria_id');
    let loader;
    if(doLoadingEffect){
      loader = this.presentLoading();
    }
    this.produtoService.findByCategoria(categoria_id,this.page,10)
      .subscribe(response => {
          let start = this.items.length;
          this.items = this.items.concat(response['content']);
          let end = this.items.length -1;
          this.loadProdutosImage(start,end);
          if(doLoadingEffect){
            loader.dismiss();
          }
        },
        error1 => {
          if(doLoadingEffect){
            loader.dismiss();
          };
        });
  }

  /**
   * Carrega a imagem dos produtos buscando no s3 da amazon
   */
  loadProdutosImage(start : number, end: number){
    for (var i =start;i < end; i++){
      let item = this.items[i];

      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response =>{
          item.imageUrl = `${API_CONFIG.bucketUrl}/prod${item.id}-small.jpg`
        },error1 => {});

    }
  }

  /**
   * Empilha a página de detalhes de produtos e passa o id como parametro para localizar esse produtos
   * na pagina seguinte
   * @param produto_id id do produto a ser mostrado os detalhes
   */
  showDetail(produto_id : string){
    this.navCtrl.push('ProdutoDetailPage',{produto_id: produto_id});
  }

  /**
   * Animação de carregando ao abrir a página
   */
  presentLoading(){
    let loader = this.loading.create({
      content: "Aguarde"
    });
    loader.present();
    return loader;
  }

  /**
   * Faz efeito de puxar a lista pra baixo e recarregar
   * @param refresher
   */
  doRefresh(refresher){
    this.page = 0;
    this.items = [];
    this.loadData(false);
    setTimeout(() => {
      refresher.complete();
    },1000);
  }

  /**
   * Método do infinite scroll
   * @param infiniteScroll
   */
  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();
    setTimeout(() => {

      infiniteScroll.complete();
    }, 500);
  }

}
