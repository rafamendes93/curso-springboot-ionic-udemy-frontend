import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ClienteDTO} from "../models/cliente.dto";
import {API_CONFIG} from "../config/api.config";
import {StorageService} from "./storage_service";

@Injectable()
export class ClienteService {

  constructor(public http:HttpClient,
              public storage : StorageService){

  }

  findByEmail(email:String) : Observable<ClienteDTO>{

    return this.http.get<ClienteDTO>(
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



}
