
import { Blocks ,Block,Events, UnitTypes,EventType, Vars, Call, Team,Fx,Color, AIController, extend, Vec2, BuildPlan, Timer, WorldLabel, Item, Items, Unit, Groups, _TapEvent_, _UnitDestroyEvent_, _UnitDamageEvent_, Effect, StatusEffect, Units, StatusEffects, UnitType} from '../../Apis/Mdt';
import {Aim,Console,_ui_} from '../../Apis/Aim';
import { resolveTypeReferenceDirective } from 'typescript';

interface _Build_<T>{
    x:number;
    y:number;
    block:_Block_<T>;
    label:WorldLabel;
    addon:T,
    team:number,
    update:()=>void
}
interface  _Team_{
    id:number;
    money:number;
    build:Array<_Build_<any>>
}
interface _Block_<T>{
    cost:number;
    name:string,
    arrmo:null|Item,
    block:Block,
    creat:(x:number,y:number,t:Team,father?:_Build_<T>)=>_Build_<T>
    children:Array<string>,
    k:number
}
interface data{
    place:number,
    build:_Build_<any>
}
interface _Blocks_{
    [index:string]:_Block_<any>;
}
interface data2{
    block:_Block_<any>;
    callback:data;
    noMoney?:boolean;
}
interface ud{
    [index:number]:number;
}
interface unitMoney{
    [index:string]:number;
}
interface ae{
    [index:string]:ud,
}
interface _Ai_{
    BuildAi:(callback:()=>void,plans:Array<BuildPlan>,finish:()=>void)=>AIController
}
interface _TaFang_{
    str:string,
    TapRun:(event:_TapEvent_)=>void;
    UnitD:(event:_UnitDestroyEvent_)=>void;
    UnitDam:(event:_UnitDamageEvent_)=>void;
    TimeRun:()=>void;
    clear:()=>void;
    infoUi:_ui_<data3>;
    listUi:_ui_<data2>;
    ui:_ui_<data>;
    creatBlock:<T>()=>_Block_<T>;
    creatBuild:(label:WorldLabel)=>_Build_<any>;
    creatTeam:()=>_Team_;
    Blocks:_Blocks_,
    Teams:Array<_Team_>,
    wareTeam:number,
    UnitDamage:ae,
    unitMoney:unitMoney,
    Ai:_Ai_,
    creatTickBlock:<T>(init:(bu:_Build_<tickData&T>)=>_Build_<tickData&T>,data:T)=>TickBlock<T>;
    creatDrillBlock:(ore:Block,tick:number,money:number)=>DrillBlock
    creatEffectBlock:(tick:number,effect:Array<StatusEffect>,time:number,call:(bu:_Build_<tickData>)=>void)=>TickBlock<{}>
    creatUnitBlock:(unit:UnitType,max:number,effect:Array<StatusEffect>,tick:number)=>UnitBlock;
}
interface data3{
    block:_Block_<any>,
    callback:data2
    callback2?:data3,
}
interface BlockTimer{
    tick:number;
    name:string;
    run:()=>boolean,
    callup:(tick:number)=>void
}
interface tickData{
    timer:Array<BlockTimer>;
    ticks:{
        [index:string]:number
    }
}
interface TickBlock<T> extends _Block_<T&tickData>{
    creat:(x:number,y:number,t:Team,father?:_Build_<any>)=>_Build_<tickData&T>
}
interface DrillBlock extends TickBlock<{
    ore:Block
}>{}
interface UnitBlock extends TickBlock<{
    units:Array<Unit>
}>{}
try{
    // @ts-ignore
    TaFang.clear();
}catch(_){

}
var TaFang={
    str:"",
    creatUnitBlock(unit, max, effect, tick) {
        let b=TaFang.creatTickBlock<{
            units:Array<Unit>
        }>(
            (bu)=>{
                bu.addon.timer.push({
                    name:"spawnTick",
                    tick:tick,
                    run() {
                        if(bu.addon.units.length>=max){
                            return false;
                        }
                        let u=unit.spawn(Team.get(bu.team),bu.x*8,bu.y*8);
                        for(let i of effect){
                            u.apply(i,NaN);
                        }
                        bu.addon.units.push(u);
                        return true;
                    },
                    callup(tick) {
                        let str="[yellow]单位方块\n"+b.name+"\n";
                        if(tick>0){
                            str+="[sky]冷却中"+tick;
                        }else str+="[acid]准备完毕";
                        str+="\n[pink]单位数量"+bu.addon.units.length+"/"+max;
                        bu.label.text=str;
                        for(let i in bu.addon.units){
                            if(bu.addon.units[i].dead()){
                                bu.addon.units.splice(Number(i),1);
                            }
                        }
                    }
                })
                return bu;
            },
            {
                units:[]
            }
        )
    },
    creatEffectBlock(tick,effect,time,call){
        let b=TaFang.creatTickBlock<{}>(
            (bu)=>{
                bu.addon.timer.push({
                    name:"EffectTick",
                    tick:tick,
                    run:()=>{
                        let flag=false;
                        Units.nearby(Team.get(TaFang.wareTeam),bu.x*8,bu.y*8,8*8,(u=>{
                            for(let i of effect){
                                u.apply(i,time);
                            }
                            flag=true;
                        }));
                        if(flag) call(bu);
                        return flag;
                    },
                    callup(tick){
                        bu.label.text="[red]buff武器\n"+bu.block.name+"\n";
                        if(tick>0){
                            bu.label.text+="[orange]冷却中"+tick;
                        }else bu.label.text+="[acid]冷却完成";
                    }
                })
                return bu
            }
        ,{})
        return b;
    },
    creatDrillBlock(ore:Block,tick:number,money:number){
        let b=TaFang.creatTickBlock<{
            ore:Block
        }>(
            (bu)=>{
                for(let i=bu.block.k*-1;i<=bu.block.k;i++){
                    for(let j=bu.block.k*-1;j<=bu.block.k;j++){
                        Vars.world.tile(i+bu.x,j+bu.y).setOverlayNet(bu.addon.ore);
                    }
                }
                bu.addon.timer.push({
                    name:"DirllTick",
                    tick:tick,
                    run:()=>{
                        let t=TaFang.Teams[bu.team];
                        if(t==null) return true;
                        TaFang.Teams[bu.team].money+=money;
                        return true;
                    },
                    callup:(tick)=>{
                        bu.label.text = "[acid][功能方块]\n" + bu.block.name + "\n";
                        if (tick > 0) {
                            bu.label.text += "冷却中" + tick;
                        }
                        else
                            bu.label.text += "[acid]+"+money;
                    }
                })
                return bu;
            },
            {
                ore:ore
            }
        );  
        return b;
    },
    creatTickBlock:<T>(init:(bu:_Build_<tickData&T>)=>_Build_<tickData&T>,data:T)=>{
        let b=TaFang.creatBlock<tickData&T>();
        let w=b.creat;
        b.creat=(x:number,y:number,t:Team,father?:_Build_<any>)=>{
            let bu=w(x,y,t,father);
            bu.addon=Object.assign({
                timer:[],
                ticks:{}
            },data) as tickData&T;
            bu.update=()=>{
                for(let i of bu.addon.timer){
                    if(i==null) continue;
                    let tick=bu.addon.ticks[i.name];
                    if(tick==null)tick=0;
                    if(tick<=0){
                        if(i.run()){
                            bu.addon.ticks[i.name]=i.tick;
                        }
                    }else{
                        bu.addon.ticks[i.name]--;
                    }
                    i.callup(tick);
                }
            }
            return init(bu);
        }
        return b;
    },
    clear:()=>{
        for(let i of TaFang.Teams){
            if(i==null) continue;
            for(let b of i.build){
                b.label.hide();
                b.label.remove();
            }
        }
    },
    infoUi:Aim.menuUI.createUI<data3>()
    .title("详细信息").content((p,v,d)=>"[yellow]当前方块:"+v.block.name+"\n[acid]价格"+v.block.cost
    +"\n[sky]使用方块:"+v.block.block)
    .eles((p,v,u)=>{
        for(let i of v.block.children){
            let b=TaFang.Blocks[i];
            u.button(b.name+'\n'+b.cost,()=>{
            TaFang.infoUi.show(p,{
                block:b,
                callback:v.callback,
                callback2:v
            })
        },true).row();
        }
        if(typeof v.callback2!='undefined'){
            u.button("返回上一级",()=>{
                if(typeof v.callback2=='undefined') return;
                TaFang.infoUi.show(p,v.callback2);
            },true)
        }
    })
    .button("返回",(p,v,u)=>{
        TaFang.listUi.show(p,v.callback);
    },true)
    ,
    listUi:Aim.menuUI.createUI<data2>()
    .title("升级").content("选择").eles((p,v,u)=>{
        let team=TaFang.Teams[p.team().id];
        if(team==null) return ;
        
        for(let i of v.block.children){
            let b=TaFang.Blocks[i];
            u.button((p,v,u)=>{
                let str='[green]';
                if(team.money<v.block.cost) str="[red]"
               return str+b.name+"\n[yellow]金币:"+b.cost
            }
            ,(p,v,u)=>{
                if(team.money>=b.cost){
                    //UP Block
                    let w=TaFang.Teams[p.team().id].build[v.callback.place]=b.creat(
                        v.callback.build.x,
                        v.callback.build.y,
                        p.team(),
                        v.callback.build
                    );
                    v.callback.build=w;
                    TaFang.ui.show(p,v.callback);
                    team.money-=b.cost;
                    //UpEnd
                }
            },true).button("详情",(p,v,u)=>{
                TaFang.infoUi.show(p,{
                    block:b,
                    callback:v
                })
            },true).row();
        }
        if(v.noMoney!=null&&v.noMoney){
            u.text("[red]金币不够").row();
        }
    }).button("返回",(p,v,u)=>{
        TaFang.ui.show(p,v.callback);
    },true),
    ui:Aim.menuUI.createUI<data>().title("简单塔防")
    .content((p,d,_u)=>"[orange]金币"+TaFang.Teams[p.team().id].money
    +"\n当前炮台"+d.build.block.name).button("升级",(p,d,_u)=>{
        TaFang.listUi.show(p,{
            block:d.build.block,
            callback:d
        })
    },true)
    .row().eles((p,d,u)=>{
        if(d.build.block!=TaFang.Blocks.air){
        u.button("[red]拆除",(p,d,u)=>{},false)
        .row().button("[red]降级",(p,d,u)=>{},false)
        .row();
        }
        u.button("取消",(p,d,u)=>{},true);
    }),
    
    creatBlock:function(){
        let that= {
        name:"none",
        update:()=>{},
        arrmo:null,
        block:Blocks.air,
        k:2,
        cost:0,
        children:[],
        creat:(x:number,y:number,t:Team,father:_Build_<null>):_Build_<null>=>{
            //if(father==null) return TaFang.creatBuild(WorldLabel.create());
            let b=TaFang.creatBuild(father.label);
            b.x=x;b.y=y;b.block=that;
            b.label.x=x*8;b.label.y=y*8;
            b.label.text="[sky][炮台]\n"+b.block.name;
            b.label.fontSize=2;
            b.label.add();
            for(let i=that.k*-1;i<=that.k;i++){
                for(let j=that.k*-1;j<=that.k;j++){
                    Vars.world.tile(b.x+i,b.y+i).setNet(Blocks.air,Team.get(0),0);
                }
            }
            Call.effect(Fx.titanSmoke,b.x*8,b.y*8,0,Color.orange);
            let u=UnitTypes.poly.spawn(t,b.x*8,b.y*8);
            let run=()=>{
                let ai=TaFang.Ai.BuildAi(run,[new BuildPlan(b.x,b.y,0,that.block)
                ,new BuildPlan(b.x,b.y-Math.floor((that.block.size-1)/2)-1,1,Blocks.itemSource)],
                ()=>{
                    Vars.world.tile(b.x,b.y-Math.floor((that.block.size-1)/2)-1).build.configure(that.arrmo);
                });
                u.controller(ai);
                ai.unit=u;
            }
            run();
            b.team=t.id;
            return b
        }
    } as _Block_<any>;
    return that;
    },
    Blocks:{},
    creatBuild:function(label:WorldLabel){
        return {
            update:()=>{},
            team:0,
        block:TaFang.Blocks.air,
        x:0,
        y:0,
        children:[] as Array<string>,
        cost:0,
        label:label,
        addon:undefined
        } as _Build_<undefined>;
    },
    creatTeam:function(){
        return {
        id:1,
        money:200,
        build:[]
    } as _Team_;
    },
    Teams:[] as Array<_Team_>,
    wareTeam:2,
    UnitDamage:{},
    unitMoney:{},
    Ai:{
        BuildAi:(callback:()=>void,plans:Array<BuildPlan>,finish:()=>void)=>{
            let ro=0;let last=plans[0];
            return extend<AIController,{
                vect?:Vec2
            }>(AIController,{
              updateMovement(){
                try{
                if(!this.unit) return ;
                if(this.unit.isPlayer()){
                    this.unit.kill();
                    callback();
                }
                ro+=0.05;
                let k=plans[0];
                if(k!=null){
                    if(Vars.world.tile(k.x,k.y).block()==k.block){
                        plans.shift();
                    }else{
                        this.unit.plans.add(k);
                        last=k;
                    }
                }
                if(plans.length<=0&&ro>=10){
                    this.unit.kill();
                    finish();
                    return ;
                }
                let y=Math.sin(ro)*3*8+last.y*8;
                let x=Math.cos(ro)*3*8+last.x*8;
                if(!this.unit.within(x,y,10)){
                    if(!this.vect) this.vect=new Vec2()
                    this.unit.movePref(this.vect.trns(this.unit.angleTo(x,y),this.unit.speed()))
                }
            }catch(e){
                Console.err(e);
            }
              }
            })
        }
    } as _Ai_,
    TapRun(event:_TapEvent_){
    if(!Vars.state.map.description().startsWith(TaFang.str)) return ;
        let p=event.player,t=event.tile;
        if(!p.unit().within(t.x*8,t.y*8,24*8)) return ;
        let team=TaFang.Teams[p.team().id];
        if(team==null) return ;
        for(let i in team.build){
            let b=team.build[i]
            if(Math.sqrt(Math.pow(t.x-b.x,2)+Math.pow(t.y-b.y,2))<=1.2){
                TaFang.ui.show(p,{
                    place:Number(i),
                    build:b
                });
                break;
            }
        }
    },
    TimeRun(){
        if(!Vars.state.map.description().startsWith(TaFang.str)) return ;
        Groups.player.each(p=>{
            let t=TaFang.Teams[p.team().id];
            if(t==null||t.money==null) return;
            Call.infoToast(p.con,"[orange]当前金币"+t.money,1);
        });
        for(let i of TaFang.Teams){
            if(i==null) continue;
            for(let b of i.build){
                b.update();
            }
        }
    },
    UnitDam(event:_UnitDamageEvent_){
    if(!Vars.state.map.description().startsWith(TaFang.str)) return ;
        let unit=event.unit,bullet=event.bullet;
        if(unit.team.id!=TaFang.wareTeam) return ;
        if(TaFang.UnitDamage[unit.toString()]==null){
            TaFang.UnitDamage[unit.toString()]={} as ud;
        }
        let k=TaFang.UnitDamage[unit.toString()];
        if(k[bullet.team.id]==null||isNaN(k[bullet.team.id])){
            k[bullet.team.id]=0;
        }
        k[bullet.team.id]+=bullet.damage;
        let money=Math.pow(bullet.damage*1.0/400,1.2);
        let fx;
        fx=Fx.hitMeltdown;
        if(bullet.damage>=100){
            fx=Fx.payloadReceive;
            Call.effect(Fx.payloadReceive,unit.x,unit.y,0,Color.orange);
        }
        if(bullet.damage>=200){
            fx=Fx.mineImpact
            Call.effect(Fx.mineImpact,unit.x,unit.y,0,Color.orange);
        }
        for(let i=0;i<=Math.max(Math.min(unit.type.hitSize*0.3,6),3);i++){
            let x=Math.floor(Math.random()*unit.type.hitSize)-unit.type.hitSize*0.5;
            let y=Math.floor(Math.random()*unit.type.hitSize)-unit.type.hitSize*0.5;
            Call.effect(fx,x+unit.x,y+unit.y,0,Color.orange);
        }
        if(money<=0) return ;
        if(money>=1)Call.label('[#'+bullet.team.color.toString()+']+'+money,0.3,unit.x,unit.y);
        TaFang.Teams[bullet.team.id].money+=money;
    },
    UnitD(event:_UnitDestroyEvent_){
    if(!Vars.state.map.description().startsWith(TaFang.str)) return ;
        let unit=event.unit;
        if(unit.team.id!=TaFang.wareTeam) return ;
        let max=0,maxt=-1;
        for(let i in TaFang.UnitDamage[unit.toString()]){
            let d=TaFang.UnitDamage[unit.toString()][i];
            if(d>max){
                maxt=Number(i);
                max=d;
            }
        }
        if(maxt!=-1){
            Call.effect(Fx.shootSmokeSmite,unit.x,unit.y,0,Color.orange);
            let money=TaFang.unitMoney[unit.type.toString()];
            if(isNaN(money)||money==null) money=0;
            if(money<=0) return ;
            Call.label('[#'+Team.get(maxt).color.toString()+']+'+money,0.3,unit.x,unit.y)
            TaFang.Teams[maxt].money+=money;
    }
}
} as _TaFang_;
let drill=TaFang.Blocks.drill=TaFang.creatDrillBlock(Blocks.oreCopper,10,10);
drill.name="普通转头";drill.cost=20;drill.block=Blocks.mechanicalDrill;
/*
let drill=TaFang.Blocks.drill=TaFang.creatTickBlock<{}>(
    (bu:_Build_<{}&tickData>)=>{
        bu.addon.timer.push({
            name:"drillTick",
            tick:5,
            run:()=>{
                let t=TaFang.Teams[bu.team];
                if(t==null) return true;
                t.money+=10;
                return true;
            },
            callup(tick){
                bu.label.text="[acid][功能方块]/n"+bu.block.name+"\n";
                if(tick>0){
                    bu.label.text="冷却中"+tick;
                }else bu.label.text+="[acid]+10";
            }
        })
        return bu;
},{});
drill.name="普通钻头";drill.cost=15;
drill.block=Blocks.mechanicalDrill;
*/
let iceTall=TaFang.Blocks.IceTall=TaFang.creatEffectBlock(3,[StatusEffects.freezing,StatusEffects.wet],30,
    (bu)=>{
        Call.effect(Fx.circleColorSpark,bu.x*8,bu.y*8,0,Color.sky)
    });
iceTall.name="冰塔";iceTall.cost=30;
iceTall.block=Blocks.regenProjector;
let flareBlock=TaFang.Blocks.flareBlock=TaFang.creatUnitBlock(UnitTypes.flare,10,[StatusEffects.overclock,StatusEffects.overdrive],10);
flareBlock.cost=30;flareBlock.name="flare工厂";
flareBlock.block=Blocks.airFactory;
TaFang.Blocks.duo=TaFang.creatBlock();
TaFang.Blocks.duo.name="双管";
TaFang.Blocks.duo.cost=5;
TaFang.Blocks.duo.arrmo=Items.copper;
TaFang.Blocks.air=TaFang.creatBlock();
TaFang.Blocks.duo.block=Blocks.duo;
TaFang.Blocks.air.name="空气";
TaFang.Blocks.air.children.push("duo","drill","IceTall","flareBlock");
TaFang.Blocks.air.creat=<T>(x:number,y:number,t:Team):_Build_<T>=>{
    let b=TaFang.creatBuild(WorldLabel.create());
    b.x=x;b.y=y;b.block=TaFang.Blocks.air;
    b.label.text="[sky]炮台\n"+b.block.name;
    b.label.x=b.x*8;b.label.y=b.y*8;b.label.fontSize=2;
    b.label.add();
    return b;
}
TaFang.Teams[1]=TaFang.creatTeam();
try{
    Vars.world.tiles.eachTile(t=>{
        if(t.block()==Blocks.message){
            TaFang.Teams[t.build.team.id].build.push(TaFang.Blocks.air.creat(t.x,t.y,t.build.team));
            Vars.world.tile(t.x,t.y).setNet(Blocks.air,Team.get(0),0);
        }
    })
}catch(e){
    
}
try{
    // @ts-ignore
    TaFangLoad.w=0;
}catch(_){
    let TaFangLoad={};
    Timer.schedule(()=>{
        TaFang.TimeRun();
    },1,1)
    Events.on(EventType.TapEvent,(event)=>{
        try{
        TaFang.TapRun(event);
    }catch(e){
        Console.err(e);
    }
    });
    Events.on(EventType.UnitDamageEvent,(event)=>{
        try{
        TaFang.UnitDam(event);
    }catch(e){
        Console.err(e);
    }
    });
    Events.on(EventType.UnitDestroyEvent,event=>{
        try{
            TaFang.UnitD(event)
        }catch(e){
            Console.err(e);
        }
    });

}