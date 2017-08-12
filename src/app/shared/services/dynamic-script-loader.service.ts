import { Injectable } from '@angular/core';
import { DynamicScriptModel } from "app/models/interfaces";
import { Observable } from "rxjs/Observable";

@Injectable()
export class DynamicScriptLoaderService {

  private scripts:Array<DynamicScriptModel> = [];

  constructor() { }

  loadScript(name: string):Promise<DynamicScriptModel> {
    return new Promise((resolve, reject) => {
        //resolve if already loaded
        const exist = this.scripts.find(s => s.src === name && s.loaded);
        if (exist) {
            resolve(Object.assign({},exist,{status: 'Already Loaded'}));
        }
        else {
            //load script
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = name;
            if (script['readyState']) {  //IE
                script['onreadystatechange'] = () => {
                    if (script['readyState'] === "loaded" || script['readyState'] === "complete") {
                        script['onreadystatechange'] = null;
                        resolve(this.addToScriptList(name,true,'Loaded'));
                    }
                };
            } else {  //Others
                script.onload = () => {
                    resolve(this.addToScriptList(name,true,'Loaded'));
                };
            }
            script.onerror = (error: any) => resolve({src:name, loaded: false, status: 'Failed to load script'});
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    });
  }

  loadScriptObservable(name: string):Observable<DynamicScriptModel> {
    return Observable.create(observer => {
      this.loadScript(name).then((data)=>{
        observer.next(data);
        observer.complete();
      })
    })
  }

  private addToScriptList(src:string, loaded:boolean, status:string){
    const script: DynamicScriptModel = {src, loaded, status};
    this.scripts.push(script);
    return script;
  }
}
