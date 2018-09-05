import {Injectable} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {StorageService} from "../services/storage_service";
import {AlertController, ToastController} from "ionic-angular";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public storage: StorageService,
              public alerta : AlertController,
              public toastCtrl: ToastController){}

  /**
   * Esse método intercepta todas as requisições HTTP.
   * Faz a captação de erros que podem acontecer em alguma requisição como por exemplo a uma URL inexistente
   * e transforma em JSON (caso não seja) e mostra no console a mensagem de erro que o webservice emitiu.
   * @param req requisição HTTP
   * @param next ação a ser feita quando interceptado requisição HTTP
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req)
      .catch((error, caught) => {

        /**
         * Captura o erro 0 de erro na conexão do APP
         */
        switch (error.status) {
          case 0:
            this.showToastErro("Problema de conexão com o servidor, verifique seu WI-FI ou rede móvel");
            break;
        }

        let errorObj = error;
        if(errorObj.error){
          errorObj = errorObj.error;
        }
        if(!errorObj.status){
          errorObj = JSON.parse(errorObj);
        }

        switch (errorObj.status) {
          case 403:
            this.handle403();
            break;
          case 401:
            this.showMensagemErro("Erro de login","Usuário ou Senha Inválidos");
            console.log(JSON.stringify(errorObj))
            break;
          case 404:
            this.showMensagemErro("Não encontrado","Elemento buscado não está disponível")
            break;
        }

        return Observable.throw(errorObj);
      }) as any;
  }

  /**
   * No caso de erro 403 significa que o usuário está inválido, então apaga o usuário do localStorage
   */
  handle403(){
    this.storage.setLocalUser(null);
  }

  private showMensagemErro(title: string,subTitle: string){
    const alert = this.alerta.create({
      title:title,
      subTitle:subTitle,
      buttons:['ok']
    })
    alert.present();
  }

  private showToastErro(mensagem:string){
    let toast = this.toastCtrl.create({
      message: mensagem,
      duration: 5000,
      position: 'bottom'
    })
    toast.present();
  }



}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};

