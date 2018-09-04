import {Injectable} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  /**
   * Esse método intercepta todas as requisições HTTP.
   * Faz a captação de erros que podem acontecer em alguma requisição como por exemplo a uma URL inexistente
   * e transforma em JSON (caso não seja) e mostra no console a mensagem de erro que o webservice emitiu.
   * @param req requisição HTTP
   * @param next ação a ser feita quando interceptado requisição HTTP
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log("-- Passou no interceptor --")
    return next.handle(req)
      .catch((error, caught) => {

        let errorObj = error;
        if(errorObj.error){
          errorObj = errorObj.error;
        }
        if(!errorObj.status){
          errorObj = JSON.parse(errorObj);
        }

        console.log("Error detectado pelo interceptor:");
        console.log(errorObj);

        return Observable.throw(errorObj);
      }) as any;
  }

}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};

