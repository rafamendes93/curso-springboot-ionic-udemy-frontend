import {Injectable} from "@angular/core";
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {StorageService} from "../services/storage_service";
import {API_CONFIG} from "../config/api.config";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public storage:StorageService){

  }

  /**
   * Intercepta requisições http e verifica se existe algum usuário logado no sistema.
   * Caso existe algum usuário logado, o método adiciona o cabeçalho "Authorization" nas requisições, caso não tenha nenhum
   * usuário logado, o interceptor libera a requisição HTTP sem nenhuma modificação.
   * @param req requisição HTTP
   * @param next ação feita na requisição após passar pelo interceptor
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let localUser = this.storage.getLocalUser();
    let N = API_CONFIG.baseUrl.length;
    let requestToApi = req.url.substring(0,N) == API_CONFIG.baseUrl;

    if(localUser && requestToApi){
        const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer '+localUser.token)});
        return next.handle(authReq);
    }else {
      return next.handle(req);
    }
  }

}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};

