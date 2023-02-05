import { Player } from "./Mdt";

export class _ui_<T>{
  public title(title:string|((p:Player,data:T,ui:_ui_<T>)=>string)):_ui_<T>{
    return this;
  }
  public content(title:string|((p:Player,data:T,ui:_ui_<T>)=>string)):_ui_<T>{
    return this;
  }
  public row():_ui_<T>{
    return this;
  }
  public text(title:string|((p:Player,data:T,ui:_ui_<T>)=>string)):_ui_<T>{
    return this;
  }
  public button(title:string|((p:Player,data:T,ui:_ui_<T>)=>string),run:((p:Player,data:T,ui:_ui_<T>)=>void),show:boolean):_ui_<T>{
    return this;
  }
  public show(player:Player,data:T){

  }
  public eles(title:string|((p:Player,data:T,ui:_ui_<T>)=>void)):_ui_<T>{
    return this;
  }
}
class menuUi{
  public createUI<T>():_ui_<T>{
    return new _ui_<T>();
  }
}
export class Aim{
  public static menuUi:menuUi;
}
