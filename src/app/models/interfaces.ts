import { Action } from './../constants/enums';

export interface LocationModel {
    name:string,
    address:string,
    coordinates:string,
    category:Array<string>
}

export interface CategoryModel {
    name:string,
    // color:string
}

export interface ActionModel {
    type:Action,
    pageName:string,
    data:any
}

export interface DynamicScriptModel {
    src:string,
    loaded:boolean,
    status:string
}