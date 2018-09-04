import {Injectable} from "@angular/core";
import {LocalUser} from "../models/local_user";
import {STORAGE_KEYS} from "../config/storage_keys.config";

@Injectable()
export class StorageService {

  /**
   * Retorna um LocalUser e fazer parse para JSON (caso exista), caso não retorna um nulo.
   */
  getLocalUser(): LocalUser {
    let usr = localStorage.getItem(STORAGE_KEYS.localUser);
    if(usr == null){
      return null;
    }
    else{
      return JSON.parse(usr);
    }


  }

  /**
   * Caso o LocalUser passado no parametro seja nulo, então entende-se que se quer remover o usuário do localStorage
   * @param obj usuário a ser adicionado ou usuário a ser removido (passado um obj nulo)
   */
  setLocalUser(obj:LocalUser){
    if (obj == null){
      localStorage.removeItem(STORAGE_KEYS.localUser);
    } else{
      localStorage.setItem(STORAGE_KEYS.localUser,JSON.stringify(obj));
    }
  }
}
