
import { Blocks ,Block,Events,EventType, UnitTypes, Vars, Call, Team,Fx,Color, AIController, extend, Vec2, BuildPlan, Timer, WorldLabel, Item, Items} from '../../Apis/Mdt';
import {Aim,Console,_ui_} from '../../Apis/Aim';
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
    creatTickBlock:<T>(init:(bu:_Build_<tickData&T>)=>_Build_<tickData&T>)=>TickBlock<T>;
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
try{
    // @ts-ignore
    TaFang.clear();
}catch(_){

}
var TaFang={
    creatTickBlock:<T>(init:(bu:_Build_<tickData&T>)=>_Build_<tickData&T>)=>{
        let b=TaFang.creatBlock<tickData&T>();
        let w=b.creat;
        b.creat=(x:number,y:number,t:Team,father?:_Build_<any>)=>{
            let bu=w(x,y,t,father);
            bu.update=()=>{
                for(let i of bu.addon.timer){
                    if(i==null) continue;
                    let tick=bu.addon.ticks[i.name];
                    if(tick==null)tick=0;
                    if(tick<=0){
                        if(i.run()){
                            tick=i.tick;
                        }
                    }else{
                        tick--;
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
                if(plans.length<=0&&ro>=360){
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
    } as _Ai_
} as _TaFang_;
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
                bu.label.text="[功能方块]/n"+bu.block.name+"\n";
                if(tick>0){
                    bu.label.text="冷却中"+tick;
                }else bu.label.text+="[acid]+10";
            }
        })
        return bu;
});
drill.name="普通钻头";drill.cost=15;
drill.block=Blocks.mechanicalDrill;
TaFang.Blocks.duo=TaFang.creatBlock();
TaFang.Blocks.duo.name="双管";
TaFang.Blocks.duo.cost=5;
TaFang.Blocks.duo.arrmo=Items.copper;
TaFang.Blocks.air=TaFang.creatBlock();
TaFang.Blocks.duo.block=Blocks.duo;
TaFang.Blocks.air.name="空气";
TaFang.Blocks.air.children.push("duo","drill");
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
    let str=""
    let TaFangLoad={};
    Timer.schedule(()=>{
        for(let i of TaFang.Teams){
            if(i==null) continue;
            for(let b of i.build){
                b.update();
            }
        }
    },0.1,0.1)
    Events.on(EventType.TapEvent,(event)=>{
        try{
        if(!Vars.state.map.description().startsWith(str)) return ;
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
    }catch(e){
        Console.err(e);
    }
    });
    Events.on(EventType.UnitDamageEvent,(event)=>{
        try{
        if(!Vars.state.map.description().startsWith(str)) return ;
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
        let money=Math.pow(bullet.damage*1.0/100,1.2);
        if(money<=0) return ;
        Call.label('[#'+bullet.team.color.toString()+']+'+money,0.3,unit.x,unit.y);
        TaFang.Teams[bullet.team.id].money+=money;
    }catch(e){
        Console.err(e);
    }
    });
    Events.on(EventType.UnitDestroyEvent,event=>{
        try{
        if(!Vars.state.map.description().startsWith(str)) return ;
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
            let money=TaFang.unitMoney[unit.type.toString()];
            if(isNaN(money)||money==null) money=0;
            if(money<=0) return ;
            Call.label('[#'+Team.get(maxt).color.toString()+']+'+money,0.3,unit.x,unit.y)
            TaFang.Teams[maxt].money+=money;
        }}catch(e){
            Console.err(e);
        }
    });

}