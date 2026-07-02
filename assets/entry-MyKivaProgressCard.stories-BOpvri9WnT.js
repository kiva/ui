import{v as o,c as p,b as g,a as V,u as A,I as _,t as i,g as v,f as _t,o as d,h as vt}from"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-tailwind.config-DnDN25xoV6.js";import{n as ht}from"./entry-numeral-xVHG5DEP0A.js";import{M as yt}from"./entry-KvProgressCircle-DDaAGjncem.js";import{K as ft}from"./entry-KvIcon-Dux0tIgRb3.js";import{_ as Lt}from"./entry-KvButton-Q0ufDo4OiO.js";import{M as It,d as W,b as Y,c as Q,I as k,a as F}from"./entry-useBadgeData-DvNC4ibPVz.js";import{G as Pt}from"./entry-useGoalData-DQrSBIuF-f.js";import{m as Et}from"./entry-importHelpers-zIMYNa8D_v.js";import{_ as St}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-achievementUtils-D7MP6c4lcC.js";import"./entry-imageUtils-BO57SRLi2g.js";import"./entry-contentfulUtils-Cr2nj0VwiQ.js";import"./entry-index-Dew-HucFLB.js";import"./entry-myKivaUtils-4-ur9tt9PN.js";import"./entry-flssUtils-dzr0CljlIg.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterUtils-BxjxFhmwJz.js";import"./entry-orderBy-CuF8cTvHI1.js";import"./entry-_baseOrderBy-p4qs5UUyWO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseMap-Y3vx4Wl8dz.js";import"./entry-keys-WbbxK4vnp3.js";const Tt=""+new URL("brand-DRsde_GU.png",import.meta.url).href,xt=Object.freeze(Object.defineProperty({__proto__:null,default:Tt},Symbol.toStringTag,{value:"Module"})),Ct=""+new URL("danger-highlight-NoVmckvK.png",import.meta.url).href,Nt=Object.freeze(Object.defineProperty({__proto__:null,default:Ct},Symbol.toStringTag,{value:"Module"})),Ut=""+new URL("eco-green-2-NN39MRhM.png",import.meta.url).href,Dt=Object.freeze(Object.defineProperty({__proto__:null,default:Ut},Symbol.toStringTag,{value:"Module"})),Mt=""+new URL("eco-green-3-BrUWi9qr.png",import.meta.url).href,Ot=Object.freeze(Object.defineProperty({__proto__:null,default:Mt},Symbol.toStringTag,{value:"Module"})),bt=""+new URL("marigold-BvOK8dxz.png",import.meta.url).href,Gt=Object.freeze(Object.defineProperty({__proto__:null,default:bt},Symbol.toStringTag,{value:"Module"})),wt=""+new URL("stone-3-ctGo-BuV.png",import.meta.url).href,Bt=Object.freeze(Object.defineProperty({__proto__:null,default:wt},Symbol.toStringTag,{value:"Module"})),Rt={class:"progress-card"},Wt={class:"tw-relative tw-z-docked"},Yt={key:0,class:"tw-text-small"},Qt={class:"tw-w-full"},kt={class:"tw-flex tw-items-center tw-gap-0.5"},jt={class:"tw-text-secondary tw-text-label"},$t={class:"tw-text-title"},Kt={key:0,class:"tw-text-small"},zt={key:1,class:"tw-w-full tw-flex tw-justify-end tw-mt-1"},Ht=["src"],te=100,Vt=1e3,mt={__name:"MyKivaProgressCard",props:{goal:{type:Object,required:!0},goalProgress:{type:Number,required:!0},isAnnualGoal:{type:Boolean,default:!1},year:{type:Number,default:()=>Pt},isHistoricalGoal:{type:Boolean,default:!1}},setup(l){const q=Et(Object.assign({"/src/assets/images/my-kiva/goal-progress-texture/brand.png":xt,"/src/assets/images/my-kiva/goal-progress-texture/danger-highlight.png":Nt,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-2.png":Dt,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-3.png":Ot,"/src/assets/images/my-kiva/goal-progress-texture/marigold.png":Gt,"/src/assets/images/my-kiva/goal-progress-texture/stone-3.png":Bt}),"/src/assets/images/my-kiva/goal-progress-texture/"),e=l,pt=o(()=>{var n,u,H;if(e.isAnnualGoal)return!((n=e.goal)!=null&&n.target)||e.goalProgress<=0?0:Math.min(Math.round(e.goalProgress/e.goal.target*100),te);const t=((u=e.goal)==null?void 0:u.tierTarget)||0,r=((H=e.goal)==null?void 0:H.totalLoans)??0;return!t||r<=0?0:Math.min(Math.round(r/t*100),te)}),c=o(()=>{var t,r,n;return((t=e.goal)==null?void 0:t.nextAchievementAt)>0?(r=e.goal)==null?void 0:r.tierTarget:((n=e.goal)==null?void 0:n.target)||0}),s=o(()=>e.goalProgress>=c.value),$=o(()=>{var r;const t=((r=e.goal)==null?void 0:r.totalLoans)??e.goalProgress;return Math.max(c.value-t,0)}),dt=o(()=>e.isAnnualGoal?`Your ${e.year} goal`:e.goal.name),X=o(()=>{var t,r;if(e.isHistoricalGoal){const n=e.goalProgress??0,u=c.value;return`Completed ${n} of ${u} ${u===1?"loan":"loans"}`}return e.isAnnualGoal&&s.value?"You’ve completed your goal!":e.isAnnualGoal?$.value===1?`${$.value} loan to complete your goal.`:`${$.value} loans to complete your goal.`:s.value?"All badges earned!":`${((t=e.goal)==null?void 0:t.nextAchievementAt)??0} loan${((r=e.goal)==null?void 0:r.nextAchievementAt)!==1?"s":""} to unlock next badge.`}),J=o(()=>{var r,n;if(s.value&&e.isAnnualGoal)return c.value;if(e.isAnnualGoal)return e.goalProgress;if(!s.value)return((r=e.goal)==null?void 0:r.totalLoans)??e.goalProgress;const t=Math.min(((n=e.goal)==null?void 0:n.totalLoans)??0,It);return t>Vt?ht(t).format("0.0a"):t}),m=o(()=>s.value&&e.isAnnualGoal||e.isAnnualGoal||!s.value?c.value:null),Z=t=>Number(t)>999,K=o(()=>{const t=m.value!==null&&Z(m.value);return Z(J.value)||t}),At=o(()=>e.isAnnualGoal?"Annual goal":"Lifetime achievement"),ee=o(()=>{var r;if(e.isAnnualGoal&&s.value||e.isHistoricalGoal)return"";const t=e.isAnnualGoal?e.goalProgress??0:((r=e.goal)==null?void 0:r.totalLoans)??e.goalProgress??0;return!s.value&&t<=0?"Get started":s.value?"See details":"Continue"}),z=o(()=>e.isAnnualGoal?"brand":e.goal.category===W?"marigold":e.goal.category===Y?"eco-green-3":e.goal.category===Q?"danger-highlight":e.goal.category===k?"stone-3":"eco-green-2");return(t,r)=>(d(),p("div",Rt,[g("div",Wt,[V(A(yt),{class:"progress-circle","stroke-width":20,value:pt.value,max:c.value,rotate:180,color:z.value},null,8,["value","max","color"]),g("div",{class:_(["progress-circle-content",{"tw-mt-0.5":s.value&&!l.isAnnualGoal}])},[g("p",{class:_(["progress-value tw-text-center tw-text-label",K.value?"tw-flex tw-flex-col":"tw-whitespace-nowrap"])},[g("span",null,i(J.value),1),m.value!==null?(d(),p("span",{key:0,class:_(K.value?"":"tw-inline")},i(K.value?`/${m.value}`:` / ${m.value}`),3)):v("",!0)],2),s.value&&!l.isAnnualGoal?(d(),p("p",Yt," loans ")):v("",!0)],2)]),g("div",Qt,[g("div",kt,[V(A(ft),{class:"tw-text-gray-400 tw-h-2 tw-w-2",name:l.isAnnualGoal?"annual-goal-flag":"progress-checkmark"},null,8,["name"]),g("p",jt,i(At.value),1)]),g("p",$t,i(dt.value),1),X.value?(d(),p("p",Kt,i(X.value),1)):v("",!0),ee.value?(d(),p("div",zt,[V(A(Lt),{class:"text-link !tw-text-eco-green-3"},{default:_t(()=>[vt(i(ee.value),1)],void 0),_:1})])):v("",!0)]),g("img",{class:_(["tw-absolute tw-z-2","card-texture",`card-texture--${z.value}`]),alt:"Card color decorative stain",src:A(q)(`${z.value}.png`)},null,10,Ht)]))}},ut=St(mt,[["__scopeId","data-v-33393375"]]);mt.__docgenInfo={exportName:"default",displayName:"MyKivaProgressCard",description:"",tags:{},props:[{name:"goal",type:{name:"object"},required:!0},{name:"goalProgress",type:{name:"number"},required:!0},{name:"isAnnualGoal",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"year",type:{name:"number"},defaultValue:{func:!0,value:"() => GOALS_CURRENT_YEAR"}},{name:"isHistoricalGoal",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/MyKivaProgressCard.vue"]};const Ca={title:"MyKiva/MyKivaProgressCard",component:ut},a=(l={})=>{const j=(q,{argTypes:e})=>({props:Object.keys(e),components:{MyKivaProgressCard:ut},setup(){return{args:l}},template:`
      <div style="width: 379px;">
        <MyKivaProgressCard v-bind="args" style="${l.height?`height: ${l.height}px;`:""}" />
      </div>
    `});return j.args=l,j},h=a({goal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:0,isAnnualGoal:!0}),y=a({goal:{target:100,category:"ID_WOMENS_EQUALITY"},goalProgress:38,isAnnualGoal:!0}),f=a({goal:{target:100,category:"ID_WOMENS_EQUALITY"},goalProgress:100,isAnnualGoal:!0}),L=a({goal:{target:999,category:"ID_WOMENS_EQUALITY",tierTarget:1e3,totalLoans:380},goalProgress:380}),I=a({goal:{target:1e4,category:"ID_WOMENS_EQUALITY",tierTarget:1e4,totalLoans:3800},goalProgress:3800}),P=a({goal:{target:1e5,category:"ID_WOMENS_EQUALITY",tierTarget:1e5,totalLoans:38e3},goalProgress:38e3}),E=a({goal:{target:5,name:"Women",category:W,nextAchievementAt:1,totalLoans:0,tierTarget:10},goalProgress:0}),S=a({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:W,nextAchievementAt:10,totalLoans:20,tierTarget:30},goalProgress:4}),T=a({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:W,nextAchievementAt:0,totalLoans:1200},goalProgress:5}),x=a({goal:{target:10,name:"Refugees",category:Q,nextAchievementAt:1,totalLoans:0,tierTarget:20},goalProgress:0}),C=a({goal:{target:5,name:"Refugees",category:Q,nextAchievementAt:10,totalLoans:20,tierTarget:30},goalProgress:3}),N=a({goal:{target:5,name:"Refugees",category:Q,nextAchievementAt:0,totalLoans:200},goalProgress:5}),U=a({goal:{target:10,name:"Climate Action",category:Y,nextAchievementAt:1,totalLoans:0,tierTarget:100},goalProgress:0}),D=a({goal:{target:5,name:"Climate Action",category:Y,nextAchievementAt:10,totalLoans:20,tierTarget:30},goalProgress:3}),M=a({goal:{target:5,name:"Climate Action",category:Y,nextAchievementAt:0,totalLoans:200},goalProgress:5}),O=a({goal:{target:10,name:"Basic Needs",category:k,nextAchievementAt:1,totalLoans:0,tierTarget:20},goalProgress:0}),b=a({goal:{target:5,name:"Basic Needs",category:k,nextAchievementAt:10,totalLoans:20,tierTarget:30},goalProgress:3}),G=a({goal:{target:5,name:"Basic Needs",category:k,nextAchievementAt:0,totalLoans:200},goalProgress:5}),w=a({goal:{target:10,name:"U.S. Business",category:F,nextAchievementAt:1,totalLoans:0,tierTarget:20},goalProgress:0}),B=a({goal:{target:5,name:"U.S. Business",category:F,nextAchievementAt:10,totalLoans:20},goalProgress:3}),R=a({goal:{target:5,name:"U.S. Business",category:F,nextAchievementAt:0,totalLoans:200},goalProgress:5});var ae,re,oe;h.parameters={...h.parameters,docs:{...(ae=h.parameters)==null?void 0:ae.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 0,
  isAnnualGoal: true
})`,...(oe=(re=h.parameters)==null?void 0:re.docs)==null?void 0:oe.source}}};var se,ne,le;y.parameters={...y.parameters,docs:{...(se=y.parameters)==null?void 0:se.docs,source:{originalSource:`story({
  goal: {
    target: 100,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 38,
  isAnnualGoal: true
})`,...(le=(ne=y.parameters)==null?void 0:ne.docs)==null?void 0:le.source}}};var ge,ce,ie;f.parameters={...f.parameters,docs:{...(ge=f.parameters)==null?void 0:ge.docs,source:{originalSource:`story({
  goal: {
    target: 100,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 100,
  isAnnualGoal: true
})`,...(ie=(ce=f.parameters)==null?void 0:ce.docs)==null?void 0:ie.source}}};var me,ue,pe;L.parameters={...L.parameters,docs:{...(me=L.parameters)==null?void 0:me.docs,source:{originalSource:`story({
  goal: {
    target: 999,
    category: 'ID_WOMENS_EQUALITY',
    tierTarget: 1000,
    totalLoans: 380
  },
  goalProgress: 380
})`,...(pe=(ue=L.parameters)==null?void 0:ue.docs)==null?void 0:pe.source}}};var de,Ae,_e;I.parameters={...I.parameters,docs:{...(de=I.parameters)==null?void 0:de.docs,source:{originalSource:`story({
  goal: {
    target: 10000,
    category: 'ID_WOMENS_EQUALITY',
    tierTarget: 10000,
    totalLoans: 3800
  },
  goalProgress: 3800
})`,...(_e=(Ae=I.parameters)==null?void 0:Ae.docs)==null?void 0:_e.source}}};var ve,he,ye;P.parameters={...P.parameters,docs:{...(ve=P.parameters)==null?void 0:ve.docs,source:{originalSource:`story({
  goal: {
    target: 100000,
    category: 'ID_WOMENS_EQUALITY',
    tierTarget: 100000,
    totalLoans: 38000
  },
  goalProgress: 38000
})`,...(ye=(he=P.parameters)==null?void 0:he.docs)==null?void 0:ye.source}}};var fe,Le,Ie;E.parameters={...E.parameters,docs:{...(fe=E.parameters)==null?void 0:fe.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 10
  },
  goalProgress: 0
})`,...(Ie=(Le=E.parameters)==null?void 0:Le.docs)==null?void 0:Ie.source}}};var Pe,Ee,Se;S.parameters={...S.parameters,docs:{...(Pe=S.parameters)==null?void 0:Pe.docs,source:{originalSource:`story({
  tag: 'Lifetime achievement',
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20,
    tierTarget: 30
  },
  goalProgress: 4
})`,...(Se=(Ee=S.parameters)==null?void 0:Ee.docs)==null?void 0:Se.source}}};var Te,xe,Ce;T.parameters={...T.parameters,docs:{...(Te=T.parameters)==null?void 0:Te.docs,source:{originalSource:`story({
  tag: 'Lifetime achievement',
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 1200
  },
  goalProgress: 5
})`,...(Ce=(xe=T.parameters)==null?void 0:xe.docs)==null?void 0:Ce.source}}};var Ne,Ue,De;x.parameters={...x.parameters,docs:{...(Ne=x.parameters)==null?void 0:Ne.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 20
  },
  goalProgress: 0
})`,...(De=(Ue=x.parameters)==null?void 0:Ue.docs)==null?void 0:De.source}}};var Me,Oe,be;C.parameters={...C.parameters,docs:{...(Me=C.parameters)==null?void 0:Me.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20,
    tierTarget: 30
  },
  goalProgress: 3
})`,...(be=(Oe=C.parameters)==null?void 0:Oe.docs)==null?void 0:be.source}}};var Ge,we,Be;N.parameters={...N.parameters,docs:{...(Ge=N.parameters)==null?void 0:Ge.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(Be=(we=N.parameters)==null?void 0:we.docs)==null?void 0:Be.source}}};var Re,We,Ye;U.parameters={...U.parameters,docs:{...(Re=U.parameters)==null?void 0:Re.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 100
  },
  goalProgress: 0
})`,...(Ye=(We=U.parameters)==null?void 0:We.docs)==null?void 0:Ye.source}}};var Qe,ke,je;D.parameters={...D.parameters,docs:{...(Qe=D.parameters)==null?void 0:Qe.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 10,
    totalLoans: 20,
    tierTarget: 30
  },
  goalProgress: 3
})`,...(je=(ke=D.parameters)==null?void 0:ke.docs)==null?void 0:je.source}}};var $e,Ke,ze;M.parameters={...M.parameters,docs:{...($e=M.parameters)==null?void 0:$e.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(ze=(Ke=M.parameters)==null?void 0:Ke.docs)==null?void 0:ze.source}}};var He,Ve,Fe;O.parameters={...O.parameters,docs:{...(He=O.parameters)==null?void 0:He.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 20
  },
  goalProgress: 0
})`,...(Fe=(Ve=O.parameters)==null?void 0:Ve.docs)==null?void 0:Fe.source}}};var qe,Xe,Je;b.parameters={...b.parameters,docs:{...(qe=b.parameters)==null?void 0:qe.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 10,
    totalLoans: 20,
    tierTarget: 30
  },
  goalProgress: 3
})`,...(Je=(Xe=b.parameters)==null?void 0:Xe.docs)==null?void 0:Je.source}}};var Ze,et,tt;G.parameters={...G.parameters,docs:{...(Ze=G.parameters)==null?void 0:Ze.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(tt=(et=G.parameters)==null?void 0:et.docs)==null?void 0:tt.source}}};var at,rt,ot;w.parameters={...w.parameters,docs:{...(at=w.parameters)==null?void 0:at.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 20
  },
  goalProgress: 0
})`,...(ot=(rt=w.parameters)==null?void 0:rt.docs)==null?void 0:ot.source}}};var st,nt,lt;B.parameters={...B.parameters,docs:{...(st=B.parameters)==null?void 0:st.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(lt=(nt=B.parameters)==null?void 0:nt.docs)==null?void 0:lt.source}}};var gt,ct,it;R.parameters={...R.parameters,docs:{...(gt=R.parameters)==null?void 0:gt.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(it=(ct=R.parameters)==null?void 0:ct.docs)==null?void 0:it.source}}};const Na=["Default","InProgressGoal","CompletedGoal","ThreeDigitsGoalLoans","FourDigitsGoalLoans","FiveDigitsGoalLoans","AchievementWomen","AchievementWomenInProgress","AchievementWomenCompleted","AchievementRefugees","AchievementRefugeesInProgress","AchievementRefugeesCompleted","AchievementClimateAction","AchievementClimateActionInProgress","AchievementClimateActionCompleted","AchievementBasicNeeds","AchievementBasicNeedsInProgress","AchievementBasicNeedsCompleted","AchievementUSBusiness","AchievementUSBusinessInProgress","AchievementUSBusinessCompleted"];export{O as AchievementBasicNeeds,G as AchievementBasicNeedsCompleted,b as AchievementBasicNeedsInProgress,U as AchievementClimateAction,M as AchievementClimateActionCompleted,D as AchievementClimateActionInProgress,x as AchievementRefugees,N as AchievementRefugeesCompleted,C as AchievementRefugeesInProgress,w as AchievementUSBusiness,R as AchievementUSBusinessCompleted,B as AchievementUSBusinessInProgress,E as AchievementWomen,T as AchievementWomenCompleted,S as AchievementWomenInProgress,f as CompletedGoal,h as Default,P as FiveDigitsGoalLoans,I as FourDigitsGoalLoans,y as InProgressGoal,L as ThreeDigitsGoalLoans,Na as __namedExportsOrder,Ca as default};
