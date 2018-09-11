import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ClienteDTO} from "../models/cliente.dto";
import {API_CONFIG} from "../config/api.config";
import {StorageService} from "./storage_service";
import {ImageUtilService} from "./image-util.service";

@Injectable()
export class ClienteService {

  constructor(public http:HttpClient,
              public storage : StorageService,
              public imageUtilService : ImageUtilService){

  }

  /**
   * Busca um cliente pelo ID fazneod um HTTP GET no endpoint /clientes/ID
   * @param id ID do cliente a ser buscado
   */
  findById(id: string){
    return this.http.get(
      `${API_CONFIG.baseUrl}/clientes/${id}`
    );
  }

  /**
   * Busca um cliente por e-mail no endpoint /clientes/email?value="EMAIL" fazendo um HTTP GET
   * @param email e-mail a ser buscado
   */
  findByEmail(email:String){
    return this.http.get(
      `${API_CONFIG.baseUrl}/clientes/email?value=${email}`
      );
  }

  /**
   * Esse método retorna o link de uma imagem do bucket da amazon a partir do id do usuário.
   * Exemplo: Se o ID = 3 ele busca em: url_do_bucket/cp3.jpg
   * @param id id do usuário a ser buscado a imagem no bucket
   */
  getImageFromBucket(id : string) : Observable<any>{
    let url = `${API_CONFIG.bucketUrl}/cp${id}.jpg`;
    return this.http.get(url,{responseType : 'blob'});
  }

  /**
   * Insere um cliente no DB fazendo um HTTP POST no endpoint /clientes
   * @param obj Cliente a ser inserido no DB
   */
  insert(obj : ClienteDTO){
    return this.http.post(
      `${API_CONFIG.baseUrl}/clientes`,
      obj,
      {
        observe : 'response',
        responseType : 'text'
      }
    );
  }

  uploadPicture(picture){
    let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
    let formData : FormData = new FormData();
    formData.set('file',pictureBlob,'file.png');

    return this.http.post(
      `${API_CONFIG.baseUrl}/clientes/picture`,
      formData,
      {
        observe : 'response',
        responseType : 'text'
      }
    );
  }

}
