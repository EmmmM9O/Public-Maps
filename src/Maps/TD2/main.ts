import {
  Blocks,
  Block,
  Events,
  UnitTypes,
  EventType,
  Vars,
  Call,
  Team,
  Fx,
  Color,
  AIController,
  extend,
  Vec2,
  BuildPlan,
  Timer,
  WorldLabel,
  Item,
  Items,
  Unit,
  Groups,
  _TapEvent_,
  _UnitDestroyEvent_,
  _UnitDamageEvent_,
  Effect,
  StatusEffect,
  Units,
  StatusEffects,
  UnitType,
  World,
  Tile,
  Liquid,
  MessageBlock,
  Integer,
  Administration,
  Player,
  Building,
  LogicBlock,
  Liquids,
  LExecutor,
  UnitEntity,
  Prov,
  prov,
  CoreBlock,
  Seq,
  Astar,
  InputHandler,
  NetClient,
  Menus,
} from "../../Apis/Mdt";
import { Aim, Console, _ui_ } from "../../Apis/Aim";
import { ArrayTypeNode } from "typescript";
interface TD2_Build<T> {
  x: number;
  y: number;
  block: TD2_Block<T>;
  addon?: T;
  team: Team;
  update?: () => void;
}

interface TD2_Team {
  id: number;
  money: number;
  team: Team;
  displayInfo: () => string;
  updateS: () => void;
  update: () => void;
  updateCoreLabel: () => void;
  coreLabels: { [index: number]: WorldLabel };
  coreHealth: { [index: number]: number };
  last_add: number;
  last_remove: number;
  money_increase: number;
  point: number;
  resourcePoint: number;
  damagePoint: number;
}
interface TD2_Block<T> {
  cost: number;
  baseName: string;
  name: string;
  desc?: string;
  ammo: null | Item;
  liquid: null | Liquid;
  liquidE?: Liquid;
  block: Block;
  create: (tile: TD2_Tile, team: Team) => TD2_Build<T>;
  children: Array<string>;
  father?: string;
  k: number;
  displayInfo: (tile: TD2_Tile, player: Player) => string;
  display: (player: Player) => string;
  check?: (tile: TD2_Tile) => boolean;
  extra?: number;
}
interface TD2_Tile {
  tile: Tile;
  build?: TD2_Build<any>;
  max_size: number;
  team: Team;
  label: WorldLabel;
}
interface TD2_Blocks {
  [index: string]: TD2_Block<any>;
}
interface TD2_Tiles {
  [index: number]: TD2_Tile;
}

interface TD2_Teams {
  [index: number]: TD2_Team;
}
interface UnitTeamDamageType {
  [index: number]: number;
}
interface UnitMoneyType {
  [index: string]: number;
}
interface UnitDamageType {
  [index: string]: UnitTeamDamageType;
}
interface TD2_UI_Data {
  tile: TD2_Tile;
}
interface TD2_List_UI_Data {
  tile: TD2_Tile;
  block: TD2_Block<any>;
  noMoney: boolean;
}
interface TD2_Core_UI_Data {
  tile: Tile;
  index: number;
  build: Building;
  team: TD2_Team;
}
interface TD2_DirllBlcok {
  speed: number;
  point: number;
  progress: number;
}
try {
  // @ts-ignore
  TD2.clear();
} catch (_) {}
interface TD2_Type {
  coreUi: _ui_<TD2_Core_UI_Data>;
  floors: Array<number>;
  TDAi: (type: UnitType) => AIController | null;
  buildingIndex: number;
  liquidIndex: number;
  worldProcessorTile: Tile;
  applyStarts: string;
  unitDamage: UnitDamageType;
  tiles: TD2_Tiles;
  teams: TD2_Teams;
  init: () => void;
  initTile: () => void;
  onTapEvent: (event: _TapEvent_) => void;
  onUnitDamageEvent: (event: _UnitDamageEvent_) => void;
  onUnitDestoryEvent: (event: _UnitDestroyEvent_) => void;
  onWaveEvent: () => void;
  clear: () => void;
  createTeam: (id: number, money: number) => TD2_Team;
  checkMap: () => boolean;
  createTile: (tile: Tile) => TD2_Tile;
  createBlock: <T>(
    run?: (block: TD2_Block<T>) => void,
    children?: Array<TD2_Block<any>>,
    createF?: (build: TD2_Build<T>) => void
  ) => TD2_Block<T>;
  createDirllBlock: (
    speed: number,
    point: number,
    run?: (block: TD2_Block<TD2_DirllBlcok>) => void,
    children?: Array<TD2_Block<any>>
  ) => TD2_Block<TD2_DirllBlcok>;
  blocks: TD2_Blocks;
  createBuild: <T>(tile: TD2_Tile) => TD2_Build<T>;
  timerRun: () => void;
  waveTeam: Team;
  unitMoney: UnitMoneyType;
  labels: Array<WorldLabel>;
  mainUi: _ui_<TD2_UI_Data>;
  listUi: _ui_<TD2_List_UI_Data>;
  syncLiquid: (build: Building, liquid: Liquid) => void;
  actionFilter: (action: Administration.PlayerAction) => boolean;
  update: () => void;
}
var TD2: TD2_Type = {
  onWaveEvent() {
    Timer.schedule(() => {
      Vars.spawner.getSpawns().each((tile) => {
        Units.nearby(TD2.waveTeam, tile.x * 8, tile.y * 8, 8 * 8, (unit) => {
          if (unit.flag != 114514) {
            let type = unit.type;
            let u: any = null;
            let h = unit.health;
            let s = unit.shield;
            if (!type.flying)
              u = UnitTypes.elude.spawn(TD2.waveTeam, unit.x, unit.y);
            else
              u = UnitTypes.elude.spawn(TD2.waveTeam, tile.x * 8, tile.y * 8);
            u.health = h;
            u.shield = s;
            u.type = type;
            u.mounts = type.create(Team.get(0)).mounts;
            if (h >= 6000) {
              u.apply(StatusEffects.overdrive, 10000);
            }
            if (h >= 10000) {
              u.apply(StatusEffects.overclock, 10000);
            }
            unit.kill();
            u.flag = 114514;
          }
        });
      });
      let index = 0;
      Units.nearby(TD2.waveTeam, 100 * 8, 100 * 8, 16 * 8, (unit) => {
        if (unit.flag != 114514 && unit.type.flying) {
          let h = unit.health;
          let s = unit.shield;
          let tile = Vars.spawner.getSpawns().get(index);
          index++;
          index %= Vars.spawner.getSpawns().size;
          let type = unit.type;
          let u = UnitTypes.elude.spawn(TD2.waveTeam, tile.x * 8, tile.y * 8);
          u.health = h;
          u.shield = s;
          u.type = type;
          u.mounts = type.create(Team.get(0)).mounts;
          u.apply(StatusEffects.slow, 100000);
          if (h >= 6000) {
            u.apply(StatusEffects.overdrive, 10000);
          }
          if (h >= 10000) {
            u.apply(StatusEffects.overclock, 10000);
          }
          unit.kill();
          u.health = h;
          u.flag = 114514;
        }
      });
    }, 0.5);
  },
  floors: [
    Blocks.water.id,
    Blocks.metalFloor.id,
    Blocks.metalFloor2.id,
    Blocks.metalFloor3.id,
    Blocks.metalFloor4.id,
    Blocks.metalFloor5.id,
  ],
  coreUi: Aim.menuUI
    .createUI<TD2_Core_UI_Data>()
    .title("核心")
    .content((p, d, u) => d.team.displayInfo())
    .eles((p, d, u) => {
      if (d.team.coreHealth[d.tile.pos()] > 0) {
        u.text(
          (p, d, u) =>
            "[red]" +
            d.team.coreHealth[d.tile.pos()] +
            "/" +
            d.build.block.size * d.build.block.size
        );
        u.row();
        if (
          d.team.coreHealth[d.tile.pos()] <
          d.build.block.size * d.build.block.size
        ) {
          u.button(
            (p, d, u) =>
              (d.team.money >= 1000 ? "[acid]" : "[red]") +
              "消耗1000恢复一点血量",
            () => {
              if (d.team.money >= 1000) {
                if (
                  d.team.coreHealth[d.tile.pos()] > 0 &&
                  d.team.coreHealth[d.tile.pos()] <
                    d.build.block.size * d.build.block.size
                ) {
                  d.team.money -= 1000;
                  d.team.last_remove += 1000;
                  d.team.coreHealth[d.tile.pos()]++;
                }
              }
              TD2.coreUi.show(p, d);
            },
            true
          );
          u.row();
        }
        u.text((p, d, u) => "[violet]科技点数:" + d.team.point);
        u.button(
          (p, d, u) =>
            (d.team.money >= 1000 ? "[acid]" : "[red]") +
            "消耗1000研发一点科技",
          () => {
            if (d.team.money >= 1000) {
              if (d.team.coreHealth[d.tile.pos()] > 0) {
                d.team.money -= 1000;
                d.team.last_remove += 1000;
                d.team.point++;
              }
            }
            TD2.coreUi.show(p, d);
          },
          true
        );
        u.row();
        u.text("[cyan]消耗科技点 升级内容:");
        u.row();
        u.button(
          (p, d, u) =>
            "[orange]资源倍率:" +
            Math.round(d.team.resourcePoint * 100) +
            "% -> " +
            (Math.round(d.team.resourcePoint * 100) + 1) +
            "%",
          (p, d, u) => {
            if (d.team.point > 0) {
              d.team.point--;
              d.team.resourcePoint += 0.01;
            }
            TD2.coreUi.show(p, d);
          },
          true
        );
        u.button(
          (p, d, u) =>
            "[sky]伤害倍率:" +
            Math.round(d.team.damagePoint * 100) +
            "% -> " +
            (Math.round(d.team.damagePoint * 100) + 1) +
            "%",
          (p, d, u) => {
            if (d.team.point > 0) {
              d.team.point--;
              d.team.damagePoint += 0.01;
              Vars.state.rules.teams.get(p.team()).blockDamageMultiplier =
                d.team.damagePoint;
              Vars.state.rules.teams.get(p.team()).unitDamageMultiplier =
                d.team.damagePoint;
              Call.setRules(Vars.state.rules);
            }
            TD2.coreUi.show(p, d);
          },
          true
        );
      } else {
        u.text("核心已损坏");
      }
      u.row();
      u.button("返回", (p, v, u) => {}, true);
    }),
  TDAi(type): AIController {
    return extend<
      AIController,
      {
        superAi?: any;
        path?: Seq<Tile>;
        lastCore?: CoreBlock.CoreBuild;
        repath: number;
        pathProgress: number;
        vect?: Vec2;
      }
    >(AIController, {
      repath: 0,
      pathProgress: 0,
      updateMovement() {
        if (this == null) return;
        if (this.unit == null || this.unit.flag != 114514) return;
        if (
          this.unit.type == UnitTypes.emanate ||
          this.unit.type == UnitTypes.quad ||
          this.unit.type == UnitTypes.oct
        ) {
          return;
        }
        if (this.unit.team != TD2.waveTeam) {
          this.unit.controller = this.superAi;
          try {
            this.superAi.unit(this.unit);
          } catch (e) {
            this.superAi.unit = this.unit;
          }
          return;
        }
        var core = this.unit.closestEnemyCore();
        if (core != null) {
          // @ts-ignore
          this.pathfind(Pathfinder.fieldCore);
        }
        // @ts-ignore
        this.faceTarget();

        /*
        try {
          let core = this.unit.closestEnemyCore();
          if (core) {
            if (
              this.path == null ||
              this.lastCore != core ||
              this.repath < Date.now()
            ) {
              this.lastCore = core;

              let path = Astar.pathfind(
                Math.round(this.unit.x / 8),
                Math.round(this.unit.y / 8),
                core ? Math.floor(core.x / 8) : 0,
                core ? Math.floor(core.y / 8) : 0,
                extend<Astar.TileHueristic, {}>(
                  (Astar as any).TileHueristic as any,
                  {
                    cost(tile) {
                      return TD2.floors.includes(tile.floor().id)
                        ? TD2.floors.indexOf(tile.floor().id) * 5
                        : 3000;
                    },
                  }
                ),
                (b) =>
                  TD2.floors.includes(b.floor().id) &&
                  (b.solid() == false || b.block() instanceof CoreBlock)
              );
              this.path = new Seq();
              path.each((a) => (this.path as Seq<Tile>).add(a));
              this.pathProgress = 0;
              this.repath = Date.now() + 30000;
            }
            if (this.pathProgress >= this.path.size) return;
            let next = this.path.get(this.pathProgress);
            if (this.vect == undefined) this.vect = new Vec2(0, 0);
            this.unit.movePref(
              this.vect.trns(
                this.unit.angleTo(next.x * 8, next.y * 8),
                this.unit.speed()
              )
            );
            if (this.unit.within(next.x * 8, next.y * 8, 8 * 2))
              this.pathProgress++;
          }
          (this.faceTarget as any)();
        } catch (e) {
          Console.err(e);
        }*/
      },
      retarget() {
        return false;
      },
    });
  },
  buildingIndex: 0,
  liquidIndex: 0,
  worldProcessorTile: Vars.world.tile(0, 0),
  update() {
    for (let tileK in this.tiles) {
      let tile = this.tiles[tileK];
      if (tile == null) return;
      if (tile.build == null) return;
      if (tile.build.update == null) return;
      tile.build.update();
    }
    for (let index in TD2.teams) {
      let team = TD2.teams[index];
      team.update();
    }
  },
  syncLiquid(build, liquid) {
    if (Vars.net.server()) {
      Call.syncVariable(
        this.worldProcessorTile.build,
        this.buildingIndex,
        build
      );
      Call.syncVariable(
        this.worldProcessorTile.build,
        this.liquidIndex,
        liquid
      );
    } else {
      LExecutor.syncVariable(
        this.worldProcessorTile.build,
        this.buildingIndex,
        build
      );
      LExecutor.syncVariable(
        this.worldProcessorTile.build,
        this.liquidIndex,
        liquid
      );
    }
  },
  listUi: Aim.menuUI
    .createUI<TD2_List_UI_Data>()
    .title("升级")
    .content(
      (p, d, u) =>
        "从[" +
        d.block.name +
        "]升级\n" +
        (TD2.teams[p.team().id] == null
          ? "Error Empty Team"
          : TD2.teams[p.team().id].displayInfo())
    )
    .eles((p, v, u) => {
      let team = TD2.teams[p.team().id];
      if (team == null) return;
      for (let i of v.block.children) {
        let b = TD2.blocks[i];
        if (
          b.block.size >
          v.tile.max_size + (v.block.extra == null ? 0 : v.block.extra)
        )
          continue;
        if (b.check != null && !b.check(v.tile)) continue;
        u.button(
          (p, v, u) => {
            return (
              (team.money < b.cost ? "[red]" : "[green]") +
              b.name +
              "\n[yellow]金币:" +
              b.cost
            );
          },
          (p, v, u) => {
            if (team.money >= b.cost) {
              Timer.schedule(() => {
                v.tile.build = b.create(v.tile, p.team());
                team.money -= b.cost;
                team.last_remove += b.cost;
                TD2.mainUi.show(p, { tile: v.tile });
              }, 0.6);
            } else {
              v.noMoney = true;
              TD2.listUi.show(p, v);
            }
          },
          true
        )
          .text((p, v, u) => b.display(p))
          .row();
      }
      if (v.noMoney != null && v.noMoney) {
        u.text("[red]金币不够").row();
      }

      u.button(
        "返回",
        (p, v, u) => {
          TD2.mainUi.show(p, { tile: v.tile });
        },
        true
      );
    }),
  mainUi: Aim.menuUI
    .createUI<TD2_UI_Data>()
    .title("塔防2.0")
    .content(
      (p, s, u) =>
        (TD2.teams[p.team().id] == null
          ? "Error Empty Team"
          : TD2.teams[p.team().id].displayInfo()) +
        "\n" +
        (s.tile.build == null
          ? "ERROR EMPTY BUILD"
          : s.tile.build.block.displayInfo(s.tile, p))
    )

    .eles((p, d, u) => {
      if (d.tile != null && d.tile.build != null) {
        if (d.tile.build.block.block.size <= d.tile.max_size) {
          u.button(
            "升级",
            (p, d, u) => {
              if (d.tile.build == null) return;
              TD2.listUi.show(p, {
                tile: d.tile,
                noMoney: false,
                block: d.tile.build.block,
              });
            },
            true
          );
          u.row();
        }
        if (
          d.tile.build.block != TD2.blocks.air &&
          d.tile.build.block.father != null
        ) {
          u.button(
            "[red]拆除",
            (p, v, u) => {
              let team = TD2.teams[p.team().id];
              v.tile.build = TD2.blocks.air.create(v.tile, p.team());
              let now = v.tile.build.block as TD2_Block<any>;
              let num = 0;
              while (now.father != null) {
                num += now.cost;
                now = TD2.blocks[now.father];
              }
              team.money += num * 0.6;
              team.last_add += num * 0.6;
              TD2.mainUi.show(p, { tile: v.tile });
            },
            true
          )
            .row()
            .button(
              "[red]降级",
              (p, v, u) => {
                Timer.schedule(() => {
                  let team = TD2.teams[p.team().id];
                  let b =
                    TD2.blocks[
                      (v.tile.build as TD2_Build<any>).block.father as string
                    ];
                  v.tile.build = b.create(v.tile, p.team());
                  team.money += v.tile.build.block.cost * 0.6;
                  team.last_add += v.tile.build.block.cost * 0.6;
                  TD2.mainUi.show(p, { tile: v.tile });
                }, 1.2);
              },
              true
            )
            .row();
        }
      }
      u.button("取消", (p, d, u) => {}, true);
    }),
  labels: [],
  unitMoney: {
    dagger: 3,
    mace: 40,
    fortress: 120,
    separator: 600,
    reign: 2000,
    nova: 5,
    pulsar: 30,
    quasar: 200,
    vela: 800,
    corvus: 2500,
    crawler: 4,
    atrax: 60,
    spiroct: 150,
    arkyid: 700,
    toxopid: 2300,
    flare: 8,
    horizon: 40,
    zenith: 130,
    antumbra: 800,
    eclipse: 2700,
    risso: 8,
    minke: 35,
    bryde: 250,
    sei: 900,
    omura: 3200,
    retusa: 8,
    oxynoe: 22,
    cyerce: 350,
    aegires: 1000,
    navanax: 2800,
    stell: 3,
    locus: 35,
    precept: 300,
    vanquish: 850,
    conquer: 2000,
    merui: 10,
    cleroi: 25,
    anthicus: 400,
    tecta: 900,
    collaris: 3000,
    elude: 8,
    avert: 30,
    obviate: 300,
    quell: 800,
    disrupt: 2800,
  },
  waveTeam: Team.get(2),
  applyStarts: "##TD2##",
  tiles: {},
  teams: {},
  unitDamage: {},
  blocks: {},
  init(): void {
    Timer.schedule(
      () => {
        TD2.timerRun();
      },
      1,
      1
    );
    Events.run(EventType.Trigger.update, () => {
      try {
        TD2.update();
      } catch (e) {
        Console.err(e);
      }
    });
    Events.on(EventType.TapEvent, (event) => {
      try {
        TD2.onTapEvent(event);
      } catch (e) {
        Console.err(e);
      }
    });
    Events.on(EventType.UnitDamageEvent, (event) => {
      try {
        TD2.onUnitDamageEvent(event);
      } catch (e) {
        Console.err(e);
      }
    });
    Events.on(EventType.UnitDestroyEvent, (event) => {
      try {
        TD2.onUnitDestoryEvent(event);
      } catch (e) {
        Console.err(e);
      }
    });
    Events.on(EventType.WaveEvent, (event) => {
      try {
        TD2.onWaveEvent();
      } catch (e) {
        Console.err(e);
      }
    });
    Vars.netServer.admins.actionFilters.insert(
      0,
      extend<Administration.ActionFilter, {}>(Administration.ActionFilter, {
        allow(action: Administration.PlayerAction): boolean {
          return TD2.actionFilter(action);
        },
      })
    );
    Vars.content.units().each((ut) => {
      let lastController = ut.aiController;
      ut.aiController = prov(() => {
        if (!TD2.checkMap()) return lastController.get();
        let tAi = TD2.TDAi(ut);
        if (tAi == null) return lastController.get();
        try {
          // @ts-ignore
          tAi.superAi = lastController.get();
        } catch (e) {}
        return tAi;
      });
    });
  },
  actionFilter(action) {
    if (!TD2.checkMap()) return true;
    let types = Administration.ActionType;
    let type = action.type;
    if (type == types.breakBlock) {
      return false;
    }
    if (type == types.placeBlock) {
      return false;
    }

    return true;
  },
  checkMap(): boolean {
    return Vars.state.map.description().startsWith(this.applyStarts);
  },
  initTile(): void {
    let build = this.worldProcessorTile.build;
    if (build == null || build.block != Blocks.worldProcessor) {
      Console.err("ERROR NO WORLD PROCESSOR");
    } else {
      let executor = (build as LogicBlock.LogicBuild).executor;
      let vars = executor.vars;
      TD2.buildingIndex = vars.findIndex((v) => v.name == "build");
      TD2.liquidIndex = vars.findIndex((v) => v.name == "liquid");
      if (TD2.liquidIndex == -1 || TD2.buildingIndex == -1) {
        Console.err("ERROR PROCESSOR");
      }
    }
    Vars.world.tiles.eachTile((t: Tile) => {
      if (t.block() == Blocks.message) {
        this.tiles[Vars.world.tile(t.x, t.y - 1).pos()] = this.tiles[t.pos()] =
          this.createTile(t);
      }
    });
  },
  createBuild<T>(tile: TD2_Tile): TD2_Build<T> {
    return {
      update(): void {},
      team: tile.team,
      block: this.blocks.air,
      x: tile.tile.x,
      y: tile.tile.y,
      addon: undefined,
    };
  },
  createDirllBlock(
    speed: number,
    point: number,
    run?: (block: TD2_Block<TD2_DirllBlcok>) => void,
    children?: Array<TD2_Block<any>>
  ): TD2_Block<TD2_DirllBlcok> {
    let that = this.createBlock<TD2_DirllBlcok>(run, children, (b) => {
      b.addon = { speed: speed, point: point, progress: 0 };
      b.update = () => {
        if (b.addon == null) return;
        let team = TD2.teams[b.team.id];
        let build = Vars.world.tile(b.x, b.y).build;
        let add =
          b.addon.speed *
          team.resourcePoint *
          (build == null ? 1.0 : build.timeScale());
        team.money += add;
        team.last_add += add;
        let tile = TD2.tiles[Vars.world.tile(b.x, b.y).pos()];
        if (b.addon.point != 0) {
          b.addon.progress += build.timeScale() * team.resourcePoint;
          if (b.addon.progress >= b.addon.point) {
            team.point++;
            b.addon.progress = 0;
          }
        }
        tile.label.text =
          "[sky]砖井:" +
          that.name +
          "\n[orange]资源:" +
          Math.round(add * 60) +
          "/s" +
          (b.addon.point == 0
            ? ""
            : "\n[violet]科技点生产:" +
              Math.round(b.addon.progress) +
              "/" +
              Math.round(b.addon.point) +
              "\n速度:+" +
              Math.round(build.timeScale() * team.resourcePoint));
      };
    });
    that.displayInfo;
    that.liquid = null;
    that.ammo = null;
    return that;
  },
  createBlock<T>(
    run?: (block: TD2_Block<T>) => void,
    children?: Array<TD2_Block<any>>,
    createF?: (build: TD2_Build<T>) => void
  ): TD2_Block<T> {
    let that: TD2_Block<T> = {
      name: "none",
      baseName: "none",
      ammo: null,
      liquid: null,
      block: Blocks.air,
      k: 2,
      cost: 0,
      children: children == null ? [] : children.map((b) => b.baseName),
      displayInfo(tile, player): string {
        return (
          this.display(player) +
          (tile.tile.build == null
            ? ""
            : "\n[cyan]时间缩放:" + tile.tile.build.timeScale())
        );
      },
      display(player): string {
        return (
          "[acid][建筑]:[" +
          this.name +
          "]" +
          (this.desc == null ? "" : "\n[orange]简介:" + this.desc) +
          (this.block == null
            ? ""
            : "\n[violet]方块:" + this.block.localizedName) +
          (this.ammo == null ? "" : "\n[sky]弹药:" + this.ammo.localizedName) +
          (this.liquid == null
            ? ""
            : "\n[cyan]液体:" + this.liquid.localizedName)
        );
      },
      create(tile: TD2_Tile, t: Team): TD2_Build<T> {
        let b = TD2.createBuild<T>(tile);
        b.block = this;
        tile.label.text = "[sky][建筑]\n" + b.block.name;
        b.team = t;
        Vars.world.tile(b.x, b.y).setNet(b.block.block, t, 0);
        let bu = Vars.world.tile(b.x, b.y).build;
        Call.effect(Fx.launchPod, b.x * 8, b.y * 8, 0, Color.orange);

        if (this.ammo != null) {
          if (Vars.net.server()) {
            Call.clearItems(bu);
            Call.transferItemTo(null, this.ammo, 5000, b.x * 8, b.y * 8, bu);
          } else {
            InputHandler.clearItems(bu);
            InputHandler.transferItemTo(
              null,
              this.ammo,
              5000,
              b.x * 8,
              b.y * 8,
              bu
            );
          }
        }
        if (this.liquid != null) {
          let u: any = null;
          if (b.block.block.size <= 2) {
            u = UnitTypes.emanate.spawn(b.team, b.x * 8, b.y * 8);
          } else if (b.block.block.size <= 3) {
            u = UnitTypes.quad.spawn(b.team, b.x * 8, b.y * 8);
          } else if (b.block.block.size <= 5) {
            u = UnitTypes.oct.spawn(b.team, b.x * 8, b.y * 8);
          } else {
            return b;
          }
          u.apply(StatusEffects.invincible, 60 * 60 * 60);
          u.apply(StatusEffects.unmoving, 60 * 60 * 60);
          bu.liquids.set(this.liquid, 10000);
          if (this.liquidE != null) bu.liquids.set(this.liquidE, 10000);
          if (Vars.net.server()) {
            Call.pickedBuildPayload(u, bu, true);
            Timer.schedule(() => {
              u.x = b.x * 8;
              u.y = b.y * 8;
              Call.payloadDropped(u, b.x * 8, b.y * 8);
              Timer.schedule(() => {
                u.kill();
              }, 0.2);
            }, 1);
          } else {
            InputHandler.pickedBuildPayload(u, bu, true);
            Timer.schedule(() => {
              u.x = b.x * 8;
              u.y = b.y * 8;
              InputHandler.payloadDropped(u, b.x * 8, b.y * 8);
              Timer.schedule(() => {
                u.kill();
              }, 0.2);
            }, 1);
          }
        }
        if (createF != null) createF(b);
        return b;
      },
    };
    if (run != null) {
      run(that);
    }
    if (children != null) {
      for (let child of children) {
        child.father = that.baseName;
      }
    }
    return that;
  },
  createTile(tile): TD2_Tile {
    let message = (tile.build as MessageBlock.MessageBuild).message.toString();
    let split = message.split("\n");
    let max_size = eval(split[0]);
    if (max_size == null || isNaN(max_size)) max_size = 6;
    let t: TD2_Tile = {
      tile: tile,
      team: tile.build.team,
      max_size: max_size,
      label: WorldLabel.create(),
    };
    t.label.x = tile.x * 8;
    t.label.y = tile.y * 8;
    t.label.fontSize = 2;
    t.label.add();
    this.labels.push(t.label);
    let build = this.blocks.air.create(t, t.team);
    t.build = build;
    return t;
  },
  onTapEvent(event: _TapEvent_): void {
    if (!this.checkMap()) return;
    let p = event.player,
      t = event.tile;
    if (
      t == null ||
      p == null ||
      p.unit() == null ||
      TD2.teams[p.team().id] == null
    )
      return;
    if (!p.unit().within(t.x * 8, t.y * 8, 24 * 8)) return;
    if (
      t.build != null &&
      t.build instanceof CoreBlock.CoreBuild &&
      t.build.team == p.team()
    ) {
      TD2.coreUi.show(p, {
        tile: t.build.tile,
        build: t.build,
        team: TD2.teams[p.team().id],
        index: t.build.tile.pos(),
      });
    }
    let ti = this.tiles[t.pos()];
    if (ti == null || ti.team.id != p.team().id) return;
    this.mainUi.show(p, { tile: ti });
  },
  onUnitDestoryEvent(event: _UnitDestroyEvent_): void {
    if (!this.checkMap()) return;
    let unit = event.unit;
    if (unit == null) return;
    if (unit.team.id != TD2.waveTeam.id) return;
    if (unit.flag != 114514) return;
    let max = 0,
      maxt = -1;
    for (let i in TD2.unitDamage[unit.toString()]) {
      let d = TD2.unitDamage[unit.toString()][i];
      if (d > max) {
        maxt = Number(i);
        max = d;
      }
    }
    if (maxt != -1) {
      if (Vars.net.server()) {
        Call.effect(Fx.shootSmokeSmite, unit.x, unit.y, 0, Color.orange);
        Call.effect(Fx.lightningShoot, unit.x, unit.y, 0, Color.orange);
        Call.effect(Fx.circleColorSpark, unit.x, unit.y, 0, Color.orange);
      } else {
        NetClient.effect(Fx.shootSmokeSmite, unit.x, unit.y, 0, Color.orange);
        NetClient.effect(Fx.lightningShoot, unit.x, unit.y, 0, Color.orange);
        NetClient.effect(Fx.circleColorSpark, unit.x, unit.y, 0, Color.orange);
      }
      let money = TD2.unitMoney[unit.type.toString()];
      money /= 10;
      if (isNaN(money) || money == null) money = 0;
      if (money <= 0) return;
      if (Vars.net.server()) {
        Call.label(
          "Dead[#" + Team.get(maxt).color.toString() + "]+" + money,
          0.3,
          unit.x,
          unit.y
        );
      } else {
        Menus.label(
          "Dead[#" + Team.get(maxt).color.toString() + "]+" + money,
          0.3,
          unit.x,
          unit.y
        );
      }
      let team = TD2.teams[maxt];
      team.money += money * team.resourcePoint * 0.9;
      team.last_add += money * team.resourcePoint * 0.9;
    }
  },
  onUnitDamageEvent(event: _UnitDamageEvent_): void {
    if (!this.checkMap()) return;
    let unit = event.unit,
      bullet = event.bullet;
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
    let money = Math.pow(
      (Math.min(bullet.damage, unit.health) * 1.0) / 80,
      1.5
    );
    if (isNaN(money)) money = 0;
    let fx;
    fx = Fx.hitMeltdown;
    if (bullet.damage >= 100) {
      fx = Fx.payloadReceive;
      Call.effect(Fx.payloadReceive, unit.x, unit.y, 0, Color.orange);
      Call.effect(Fx.mineHuge, unit.x, unit.y, 0, Color.orange);
    }
    if (bullet.damage >= 200) {
      fx = Fx.mineImpact;
      Call.effect(Fx.mineImpact, unit.x, unit.y, 0, Color.orange);
      Call.effect(Fx.teleportOut, unit.x, unit.y, 0, Color.orange);
    }
    for (
      let i = 0;
      i <= Math.max(Math.min(unit.type.hitSize * 0.3, 6), 3);
      i++
    ) {
      let x =
        Math.floor(Math.random() * unit.type.hitSize) - unit.type.hitSize * 0.5;
      let y =
        Math.floor(Math.random() * unit.type.hitSize) - unit.type.hitSize * 0.5;
      Call.effect(fx, x + unit.x, y + unit.y, 0, Color.orange);
    }
    if (money <= 0) return;
    if (money >= 1)
      Call.label(
        "[#" + bullet.team.color.toString() + "]+" + money,
        0.3,
        unit.x,
        unit.y
      );
    let team = TD2.teams[bullet.team.id];
    team.money += money * team.resourcePoint;
    team.last_add += money * team.resourcePoint;
  },
  timerRun(): void {
    if (!TD2.checkMap()) {
      TD2.clear();
      return;
    }

    Groups.player.each((p) => {
      let t = TD2.teams[p.team().id];
      if (t == null || t.money == null) return;
      Call.infoToast(p.con, t.displayInfo(), 1);
    });
    for (let index in TD2.teams) {
      let team = TD2.teams[index];
      team.updateS();
    }
  },
  createTeam(id: number, money: number): TD2_Team {
    let res: TD2_Team = {
      resourcePoint: 1,
      damagePoint: Vars.state.rules.teams.get(Team.get(id))
        .blockDamageMultiplier,
      point: 5,
      money_increase: 0,
      id: id,
      money: money,
      team: Team.get(id),
      last_add: 0,
      last_remove: 0,
      displayInfo(): string {
        return (
          "[#" +
          Team.get(this.id).color.toString() +
          "]队伍:" +
          this.id +
          "\n[orange]当前金币" +
          Math.round(this.money) +
          "\n[acid]收入" +
          Math.round(this.last_add) +
          "/s\n[red]支出" +
          Math.round(this.last_remove) +
          "/s\n" +
          (this.last_add > this.last_remove ? "[acid]净利润" : "[red]净亏损") +
          Math.round(Math.abs(this.last_add - this.last_remove)) +
          "/s\n[violet]可用科技点数:" +
          this.point
        );
      },
      update() {
        let t = (this.money_increase / 60.0 / 20) * this.resourcePoint;
        this.money += t;
        this.last_add += t;
      },
      updateS() {
        Team.get(id)
          .data()
          .cores.each((core) => {
            let index = core.tile.pos();
            this.coreLabels[index].text =
              this.displayInfo() +
              "\n[red]血量:" +
              this.coreHealth[index] +
              "/" +
              core.block.size * core.block.size +
              "\n[sky]点击进入菜单" +
              "\n[orange]资源:" +
              Math.round((core.block.size * core.block.size) / 20) +
              "/s";
            if (this.coreHealth[index] > 0) {
              Units.nearby(
                TD2.waveTeam,
                core.x,
                core.y,
                (core.block.size / 2 + 6) * 8,
                (u) => {
                  if (this.coreHealth[index] <= 0) return;
                  this.coreHealth[index]--;
                  this.coreLabels[index].text =
                    this.displayInfo() +
                    "\n[red]血量:" +
                    this.coreHealth[index] +
                    "/" +
                    core.block.size * core.block.size +
                    "\n[sky]点击进入菜单" +
                    "\n[orange]资源:" +
                    Math.round((core.block.size * core.block.size) / 20) +
                    "/s";
                  if (this.coreHealth[index] <= 0) {
                    this.coreLabels[index].hide();
                    this.coreLabels[index].remove();
                    Call.effect(
                      Fx.scatheExplosion,
                      core.x,
                      core.y,
                      0,
                      Color.orange
                    );
                    this.money_increase -= core.block.size * core.block.size;
                    core.kill();
                  }
                  Call.effect(Fx.unitCapKill, u.x, u.y, 0, Color.orange);
                  u.flag = 0;
                  u.kill();
                }
              );
            }
          });
        this.last_add = 0;
        this.last_remove = 0;
      },
      coreHealth: {},
      coreLabels: {},
      updateCoreLabel() {
        Team.get(id)
          .data()
          .cores.each((core) => {
            let index = core.tile.pos();
            this.coreLabels[index].text =
              this.displayInfo() +
              "\n[red]血量:" +
              this.coreHealth[index] +
              "/" +
              core.block.size * core.block.size;
            this.money_increase += core.block.size * core.block.size;
          });
      },
    };
    Team.get(id)
      .data()
      .cores.each((core) => {
        let index = core.tile.pos();
        let label = WorldLabel.create();
        label.x = core.x;
        label.y = core.y;
        label.fontSize = 2;
        label.add();
        res.coreLabels[index] = label;
        res.coreHealth[index] = core.block.size * core.block.size;
        TD2.labels.push(label);
      });
    res.updateCoreLabel();
    this.teams[id] = res;
    return res;
  },
  clear(): void {
    for (let label of TD2.labels) {
      if (label != undefined) {
        label.hide();
        label.remove();
      }
    }
    TD2.labels = [];
    TD2.tiles = {};
  },
};
TD2.blocks.air = TD2.createBlock<{}>(
  (block) => {
    block.name = "空气";
    block.baseName = "air";
  },
  [
    (TD2.blocks.duo = TD2.createBlock<{}>(
      (block) => {
        block.name = "基础双管";
        block.baseName = "duo";
        block.cost = 5;
        block.block = Blocks.duo;
        block.ammo = Items.copper;
        block.liquid = Liquids.cryofluid;
      },
      [
        (TD2.blocks.duo1 = TD2.createBlock<{}>(
          (block) => {
            block.name = "速度型双管";
            block.baseName = "duo1";
            block.block = Blocks.duo;
            block.cost = 10;
            block.ammo = Items.silicon;
            block.liquid = Liquids.cryofluid;
          },
          [
            (TD2.blocks.salvo = TD2.createBlock<{}>(
              (block) => {
                block.name = "基础齐射";
                block.baseName = "salvo";
                block.block = Blocks.salvo;
                block.cost = 35;
                block.ammo = Items.copper;
                block.liquid = Liquids.water;
              },
              [
                (TD2.blocks.salvo1 = TD2.createBlock<{}>(
                  (block) => {
                    block.name = "伤害齐射";
                    block.baseName = "salvo1";
                    block.block = Blocks.salvo;
                    block.cost = 80;
                    block.ammo = Items.thorium;
                    block.liquid = Liquids.water;
                  },
                  [
                    (TD2.blocks.salvo11 = TD2.createBlock<{}>(
                      (block) => {
                        block.name = "终极齐射";
                        block.baseName = "salvo11";
                        block.block = Blocks.salvo;
                        block.cost = 200;
                        block.ammo = Items.thorium;
                        block.liquid = Liquids.cryofluid;
                      },
                      [
                        (TD2.blocks.spectre1 = TD2.createBlock<{}>((block) => {
                          block.name = "钍幽灵";
                          block.baseName = "spectre1";
                          block.block = Blocks.spectre;
                          block.cost = 4000;
                          block.ammo = Items.thorium;
                          block.liquid = Liquids.cryofluid;
                        })),
                      ]
                    )),
                  ]
                )),
                (TD2.blocks.salvo2 = TD2.createBlock<{}>(
                  (block) => {
                    block.name = "速度齐射";
                    block.baseName = "salvo2";
                    block.block = Blocks.salvo;
                    block.cost = 50;
                    block.ammo = Items.silicon;
                    block.liquid = Liquids.cryofluid;
                  },
                  [
                    (TD2.blocks.spectre2 = TD2.createBlock<{}>((block) => {
                      block.name = "石墨幽灵";
                      block.baseName = "spectre2";
                      block.block = Blocks.spectre;
                      block.cost = 2000;
                      block.ammo = Items.graphite;
                      block.liquid = Liquids.cryofluid;
                    })),
                    (TD2.blocks.cyclone = TD2.createBlock<{}>(
                      (block) => {
                        block.name = "基础气旋";
                        block.baseName = "cyclone";
                        block.block = Blocks.cyclone;
                        block.cost = 500;
                        block.ammo = Items.plastanium;
                        block.liquid = Liquids.cryofluid;
                      },
                      [
                        (TD2.blocks.cycloneX = TD2.createBlock<{}>(
                          (block) => {
                            block.name = "合金气旋";
                            block.baseName = "cycloneX";
                            block.block = Blocks.cyclone;
                            block.cost = 2000;
                            block.ammo = Items.surgeAlloy;
                            block.liquid = Liquids.cryofluid;
                          },
                          [
                            (TD2.blocks.smite = TD2.createBlock<{}>((block) => {
                              block.name = "天谴";
                              block.baseName = "smite";
                              block.block = Blocks.smite;
                              block.cost = 10000;
                              block.ammo = Items.surgeAlloy;
                              block.liquid = Liquids.water;
                            }, [])),
                          ]
                        )),
                      ]
                    )),
                    (TD2.blocks.swarmer1 = TD2.createBlock<{}>((block) => {
                      block.name = "合金蜂群";
                      block.baseName = "swarmer1";
                      block.block = Blocks.swarmer;
                      block.cost = 700;
                      block.ammo = Items.surgeAlloy;
                      block.liquid = Liquids.cryofluid;
                    })),
                  ]
                )),
                (TD2.blocks.salvo3 = TD2.createBlock<{}>(
                  (block) => {
                    block.name = "燃烧齐射";
                    block.baseName = "salvo3";
                    block.block = Blocks.salvo;
                    block.cost = 70;
                    block.ammo = Items.pyratite;
                    block.liquid = Liquids.water;
                  },
                  [
                    (TD2.blocks.salvo31 = TD2.createBlock<{}>(
                      (block) => {
                        block.name = "速燃齐射";
                        block.baseName = "salvo31";
                        block.block = Blocks.salvo;
                        block.cost = 70;
                        block.ammo = Items.copper;
                        block.liquid = Liquids.cryofluid;
                      },
                      [
                        (TD2.blocks.swarmer = TD2.createBlock<{}>(
                          (block) => {
                            block.name = "基础蜂群";
                            block.baseName = "swarmer";
                            block.block = Blocks.swarmer;
                            block.cost = 700;
                            block.ammo = Items.pyratite;
                            block.liquid = Liquids.cryofluid;
                          },
                          [
                            (TD2.blocks.swarmer2 = TD2.createBlock<{}>(
                              (block) => {
                                block.name = "爆炸蜂群";
                                block.baseName = "swarmer2";
                                block.block = Blocks.swarmer;
                                block.cost = 700;
                                block.ammo = Items.blastCompound;
                                block.liquid = Liquids.cryofluid;
                              }
                            )),
                          ]
                        )),
                        (TD2.blocks.spectre3 = TD2.createBlock<{}>((block) => {
                          block.name = "硫幽灵";
                          block.baseName = "spectre3";
                          block.block = Blocks.spectre;
                          block.cost = 1000;
                          block.ammo = Items.pyratite;
                          block.liquid = Liquids.cryofluid;
                        })),
                        (TD2.blocks.cyclone1 = TD2.createBlock<{}>((block) => {
                          block.name = "爆炸气旋";
                          block.baseName = "cyclone1";
                          block.block = Blocks.cyclone;
                          block.cost = 1200;
                          block.ammo = Items.blastCompound;
                          block.liquid = Liquids.cryofluid;
                        })),
                      ]
                    )),
                  ]
                )),
              ]
            )),
          ]
        )),
        (TD2.blocks.duo2 = TD2.createBlock<{}>(
          (block) => {
            block.name = "伤害型双管";
            block.baseName = "duo2";
            block.block = Blocks.duo;
            block.cost = 20;
            block.ammo = Items.graphite;
            block.liquid = Liquids.cryofluid;
          },
          [
            (TD2.blocks.breach = TD2.createBlock<{}>(
              (block) => {
                block.name = "基础撕裂";
                block.baseName = "breach";
                block.block = Blocks.breach;
                block.cost = 40;
                block.ammo = Items.beryllium;
                block.liquid = Liquids.water;
              },
              [
                (TD2.blocks.breach1 = TD2.createBlock<{}>((block) => {
                  block.name = "终极撕裂";
                  block.baseName = "breach1";
                  block.block = Blocks.breach;
                  block.cost = 80;
                  block.ammo = Items.tungsten;
                  block.liquid = Liquids.water;
                }, [])),
              ]
            )),
            (TD2.blocks.ripple = TD2.createBlock<{}>(
              (block) => {
                block.name = "基础浪涌";
                block.baseName = "ripple";
                block.block = Blocks.ripple;
                block.cost = 40;
                block.ammo = Items.graphite;
                block.liquid = Liquids.water;
              },
              [
                (TD2.blocks.titan = TD2.createBlock<{}>(
                  (block) => {
                    block.name = "基础泰坦";
                    block.baseName = "titan";
                    block.block = Blocks.titan;
                    block.cost = 80;
                    block.ammo = Items.thorium;
                    block.liquid = null;
                  },
                  [
                    (TD2.blocks.titan1 = TD2.createBlock<{}>(
                      (block) => {
                        block.name = "终极泰坦";
                        block.baseName = "titan1";
                        block.block = Blocks.titan;
                        block.cost = 100;
                        block.ammo = Items.thorium;
                        block.liquid = Liquids.water;
                      },
                      [
                        (TD2.blocks.scathe = TD2.createBlock<{}>((block) => {
                          block.name = "创伤";
                          block.baseName = "breach";
                          block.block = Blocks.scathe;
                          block.cost = 3000;
                          block.ammo = Items.carbide;
                          block.liquid = Liquids.water;
                        }, [])),
                      ]
                    )),
                  ]
                )),
                (TD2.blocks.ripple1 = TD2.createBlock<{}>(
                  (block) => {
                    block.name = "基础塑钢浪涌";
                    block.baseName = "ripple1";
                    block.block = Blocks.ripple;
                    block.cost = 100;
                    block.ammo = Items.plastanium;
                    block.liquid = Liquids.water;
                  },
                  [
                    (TD2.blocks.ripple11 = TD2.createBlock<{}>((block) => {
                      block.name = "终极塑钢浪涌";
                      block.baseName = "ripple11";
                      block.block = Blocks.ripple;
                      block.cost = 80;
                      block.ammo = Items.plastanium;
                      block.liquid = Liquids.cryofluid;
                    }, [])),
                  ]
                )),
                (TD2.blocks.ripple2 = TD2.createBlock<{}>(
                  (block) => {
                    block.name = "硫浪涌";
                    block.baseName = "ripple2";
                    block.block = Blocks.ripple;
                    block.cost = 80;
                    block.ammo = Items.pyratite;
                    block.liquid = Liquids.water;
                  },
                  [
                    (TD2.blocks.ripple21 = TD2.createBlock<{}>((block) => {
                      block.name = "爆炸浪涌";
                      block.baseName = "ripple21";
                      block.block = Blocks.ripple;
                      block.cost = 120;
                      block.ammo = Items.blastCompound;
                      block.liquid = Liquids.cryofluid;
                    }, [])),
                  ]
                )),
              ]
            )),
            (TD2.blocks.scorch = TD2.createBlock<{}>(
              (block) => {
                block.name = "基础火焰";
                block.baseName = "scorch";
                block.cost = 50;
                block.block = Blocks.scorch;
                block.ammo = Items.coal;
                block.liquid = null;
              },
              [
                (TD2.blocks.scorch1 = TD2.createBlock<{}>(
                  (block) => {
                    block.name = "进阶火焰";
                    block.baseName = "scorch1";
                    block.cost = 80;
                    block.block = Blocks.scorch;
                    block.ammo = Items.coal;
                    block.liquid = Liquids.cryofluid;
                  },
                  [
                    (TD2.blocks.scorch2 = TD2.createBlock<{}>((block) => {
                      block.name = "终极火焰";
                      block.baseName = "scorch2";
                      block.cost = 300;
                      block.block = Blocks.scorch;
                      block.ammo = Items.pyratite;
                      block.liquid = Liquids.cryofluid;
                    }, [])),
                    (TD2.blocks.fuse = TD2.createBlock<{}>(
                      (block) => {
                        block.name = "基础雷光";
                        block.baseName = "fuse";
                        block.block = Blocks.fuse;
                        block.cost = 250;
                        block.ammo = Items.titanium;
                        block.liquid = Liquids.water;
                      },
                      [
                        (TD2.blocks.fuse1 = TD2.createBlock<{}>((block) => {
                          block.name = "终极雷光";
                          block.baseName = "fuse1";
                          block.block = Blocks.fuse;
                          block.cost = 500;
                          block.ammo = Items.thorium;
                          block.liquid = Liquids.cryofluid;
                        }, [])),
                      ]
                    )),
                  ]
                )),
              ]
            )),
          ]
        )),
      ]
    )),
    (TD2.blocks.wave = TD2.createBlock<{}>(
      (block) => {
        block.name = "基础波浪";
        block.baseName = "wave";
        block.block = Blocks.wave;
        block.cost = 10;
        block.ammo = null;
        block.liquid = Liquids.water;
      },
      [
        (TD2.blocks.sublimate = TD2.createBlock<{}>(
          (block) => {
            block.name = "基础升华";
            block.baseName = "sublimate";
            block.block = Blocks.sublimate;
            block.cost = 200;
            block.ammo = null;
            block.liquid = Liquids.ozone;
          },
          [
            (TD2.blocks.sublimate1 = TD2.createBlock<{}>((block) => {
              block.name = "终极升华";
              block.baseName = "sublimate1";
              block.block = Blocks.sublimate;
              block.cost = 700;
              block.ammo = null;
              block.liquid = Liquids.cyanogen;
            }, [])),
          ]
        )),
        (TD2.blocks.tsunami = TD2.createBlock<{}>((block) => {
          block.name = "海啸";
          block.baseName = "tsunami";
          block.block = Blocks.tsunami;
          block.cost = 100;
          block.ammo = null;
          block.liquid = Liquids.water;
        }, [])),
        (TD2.blocks.wave1 = TD2.createBlock<{}>(
          (block) => {
            block.name = "熔岩波浪";
            block.baseName = "wave1";
            block.block = Blocks.wave;
            block.cost = 50;
            block.ammo = null;
            block.liquid = Liquids.slag;
          },
          [
            (TD2.blocks.tsunami1 = TD2.createBlock<{}>((block) => {
              block.name = "熔岩海啸";
              block.baseName = "tsunami1";
              block.block = Blocks.tsunami;
              block.cost = 100;
              block.ammo = null;
              block.liquid = Liquids.slag;
            }, [])),
          ]
        )),
        (TD2.blocks.wave2 = TD2.createBlock<{}>(
          (block) => {
            block.name = "石油波浪";
            block.baseName = "wave2";
            block.block = Blocks.wave;
            block.cost = 50;
            block.ammo = null;
            block.liquid = Liquids.oil;
          },
          [
            (TD2.blocks.tsunami2 = TD2.createBlock<{}>((block) => {
              block.name = "石油海啸";
              block.baseName = "tsunami2";
              block.block = Blocks.tsunami;
              block.cost = 100;
              block.ammo = null;
              block.liquid = Liquids.oil;
            }, [])),
          ]
        )),
        (TD2.blocks.wave3 = TD2.createBlock<{}>(
          (block) => {
            block.name = "冷却波浪";
            block.baseName = "wave3";
            block.block = Blocks.wave;
            block.cost = 50;
            block.ammo = null;
            block.liquid = Liquids.cryofluid;
          },
          [
            (TD2.blocks.tsunami3 = TD2.createBlock<{}>((block) => {
              block.name = "冷却海啸";
              block.baseName = "tsunami3";
              block.block = Blocks.tsunami;
              block.cost = 100;
              block.ammo = null;
              block.liquid = Liquids.cryofluid;
            }, [])),
          ]
        )),
      ]
    )),
    (TD2.blocks.arc = TD2.createBlock<{}>(
      (block) => {
        block.name = "基础电弧";
        block.baseName = "arc";
        block.block = Blocks.arc;
        block.cost = 20;
        block.ammo = null;
        block.liquid = null;
      },
      [
        (TD2.blocks.arc1 = TD2.createBlock<{}>((block) => {
          block.name = "高速电弧";
          block.baseName = "arc1";
          block.block = Blocks.arc;
          block.cost = 40;
          block.ammo = null;
          block.liquid = Liquids.cryofluid;
        })),
        (TD2.blocks.lancer = TD2.createBlock<{}>(
          (block) => {
            block.name = "基础蓝瑟";
            block.baseName = "lancer";
            block.block = Blocks.lancer;
            block.cost = 80;
            block.ammo = null;
            block.liquid = null;
          },
          [
            (TD2.blocks.lancer1 = TD2.createBlock<{}>(
              (block) => {
                block.name = "高速蓝瑟";
                block.baseName = "lancer1";
                block.block = Blocks.lancer;
                block.cost = 100;
                block.ammo = null;
                block.liquid = Liquids.cryofluid;
              },
              [
                (TD2.blocks.meltdown = TD2.createBlock<{}>((block) => {
                  block.name = "熔毁";
                  block.baseName = "meltdown";
                  block.block = Blocks.meltdown;
                  block.cost = 5000;
                  block.ammo = null;
                  block.liquid = Liquids.cryofluid;
                }, [])),
                (TD2.blocks.afflict = TD2.createBlock<{}>(
                  (block) => {
                    block.name = "劫难";
                    block.baseName = "afflict";
                    block.block = Blocks.afflict;
                    block.cost = 6000;
                    block.ammo = null;
                    block.liquid = null;
                    block.extra = 1;
                  },
                  [
                    (TD2.blocks.malign = TD2.createBlock<{}>(
                      (block) => {
                        block.name = "魔灵";
                        block.baseName = "malign";
                        block.block = Blocks.malign;
                        block.cost = 15000;
                        block.ammo = null;
                        block.liquid = null;
                        block.extra = 1;
                      },
                      [],
                      (bu) => {
                        let tile = Vars.world.tile(
                          bu.x,
                          bu.y - Math.ceil(bu.block.block.size / 2)
                        );
                        tile.setNet(Blocks.heatSource, bu.team, 1);
                      }
                    )),
                  ],
                  (bu) => {
                    let tile = Vars.world.tile(
                      bu.x,
                      bu.y - Math.ceil(bu.block.block.size / 2)
                    );
                    tile.setNet(Blocks.heatSource, bu.team, 1);
                  }
                )),
              ]
            )),
            (TD2.blocks.foreshadow = TD2.createBlock<{}>((block) => {
              block.name = "厄兆";
              block.baseName = "foreshadow";
              block.block = Blocks.foreshadow;
              block.cost = 2000;
              block.ammo = Items.surgeAlloy;
              block.liquid = Liquids.cryofluid;
            }, [])),
          ]
        )),
      ]
    )),
    (TD2.blocks.steamGenerator = TD2.createBlock<{}>(
      (block) => {
        block.name = "涡轮发电机";
        block.baseName = "steamGenerator";
        block.block = Blocks.steamGenerator;
        block.cost = 50;
        block.ammo = Items.coal;
        block.liquid = Liquids.water;
      },
      [
        (TD2.blocks.chemicalCombustionChamber = TD2.createBlock<{}>(
          (block) => {
            block.name = "化学燃烧室";
            block.baseName = "chemicalCombustionChamber";
            block.block = Blocks.chemicalCombustionChamber;
            block.cost = 100;
            block.ammo = null;
            block.liquid = Liquids.ozone;
            block.liquidE = Liquids.arkycite;
          },
          [
            (TD2.blocks.pyrolysisGenerator = TD2.createBlock<{}>(
              (block) => {
                block.name = "热解发生器";
                block.baseName = "pyrolysisGenerator";
                block.block = Blocks.pyrolysisGenerator;
                block.cost = 150;
                block.ammo = null;
                block.liquid = Liquids.slag;
                block.liquidE = Liquids.arkycite;
              },
              [
                (TD2.blocks.fluxReactor = TD2.createBlock<{}>(
                  (block) => {
                    block.name = "通量反应堆";
                    block.baseName = "fluxReactor";
                    block.block = Blocks.fluxReactor;
                    block.cost = 2000;
                    block.ammo = null;
                    block.liquid = Liquids.cyanogen;
                    block.extra = 1;
                  },
                  [],
                  (bu) => {
                    let tile = Vars.world.tile(
                      bu.x,
                      bu.y - Math.ceil(bu.block.block.size / 2)
                    );
                    tile.setNet(Blocks.heatSource, bu.team, 1);
                  }
                )),
              ]
            )),
          ]
        )),
        (TD2.blocks.steamGenerator1 = TD2.createBlock<{}>(
          (block) => {
            block.name = "进阶涡轮发电机";
            block.baseName = "steamGenerator1";
            block.block = Blocks.steamGenerator;
            block.cost = 60;
            block.ammo = Items.pyratite;
            block.liquid = Liquids.water;
          },
          [
            (TD2.blocks.differentialGenerator = TD2.createBlock<{}>((block) => {
              block.name = "温差发电机";
              block.baseName = "differentialGenerator";
              block.block = Blocks.differentialGenerator;
              block.cost = 200;
              block.ammo = Items.pyratite;
              block.liquid = Liquids.cryofluid;
            }, [])),
          ]
        )),
        (TD2.blocks.rtgGenerator = TD2.createBlock<{}>(
          (block) => {
            block.name = "终极RTG发电机 ";
            block.baseName = "rtgGenerator";
            block.block = Blocks.rtgGenerator;
            block.cost = 60;
            block.ammo = Items.fissileMatter;
            block.liquid = null;
          },
          [
            (TD2.blocks.thoriumReactor = TD2.createBlock<{}>(
              (block) => {
                block.name = "钍反应堆";
                block.baseName = "thoriumReactor";
                block.block = Blocks.thoriumReactor;
                block.cost = 300;
                block.ammo = null;
                block.liquid = Liquids.cryofluid;
              },
              [
                (TD2.blocks.impactReactor = TD2.createBlock<{}>(
                  (block) => {
                    block.name = "冲击反应堆";
                    block.baseName = "impactReactor";
                    block.block = Blocks.impactReactor;
                    block.cost = 2500;
                    block.ammo = null;
                    block.liquid = Liquids.cryofluid;
                  },
                  [],
                  (bu) => {
                    bu.update = () => {
                      let build = Vars.world.tile(bu.x, bu.y).build;
                      if (build == null) return;
                      if (build.items.get(Items.blastCompound) <= 30) {
                        Call.transferItemTo(
                          null,
                          Items.blastCompound,
                          30,
                          build.x,
                          build.y,
                          build
                        );
                      }
                    };
                  }
                )),
              ],
              (bu) => {
                bu.update = () => {
                  let build = Vars.world.tile(bu.x, bu.y).build;
                  if (build == null) return;
                  if (build.items.get(Items.thorium) <= 30) {
                    Call.transferItemTo(
                      null,
                      Items.thorium,
                      30,
                      build.x,
                      build.y,
                      build
                    );
                  }
                };
              }
            )),
          ]
        )),
      ]
    )),
    (TD2.blocks.thermalGenerator = TD2.createBlock<{}>((block) => {
      block.name = "地热";
      block.baseName = "thermalGenerator";
      block.block = Blocks.thermalGenerator;
      block.cost = 20;
      block.ammo = null;
      block.liquid = null;
      block.check = (tile) =>
        (Blocks.thermalGenerator as any).canPlaceOn(
          tile.tile,
          Team.get(tile.team.id),
          0
        );
    }, [])),
    (TD2.blocks.overdriveProjector = TD2.createBlock<{}>(
      (block) => {
        block.name = "基础超速";
        block.baseName = "overdriveProjector";
        block.block = Blocks.overdriveProjector;
        block.cost = 50;
        block.ammo = null;
        block.liquid = null;
      },
      [
        (TD2.blocks.overdriveProjector1 = TD2.createBlock<{}>(
          (block) => {
            block.name = "进阶超速";
            block.baseName = "overdriveProjector1";
            block.block = Blocks.overdriveProjector;
            block.cost = 200;
            block.ammo = Items.phaseFabric;
            block.liquid = null;
          },
          [
            (TD2.blocks.overdriveDome = TD2.createBlock<{}>(
              (block) => {
                block.name = "终极超速";
                block.baseName = "overdriveDome";
                block.block = Blocks.overdriveDome;
                block.cost = 1200;
                block.ammo = Items.phaseFabric;
                block.liquid = null;
              },
              [],
              (bu) => {
                let build = Vars.world.tile(bu.x, bu.y).build;
                if (build == null) return;
                Call.transferItemTo(
                  null,
                  Items.silicon,
                  5000,
                  build.x,
                  build.y,
                  build
                );
              }
            )),
          ]
        )),
      ]
    )),
    (TD2.blocks.baseDirll = TD2.createDirllBlock(
      4 / 60,
      0,
      (block) => {
        block.name = "基础砖井";
        block.baseName = "baseDirll";
        block.block = Blocks.mendProjector;
        block.cost = 30;
      },
      [
        (TD2.blocks.advancedDirll = TD2.createDirllBlock(
          12 / 60 / 30,
          0,
          (block) => {
            block.name = "进阶砖井";
            block.baseName = "advancedDirll";
            block.block = Blocks.forceProjector;
            block.cost = 150;
          },
          [
            (TD2.blocks.finalDirll = TD2.createDirllBlock(
              45 / 60 / 30,
              0,
              (block) => {
                block.name = "终极砖井";
                block.baseName = "finalDirll";
                block.block = Blocks.forceProjector;
                block.cost = 500;
              },
              []
            )),
            (TD2.blocks.sciDirll = TD2.createDirllBlock(
              12 / 60 / 30,
              4 * 60 * 60,
              (block) => {
                block.name = "科研砖井";
                block.baseName = "sciDirll";
                block.block = Blocks.forceProjector;
                block.cost = 1000;
              },
              []
            )),
          ]
        )),
      ]
    )),
  ]
);

TD2.createTeam(1, 200);
TD2.initTile();
try {
  // @ts-ignore
  TD2_Load.w = 0;
} catch (_) {
  var TD2_Load = {};
  TD2.init();
}
