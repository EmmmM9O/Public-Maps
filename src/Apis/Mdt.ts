export class Net {
  public server(): boolean{
    return true
  }
  public active(): boolean{
    return true
  }
  public client(): boolean {
    return true;
  }
}
export class WaveSpawner {
  public getSpawns(): Seq<Tile> {
    return new Seq();
  }
}
export class NetClient {
  public static effect(
    _effect: Effect,
    _x: number,
    _y: number,
    _r: number,
    _color: Color
  ) {}
}

export class UnlockableContent {
  public localizedName!: string;
  public id!: number;
}
export class Block extends UnlockableContent {
  public size!: number;
  public isLiquid!: boolean;
}
export class InputHandler {
  public static clearItems(_build: Building): void {}
  public static transferItemTo(
    _unit: Unit | null,
    _item: Item,
    _amount: number,
    _x: number,
    _y: number,
    _build: Building
  ) {}
  public static pickedBuildPayload(
    _unit: Unit,
    _build: Building,
    _onGround: boolean
  ): void {}
  public static payloadDropped(_unit: Unit, _x: number, _y: number) {}
}
export class Item extends UnlockableContent {}
export class Items {
  public static scrap: Item;
  public static copper: Item;
  public static lead: Item;
  public static graphite: Item;
  public static coal: Item;
  public static titanium: Item;
  public static thorium: Item;
  public static silicon: Item;
  public static plastanium: Item;
  public static phaseFabric: Item;
  public static surgeAlloy: Item;
  public static sporePod: Item;
  public static sand: Item;
  public static blastCompound: Item;
  public static pyratite: Item;
  public static metaglass: Item;
  public static beryllium: Item;
  public static tungsten: Item;
  public static oxide: Item;
  public static carbide: Item;
  public static fissileMatter: Item;
  public static dormantCyst: Item;
}
export interface Prov<T> {
  get: () => T;
}
export interface Entityc {
  self: <T extends Entityc>() => T;
  as: <T>() => T;
}
export interface Buildingc {}
export class Building implements Entityc, Buildingc {
  public as<T>(): T {
    return this as any as T;
  }
  public self<T extends Entityc>(): T {
    return this as any as T;
  }
  public team = new Team();
  public timeScale(): number {
    return 0;
  }
  public tile!: Tile;
  public configure(_item: Item | null) {}
  public x!: number;
  public y!: number;
  public block!: Block;
  public liquids!: LiquidModule;
  public kill(): void {}
}
export class ContentLoader {
  public units(): Seq<UnitType> {
    return new Seq<UnitType>();
  }
}
export class Blocks {
  public static air: Block;
  public static spawn: Block;
  public static cliff: Block;
  public static deepwater: Block;
  public static water: Block;
  public static taintedWater: Block;
  public static deepTaintedWater: Block;
  public static tar: Block;
  public static slag: Block;
  public static cryofluid: Block;
  public static stone: Block;
  public static craters: Block;
  public static charr: Block;
  public static sand: Block;
  public static darksand: Block;
  public static dirt: Block;
  public static mud: Block;
  public static ice: Block;
  public static snow: Block;
  public static darksandTaintedWater: Block;
  public static space: Block;
  public static empty: Block;
  public static dacite: Block;
  public static rhyolite: Block;
  public static rhyoliteCrater: Block;
  public static roughRhyolite: Block;
  public static regolith: Block;
  public static yellowStone: Block;
  public static redIce: Block;
  public static redStone: Block;
  public static denseRedStone: Block;
  public static arkyciteFloor: Block;
  public static arkyicStone: Block;
  public static redmat: Block;
  public static bluemat: Block;
  public static stoneWall: Block;
  public static dirtWall: Block;
  public static sporeWall: Block;
  public static iceWall: Block;
  public static daciteWall: Block;
  public static sporePine: Block;
  public static snowPine: Block;
  public static pine: Block;
  public static shrubs: Block;
  public static whiteTree: Block;
  public static whiteTreeDead: Block;
  public static sporeCluster: Block;
  public static redweed: Block;
  public static purbush: Block;
  public static yellowCoral: Block;
  public static rhyoliteVent: Block;
  public static carbonVent: Block;
  public static arkyicVent: Block;
  public static yellowStoneVent: Block;
  public static redStoneVent: Block;
  public static crystallineVent: Block;
  public static regolithWall: Block;
  public static yellowStoneWall: Block;
  public static rhyoliteWall: Block;
  public static carbonWall: Block;
  public static redIceWall: Block;
  public static ferricStoneWall: Block;
  public static beryllicStoneWall: Block;
  public static arkyicWall: Block;
  public static crystallineStoneWall: Block;
  public static redStoneWall: Block;
  public static redDiamondWall: Block;
  public static ferricStone: Block;
  public static ferricCraters: Block;
  public static carbonStone: Block;
  public static beryllicStone: Block;
  public static crystallineStone: Block;
  public static crystalFloor: Block;
  public static yellowStonePlates: Block;
  public static iceSnow: Block;
  public static sandWater: Block;
  public static darksandWater: Block;
  public static duneWall: Block;
  public static sandWall: Block;
  public static moss: Block;
  public static sporeMoss: Block;
  public static shale: Block;
  public static shaleWall: Block;
  public static grass: Block;
  public static salt: Block;
  public static coreZone: Block;
  public static shaleBoulder: Block;
  public static sandBoulder: Block;
  public static daciteBoulder: Block;
  public static boulder: Block;
  public static snowBoulder: Block;
  public static basaltBoulder: Block;
  public static carbonBoulder: Block;
  public static ferricBoulder: Block;
  public static beryllicBoulder: Block;
  public static yellowStoneBoulder: Block;
  public static arkyicBoulder: Block;
  public static crystalCluster: Block;
  public static vibrantCrystalCluster: Block;
  public static crystalBlocks: Block;
  public static crystalOrbs: Block;
  public static crystallineBoulder: Block;
  public static redIceBoulder: Block;
  public static rhyoliteBoulder: Block;
  public static redStoneBoulder: Block;
  public static metalFloor: Block;
  public static metalFloorDamaged: Block;
  public static metalFloor2: Block;
  public static metalFloor3: Block;
  public static metalFloor4: Block;
  public static metalFloor5: Block;
  public static basalt: Block;
  public static magmarock: Block;
  public static hotrock: Block;
  public static snowWall: Block;
  public static saltWall: Block;
  public static darkPanel1: Block;
  public static darkPanel2: Block;
  public static darkPanel3: Block;
  public static darkPanel4: Block;
  public static darkPanel5: Block;
  public static darkPanel6: Block;
  public static darkMetal: Block;
  public static pebbles: Block;
  public static tendrils: Block;
  public static oreCopper: Block;
  public static oreLead: Block;
  public static oreScrap: Block;
  public static oreCoal: Block;
  public static oreTitanium: Block;
  public static oreThorium: Block;
  public static oreBeryllium: Block;
  public static oreTungsten: Block;
  public static oreCrystalThorium: Block;
  public static wallOreThorium: Block;
  public static wallOreBeryllium: Block;
  public static graphiticWall: Block;
  public static wallOreTungsten: Block;
  public static siliconSmelter: Block;
  public static siliconCrucible: Block;
  public static kiln: Block;
  public static graphitePress: Block;
  public static plastaniumCompressor: Block;
  public static multiPress: Block;
  public static phaseWeaver: Block;
  public static surgeSmelter: Block;
  public static pyratiteMixer: Block;
  public static blastMixer: Block;
  public static cryofluidMixer: Block;
  public static melter: Block;
  public static separator: Block;
  public static disassembler: Block;
  public static sporePress: Block;
  public static pulverizer: Block;
  public static incinerator: Block;
  public static coalCentrifuge: Block;
  public static siliconArcFurnace: Block;
  public static electrolyzer: Block;
  public static oxidationChamber: Block;
  public static atmosphericConcentrator: Block;
  public static electricHeater: Block;
  public static slagHeater: Block;
  public static phaseHeater: Block;
  public static heatRedirector: Block;
  public static heatRouter: Block;
  public static slagIncinerator: Block;
  public static carbideCrucible: Block;
  public static slagCentrifuge: Block;
  public static surgeCrucible: Block;
  public static cyanogenSynthesizer: Block;
  public static phaseSynthesizer: Block;
  public static heatReactor: Block;
  public static powerSource: Block;
  public static powerVoid: Block;
  public static itemSource: Block;
  public static itemVoid: Block;
  public static liquidSource: Block;
  public static liquidVoid: Block;
  public static payloadSource: Block;
  public static payloadVoid: Block;
  public static illuminator: Block;
  public static heatSource: Block;
  public static copperWall: Block;
  public static copperWallLarge: Block;
  public static titaniumWall: Block;
  public static titaniumWallLarge: Block;
  public static plastaniumWall: Block;
  public static plastaniumWallLarge: Block;
  public static thoriumWall: Block;
  public static thoriumWallLarge: Block;
  public static door: Block;
  public static doorLarge: Block;
  public static phaseWall: Block;
  public static phaseWallLarge: Block;
  public static surgeWall: Block;
  public static surgeWallLarge: Block;
  public static berylliumWall: Block;
  public static berylliumWallLarge: Block;
  public static tungstenWall: Block;
  public static tungstenWallLarge: Block;
  public static blastDoor: Block;
  public static reinforcedSurgeWall: Block;
  public static reinforcedSurgeWallLarge: Block;
  public static carbideWall: Block;
  public static carbideWallLarge: Block;
  public static shieldedWall: Block;
  public static mender: Block;
  public static mendProjector: Block;
  public static overdriveProjector: Block;
  public static overdriveDome: Block;
  public static forceProjector: Block;
  public static shockMine: Block;
  public static scrapWall: Block;
  public static scrapWallLarge: Block;
  public static scrapWallHuge: Block;
  public static scrapWallGigantic: Block;
  public static thruster: Block;
  public static radar: Block;
  public static buildTower: Block;
  public static regenProjector: Block;
  public static barrierProjector: Block;
  public static shockwaveTower: Block;
  public static shieldProjector: Block;
  public static largeShieldProjector: Block;
  public static shieldBreaker: Block;
  public static conveyor: Block;
  public static titaniumConveyor: Block;
  public static plastaniumConveyor: Block;
  public static armoredConveyor: Block;
  public static distributor: Block;
  public static junction: Block;
  public static itemBridge: Block;
  public static phaseConveyor: Block;
  public static sorter: Block;
  public static invertedSorter: Block;
  public static router: Block;
  public static overflowGate: Block;
  public static underflowGate: Block;
  public static massDriver: Block;
  public static duct: Block;
  public static armoredDuct: Block;
  public static ductRouter: Block;
  public static overflowDuct: Block;
  public static underflowDuct: Block;
  public static ductBridge: Block;
  public static ductUnloader: Block;
  public static surgeConveyor: Block;
  public static surgeRouter: Block;
  public static unitCargoLoader: Block;
  public static unitCargoUnloadPoint: Block;
  public static mechanicalPump: Block;
  public static rotaryPump: Block;
  public static impulsePump: Block;
  public static conduit: Block;
  public static pulseConduit: Block;
  public static platedConduit: Block;
  public static liquidRouter: Block;
  public static liquidContainer: Block;
  public static liquidTank: Block;
  public static liquidJunction: Block;
  public static bridgeConduit: Block;
  public static phaseConduit: Block;
  public static reinforcedPump: Block;
  public static reinforcedConduit: Block;
  public static reinforcedLiquidJunction: Block;
  public static reinforcedBridgeConduit: Block;
  public static reinforcedLiquidRouter: Block;
  public static reinforcedLiquidContainer: Block;
  public static reinforcedLiquidTank: Block;
  public static combustionGenerator: Block;
  public static thermalGenerator: Block;
  public static steamGenerator: Block;
  public static differentialGenerator: Block;
  public static rtgGenerator: Block;
  public static solarPanel: Block;
  public static largeSolarPanel: Block;
  public static thoriumReactor: Block;
  public static impactReactor: Block;
  public static battery: Block;
  public static batteryLarge: Block;
  public static powerNode: Block;
  public static powerNodeLarge: Block;
  public static surgeTower: Block;
  public static diode: Block;
  public static turbineCondenser: Block;
  public static ventCondenser: Block;
  public static chemicalCombustionChamber: Block;
  public static pyrolysisGenerator: Block;
  public static fluxReactor: Block;
  public static neoplasiaReactor: Block;
  public static beamNode: Block;
  public static beamTower: Block;
  public static beamLink: Block;
  public static mechanicalDrill: Block;
  public static pneumaticDrill: Block;
  public static laserDrill: Block;
  public static blastDrill: Block;
  public static waterExtractor: Block;
  public static oilExtractor: Block;
  public static cultivator: Block;
  public static cliffCrusher: Block;
  public static plasmaBore: Block;
  public static largePlasmaBore: Block;
  public static impactDrill: Block;
  public static eruptionDrill: Block;
  public static coreShard: Block;
  public static coreFoundation: Block;
  public static coreNucleus: Block;
  public static vault: Block;
  public static container: Block;
  public static unloader: Block;
  public static coreBastion: Block;
  public static coreCitadel: Block;
  public static coreAcropolis: Block;
  public static reinforcedContainer: Block;
  public static reinforcedVault: Block;
  public static duo: Block;
  public static scatter: Block;
  public static scorch: Block;
  public static hail: Block;
  public static arc: Block;
  public static wave: Block;
  public static lancer: Block;
  public static swarmer: Block;
  public static salvo: Block;
  public static fuse: Block;
  public static ripple: Block;
  public static cyclone: Block;
  public static foreshadow: Block;
  public static spectre: Block;
  public static meltdown: Block;
  public static segment: Block;
  public static parallax: Block;
  public static tsunami: Block;
  public static breach: Block;
  public static diffuse: Block;
  public static sublimate: Block;
  public static titan: Block;
  public static disperse: Block;
  public static afflict: Block;
  public static lustre: Block;
  public static scathe: Block;
  public static smite: Block;
  public static malign: Block;
  public static groundFactory: Block;
  public static airFactory: Block;
  public static navalFactory: Block;
  public static additiveReconstructor: Block;
  public static multiplicativeReconstructor: Block;
  public static exponentialReconstructor: Block;
  public static tetrativeReconstructor: Block;
  public static repairPoint: Block;
  public static repairTurret: Block;
  public static tankFabricator: Block;
  public static shipFabricator: Block;
  public static mechFabricator: Block;
  public static tankRefabricator: Block;
  public static shipRefabricator: Block;
  public static mechRefabricator: Block;
  public static primeRefabricator: Block;
  public static tankAssembler: Block;
  public static shipAssembler: Block;
  public static mechAssembler: Block;
  public static basicAssemblerModule: Block;
  public static unitRepairTower: Block;
  public static payloadConveyor: Block;
  public static payloadRouter: Block;
  public static reinforcedPayloadConveyor: Block;
  public static reinforcedPayloadRouter: Block;
  public static payloadMassDriver: Block;
  public static largePayloadMassDriver: Block;
  public static smallDeconstructor: Block;
  public static deconstructor: Block;
  public static largeConstructor: Block;
  public static payloadLoader: Block;
  public static payloadUnloader: Block;
  public static message: Block;
  public static switchBlock: Block;
  public static microProcessor: Block;
  public static logicProcessor: Block;
  public static hyperProcessor: Block;
  public static largeLogicDisplay: Block;
  public static logicDisplay: Block;
  public static memoryCell: Block;
  public static memoryBank: Block;
  public static canvas: Block;
  public static reinforcedMessage: Block;
  public static worldProcessor: Block;
  public static worldCell: Block;
  public static worldMessage: Block;
  public static launchPad: Block;
  public static interplanetaryAccelerator: Block;
}
export class Call {
  public static setRules(rules: Rules) {}
  public static menu = (
    _con: any,
    _id: number,
    _title: string,
    _message: string,
    _op: string[][]
  ) => {};
  public static label(
    _message: string,
    _duration: number,
    _worldx: number,
    _worldy: number
  ) {}
  public static effect(
    _effect: Effect,
    _x: number,
    _y: number,
    _r: number,
    _color: Color
  ) {}
  public static transferItemTo(
    _unit: Unit | null,
    _item: Item,
    _amount: number,
    _x: number,
    _y: number,
    _build: Building
  ) {}
  public static syncVariable(_building: Building, _index: number, _obj: any) {}
  public static infoToast(_con: NetConnection, _str: string, _time: number) {}
  public static pickedBuildPayload(
    _unit: Unit,
    _build: Building,
    _onGround: boolean
  ): void {}
  public static payloadDropped(_unit: Unit, _x: number, _y: number) {}
  public static clearItems(_build: Building) {}
}
export class LiquidModule {
  public get(_liquid: Liquid): number {
    return 0;
  }
  public set(_liquid: Liquid, _num: number): void {}
}
export class NetConnection {}
export class Map {
  public description() {
    return "so";
  }
}
export class Rules {
  public teams: Rules.TeamRules = new Rules.TeamRules();
}
export namespace Rules {
  export class TeamRules {
    public get(team: Team): TeamRule {
      return new TeamRule();
    }
  }
  export class TeamRule {
    public aiCoreSpawn = true;
    public cheat!: boolean;
    public infiniteResources!: boolean;
    public infiniteAmmo!: boolean;
    public buildAi!: boolean;
    public buildAiTier = 1;
    public rtsAi!: boolean;
    public rtsMinSquad = 4;
    public rtsMaxSquad = 1000;
    public rtsMinWeight = 1.2;
    public unitBuildSpeedMultiplier = 1;
    public unitDamageMultiplier = 1;
    public unitCrashDamageMultiplier = 1;
    public unitCostMultiplier = 1;
    public unitHealthMultiplier = 1;
    public blockHealthMultiplier = 1;
    public blockDamageMultiplier = 1;
  }
}
export class GameState {
  public map: Map = new Map();
  public rules: Rules = new Rules();
}
export class Tiles {
  public eachTile(_run: (t: Tile) => void) {}
}
export class World {
  public tile(_x: number, _y: number) {
    return new Tile();
  }
  public tiles: Tiles = new Tiles();
}
export class Seq<T> {
  public get(_index: number): T {
    return null as T;
  }
  public add(_data: T): void {}
  public insert(_index: number, _data: T): void {}
  public each(_func: (t: T) => void): void {}
  public size!: number;
}

export class Administration {
  public actionFilters!: Seq<Administration.ActionFilter>;
}
export namespace Administration {
  export enum ActionType {
    breakBlock,
    placeBlock,
    rotate,
    configure,
    withdrawItem,
    depositItem,
    control,
    buildSelect,
    command,
    removePlanned,
    commandUnits,
    commandBuilding,
    respawn,
  }
  export class PlayerAction {
    public type!: ActionType;
    public player!: Player;
    public tile?: Tile;
    public config: any;
  }
  export class ActionFilter {
    public allow(_action: PlayerAction): boolean {
      return true;
    }
  }
}
export class NetServer {
  public admins!: Administration;
}
export var Vars = {
  state: new GameState(),
  world: new World(),
  netServer: new NetServer(),
  content: new ContentLoader(),
  net: new Net(),
  netClient: new NetClient(),
  spawner: new WaveSpawner(),
}; /*
export class Vars {
    public static state: GameState = new GameState();
    public static world: World;
}*/
export function errLog(_e: string) {}
export class Menus {
  public static registerMenu = (_func: (p: any, o: number) => void): number => {
    return 0;
  };
  public static label(
    _message: string,
    _duration: number,
    _worldx: number,
    _worldy: number
  ) {}
  public static infoToast(_str: string, _time: number) {}
}
export class Timer {
  public static schedule(
    _run: () => void,
    _delaySeconds: number,
    _intervalSeconds?: number
  ) {}
}
export class Team {
  public id: number = 0;
  public color!: Color;
  public static get(_id: number) {
    return new Team();
  }
  public data(): Teams.TeamData {
    return new Teams.TeamData();
  }
}
export class CoreBlock extends Block {}
export namespace CoreBlock {
  export class CoreBuild extends Building {}
}
export class Teams {}
export namespace Teams {
  export class TeamData {
    public cores!: Seq<CoreBlock.CoreBuild>;
  }
}
interface Queue<T> {
  [index: number]: T;
  add: (v: T) => void;
}
export class Unitc {
  public movePref(_var1: Vec2) {}
  public isPlayer() {
    return false;
  }
}
export class WeaponMount {}
export class Unit implements Unitc {
  public apply(_effect: StatusEffect, _time: number) {}
  public controller(_var1: AIController) {}
  public speed() {
    return 1;
  }
  public angleTo(_x: number, _y: number) {
    return 1;
  }
  public flag!: number;
  public movePref(_var1: Vec2): void {}
  public plans!: Queue<BuildPlan>;
  public mounts!: Array<WeaponMount>;
  public type!: UnitType;
  public dead!: boolean;
  public x!: number;
  public y!: number;
  public within(_x: number, _y: number, _r: number): boolean {
    return true;
  }
  public kill() {}
  public isPlayer(): boolean {
    return false;
  }
  public team!: Team;
  public toString() {
    return "Unit-";
  }
}
export class UnitEntity extends Unit {
  public health!: number;
  public closestEnemyCore(): CoreBlock.CoreBuild {
    return new CoreBlock.CoreBuild();
  }
  public tileOn(): Tile {
    return new Tile();
  }
  public pathType(): number {
    return 0;
  }
}

export class Groups {
  public static player = class {
    public static each(_run: (p: Player) => void) {}
  };
}
export class Player {
  public team(): Team {
    return new Team();
  }
  public unit(): Unit {
    return new Unit();
  }
  public con!: NetConnection;
}
type Class<T> = new (...args: any[]) => T;
export class Events {
  public static on<T>(_event: Class<T>, _func: (event: T) => void) {}
  public static run<T>(_t: T, _func: () => void) {}
}
export class Tile {
  public block() {
    return new Block();
  }
  public floor(): Block {
    return new Block();
  }
  public x!: number;
  public y!: number;
  public setNet(_block: Block, _team: Team, _r: number) {}
  public setFloorNet(_floot: Block, _cover: Block) {}
  public setOverlayNet(_cover: Block) {}
  public build!: Building;
  public pos(): number {
    return 0;
  }
  public solid(): boolean {
    return false;
  }
}
export class BulletType {
  public splashDamageRadius!: number;
}
export class Bullet {
  public damage!: number;
  public team!: Team;
  public type(): BulletType {
    return new BulletType();
  }
}
export class Vec2 {
  public trns(_angle: number, _amount: number) {
    return this;
  }
  public constructor(_x?: number, _y?: number) {}
}
export interface _TapEvent_ {
  player: Player;
  tile: Tile;
}
export interface _UnitDamageEvent_ {
  bullet: Bullet;
  unit: UnitEntity;
}
export interface _UnitDestroyEvent_ {
  unit: UnitEntity;
}

export class EventType {
  public static TapEvent = class {
    public player!: Player;
    public tile!: Tile;
  };
  public static UnitDestroyEvent = class {
    public unit!: UnitEntity;
  };
  public static UnitDamageEvent = class {
    public bullet!: Bullet;
    public unit!: UnitEntity;
  };
  public static GameOverEvent = class {
    public winner!: Team;
  };
  public static WaveEvent = class {};
}
export namespace EventType {
  export enum Trigger {
    update,
  }
}
type addon<T1, T2> = T1 & T2;

export function extend<T1, T2>(
  father: Class<T1>,
  _addon: Partial<T1> & T2
): T1 {
  return new father();
}
export function prov<T>(func: () => T): Prov<T> {
  return {
    get(): T {
      return func();
    },
  };
}
export class UnitType {
  public hitSize!: number;
  public aiController!: Prov<any>;
  public flying!: boolean;
  public toString() {
    return "eee";
  }
  public spawn(_team: Team, _x: number, _y: number) {
    return new UnitEntity();
  }
  public create(team: Team) {
    return new UnitEntity();
  }
}
export class Effect {}
export class AIController implements UnitController {
  public unit!: UnitEntity;
  public updateMovement!: () => void;
  public updateUnit!: () => void;
  public moveTo!: () => void;
  public retarget!: () => boolean;
  public faceTarget: () => void = () => {};
}
export interface UnitController {}
export class Astar {
  public static pathfind(
    _startX: number,
    _startY: number,
    _endX: number,
    _endY: number,
    _th: Astar.TileHueristic,
    _passable: (t: Tile) => boolean
  ): Seq<Tile> {
    return new Seq<Tile>();
  }
}
export namespace Astar {
  export interface TileHueristic {
    cost: (tile: Tile) => number;
  }
}
export class Fx {
  public static unitPickup: Effect;
  public static coreLandDust: Effect;
  public static fireballsmoke: Effect;
  public static hitMeltdown: Effect;
  public static plasticExplosion: Effect;
  public static padlaunch: Effect;
  public static hitEmpSpark: Effect;
  public static lancerLaserCharge: Effect;
  public static rand: Effect;
  public static unitDrop: Effect;
  public static neoplasmHeal: Effect;
  public static fireHit: Effect;
  public static colorTrail: Effect;
  public static sapped: Effect;
  public static flakExplosionBig: Effect;
  public static blastExplosion: Effect;
  public static pointHit: Effect;
  public static plasticburn: Effect;
  public static overclocked: Effect;
  public static unitSpirit: Effect;
  public static blockCrash: Effect;
  public static shootSmokeSmite: Effect;
  public static surgeCruciSmoke: Effect;
  public static casing3Double: Effect;
  public static lightningCharge: Effect;
  public static mine: Effect;
  public static trailFade: Effect;
  public static pointBeam: Effect;
  public static missileTrailSmoke: Effect;
  public static coreBuildShockwave: Effect;
  public static v: Effect;
  public static pulverize: Effect;
  public static healBlock: Effect;
  public static payloadDeposit: Effect;
  public static dropItem: Effect;
  public static ventSteam: Effect;
  public static hitLaserColor: Effect;
  public static greenLaserCharge: Effect;
  public static unitShieldBreak: Effect;
  public static hitFlameSmall: Effect;
  public static railHit: Effect;
  public static electrified: Effect;
  public static shootSmokeSquareBig: Effect;
  public static unitWreck: Effect;
  public static mineImpact: Effect;
  public static hitFlameBeam: Effect;
  public static unitDust: Effect;
  public static oily: Effect;
  public static healBlockFull: Effect;
  public static titanSmoke: Effect;
  public static mineBig: Effect;
  public static regenSuppressSeek: Effect;
  public static lightBlock: Effect;
  public static mineWallSmall: Effect;
  public static payloadReceive: Effect;
  public static casing1: Effect;
  public static casing2: Effect;
  public static explosion: Effect;
  public static healWave: Effect;
  public static casing3: Effect;
  public static landShock: Effect;
  public static casing4: Effect;
  public static shootSmokeSquare: Effect;
  public static upgradeCoreBloom: Effect;
  public static healWaveDynamic: Effect;
  public static mineSmall: Effect;
  public static plasticExplosionFlak: Effect;
  public static shootSmokeMissile: Effect;
  public static select: Effect;
  public static colorSpark: Effect;
  public static shootSmallFlame: Effect;
  public static drillSteam: Effect;
  public static lancerLaserShoot: Effect;
  public static mineImpactWave: Effect;
  public static titanExplosion: Effect;
  public static unitControl: Effect;
  public static shootSmokeDisperse: Effect;
  public static shootPayloadDriver: Effect;
  public static magmasmoke: Effect;
  public static placeBlock: Effect;
  public static unitEnvKill: Effect;
  public static bubble: Effect;
  public static dooropen: Effect;
  public static missileTrail: Effect;
  public static colorSparkBig: Effect;
  public static vapor: Effect;
  public static regenParticle: Effect;
  public static ballfire: Effect;
  public static overdriveWave: Effect;
  public static doorcloselarge: Effect;
  public static airBubble: Effect;
  public static hitSquaresColor: Effect;
  public static hitLiquid: Effect;
  public static instShoot: Effect;
  public static shieldApply: Effect;
  public static shockwave: Effect;
  public static lancerLaserShootSmoke: Effect;
  public static commandSend: Effect;
  public static hitMeltHeal: Effect;
  public static shootSmallSmoke: Effect;
  public static teleport: Effect;
  public static itemTransfer: Effect;
  public static teleportOut: Effect;
  public static heal: Effect;
  public static incendTrail: Effect;
  public static upgradeCore: Effect;
  public static shootSmall: Effect;
  public static neoplasmSplat: Effect;
  public static railShoot: Effect;
  public static pulverizeRed: Effect;
  public static disperseTrail: Effect;
  public static burning: Effect;
  public static arcShieldBreak: Effect;
  public static spawn: Effect;
  public static conveyorPoof: Effect;
  public static freezing: Effect;
  public static incinerateSlag: Effect;
  public static shootBig2: Effect;
  public static absorb: Effect;
  public static coreBurn: Effect;
  public static fire: Effect;
  public static lightning: Effect;
  public static circleColorSpark: Effect;
  public static turbinegenerate: Effect;
  public static shootTitan: Effect;
  public static smokePuff: Effect;
  public static rocketSmoke: Effect;
  public static hitLaserBlast: Effect;
  public static casing2Double: Effect;
  public static massiveExplosion: Effect;
  public static moveCommand: Effect;
  public static fireRemove: Effect;
  public static melting: Effect;
  public static launchPod: Effect;
  public static flakExplosion: Effect;
  public static doorclose: Effect;
  public static unitAssemble: Effect;
  public static sparkShoot: Effect;
  public static overdriveBlockFull: Effect;
  public static crawlDust: Effect;
  public static instTrail: Effect;
  public static blockExplosionSmoke: Effect;
  public static launch: Effect;
  public static unitCapKill: Effect;
  public static fluxVapor: Effect;
  public static rotateBlock: Effect;
  public static reactorExplosion: Effect;
  public static regenSuppressParticle: Effect;
  public static shootSmokeSquareSparse: Effect;
  public static hitBulletColor: Effect;
  public static coreLaunchConstruct: Effect;
  public static tapBlock: Effect;
  public static sparkExplosion: Effect;
  public static fireSmoke: Effect;
  public static generate: Effect;
  public static bigShockwave: Effect;
  public static shootBigColor: Effect;
  public static shootSmallColor: Effect;
  public static hitFuse: Effect;
  public static dooropenlarge: Effect;
  public static smeltsmoke: Effect;
  public static ripple: Effect;
  public static greenCloud: Effect;
  public static randLifeSpark: Effect;
  public static hitLaser: Effect;
  public static lava: Effect;
  public static hitBeam: Effect;
  public static breakBlock: Effect;
  public static shootLiquid: Effect;
  public static rocketSmokeLarge: Effect;
  public static hitFlamePlasma: Effect;
  public static greenLaserChargeSmall: Effect;
  public static attackCommand: Effect;
  public static shieldWave: Effect;
  public static coalSmeltsmoke: Effect;
  public static unitLandSmall: Effect;
  public static instBomb: Effect;
  public static shieldBreak: Effect;
  public static healWaveMend: Effect;
  public static unitLand: Effect;
  public static shootBig: Effect;
  public static none: Effect;
  public static chainLightning: Effect;
  public static pointShockwave: Effect;
  public static scatheSlash: Effect;
  public static overdriven: Effect;
  public static shootHealYellow: Effect;
  public static thoriumShoot: Effect;
  public static mineHuge: Effect;
  public static heatReactorSmoke: Effect;
  public static hitLancer: Effect;
  public static smokeCloud: Effect;
  public static forceShrink: Effect;
  public static shootSmokeTitan: Effect;
  public static blastsmoke: Effect;
  public static sporeSlowed: Effect;
  public static despawn: Effect;
  public static dynamicWave: Effect;
  public static unitDespawn: Effect;
  public static artilleryTrailSmoke: Effect;
  public static lancerLaserChargeBegin: Effect;
  public static artilleryTrail: Effect;
  public static dynamicExplosion: Effect;
  public static chainEmp: Effect;
  public static lightningShoot: Effect;
  public static shootHeal: Effect;
  public static muddy: Effect;
  public static wet: Effect;
  public static pickup: Effect;
  public static neoplasiaSmoke: Effect;
  public static scatheLight: Effect;
  public static greenBomb: Effect;
  public static fallSmoke: Effect;
  public static vaporSmall: Effect;
  public static missileTrailShort: Effect;
  public static producesmoke: Effect;
  public static unitSpawn: Effect;
  public static reactorsmoke: Effect;
  public static shootBigSmoke: Effect;
  public static shootPyraFlame: Effect;
  public static generatespark: Effect;
  public static scatheExplosion: Effect;
  public static dynamicSpikes: Effect;
  public static impactReactorExplosion: Effect;
  public static teleportActivate: Effect;
  public static redgeneratespark: Effect;
  public static pulverizeSmall: Effect;
  public static coreBuildBlock: Effect;
  public static legDestroy: Effect;
  public static shootBigSmoke2: Effect;
  public static hitBulletBig: Effect;
  public static sapExplosion: Effect;
  public static instHit: Effect;
  public static spawnShockwave: Effect;
  public static railTrail: Effect;
  public static hitBulletSmall: Effect;
  public static steam: Effect;
  public static formsmoke: Effect;
  public static breakProp: Effect;
  public static pulverizeMedium: Effect;
  public static smoke: Effect;
  public static fuelburn: Effect;
}
export class UnitTypes {
  public static mace: UnitType;
  public static dagger: UnitType;
  public static crawler: UnitType;
  public static fortress: UnitType;
  public static scepter: UnitType;
  public static reign: UnitType;
  public static vela: UnitType;
  public static nova: UnitType;
  public static pulsar: UnitType;
  public static quasar: UnitType;
  public static corvus: UnitType;
  public static atrax: UnitType;
  public static merui: UnitType;
  public static cleroi: UnitType;
  public static anthicus: UnitType;
  public static tecta: UnitType;
  public static collaris: UnitType;
  public static spiroct: UnitType;
  public static arkyid: UnitType;
  public static toxopid: UnitType;
  public static elude: UnitType;
  public static flare: UnitType;
  public static eclipse: UnitType;
  public static horizon: UnitType;
  public static zenith: UnitType;
  public static antumbra: UnitType;
  public static avert: UnitType;
  public static obviate: UnitType;
  public static mono: UnitType;
  public static poly: UnitType;
  public static mega: UnitType;
  public static evoke: UnitType;
  public static incite: UnitType;
  public static emanate: UnitType;
  public static quell: UnitType;
  public static disrupt: UnitType;
  public static quad: UnitType;
  public static oct: UnitType;
  public static alpha: UnitType;
  public static beta: UnitType;
  public static gamma: UnitType;
  public static risso: UnitType;
  public static minke: UnitType;
  public static bryde: UnitType;
  public static sei: UnitType;
  public static omura: UnitType;
  public static retusa: UnitType;
  public static oxynoe: UnitType;
  public static cyerce: UnitType;
  public static aegires: UnitType;
  public static navanax: UnitType;
  public static block: UnitType;
  public static manifold: UnitType;
  public static assemblyDrone: UnitType;
  public static stell: UnitType;
  public static locus: UnitType;
  public static precept: UnitType;
  public static vanquish: UnitType;
  public static conquer: UnitType;
  public static missile: UnitType;
  public static latum: UnitType;
  public static renale: UnitType;
}
export class Color {
  public static sky: Color;
  public static orange: Color;
  public toString() {
    return "eee";
  }
}
export class BuildPlan {
  constructor(_x: number, _y: number, _r: number, _block: Block) {}
  public x!: number;
  public y!: number;
  public block!: Block;
}
export class WorldLabel {
  public x!: number;
  public y!: number;
  public z!: number;
  public id!: number;
  public fontSize!: number;
  public text!: string;
  public static create() {
    return new WorldLabel();
  }
  public add() {}
  public hide() {}
  public remove() {}
}
export class Units {
  public static nearby(
    _team: Team,
    _x: number,
    _y: number,
    _r: number,
    _run: (u: UnitEntity) => void
  ) {}
}
export class StatusEffect {}
export class StatusEffects {
  public static none: StatusEffect;
  public static burning: StatusEffect;
  public static freezing: StatusEffect;
  public static unmoving: StatusEffect;
  public static slow: StatusEffect;
  public static wet: StatusEffect;
  public static muddy: StatusEffect;
  public static melting: StatusEffect;
  public static sapped: StatusEffect;
  public static tarred: StatusEffect;
  public static overdrive: StatusEffect;
  public static overclock: StatusEffect;
  public static shielded: StatusEffect;
  public static shocked: StatusEffect;
  public static blasted: StatusEffect;
  public static corroded: StatusEffect;
  public static boss: StatusEffect;
  public static sporeSlowed: StatusEffect;
  public static disarmed: StatusEffect;
  public static electrified: StatusEffect;
  public static invincible: StatusEffect;
}
export class Point2 {
  public x!: number;
  public y!: number;
  public Point2(_x: number | undefined, _y: number | undefined) {}
  public static pack(_x: number, _y: number): number {
    return 0;
  }
  public pack(): number {
    return 0;
  }
}
export class Liquid extends UnlockableContent {}
export class Liquids {
  public static water: Liquid;
  public static slag: Liquid;
  public static oil: Liquid;
  public static cryofluid: Liquid;
  public static arkycite: Liquid;
  public static gallium: Liquid;
  public static neoplasm: Liquid;
  public static ozone: Liquid;
  public static hydrogen: Liquid;
  public static nitrogen: Liquid;
  public static cyanogen: Liquid;
}
export class StringBuilder {}
export class MessageBlock extends Block {}
export namespace MessageBlock {
  export class MessageBuild extends Building {
    public message!: StringBuilder;
  }
}

export class Integer {
  public static parserInt(_str: string): number {
    return 0;
  }
}
export class LVar {
  public name!: string;
}
export class LExecutor {
  public vars!: Array<LVar>;
  public static syncVariable(_building: Building, _index: number, _obj: any) {}
}
export class LogicBlock extends Block {}
export namespace LogicBlock {
  export class LogicBuild extends Building {
    public executor!: LExecutor;
  }
}
