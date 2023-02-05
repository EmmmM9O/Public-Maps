
import { Blocks ,Block,Events,EventType, UnitTypes, Vars, Call, Team,Fx,Color, AIController, extend} from '../../Apis/Mdt';
import {Aim,_ui_} from '../../Apis/Aim';
interface _Build_{
    x:number;
    y:number;
    block:_Block_;
}
interface  _Team_{
    id:number;
    money:number;
    build:Array<_Build_>
}
interface _Block_{
    cost:number;
    name:string,
    update:()=>void,
    arrmo:null,
    block:Block,
    creat:(x:number,y:number,t:Team)=>_Build_
    children:Array<string>
}
interface data{
    place:string,
    build:_Build_
}
interface _Blocks_{
    air:_Block_;
    [index:string]:_Block_;
}
interface data2{
    block:_Block_;
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
    BuildAi:()=>AIController
}
interface _TaFang_{
    infoUi:_ui_<data3>;
    listUi:_ui_<data2>;
    ui:_ui_<data>;
    Block:()=>void;
    Build:()=>void;
    Team:()=>void;
    Blocks:_Blocks_,
    Teams:Array<_Team_>,
    wareTeam:number,
    UnitDamage:ae,
    unitMoney:unitMoney,
    Ai:_Ai_
}
interface data3{
    block:_Block_,
    callback:data2
    callback2?:data3,
}
var TaFang={
    infoUi:Aim.menuUi.createUI<data3>()
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
        if(v.callback2!=null){
            u.button("返回上一级",()=>{
                TaFang.infoUi.show(p,v.callback2);
            },true)
        }
    })
    .button("返回",(p,v,u)=>{
        TaFang.listUi.show(p,v.callback);
    },true)
    ,
    listUi:Aim.menuUi.createUI<data2>()
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
                if(team.money>=v.block.cost){
                    //UP Block
                    let w=TaFang.Teams[p.team().id].build[v.callback.place]=b.creat(
                        v.callback.build.x,
                        v.callback.build.y,
                        p.team()
                    );
                    v.callback.build=w;
                    TaFang.ui.show(p,v.callback);
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
    ui:Aim.menuUi.createUI<data>().title("简单塔防")
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
    
    Block:function(){
        this.name="none";
        this.update=()=>{};
        this.arrmo=null;
        this.block=Blocks.air;
        this.k=2;
        let that=this;
        this.creat=(x:number,y:number,t:Team):_Build_=>{
            let b=new TaFang.Build();
            b.x=x;b.y=y;
            for(let i=that.k*-1;i<=that.k;i++){
                for(let j=that.k*-1;j<=that.k;j++){
                    Vars.world.tile(b.x+i,b.y+i).setNet(Blocks.air,Team.get(0),0);
                }
            }
            Call.effect(Fx.titanSmoke,b.x*8,b.y*8,0,Color.orange);
            let u=UnitTypes.poly.spawn(t,b.x*8,b.y*8);
            return b;
            
        }
    },
    Blocks:{
        air:new TaFang.Block()
    },
    Build:function(){
        this.block=TaFang.Blocks.air;
        this.x=0;
        this.y=0;
        this.children=[] as Array<string>;
        this.cost=0;
    },
    Team:function(){
        this.id=1;
        this.money=200;
        this.build=[];
    },
    Teams:[] as Array<_Team_>,
    wareTeam:1,
    UnitDamage:{},
    unitMoney:{},
    Ai:{
        BuildAi:()=>{
            return extend(AIController,{
                
            })
        }
    }
} as _TaFang_;

try{
    // @ts-ignore
    TaFangLoad.w=0;
}catch(_){
    let TaFangload={};
    Events.on(EventType.TapEvent,(event)=>{
        if(!Vars.state.map.description().startsWith("#简单塔防#")) return ;
        let p=event.player,t=event.tile;
        if(!p.unit().within(t.x*8,t.y*8,8*8)) return ;
        let team=TaFang.Teams[p.team().id];
        if(team==null) return ;
        for(let i in team.build){
            let b=team.build[i]
            if(p.unit().within(b.x*8,b.y*8,2*8)){
                TaFang.ui.show(p,{
                    place:i,
                    build:b
                });
                break;
            }
        }
    });
    Events.on(EventType.UnitDamageEvent,(event)=>{
        if(!Vars.state.map.description().startsWith("#简单塔防#")) return ;
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
        let money=Math.pow(bullet.damage*1.0/20,1.2);
        Call.label('['+bullet.team.color.toString()+']+'+money,0.3,unit.x,unit.y);
        TaFang.Teams[bullet.team.id].money+=money;
    });
    Events.on(EventType.UnitDestroyEvent,event=>{
        if(!Vars.state.map.description().startsWith("#简单塔防#")) return ;
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
            Call.label('['+Team.get(maxt).color.toString()+']+'+money,0.3,unit.x,unit.y)
            TaFang.Teams[maxt].money+=money;
        }
    });

}