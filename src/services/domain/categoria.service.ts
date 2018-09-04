import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_CONFIG} from "../../config/api.config";
import {CategoriaDTO} from "../../models/categoria.dto";
import {Observable} from "rxjs";

@Injectable()
export class CategoriaService {

  constructor(public http: HttpClient){

  }

  /**
   * Método que retorna todas as categorias a partir do webservice/categorias
   */
  findAll(): Observable<CategoriaDTO[]>{
    return this.http.get<CategoriaDTO[]>(`${API_CONFIG.baseUrl}/categorias`);
  }
}
