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
  displayInfo: (player: Player) => string;
}
interface TD2_Block<T> {
  cost: number;
  baseName: string;
  name: string;
  desc?: string;
  ammo: null | Item;
  liquid: null | Liquid;
  block: Block;
  create: (tile: TD2_Tile, t: Team) => TD2_Build<T>;
  children: Array<string>;
  father?: string;
  k: number;
  displayInfo: (tile: TD2_Tile, player: Player) => string;
  display: (player: Player) => string;
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
try {
  // @ts-ignore
  TD2.clear();
} catch (_) {}
interface TD2_Type {
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
  clear: () => void;
  createTeam: (id: number, money: number) => TD2_Team;
  checkMap: () => boolean;
  createTile: (tile: Tile) => TD2_Tile;
  createBlock: <T>(
    run?: (block: TD2_Block<T>) => void,
    children?: Array<TD2_Block<any>>
  ) => TD2_Block<T>;
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
  },
  syncLiquid(build, liquid) {
    LExecutor.syncVariable(
      this.worldProcessorTile.build,
      this.liquidIndex,
      liquid
    );
    LExecutor.syncVariable(
      this.worldProcessorTile.build,
      this.buildingIndex,
      build
    );
    Call.syncVariable(this.worldProcessorTile.build, this.buildingIndex, build);
    Call.syncVariable(this.worldProcessorTile.build, this.liquidIndex, liquid);
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
          : TD2.teams[p.team().id].displayInfo(p))
    )
    .eles((p, v, u) => {
      let team = TD2.teams[p.team().id];
      if (team == null) return;
      for (let i of v.block.children) {
        let b = TD2.blocks[i];
        if (b.block.size > v.tile.max_size) continue;
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
                let w = (v.tile.build = b.create(v.tile, p.team()));
                TD2.mainUi.show(p, { tile: v.tile });
                team.money -= b.cost;
              }, 0.15);
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
          : TD2.teams[p.team().id].displayInfo(p)) +
        "\n" +
        (s.tile.build == null
          ? "ERROR EMPTY BUILD"
          : s.tile.build.block.displayInfo(s.tile, p))
    )

    .eles((p, d, u) => {
      if (d.tile != null && d.tile.build != null) {
        if (d.tile.build.block.block.size < d.tile.max_size) {
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
        if (d.tile.build.block != TD2.blocks.air) {
          u.button("[red]拆除", (p, d, u) => {}, false)
            .row()
            .button("[red]降级", (p, d, u) => {}, false)
            .row();
        }
      }
      u.button("取消", (p, d, u) => {}, true);
    }),
  labels: [],
  unitMoney: {
    dagger: 3,
    crawler: 1,
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
    Vars.netServer.admins.actionFilters.insert(
      0,
      extend<Administration.ActionFilter, {}>(Administration.ActionFilter, {
        allow(action: Administration.PlayerAction): boolean {
          return TD2.actionFilter(action);
        },
      })
    );
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
    if (type == types.configure) {
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
  createBlock<T>(
    run?: (block: TD2_Block<T>) => void,
    children?: Array<TD2_Block<any>>
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
            : "\n时间缩放:" + tile.tile.build.timeScale())
        );
      },
      display(player): string {
        return (
          "[建筑]:[" +
          this.name +
          "]" +
          (this.desc == null ? "" : "\n简介:" + this.desc) +
          (this.block == null ? "" : "\n方块:" + this.block.localizedName) +
          (this.ammo == null ? "" : "\n弹药:" + this.ammo.localizedName) +
          (this.liquid == null ? "" : "\n液体:" + this.liquid.localizedName)
        );
      },
      create(tile: TD2_Tile, t: Team): TD2_Build<T> {
        let b = TD2.createBuild<T>(tile);
        b.block = this;
        tile.label.text = "[sky][建筑]\n" + b.block.name;
        b.team = t;
        Vars.world.tile(b.x, b.y).setNet(b.block.block, t, 0);
        let bu = Vars.world.tile(b.x, b.y).build;
        if (this.ammo != null) {
          Call.transferItemTo(null, this.ammo, 10000, b.x * 8, b.y * 8, bu);
        }
        if (this.liquid != null) {
          let u = null;
          if (b.block.block.size <= 2) {
            u = UnitTypes.emanate.spawn(b.team, b.x * 8, b.y * 8);
          } else if (b.block.block.size <= 3) {
            u = UnitTypes.quad.spawn(b.team, b.x * 8, b.y * 8);
          } else if (b.block.block.size <= 5) {
            u = UnitTypes.oct.spawn(b.team, b.x * 8, b.y * 8);
          } else {
            return b;
          }
          bu.liquids.set(this.liquid, 10000);
          Call.pickedBuildPayload(u, bu, true);
          Timer.schedule(() => {
            Call.payloadDropped(u, u.x, u.y);
            u.kill();
          }, 0.15);
        }
        return b;
      },
    };
    if (run != null) {
      run(that);
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
    if (t == null || p == null || p.unit() == null) return;
    if (!p.unit().within(t.x * 8, t.y * 8, 24 * 8)) return;
    let ti = this.tiles[t.pos()];
    if (ti == null || ti.team.id != p.team().id) return;
    this.mainUi.show(p, { tile: ti });
  },
  onUnitDestoryEvent(event: _UnitDestroyEvent_): void {
    if (!this.checkMap()) return;
    let unit = event.unit;
    if (unit.team.id != TD2.waveTeam.id) return;
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
      Call.effect(Fx.shootSmokeSmite, unit.x, unit.y, 0, Color.orange);
      let money = TD2.unitMoney[unit.type.toString()];
      if (isNaN(money) || money == null) money = 0;
      if (money <= 0) return;
      Call.label(
        "Dead[#" + Team.get(maxt).color.toString() + "]+" + money,
        0.3,
        unit.x,
        unit.y
      );
      TD2.teams[maxt].money += money;
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
      (Math.min(bullet.damage, unit.health) * 1.0) / 200,
      1.3
    );
    if (isNaN(money)) money = 0;
    let fx;
    fx = Fx.hitMeltdown;
    if (bullet.damage >= 100) {
      fx = Fx.payloadReceive;
      Call.effect(Fx.payloadReceive, unit.x, unit.y, 0, Color.orange);
    }
    if (bullet.damage >= 200) {
      fx = Fx.mineImpact;
      Call.effect(Fx.mineImpact, unit.x, unit.y, 0, Color.orange);
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
    TD2.teams[bullet.team.id].money += money;
  },
  timerRun(): void {
    if (!this.checkMap()) {
      this.clear();
      return;
    }
    Groups.player.each((p) => {
      let t = this.teams[p.team().id];
      if (t == null || t.money == null) return;
      Call.infoToast(p.con, t.displayInfo(p), 1);
    });
  },
  createTeam(id: number, money: number): TD2_Team {
    let res: TD2_Team = {
      id: id,
      money: money,
      team: Team.get(id),
      displayInfo(player): string {
        return "[orange]当前金币" + this.money;
      },
    };
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
                          block.cost = 1000;
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
                      block.cost = 500;
                      block.ammo = Items.graphite;
                      block.liquid = Liquids.cryofluid;
                    })),
                    (TD2.blocks.cyclone = TD2.createBlock<{}>(
                      (block) => {
                        block.name = "基础气旋";
                        block.baseName = "cyclone";
                        block.block = Blocks.cyclone;
                        block.cost = 300;
                        block.ammo = Items.plastanium;
                        block.liquid = Liquids.cryofluid;
                      },
                      [
                        (TD2.blocks.cyclone = TD2.createBlock<{}>(
                          (block) => {
                            block.name = "合金气旋";
                            block.baseName = "cyclone";
                            block.block = Blocks.cyclone;
                            block.cost = 1500;
                            block.ammo = Items.surgeAlloy;
                            block.liquid = Liquids.cryofluid;
                          },
                          [
                            (TD2.blocks.smite = TD2.createBlock<{}>((block) => {
                              block.name = "天谴";
                              block.baseName = "smite";
                              block.block = Blocks.smite;
                              block.cost = 3000;
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
                            block.cost = 350;
                            block.ammo = Items.pyratite;
                            block.liquid = Liquids.cryofluid;
                          },
                          [
                            (TD2.blocks.swarmer2 = TD2.createBlock<{}>(
                              (block) => {
                                block.name = "爆炸蜂群";
                                block.baseName = "swarmer2";
                                block.block = Blocks.swarmer;
                                block.cost = 500;
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
                          block.cost = 600;
                          block.ammo = Items.pyratite;
                          block.liquid = Liquids.cryofluid;
                        })),
                        (TD2.blocks.cyclone1 = TD2.createBlock<{}>((block) => {
                          block.name = "爆炸气旋";
                          block.baseName = "cyclone1";
                          block.block = Blocks.cyclone;
                          block.cost = 400;
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
                (TD2.blocks.breach = TD2.createBlock<{}>((block) => {
                  block.name = "终极撕裂";
                  block.baseName = "breach";
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
                        block.cost = 80;
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
                        block.cost = 150;
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
            block.cost = 100;
            block.ammo = null;
            block.liquid = Liquids.ozone;
          },
          [
            (TD2.blocks.sublimate1 = TD2.createBlock<{}>((block) => {
              block.name = "终极升华";
              block.baseName = "sublimate1";
              block.block = Blocks.sublimate;
              block.cost = 300;
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
            (TD2.blocks.lancer = TD2.createBlock<{}>(
              (block) => {
                block.name = "高速蓝瑟";
                block.baseName = "lancer";
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
                  block.cost = 1000;
                  block.ammo = null;
                  block.liquid = Liquids.cryofluid;
                }, [])),
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
