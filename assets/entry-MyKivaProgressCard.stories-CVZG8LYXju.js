import{g as r,c as Q,q as s,a as W,u,A as j,m as et,L as m,C as tt,o as K,M as at}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import{K as ot}from"./entry-KvProgressCircle-Pjk1xBU9rv.js";import{K as rt}from"./entry-KvIcon-b0e16r4G06.js";import{_ as st}from"./entry-KvButton-C9WvITgRyG.js";import{d as O,b as M,c as T,I as D,a as Y}from"./entry-useBadgeData-BF_2MyxYqK.js";import{n as nt}from"./entry-numeral-xVHG5DEP0A.js";import{m as lt}from"./entry-importHelpers-zIMYNa8D_v.js";import{_ as ct}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./iframe-Dd3MfrQK.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-achievementUtils-Cf0LlmQMSn.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";const gt=""+new URL("brand-DRsde_GU.png",import.meta.url).href,it=Object.freeze(Object.defineProperty({__proto__:null,default:gt},Symbol.toStringTag,{value:"Module"})),mt=""+new URL("danger-highlight-NoVmckvK.png",import.meta.url).href,ut=Object.freeze(Object.defineProperty({__proto__:null,default:mt},Symbol.toStringTag,{value:"Module"})),dt=""+new URL("eco-green-2-NN39MRhM.png",import.meta.url).href,pt=Object.freeze(Object.defineProperty({__proto__:null,default:dt},Symbol.toStringTag,{value:"Module"})),At=""+new URL("eco-green-3-BrUWi9qr.png",import.meta.url).href,_t=Object.freeze(Object.defineProperty({__proto__:null,default:At},Symbol.toStringTag,{value:"Module"})),vt=""+new URL("marigold-BvOK8dxz.png",import.meta.url).href,ht=Object.freeze(Object.defineProperty({__proto__:null,default:vt},Symbol.toStringTag,{value:"Module"})),yt=""+new URL("stone-3-ctGo-BuV.png",import.meta.url).href,ft=Object.freeze(Object.defineProperty({__proto__:null,default:yt},Symbol.toStringTag,{value:"Module"})),It={class:"progress-card"},Pt={class:"tw-relative tw-z-docked"},Lt={style:{"letter-spacing":"-0.05rem"}},St={key:0,class:"tw-text-small"},Ct={class:"tw-w-full"},xt={class:"tw-flex tw-items-center tw-gap-0.5"},Et={class:"tw-text-secondary"},Ut={class:"tw-font-medium"},bt={class:"tw-text-small"},Nt={class:"tw-w-full tw-flex tw-justify-end tw-mt-1"},Ot=["src"],$=100,Mt=1e3,ze={__name:"MyKivaProgressCard",props:{goal:{type:Object,required:!0},goalProgress:{type:Number,required:!0},isAnnualGoal:{type:Boolean,default:!1}},setup(n){const k=lt(Object.assign({"/src/assets/images/my-kiva/goal-progress-texture/brand.png":it,"/src/assets/images/my-kiva/goal-progress-texture/danger-highlight.png":ut,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-2.png":pt,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-3.png":_t,"/src/assets/images/my-kiva/goal-progress-texture/marigold.png":ht,"/src/assets/images/my-kiva/goal-progress-texture/stone-3.png":ft}),"/src/assets/images/my-kiva/goal-progress-texture/"),e=n,Ve=r(()=>{var c,i,R;if(e.isAnnualGoal)return!((c=e.goal)!=null&&c.target)||e.goalProgress<=0?0:Math.min(Math.round(e.goalProgress/e.goal.target*100),$);const o=((i=e.goal)==null?void 0:i.tierTarget)||0,t=((R=e.goal)==null?void 0:R.totalLoans)??0;return!o||t<=0?0:Math.min(Math.round(t/o*100),$)}),g=r(()=>{var o,t,c;return((o=e.goal)==null?void 0:o.nextAchievementAt)>0?(t=e.goal)==null?void 0:t.tierTarget:((c=e.goal)==null?void 0:c.target)||0}),l=r(()=>e.goalProgress>=g.value),w=r(()=>{var t;const o=((t=e.goal)==null?void 0:t.totalLoans)??e.goalProgress;return Math.max(g.value-o,0)}),Fe=r(()=>e.isAnnualGoal?"Your goal":e.goal.name),He=r(()=>{var o,t;return e.isAnnualGoal&&l.value?"You’ve completed your goal!":e.isAnnualGoal?w.value===1?`${w.value} loan to complete your goal.`:`${w.value} loans to complete your goal.`:l.value?"All badges earned!":`${((o=e.goal)==null?void 0:o.nextAchievementAt)??0} loan${((t=e.goal)==null?void 0:t.nextAchievementAt)!==1?"s":""} to unlock next badge.`}),Je=r(()=>{var o,t,c,i;return l.value&&e.isAnnualGoal?`${g.value} / ${g.value}`:e.isAnnualGoal?`${e.goalProgress} / ${g.value}`:l.value?((t=e.goal)==null?void 0:t.totalLoans)>Mt?nt(((c=e.goal)==null?void 0:c.totalLoans)??0).format("0.0a"):((i=e.goal)==null?void 0:i.totalLoans)??0:`${((o=e.goal)==null?void 0:o.totalLoans)??e.goalProgress} / ${g.value}`}),Xe=r(()=>e.isAnnualGoal?"2026 annual goal":"Lifetime achievement"),Ze=r(()=>{var t;if(e.isAnnualGoal&&l.value)return"";const o=e.isAnnualGoal?e.goalProgress??0:((t=e.goal)==null?void 0:t.totalLoans)??e.goalProgress??0;return!l.value&&o<=0?"Get started":l.value?"See details":"Continue"}),B=r(()=>e.isAnnualGoal?"brand":e.goal.category===O?"marigold":e.goal.category===M?"eco-green-3":e.goal.category===T?"danger-highlight":e.goal.category===D?"stone-3":"eco-green-2");return(o,t)=>(K(),Q("div",It,[s("div",Pt,[W(u(ot),{class:"progress-circle","stroke-width":20,value:Ve.value,max:g.value,rotate:180,color:B.value},null,8,["value","max","color"]),s("div",{class:j(["progress-circle-content",{"tw-mt-0.5":l.value&&!n.isAnnualGoal}])},[s("h5",Lt,m(Je.value),1),l.value&&!n.isAnnualGoal?(K(),Q("p",St," loans ")):et("",!0)],2)]),s("div",Ct,[s("div",xt,[W(u(rt),{class:"tw-text-gray-400 tw-h-2 tw-w-2",name:n.isAnnualGoal?"annual-goal-flag":"progress-checkmark"},null,8,["name"]),s("h5",Et,m(Xe.value),1)]),s("p",Ut,m(Fe.value),1),s("p",bt,m(He.value),1),s("div",Nt,[W(u(st),{class:"text-link tw-font-medium !tw-text-eco-green-3"},{default:tt(()=>[at(m(Ze.value),1)],void 0),_:1})])]),s("img",{class:j(["tw-absolute tw-z-2","card-texture",`card-texture--${B.value}`]),alt:"Card color decorative stain",src:u(k)(`${B.value}.png`)},null,10,Ot)]))}},qe=ct(ze,[["__scopeId","data-v-4aac2f9a"]]);ze.__docgenInfo={exportName:"default",displayName:"MyKivaProgressCard",description:"",tags:{},props:[{name:"goal",type:{name:"object"},required:!0},{name:"goalProgress",type:{name:"number"},required:!0},{name:"isAnnualGoal",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/MyKivaProgressCard.vue"]};const zt={title:"MyKiva/MyKivaProgressCard",component:qe},a=(n={})=>{const G=(k,{argTypes:e})=>({props:Object.keys(e),components:{MyKivaProgressCard:qe},setup(){return{args:n}},template:`
      <div style="width: 379px;">
        <MyKivaProgressCard v-bind="args" style="${n.height?`height: ${n.height}px;`:""}" />
      </div>
    `});return G.args=n,G},d=a({goal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:0,isAnnualGoal:!0}),p=a({goal:{target:100,category:"ID_WOMENS_EQUALITY"},goalProgress:38,isAnnualGoal:!0}),A=a({goal:{target:100,category:"ID_WOMENS_EQUALITY"},goalProgress:100,isAnnualGoal:!0}),_=a({goal:{target:5,name:"Women",category:O,nextAchievementAt:1,totalLoans:0},goalProgress:0}),v=a({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:O,nextAchievementAt:10,totalLoans:20},goalProgress:4}),h=a({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:O,nextAchievementAt:0,totalLoans:1200},goalProgress:5}),y=a({goal:{target:10,name:"Refugees",category:T,nextAchievementAt:1,totalLoans:0},goalProgress:0}),f=a({goal:{target:5,name:"Refugees",category:T,nextAchievementAt:10,totalLoans:20},goalProgress:3}),I=a({goal:{target:5,name:"Refugees",category:T,nextAchievementAt:0,totalLoans:200},goalProgress:5}),P=a({goal:{target:10,name:"Climate Action",category:M,nextAchievementAt:1,totalLoans:0},goalProgress:0}),L=a({goal:{target:5,name:"Climate Action",category:M,nextAchievementAt:10,totalLoans:20},goalProgress:3}),S=a({goal:{target:5,name:"Climate Action",category:M,nextAchievementAt:0,totalLoans:200},goalProgress:5}),C=a({goal:{target:10,name:"Basic Needs",category:D,nextAchievementAt:1,totalLoans:0},goalProgress:0}),x=a({goal:{target:5,name:"Basic Needs",category:D,nextAchievementAt:10,totalLoans:20},goalProgress:3}),E=a({goal:{target:5,name:"Basic Needs",category:D,nextAchievementAt:0,totalLoans:200},goalProgress:5}),U=a({goal:{target:10,name:"U.S. Business",category:Y,nextAchievementAt:1,totalLoans:0},goalProgress:0}),b=a({goal:{target:5,name:"U.S. Business",category:Y,nextAchievementAt:10,totalLoans:20},goalProgress:3}),N=a({goal:{target:5,name:"U.S. Business",category:Y,nextAchievementAt:0,totalLoans:200},goalProgress:5});var z,q,V;d.parameters={...d.parameters,docs:{...(z=d.parameters)==null?void 0:z.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 0,
  isAnnualGoal: true
})`,...(V=(q=d.parameters)==null?void 0:q.docs)==null?void 0:V.source}}};var F,H,J;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`story({
  goal: {
    target: 100,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 38,
  isAnnualGoal: true
})`,...(J=(H=p.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var X,Z,ee;A.parameters={...A.parameters,docs:{...(X=A.parameters)==null?void 0:X.docs,source:{originalSource:`story({
  goal: {
    target: 100,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 100,
  isAnnualGoal: true
})`,...(ee=(Z=A.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var te,ae,oe;_.parameters={..._.parameters,docs:{...(te=_.parameters)==null?void 0:te.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(oe=(ae=_.parameters)==null?void 0:ae.docs)==null?void 0:oe.source}}};var re,se,ne;v.parameters={...v.parameters,docs:{...(re=v.parameters)==null?void 0:re.docs,source:{originalSource:`story({
  tag: 'Lifetime achievement',
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 4
})`,...(ne=(se=v.parameters)==null?void 0:se.docs)==null?void 0:ne.source}}};var le,ce,ge;h.parameters={...h.parameters,docs:{...(le=h.parameters)==null?void 0:le.docs,source:{originalSource:`story({
  tag: 'Lifetime achievement',
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 1200
  },
  goalProgress: 5
})`,...(ge=(ce=h.parameters)==null?void 0:ce.docs)==null?void 0:ge.source}}};var ie,me,ue;y.parameters={...y.parameters,docs:{...(ie=y.parameters)==null?void 0:ie.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(ue=(me=y.parameters)==null?void 0:me.docs)==null?void 0:ue.source}}};var de,pe,Ae;f.parameters={...f.parameters,docs:{...(de=f.parameters)==null?void 0:de.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(Ae=(pe=f.parameters)==null?void 0:pe.docs)==null?void 0:Ae.source}}};var _e,ve,he;I.parameters={...I.parameters,docs:{...(_e=I.parameters)==null?void 0:_e.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(he=(ve=I.parameters)==null?void 0:ve.docs)==null?void 0:he.source}}};var ye,fe,Ie;P.parameters={...P.parameters,docs:{...(ye=P.parameters)==null?void 0:ye.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(Ie=(fe=P.parameters)==null?void 0:fe.docs)==null?void 0:Ie.source}}};var Pe,Le,Se;L.parameters={...L.parameters,docs:{...(Pe=L.parameters)==null?void 0:Pe.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(Se=(Le=L.parameters)==null?void 0:Le.docs)==null?void 0:Se.source}}};var Ce,xe,Ee;S.parameters={...S.parameters,docs:{...(Ce=S.parameters)==null?void 0:Ce.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(Ee=(xe=S.parameters)==null?void 0:xe.docs)==null?void 0:Ee.source}}};var Ue,be,Ne;C.parameters={...C.parameters,docs:{...(Ue=C.parameters)==null?void 0:Ue.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(Ne=(be=C.parameters)==null?void 0:be.docs)==null?void 0:Ne.source}}};var Oe,Me,Te;x.parameters={...x.parameters,docs:{...(Oe=x.parameters)==null?void 0:Oe.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(Te=(Me=x.parameters)==null?void 0:Me.docs)==null?void 0:Te.source}}};var De,Ge,we;E.parameters={...E.parameters,docs:{...(De=E.parameters)==null?void 0:De.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(we=(Ge=E.parameters)==null?void 0:Ge.docs)==null?void 0:we.source}}};var Be,Re,We;U.parameters={...U.parameters,docs:{...(Be=U.parameters)==null?void 0:Be.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(We=(Re=U.parameters)==null?void 0:Re.docs)==null?void 0:We.source}}};var Ye,ke,Qe;b.parameters={...b.parameters,docs:{...(Ye=b.parameters)==null?void 0:Ye.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(Qe=(ke=b.parameters)==null?void 0:ke.docs)==null?void 0:Qe.source}}};var je,Ke,$e;N.parameters={...N.parameters,docs:{...(je=N.parameters)==null?void 0:je.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...($e=(Ke=N.parameters)==null?void 0:Ke.docs)==null?void 0:$e.source}}};const qt=["Default","InProgressGoal","CompletedGoal","AchievementWomen","AchievementWomenInProgress","AchievementWomenCompleted","AchievementRefugees","AchievementRefugeesInProgress","AchievementRefugeesCompleted","AchievementClimateAction","AchievementClimateActionInProgress","AchievementClimateActionCompleted","AchievementBasicNeeds","AchievementBasicNeedsInProgress","AchievementBasicNeedsCompleted","AchievementUSBusiness","AchievementUSBusinessInProgress","AchievementUSBusinessCompleted"];export{C as AchievementBasicNeeds,E as AchievementBasicNeedsCompleted,x as AchievementBasicNeedsInProgress,P as AchievementClimateAction,S as AchievementClimateActionCompleted,L as AchievementClimateActionInProgress,y as AchievementRefugees,I as AchievementRefugeesCompleted,f as AchievementRefugeesInProgress,U as AchievementUSBusiness,N as AchievementUSBusinessCompleted,b as AchievementUSBusinessInProgress,_ as AchievementWomen,h as AchievementWomenCompleted,v as AchievementWomenInProgress,A as CompletedGoal,d as Default,p as InProgressGoal,qt as __namedExportsOrder,zt as default};
