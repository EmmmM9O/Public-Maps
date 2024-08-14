import {Blocks, Block, Events, UnitTypes, EventType, Vars, Call, Team, Fx, Color, AIController, extend, Vec2, BuildPlan, Timer, WorldLabel, Item, Items, Unit, Groups, _TapEvent_, _UnitDestroyEvent_, _UnitDamageEvent_, Effect, StatusEffect, Units, StatusEffects, UnitType, World, Tile, Liquid, MessageBlock, Integer, Administration} from '../../Apis/Mdt';
import {Aim, Console, _ui_} from '../../Apis/Aim';
interface TD2_Build<T> {
  x: number;
  y: number;
  block: TD2_Block<T>;
  addon?: T,
  team: Team,
  update: () => void
}
interface TD2_Team {
  id: number,
  money: number;
  team: Team
}
interface TD2_Block<T> {
  cost: number;
  name: string,
  arrmo: null | Item,
  liquid: null | Liquid,
  block: Block,
  create: (tile: TD2_Tile, t: Team) => TD2_Build<T>
  children: Array<string>,
  father?: string,
  k: number,
}
interface TD2_Tile {
  tile: Tile,
  build?: TD2_Build<any>,
  max_size: number,
  team: Team,
  label: WorldLabel
}
interface TD2_Blocks {
  [index: string]: TD2_Block<any>
}
interface TD2_Tiles {
  [index: number]: TD2_Tile
}

interface TD2_Teams {
  [index: number]: TD2_Team
}
interface UnitTeamDamageType {
  [index: number]: number
}
interface UnitMoneyType {
  [index: string]: number;
}
interface UnitDamageType {
  [index: string]: UnitTeamDamageType
}
try {
  // @ts-ignore
  TD2.clear();
} catch (_) {

}
interface TD2_Type {
  applyStarts: string,
  unitDamage: UnitDamageType,
  tiles: TD2_Tiles,
  teams: TD2_Teams,
  init: () => void,
  initTile: () => void,
  onTabEvent: (event: _TapEvent_) => void,
  onUnitDamageEvent: (event: _UnitDamageEvent_) => void,
  onUnitDestoryEvent: (event: _UnitDestroyEvent_) => void
  clear: () => void,
  createTeam: (id: number, money: number) => TD2_Team,
  checkMap: () => boolean,
  createTile: (tile: Tile) => TD2_Tile,
  createBlock: <T>() => TD2_Block<T>,
  blocks: TD2_Blocks,
  createBuild: <T> (tile: TD2_Tile) => TD2_Build<T>,
  timerRun: () => void,
  waveTeam: Team,
  unitMoney: UnitMoneyType
}
var TD2: TD2_Type = {
  unitMoney: {
    "dagger": 10,
    "crawler": 4,
  },
  waveTeam: Team.get(2),
  applyStarts: "##TD2##",
  tiles: {},
  teams: {},
  unitDamage: {},
  blocks: {},
  init(): void {
    Timer.schedule(() => {
      this.timerRun();
    }, 1, 1)
    Events.on(EventType.TapEvent, (event) => {
      try {
        this.onTabEvent(event);
      } catch (e) {
        Console.err(e);
      }
    })
    Events.on(EventType.UnitDamageEvent, (event) => {
      try {
        this.onUnitDamageEvent(event);
      } catch (e) {
        Console.err(e);
      }
    })
    Events.on(EventType.UnitDestroyEvent, event => {
      try {
        this.onUnitDestoryEvent(event)
      } catch (e) {
        Console.err(e);
      }
    })
    Vars.netServer.admins.actionFilters.insert(0, extend<Administration.ActionFilter, {}>(Administration.ActionFilter, {
      allow(action: Administration.PlayerAction): boolean {
        if (!TD2.checkMap()) return true;
        let types = Administration.ActionType
        let type = action.type
        if (type == types.breakBlock) {
          return false
        }
        if (type == types.placeBlock) {
          return false
        }
        if (type == types.configure) {
          return false
        }
        return true
      },
    }))
  },
  checkMap(): boolean {
    return Vars.state.map.description().startsWith(this.applyStarts)
  },
  initTile(): void {
    Vars.world.tiles.eachTile((t: Tile) => {
      if (t.block() == Blocks.message) {
        this.tiles[t.pack()] = this.createTile(t);
      }
    })
  },
  createBuild<T>(tile: TD2_Tile): TD2_Build<T> {
    return {
      update: () => {},
      team: tile.team,
      block: this.blocks.air,
      x: tile.tile.x,
      y: tile.tile.y,
      addon: undefined
    };
  },
  createBlock<T>(): TD2_Block<T> {
    let that: TD2_Block<T> = {
      name: "none",
      arrmo: null,
      liquid: null,
      block: Blocks.air,
      k: 2,
      cost: 0,
      children: [],
      create: (tile: TD2_Tile, t: Team): TD2_Build<T> => {
        var b = this.createBuild<T>(tile);
        b.block = that
        tile.label.text = "[sky][建筑]\n" + b.block.name
        b.team = t
        Vars.world.tile(b.x, b.y).setNet(b.block.block, t, 0);
        return b;
      }
    }
    return that
  },
  createTile(tile): TD2_Tile {
    let t: TD2_Tile = {
      tile, team: tile.build.team,
      max_size: Integer.parserInt((tile.build as MessageBlock.MessageBuild).message.str()),
      label: WorldLabel.create()
    }
    t.label.x = tile.x * 8
    t.label.y = tile.y * 8
    t.label.fontSize = 2
    t.label.add()
    let build = this.blocks.air.create(t, t.team);
    t.build = build
    return t;
  },
  onTabEvent(event: _TapEvent_): void {
    if (!this.checkMap()) return;
    let p = event.player, t = event.tile;
    if (t == null || t.build == null || p.team() != t.build.team) return;
    if (!p.unit().within(t.x * 8, t.y * 8, 24 * 8)) return;
    let ti = this.tiles[t.pack()];
    if (ti == null) return;
  },
  onUnitDestoryEvent(event: _UnitDestroyEvent_): void {
    if (!this.checkMap()) return;
    let unit = event.unit;
    if (unit.team.id != TD2.waveTeam.id) return;
    let max = 0, maxt = -1;
    for (let i in TD2.unitDamage[unit.toString()]) {
      let d = TD2.unitDamage[unit.toString()][i];
      if (d > max) {
        maxt = Number(i);
        max = d;
      }
    }
    if (maxt != -1) {
      Call.effect(Fx.shootSmokeSmite, unit.x, unit.y, 0, Color.orange);
      let money = TD2.unitMoney[unit.type.toString()];
      if (isNaN(money) || money == null) money = 0;
      if (money <= 0) return;
      Call.label('Dead[#' + Team.get(maxt).color.toString() + ']+' + money, 0.3, unit.x, unit.y)
      TD2.teams[maxt].money += money;
    }

  },
  onUnitDamageEvent(event: _UnitDamageEvent_): void {
    if (!this.checkMap()) return;
    let unit = event.unit, bullet = event.bullet;
    if (unit.team.id != TD2.waveTeam.id) return;
    if (bullet == null) return;
    if (TD2.unitDamage[unit.toString()] == null) {
      TD2.unitDamage[unit.toString()] = {} as UnitTeamDamageType;
    }
    let k = TD2.unitDamage[unit.toString()];
    if (k[bullet.team.id] == null || isNaN(k[bullet.team.id])) {
      k[bullet.team.id] = 0;
    }
    k[bullet.team.id] += bullet.damage;
    let money = Math.pow(Math.min(bullet.damage, unit.health) * 1.0 / 400, 1.2);
    let fx;
    fx = Fx.hitMeltdown;
    if (bullet.damage >= 100) {
      fx = Fx.payloadReceive;
      Call.effect(Fx.payloadReceive, unit.x, unit.y, 0, Color.orange);
    }
    if (bullet.damage >= 200) {
      fx = Fx.mineImpact
      Call.effect(Fx.mineImpact, unit.x, unit.y, 0, Color.orange);
    }
    for (let i = 0; i <= Math.max(Math.min(unit.type.hitSize * 0.3, 6), 3); i++) {
      let x = Math.floor(Math.random() * unit.type.hitSize) - unit.type.hitSize * 0.5;
      let y = Math.floor(Math.random() * unit.type.hitSize) - unit.type.hitSize * 0.5;
      Call.effect(fx, x + unit.x, y + unit.y, 0, Color.orange);
    }
    if (money <= 0) return;
    if (money >= 1) Call.label('[#' + bullet.team.color.toString() + ']+' + money, 0.3, unit.x, unit.y);
    TD2.teams[bullet.team.id].money += money;
  },
  timerRun(): void {
    if (!this.checkMap()) return;
    Groups.player.each(p => {
      let t = this.teams[p.team().id];
      if (t == null || t.money == null) return;
      Call.infoToast(p.con, "[orange]当前金币" + t.money, 1);
    });
    for (let tileK in this.tiles) {
      let tile = this.tiles[tileK]
      if (tile == null) return;
      if (tile.build == null) return;
      tile.build.update();
    }
  },
  createTeam(id: number, money: number): TD2_Team {
    let res: TD2_Team = {
      id, money, team: Team.get(id)
    }
    this.teams[id] = res
    return res
  },
  clear(): void {
    for (let tileId in TD2.tiles) {
      let tile = TD2.tiles[tileId]
      if (tile != undefined) {
        tile.label.hide()
        tile.label.remove()
      }
    }
    TD2.tiles = {}
  }
};
TD2.blocks.air = TD2.createBlock<{}>();
TD2.blocks.air.name = "空气"
TD2.createTeam(1, 100)
TD2.initTile();
try {
  // @ts-ignore
  TD2_Load.w = 0;
} catch (_) {
  var TD2_Load = {}
  TD2.init()

}
