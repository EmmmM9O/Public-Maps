export class Block{
    public size!:number;
}
export class Item{

}
export class Items{
    public static copper:Item;
}
export class Building{
    public team=new Team();
    public configure(item:Item|null){

    }
}
export class Blocks{
    public static air:Block;public static  spawn:Block;public static  cliff:Block;public static  deepwater:Block;public static  water:Block;public static  taintedWater:Block;public static  deepTaintedWater:Block;public static  tar:Block;public static  slag:Block;public static  cryofluid:Block;public static  stone:Block;public static  craters:Block;public static  charr:Block;public static  sand:Block;public static  darksand:Block;public static  dirt:Block;public static  mud:Block;public static  ice:Block;public static  snow:Block;public static  darksandTaintedWater:Block;public static  space:Block;public static  empty:Block;public static dacite:Block;public static  rhyolite:Block;public static  rhyoliteCrater:Block;public static  roughRhyolite:Block;public static  regolith:Block;public static  yellowStone:Block;public static  redIce:Block;public static  redStone:Block;public static  denseRedStone:Block;public static arkyciteFloor:Block;public static  arkyicStone:Block;public static redmat:Block;public static  bluemat:Block;public static stoneWall:Block;public static  dirtWall:Block;public static  sporeWall:Block;public static  iceWall:Block;public static  daciteWall:Block;public static  sporePine:Block;public static  snowPine:Block;public static  pine:Block;public static  shrubs:Block;public static  whiteTree:Block;public static  whiteTreeDead:Block;public static  sporeCluster:Block;public static redweed:Block;public static  purbush:Block;public static  yellowCoral:Block;public static rhyoliteVent:Block;public static  carbonVent:Block;public static  arkyicVent:Block;public static  yellowStoneVent:Block;public static  redStoneVent:Block;public static  crystallineVent:Block;public static regolithWall:Block;public static  yellowStoneWall:Block;public static  rhyoliteWall:Block;public static  carbonWall:Block;public static  redIceWall:Block;public static  ferricStoneWall:Block;public static  beryllicStoneWall:Block;public static  arkyicWall:Block;public static  crystallineStoneWall:Block;public static  redStoneWall:Block;public static  redDiamondWall:Block;public static ferricStone:Block;public static  ferricCraters:Block;public static  carbonStone:Block;public static  beryllicStone:Block;public static  crystallineStone:Block;public static  crystalFloor:Block;public static  yellowStonePlates:Block;public static iceSnow:Block;public static  sandWater:Block;public static  darksandWater:Block;public static  duneWall:Block;public static  sandWall:Block;public static  moss:Block;public static  sporeMoss:Block;public static  shale:Block;public static  shaleWall:Block;public static  grass:Block;public static  salt:Block;public static coreZone:Block;public static shaleBoulder:Block;public static  sandBoulder:Block;public static  daciteBoulder:Block;public static  boulder:Block;public static  snowBoulder:Block;public static  basaltBoulder:Block;public static  carbonBoulder:Block;public static  ferricBoulder:Block;public static  beryllicBoulder:Block;public static  yellowStoneBoulder:Block;public static arkyicBoulder:Block;public static  crystalCluster:Block;public static  vibrantCrystalCluster:Block;public static  crystalBlocks:Block;public static  crystalOrbs:Block;public static  crystallineBoulder:Block;public static  redIceBoulder:Block;public static  rhyoliteBoulder:Block;public static  redStoneBoulder:Block;public static metalFloor:Block;public static  metalFloorDamaged:Block;public static  metalFloor2:Block;public static  metalFloor3:Block;public static  metalFloor4:Block;public static  metalFloor5:Block;public static  basalt:Block;public static  magmarock:Block;public static  hotrock:Block;public static  snowWall:Block;public static  saltWall:Block;public static darkPanel1:Block;public static  darkPanel2:Block;public static  darkPanel3:Block;public static  darkPanel4:Block;public static  darkPanel5:Block;public static  darkPanel6:Block;public static  darkMetal:Block;public static pebbles:Block;public static  tendrils:Block;public static oreCopper:Block;public static  oreLead:Block;public static  oreScrap:Block;public static  oreCoal:Block;public static  oreTitanium:Block;public static  oreThorium:Block;public static oreBeryllium:Block;public static  oreTungsten:Block;public static  oreCrystalThorium:Block;public static  wallOreThorium:Block;public static wallOreBeryllium:Block;public static  graphiticWall:Block;public static  wallOreTungsten:Block;public static siliconSmelter:Block;public static  siliconCrucible:Block;public static  kiln:Block;public static  graphitePress:Block;public static  plastaniumCompressor:Block;public static  multiPress:Block;public static  phaseWeaver:Block;public static  surgeSmelter:Block;public static  pyratiteMixer:Block;public static  blastMixer:Block;public static  cryofluidMixer:Block;public static melter:Block;public static  separator:Block;public static  disassembler:Block;public static  sporePress:Block;public static  pulverizer:Block;public static  incinerator:Block;public static  coalCentrifuge:Block;public static siliconArcFurnace:Block;public static  electrolyzer:Block;public static  oxidationChamber:Block;public static  atmosphericConcentrator:Block;public static  electricHeater:Block;public static  slagHeater:Block;public static  phaseHeater:Block;public static  heatRedirector:Block;public static  heatRouter:Block;public static  slagIncinerator:Block;public static carbideCrucible:Block;public static  slagCentrifuge:Block;public static  surgeCrucible:Block;public static  cyanogenSynthesizer:Block;public static  phaseSynthesizer:Block;public static  heatReactor:Block;public static powerSource:Block;public static  powerVoid:Block;public static  itemSource:Block;public static  itemVoid:Block;public static  liquidSource:Block;public static  liquidVoid:Block;public static  payloadSource:Block;public static  payloadVoid:Block;public static  illuminator:Block;public static  heatSource:Block;public static copperWall:Block;public static  copperWallLarge:Block;public static  titaniumWall:Block;public static  titaniumWallLarge:Block;public static  plastaniumWall:Block;public static  plastaniumWallLarge:Block;public static  thoriumWall:Block;public static  thoriumWallLarge:Block;public static  door:Block;public static  doorLarge:Block;public static phaseWall:Block;public static  phaseWallLarge:Block;public static  surgeWall:Block;public static  surgeWallLarge:Block;public static berylliumWall:Block;public static  berylliumWallLarge:Block;public static  tungstenWall:Block;public static  tungstenWallLarge:Block;public static  blastDoor:Block;public static  reinforcedSurgeWall:Block;public static  reinforcedSurgeWallLarge:Block;public static  carbideWall:Block;public static  carbideWallLarge:Block;public static shieldedWall:Block;public static mender:Block;public static  mendProjector:Block;public static  overdriveProjector:Block;public static  overdriveDome:Block;public static  forceProjector:Block;public static  shockMine:Block;public static scrapWall:Block;public static  scrapWallLarge:Block;public static  scrapWallHuge:Block;public static  scrapWallGigantic:Block;public static  thruster:Block;public static  radar:Block;public static buildTower:Block;public static regenProjector:Block;public static  barrierProjector:Block;public static  shockwaveTower:Block;public static shieldProjector:Block;public static largeShieldProjector:Block;public static shieldBreaker:Block;public static conveyor:Block;public static  titaniumConveyor:Block;public static  plastaniumConveyor:Block;public static  armoredConveyor:Block;public static  distributor:Block;public static  junction:Block;public static  itemBridge:Block;public static  phaseConveyor:Block;public static  sorter:Block;public static  invertedSorter:Block;public static  router:Block;public static overflowGate:Block;public static  underflowGate:Block;public static  massDriver:Block;public static duct:Block;public static  armoredDuct:Block;public static  ductRouter:Block;public static  overflowDuct:Block;public static  underflowDuct:Block;public static  ductBridge:Block;public static  ductUnloader:Block;public static surgeConveyor:Block;public static  surgeRouter:Block;public static unitCargoLoader:Block;public static  unitCargoUnloadPoint:Block;public static mechanicalPump:Block;public static  rotaryPump:Block;public static  impulsePump:Block;public static  conduit:Block;public static  pulseConduit:Block;public static  platedConduit:Block;public static  liquidRouter:Block;public static  liquidContainer:Block;public static  liquidTank:Block;public static  liquidJunction:Block;public static  bridgeConduit:Block;public static  phaseConduit:Block;public static reinforcedPump:Block;public static  reinforcedConduit:Block;public static  reinforcedLiquidJunction:Block;public static  reinforcedBridgeConduit:Block;public static  reinforcedLiquidRouter:Block;public static  reinforcedLiquidContainer:Block;public static  reinforcedLiquidTank:Block;public static combustionGenerator:Block;public static  thermalGenerator:Block;public static  steamGenerator:Block;public static  differentialGenerator:Block;public static  rtgGenerator:Block;public static  solarPanel:Block;public static  largeSolarPanel:Block;public static  thoriumReactor:Block;public static impactReactor:Block;public static  battery:Block;public static  batteryLarge:Block;public static  powerNode:Block;public static  powerNodeLarge:Block;public static  surgeTower:Block;public static  diode:Block;public static turbineCondenser:Block;public static  ventCondenser:Block;public static  chemicalCombustionChamber:Block;public static  pyrolysisGenerator:Block;public static  fluxReactor:Block;public static  neoplasiaReactor:Block;public static beamNode:Block;public static  beamTower:Block;public static  beamLink:Block;public static mechanicalDrill:Block;public static  pneumaticDrill:Block;public static  laserDrill:Block;public static  blastDrill:Block;public static  waterExtractor:Block;public static  oilExtractor:Block;public static  cultivator:Block;public static cliffCrusher:Block;public static  plasmaBore:Block;public static  largePlasmaBore:Block;public static  impactDrill:Block;public static  eruptionDrill:Block;public static coreShard:Block;public static  coreFoundation:Block;public static  coreNucleus:Block;public static  vault:Block;public static  container:Block;public static  unloader:Block;public static coreBastion:Block;public static  coreCitadel:Block;public static  coreAcropolis:Block;public static  reinforcedContainer:Block;public static  reinforcedVault:Block;public static duo:Block;public static  scatter:Block;public static  scorch:Block;public static  hail:Block;public static  arc:Block;public static  wave:Block;public static  lancer:Block;public static  swarmer:Block;public static  salvo:Block;public static  fuse:Block;public static  ripple:Block;public static  cyclone:Block;public static  foreshadow:Block;public static  spectre:Block;public static  meltdown:Block;public static  segment:Block;public static  parallax:Block;public static  tsunami:Block;public static breach:Block;public static  diffuse:Block;public static  sublimate:Block;public static  titan:Block;public static  disperse:Block;public static  afflict:Block;public static  lustre:Block;public static  scathe:Block;public static  smite:Block;public static  malign:Block;public static groundFactory:Block;public static  airFactory:Block;public static  navalFactory:Block;public static additiveReconstructor:Block;public static  multiplicativeReconstructor:Block;public static  exponentialReconstructor:Block;public static  tetrativeReconstructor:Block;public static repairPoint:Block;public static  repairTurret:Block;public static tankFabricator:Block;public static  shipFabricator:Block;public static  mechFabricator:Block;public static tankRefabricator:Block;public static  shipRefabricator:Block;public static  mechRefabricator:Block;public static primeRefabricator:Block;public static tankAssembler:Block;public static  shipAssembler:Block;public static  mechAssembler:Block;public static basicAssemblerModule:Block;public static unitRepairTower:Block;public static payloadConveyor:Block;public static  payloadRouter:Block;public static  reinforcedPayloadConveyor:Block;public static  reinforcedPayloadRouter:Block;public static  payloadMassDriver:Block;public static  largePayloadMassDriver:Block;public static  smallDeconstructor:Block;public static  deconstructor:Block;
    public static  largeConstructor:Block;public static  payloadLoader:Block;public static  payloadUnloader:Block;public static message:Block;public static  switchBlock:Block;public static  microProcessor:Block;public static  logicProcessor:Block;public static  hyperProcessor:Block;public static  largeLogicDisplay:Block;public static  logicDisplay:Block;public static  memoryCell:Block;public static  memoryBank:Block;public static canvas:Block;public static  reinforcedMessage:Block;public static worldProcessor:Block;public static  worldCell:Block;public static  worldMessage:Block;public static launchPad:Block;public static  interplanetaryAccelerator:Block;
}
export class Call{
    public static menu=(_con:any,_id:number,_title:string,_message:string,_op:string[][])=>{

    }
    public static label(_message:string, _duration:number, _worldx:number,_worldy:number){

    }
    public static effect(effect:Effect,x:number,y:number,r:number,color:Color){

    }
    public static infoToast(con:NetConnection,str:string,time:number){

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
    public map:Map=new Map();
}
export class Tiles{
    public eachTile(run:(t:Tile)=>void){

    }
}
export class World{
    public tile(x:number,y:number){
        return new Tile();
    }
    public tiles: Tiles = new Tiles;
}
export class Vars{
    public static state:GameState=new GameState();
    public static world:World;
}
export function errLog(_e:string){

}
export class Menus{
    public static registerMenu=(_func:(p:any,o:number)=>void):number=>{
        return 0;
    }
}
export class Timer{
    public static schedule(run:()=>void,delaySeconds:number,intervalSeconds:number){

    }
}
export class Team{
    public id:number=0;
    public color!: Color;
    public static get(id:number){
        return new Team();
    }
}
interface Queue<T>{
    [index:number]:T;
    add:(v:T)=>void
}
export class Unitc{
    public movePref(var1:Vec2){

    }
    public isPlayer(){
        return false;
    }
}
export class Unit implements Unitc{
    public dead(){
        return false;
    }
    public apply(effect:StatusEffect,time:number){

    }
    public controller(var1:AIController){
        
    }
    public speed(){
        return 1
    }
    public angleTo(x:number,y:number){
        return 1
    }
    public movePref(var1: Vec2): void{

    }
    public plans!: Queue<BuildPlan>;
    public type!: UnitType;
    public x!: number;
    public y!: number;
    public within(_x:number,_y:number,_r:number):boolean{
        return true;
    }
    public kill(){

    }
    public isPlayer(): boolean {
        return false;
    }
    public team!: Team;
    public toString(){
        return "Unit-"
    }
}
export class Groups{
    public static player=class{
        public static each(run:(p:Player)=>void){

        }
    }
}
export class Player{
    public team():Team{
        return new Team();
    }
    public unit():Unit{
        return new Unit();
    }
    public con!:NetConnection;
}
type Class<T> = new(...args: any[]) => T;
export class Events{
    public static on<T>(_event:Class<T>,_func:((event:T)=>void)){

    }
}
export class Tile{
    public block(){
        return new Block();
    }
    public x!: number;
    public y!: number;
    public setNet(block:Block,team:Team,r:number){

    }
    public setFloorNet(floot:Block,cover:Block){

    }
    public setOverlayNet(cover:Block){

    }
    public build!:Building;
}
export class Bullet{
    public damage!: number;
    public team!: Team;
}
export class Vec2{
    public trns(angle:number, amount:number){
        return this;
    }
}
export interface _TapEvent_{
    player:Player;
    tile:Tile;
}
export interface _UnitDamageEvent_{
    bullet:Bullet;
    unit:Unit;
}
export interface _UnitDestroyEvent_{
    unit:Unit;
}
export class EventType{
    public static TapEvent=class{
        public player!: Player;
        public tile!: Tile;
    }
    public static UnitDestroyEvent=class{
        public unit!: Unit;
    }
    public static UnitDamageEvent=class{
        public bullet!: Bullet;
        public unit!: Unit;
    }
}type addon<T1,T2>=T1 & T2;

export function extend<T1,T2>(father:Class<T1>,addon:(Partial<T1>&T2)):T1{
    return new father;
}
export class UnitType{
    public hitSize!:number;
    public toString(){
        return "eee";
    }
    public spawn(team:Team,x:number,y:number){
        return new Unit();
    }
}
export class Effect{

}
export class AIController{
    public unit!: Unit;
    public updateMovement!: () => void;
    public updateUnit!: () => void;
    public moveTo!: () => void;
    
}
export class Fx{
    public static hitMeltdown:Effect;
    public static flakExplosionBig:Effect;
    public static shootSmokeSmite:Effect;
    public static mineImpact:Effect;
    public static titanSmoke:Effect;
    public static payloadReceive:Effect;
    public static circleColorSpark:Effect;
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
    public static sky:Color;
    public static orange:Color;
    public toString(){
        return "eee";
    }
}
export class BuildPlan{
    constructor(x:number,y:number,r:number,block:Block){
        
    }
    public x!:number;
    public y!:number;
    public block!:Block;
}
export class WorldLabel{
    public x!:number;
    public y!:number;
    public z!:number;
    public id!:number;
    public fontSize!:number;
    public text!:string;
    public static create(){
        return new WorldLabel;
    }
    public add(){
        
    }
    public hide(){

    }
    public remove(){

    }
}
export class Units{
    public static nearby(team:Team,x:number,y:number,r:number,run:(u:Unit)=>void){

    }
}
export class StatusEffect{

}
export class StatusEffects{
    public static none:StatusEffect;public static  burning:StatusEffect;public static  freezing:StatusEffect;public static  unmoving:StatusEffect;public static  slow:StatusEffect;public static  wet:StatusEffect;public static  muddy:StatusEffect;public static  melting:StatusEffect;public static  sapped:StatusEffect;public static  tarred:StatusEffect;public static  overdrive:StatusEffect;public static  overclock:StatusEffect;public static  shielded:StatusEffect;public static  shocked:StatusEffect;public static  blasted:StatusEffect;public static  corroded:StatusEffect;public static  boss:StatusEffect;public static  sporeSlowed:StatusEffect;public static  disarmed:StatusEffect;public static  electrified:StatusEffect;public static  invincible:StatusEffect;
}