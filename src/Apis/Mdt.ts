export class Block{

}
export class Blocks{
    public static air:Block;
}
export class Call{
    public static menu=(_con:any,_id:number,_title:string,_message:string,_op:string[][])=>{

    }
    public static label(_message:string, _duration:number, _worldx:number,_worldy:number){

    }
}
export class NetConnection{

}
export class Map{
    public description(){
        return "so";
    }
}
export class GameState{
    public map:Map;
}
export class World{
    public tile(x:number,y:number){
        return new Tile();
    }
}
export class Vars{
    public static state:GameState=new GameState();
    public world:World;
}
export function errLog(_e:string){

}
export class Menus{
    public static registerMenu=(_func:(p:any,o:number)=>void):number=>{
        return 0;
    }
}
export class Team{
    public id:number=0;
    public color:Color;
    public static get(id:number){
        return new Team();
    }
}
export class Unit{
    public type:UnitType;
    public x:number;
    public y:number;
    public within(_x:number,_y:number,_r:number):boolean{
        return true;
    }
    public team:Team;
    public toString(){
        return "Unit-"
    }
}
export class Player{
    public team():Team{
        return new Team();
    }
    public unit():Unit{
        return new Unit();
    }
}
type Class<T> = new(...args: any[]) => T;
export class Events{
    public static on<T>(_event:Class<T>,_func:((event:T)=>void)){

    }
}
export class Tile{
    public x:number;
    public y:number;
    public setNet(block:Block,team:Team,r:number){

    }
}
export class Bullet{
    public damage:number;
    public team:Team;
}
export class EventType{
    public static TapEvent=class{
        public player:Player;
        public tile:Tile;
    }
    public static UnitDestroyEvent=class{
        public unit:Unit;
    }
    public static UnitDamageEvent=class{
        public bullet:Bullet;
        public unit:Unit;
    }
}
export class UnitType{
    public toString(){
        return "eee";
    }
}
export class UnitTypes{
public static  mace:UnitType;
   public static  dagger:UnitType;
   public static  crawler:UnitType;
   public static  fortress:UnitType;
   public static  scepter:UnitType;
   public static  reign:UnitType;
   public static  vela:UnitType;
   public static  nova:UnitType;
   public static  pulsar:UnitType;
   public static  quasar:UnitType;
   public static  corvus:UnitType;
   public static  atrax:UnitType;
   public static  merui:UnitType;
   public static  cleroi:UnitType;
   public static  anthicus:UnitType;
   public static  tecta:UnitType;
   public static  collaris:UnitType;
   public static  spiroct:UnitType;
   public static  arkyid:UnitType;
   public static  toxopid:UnitType;
   public static  elude:UnitType;
   public static  flare:UnitType;
   public static  eclipse:UnitType;
   public static  horizon:UnitType;
   public static  zenith:UnitType;
   public static  antumbra:UnitType;
   public static  avert:UnitType;
   public static  obviate:UnitType;
   public static  mono:UnitType;
   public static  poly:UnitType;
   public static  mega:UnitType;
   public static  evoke:UnitType;
   public static  incite:UnitType;
   public static  emanate:UnitType;
   public static  quell:UnitType;
   public static  disrupt:UnitType;
   public static  quad:UnitType;
   public static  oct:UnitType;
   public static  alpha:UnitType;
   public static  beta:UnitType;
   public static  gamma:UnitType;
   public static  risso:UnitType;
   public static  minke:UnitType;
   public static  bryde:UnitType;
   public static  sei:UnitType;
   public static  omura:UnitType;
   public static  retusa:UnitType;
   public static  oxynoe:UnitType;
   public static  cyerce:UnitType;
   public static  aegires:UnitType;
   public static  navanax:UnitType;
   public static  block:UnitType;
   public static  manifold:UnitType;
   public static  assemblyDrone:UnitType;
   public static  stell:UnitType;
   public static  locus:UnitType;
   public static  precept:UnitType;
   public static  vanquish:UnitType;
   public static  conquer:UnitType;
   public static  missile:UnitType;
   public static  latum:UnitType;
   public static  renale:UnitType;
}
export class Color{
    public toString(){
        return "eee";
    }
}