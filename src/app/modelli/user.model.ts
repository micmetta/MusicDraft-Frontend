

export class User{
  constructor(
    public nickname: string,
    public email: string,
    private _token: string,
    private _expirationDate: Date // mi dice qual è la data e l'orario fino a quando il token corrente sarà valido.
  ){}

  get token(){
    // verifico che il token corrente sia ancora valido o meno
    // l'if di sotto dice questo:
    // - SE this._expirationDate NON ESISTE oppure la data di adesso è maggiore rispetto
    // a this._expirationDate allora restituisco null e con questo CAPIRO' CHE L'UTENTE DOVRA'
    // RIFARE IL LOGIN:
    if(!this._expirationDate || new Date() > this._expirationDate){
      return null; // perchè in questo modo faccio capire che il token corrente non è più valido.
    }

    return this._token; // altrimenti restituisco il token corrente perchè vuol dire che è ancora valido
  }




}
