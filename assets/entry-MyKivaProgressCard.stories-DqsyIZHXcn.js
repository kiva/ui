import{j as r,c as j,e as s,a as W,u,n as Q,d as et,K as m,b as tt,o as K,J as at}from"./entry-vue.esm-bundler-BthIfLPEGH.js";import{K as ot}from"./entry-KvProgressCircle-bPCvVuPg8I.js";import{K as rt}from"./entry-KvIcon-C4WFWkVr3g.js";import{_ as st}from"./entry-KvButton-CBBItbLSAS.js";import{d as O,b as M,c as T,I as D,a as Y}from"./entry-useBadgeData-DjGjDFcytk.js";import{n as nt}from"./entry-numeral-xVHG5DEP0A.js";import{m as lt}from"./entry-importHelpers-zIMYNa8D_v.js";import{_ as ct}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./iframe-CMDynTYb.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-achievementUtils-Cf0LlmQMSn.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";const gt=""+new URL("brand-DRsde_GU.png",import.meta.url).href,it=Object.freeze(Object.defineProperty({__proto__:null,default:gt},Symbol.toStringTag,{value:"Module"})),mt=""+new URL("danger-highlight-NoVmckvK.png",import.meta.url).href,ut=Object.freeze(Object.defineProperty({__proto__:null,default:mt},Symbol.toStringTag,{value:"Module"})),dt=""+new URL("eco-green-2-NN39MRhM.png",import.meta.url).href,pt=Object.freeze(Object.defineProperty({__proto__:null,default:dt},Symbol.toStringTag,{value:"Module"})),At=""+new URL("eco-green-3-BrUWi9qr.png",import.meta.url).href,_t=Object.freeze(Object.defineProperty({__proto__:null,default:At},Symbol.toStringTag,{value:"Module"})),vt=""+new URL("marigold-BvOK8dxz.png",import.meta.url).href,ht=Object.freeze(Object.defineProperty({__proto__:null,default:vt},Symbol.toStringTag,{value:"Module"})),yt=""+new URL("stone-3-ctGo-BuV.png",import.meta.url).href,ft=Object.freeze(Object.defineProperty({__proto__:null,default:yt},Symbol.toStringTag,{value:"Module"})),It={class:"progress-card"},Pt={class:"tw-relative tw-z-docked"},Lt={style:{"letter-spacing":"-0.05rem"}},St={key:0,class:"tw-text-small"},xt={class:"tw-w-full"},Ct={class:"tw-flex tw-items-center tw-gap-0.5"},Et={class:"tw-text-secondary"},bt={class:"tw-font-medium"},Ut={class:"tw-text-small"},Nt={class:"tw-w-full tw-flex tw-justify-end tw-mt-1"},Ot=["src"],$=100,Mt=1e3,ze={__name:"MyKivaProgressCard",props:{goal:{type:Object,required:!0},goalProgress:{type:Number,required:!0},isAnnualGoal:{type:Boolean,default:!1}},setup(n){const k=lt(Object.assign({"/src/assets/images/my-kiva/goal-progress-texture/brand.png":it,"/src/assets/images/my-kiva/goal-progress-texture/danger-highlight.png":ut,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-2.png":pt,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-3.png":_t,"/src/assets/images/my-kiva/goal-progress-texture/marigold.png":ht,"/src/assets/images/my-kiva/goal-progress-texture/stone-3.png":ft}),"/src/assets/images/my-kiva/goal-progress-texture/"),e=n,Ve=r(()=>{var c,i,R;if(e.isAnnualGoal)return!((c=e.goal)!=null&&c.target)||e.goalProgress<=0?0:Math.min(Math.round(e.goalProgress/e.goal.target*100),$);const o=((i=e.goal)==null?void 0:i.tierTarget)||0,a=((R=e.goal)==null?void 0:R.totalLoans)??0;return!o||a<=0?0:Math.min(Math.round(a/o*100),$)}),g=r(()=>{var o,a,c;return((o=e.goal)==null?void 0:o.nextAchievementAt)>0?(a=e.goal)==null?void 0:a.tierTarget:((c=e.goal)==null?void 0:c.target)||0}),l=r(()=>e.goalProgress>=g.value),B=r(()=>{var a;const o=((a=e.goal)==null?void 0:a.totalLoans)??e.goalProgress;return Math.max(g.value-o,0)}),Fe=r(()=>e.isAnnualGoal?"Your goal":e.goal.name),He=r(()=>{var o,a;return e.isAnnualGoal&&l.value?"You’ve completed your goal!":e.isAnnualGoal?B.value===1?`${B.value} loan to complete your goal.`:`${B.value} loans to complete your goal.`:l.value?"All badges earned!":`${((o=e.goal)==null?void 0:o.nextAchievementAt)??0} loan${((a=e.goal)==null?void 0:a.nextAchievementAt)!==1?"s":""} to unlock next badge.`}),Je=r(()=>{var o,a,c,i;return l.value&&e.isAnnualGoal?`${g.value} / ${g.value}`:e.isAnnualGoal?`${e.goalProgress} / ${g.value}`:l.value?((a=e.goal)==null?void 0:a.totalLoans)>Mt?nt(((c=e.goal)==null?void 0:c.totalLoans)??0).format("0.0a"):((i=e.goal)==null?void 0:i.totalLoans)??0:`${((o=e.goal)==null?void 0:o.totalLoans)??e.goalProgress} / ${g.value}`}),Xe=r(()=>e.isAnnualGoal?"2026 annual goal":"Lifetime achievement"),Ze=r(()=>e.isAnnualGoal&&l.value?"":l.value?"See details":"Continue"),G=r(()=>e.isAnnualGoal?"brand":e.goal.category===O?"marigold":e.goal.category===M?"eco-green-3":e.goal.category===T?"danger-highlight":e.goal.category===D?"stone-3":"eco-green-2");return(o,a)=>(K(),j("div",It,[s("div",Pt,[W(u(ot),{class:"progress-circle","stroke-width":20,value:Ve.value,max:g.value,rotate:180,color:G.value},null,8,["value","max","color"]),s("div",{class:Q(["progress-circle-content",{"tw-mt-0.5":l.value&&!n.isAnnualGoal}])},[s("h5",Lt,m(Je.value),1),l.value&&!n.isAnnualGoal?(K(),j("p",St," loans ")):et("",!0)],2)]),s("div",xt,[s("div",Ct,[W(u(rt),{class:"tw-text-gray-400 tw-h-2 tw-w-2",name:n.isAnnualGoal?"annual-goal-flag":"progress-checkmark"},null,8,["name"]),s("h5",Et,m(Xe.value),1)]),s("p",bt,m(Fe.value),1),s("p",Ut,m(He.value),1),s("div",Nt,[W(u(st),{class:"text-link tw-font-medium !tw-text-eco-green-3"},{default:tt(()=>[at(m(Ze.value),1)],void 0),_:1})])]),s("img",{class:Q(["tw-absolute tw-z-2","card-texture",`card-texture--${G.value}`]),alt:"Card color decorative stain",src:u(k)(`${G.value}.png`)},null,10,Ot)]))}},qe=ct(ze,[["__scopeId","data-v-1ff04a38"]]);ze.__docgenInfo={exportName:"default",displayName:"MyKivaProgressCard",description:"",tags:{},props:[{name:"goal",type:{name:"object"},required:!0},{name:"goalProgress",type:{name:"number"},required:!0},{name:"isAnnualGoal",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/MyKivaProgressCard.vue"]};const zt={title:"MyKiva/MyKivaProgressCard",component:qe},t=(n={})=>{const w=(k,{argTypes:e})=>({props:Object.keys(e),components:{MyKivaProgressCard:qe},setup(){return{args:n}},template:`
      <div style="width: 379px;">
        <MyKivaProgressCard v-bind="args" style="${n.height?`height: ${n.height}px;`:""}" />
      </div>
    `});return w.args=n,w},d=t({goal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:0,isAnnualGoal:!0}),p=t({goal:{target:100,category:"ID_WOMENS_EQUALITY"},goalProgress:38,isAnnualGoal:!0}),A=t({goal:{target:100,category:"ID_WOMENS_EQUALITY"},goalProgress:100,isAnnualGoal:!0}),_=t({goal:{target:5,name:"Women",category:O,nextAchievementAt:1,totalLoans:0},goalProgress:0}),v=t({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:O,nextAchievementAt:10,totalLoans:20},goalProgress:4}),h=t({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:O,nextAchievementAt:0,totalLoans:1200},goalProgress:5}),y=t({goal:{target:10,name:"Refugees",category:T,nextAchievementAt:1,totalLoans:0},goalProgress:0}),f=t({goal:{target:5,name:"Refugees",category:T,nextAchievementAt:10,totalLoans:20},goalProgress:3}),I=t({goal:{target:5,name:"Refugees",category:T,nextAchievementAt:0,totalLoans:200},goalProgress:5}),P=t({goal:{target:10,name:"Climate Action",category:M,nextAchievementAt:1,totalLoans:0},goalProgress:0}),L=t({goal:{target:5,name:"Climate Action",category:M,nextAchievementAt:10,totalLoans:20},goalProgress:3}),S=t({goal:{target:5,name:"Climate Action",category:M,nextAchievementAt:0,totalLoans:200},goalProgress:5}),x=t({goal:{target:10,name:"Basic Needs",category:D,nextAchievementAt:1,totalLoans:0},goalProgress:0}),C=t({goal:{target:5,name:"Basic Needs",category:D,nextAchievementAt:10,totalLoans:20},goalProgress:3}),E=t({goal:{target:5,name:"Basic Needs",category:D,nextAchievementAt:0,totalLoans:200},goalProgress:5}),b=t({goal:{target:10,name:"U.S. Business",category:Y,nextAchievementAt:1,totalLoans:0},goalProgress:0}),U=t({goal:{target:5,name:"U.S. Business",category:Y,nextAchievementAt:10,totalLoans:20},goalProgress:3}),N=t({goal:{target:5,name:"U.S. Business",category:Y,nextAchievementAt:0,totalLoans:200},goalProgress:5});var z,q,V;d.parameters={...d.parameters,docs:{...(z=d.parameters)==null?void 0:z.docs,source:{originalSource:`story({
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
})`,...(Se=(Le=L.parameters)==null?void 0:Le.docs)==null?void 0:Se.source}}};var xe,Ce,Ee;S.parameters={...S.parameters,docs:{...(xe=S.parameters)==null?void 0:xe.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(Ee=(Ce=S.parameters)==null?void 0:Ce.docs)==null?void 0:Ee.source}}};var be,Ue,Ne;x.parameters={...x.parameters,docs:{...(be=x.parameters)==null?void 0:be.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(Ne=(Ue=x.parameters)==null?void 0:Ue.docs)==null?void 0:Ne.source}}};var Oe,Me,Te;C.parameters={...C.parameters,docs:{...(Oe=C.parameters)==null?void 0:Oe.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(Te=(Me=C.parameters)==null?void 0:Me.docs)==null?void 0:Te.source}}};var De,we,Be;E.parameters={...E.parameters,docs:{...(De=E.parameters)==null?void 0:De.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(Be=(we=E.parameters)==null?void 0:we.docs)==null?void 0:Be.source}}};var Ge,Re,We;b.parameters={...b.parameters,docs:{...(Ge=b.parameters)==null?void 0:Ge.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(We=(Re=b.parameters)==null?void 0:Re.docs)==null?void 0:We.source}}};var Ye,ke,je;U.parameters={...U.parameters,docs:{...(Ye=U.parameters)==null?void 0:Ye.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(je=(ke=U.parameters)==null?void 0:ke.docs)==null?void 0:je.source}}};var Qe,Ke,$e;N.parameters={...N.parameters,docs:{...(Qe=N.parameters)==null?void 0:Qe.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...($e=(Ke=N.parameters)==null?void 0:Ke.docs)==null?void 0:$e.source}}};const qt=["Default","InProgressGoal","CompletedGoal","AchievementWomen","AchievementWomenInProgress","AchievementWomenCompleted","AchievementRefugees","AchievementRefugeesInProgress","AchievementRefugeesCompleted","AchievementClimateAction","AchievementClimateActionInProgress","AchievementClimateActionCompleted","AchievementBasicNeeds","AchievementBasicNeedsInProgress","AchievementBasicNeedsCompleted","AchievementUSBusiness","AchievementUSBusinessInProgress","AchievementUSBusinessCompleted"];export{x as AchievementBasicNeeds,E as AchievementBasicNeedsCompleted,C as AchievementBasicNeedsInProgress,P as AchievementClimateAction,S as AchievementClimateActionCompleted,L as AchievementClimateActionInProgress,y as AchievementRefugees,I as AchievementRefugeesCompleted,f as AchievementRefugeesInProgress,b as AchievementUSBusiness,N as AchievementUSBusinessCompleted,U as AchievementUSBusinessInProgress,_ as AchievementWomen,h as AchievementWomenCompleted,v as AchievementWomenInProgress,A as CompletedGoal,d as Default,p as InProgressGoal,qt as __namedExportsOrder,zt as default};
