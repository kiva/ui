import{q as o,o as p,c as d,a as g,d as H,u as A,n as _,t as i,g as v,e as _t,j as vt}from"./entry-vue.esm-bundler-BYzU99W7uH.js";import"./entry-KvWwwHeaderBasic-D-dYqQTzhh.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import{n as ht}from"./entry-numeral-xVHG5DEP0A.js";import{M as yt}from"./entry-KvProgressCircle-Cn_llL2aCm.js";import{K as ft}from"./entry-KvIcon-DwxBcAik-4.js";import{_ as Lt}from"./entry-KvButton-DBpMdhUDo3.js";import{d as W,b as Y,c as Q,I as k,M as It,a as V}from"./entry-useBadgeData-D_2cNaEw10.js";import{G as Pt,_ as Et}from"./entry-useGoalData-CgCy7catT-.js";import{m as St}from"./entry-importHelpers-zIMYNa8D_v.js";import{_ as Tt}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-9O9xxAVV.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-achievementUtils-D2hR7yj5fV.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-contentfulUtils-BSVc25-f1Y.js";import"./entry-index-7WUD3idviV.js";import"./entry-myKivaUtils-4-ur9tt9PN.js";import"./entry-flssUtils-8s65ZAh5E7.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterUtils-BxjxFhmwJz.js";import"./entry-orderBy-CuF8cTvHI1.js";import"./entry-_baseOrderBy-p4qs5UUyWO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseMap-Y3vx4Wl8dz.js";import"./entry-keys-WbbxK4vnp3.js";const xt=""+new URL("brand-DRsde_GU.png",import.meta.url).href,Ct=Object.freeze(Object.defineProperty({__proto__:null,default:xt},Symbol.toStringTag,{value:"Module"})),Nt=""+new URL("danger-highlight-NoVmckvK.png",import.meta.url).href,Ot=Object.freeze(Object.defineProperty({__proto__:null,default:Nt},Symbol.toStringTag,{value:"Module"})),Dt=""+new URL("eco-green-2-NN39MRhM.png",import.meta.url).href,Ut=Object.freeze(Object.defineProperty({__proto__:null,default:Dt},Symbol.toStringTag,{value:"Module"})),bt=""+new URL("eco-green-3-BrUWi9qr.png",import.meta.url).href,Mt=Object.freeze(Object.defineProperty({__proto__:null,default:bt},Symbol.toStringTag,{value:"Module"})),Gt=""+new URL("marigold-BvOK8dxz.png",import.meta.url).href,wt=Object.freeze(Object.defineProperty({__proto__:null,default:Gt},Symbol.toStringTag,{value:"Module"})),Bt=""+new URL("stone-3-ctGo-BuV.png",import.meta.url).href,Rt=Object.freeze(Object.defineProperty({__proto__:null,default:Bt},Symbol.toStringTag,{value:"Module"})),Wt={class:"progress-card"},Yt={class:"tw-relative tw-z-docked"},Qt={key:0,class:"tw-text-small"},kt={class:"tw-w-full"},jt={class:"tw-flex tw-items-center tw-gap-0.5"},$t={class:"tw-text-secondary tw-text-label"},Kt={class:"tw-text-button-link"},Ft={key:0,class:"tw-text-caption"},zt={key:1,class:"tw-w-full tw-flex tw-justify-end tw-mt-1"},Ht=["src"],ae=100,Vt=1e3,ut={__name:"MyKivaProgressCard",props:{goal:{type:Object,required:!0},goalProgress:{type:Number,required:!0},isAnnualGoal:{type:Boolean,default:!1},year:{type:Number,default:()=>Pt},isHistoricalGoal:{type:Boolean,default:!1}},setup(l){const X=St(Object.assign({"/src/assets/images/my-kiva/goal-progress-texture/brand.png":Ct,"/src/assets/images/my-kiva/goal-progress-texture/danger-highlight.png":Ot,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-2.png":Ut,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-3.png":Mt,"/src/assets/images/my-kiva/goal-progress-texture/marigold.png":wt,"/src/assets/images/my-kiva/goal-progress-texture/stone-3.png":Rt}),"/src/assets/images/my-kiva/goal-progress-texture/"),e=l,pt=o(()=>{var n,u,z;if(e.isAnnualGoal)return!((n=e.goal)!=null&&n.target)||e.goalProgress<=0?0:Math.min(Math.round(e.goalProgress/e.goal.target*100),ae);const t=((u=e.goal)==null?void 0:u.tierTarget)||0,r=((z=e.goal)==null?void 0:z.totalLoans)??0;return!t||r<=0?0:Math.min(Math.round(r/t*100),ae)}),c=o(()=>{var t,r,n;return((t=e.goal)==null?void 0:t.nextAchievementAt)>0?(r=e.goal)==null?void 0:r.tierTarget:((n=e.goal)==null?void 0:n.target)||0}),s=o(()=>e.goalProgress>=c.value),$=o(()=>{var r;const t=((r=e.goal)==null?void 0:r.totalLoans)??e.goalProgress;return Math.max(c.value-t,0)}),dt=o(()=>e.isAnnualGoal?`Your ${e.year} goal`:e.goal.name),J=o(()=>{var t,r;if(e.isHistoricalGoal){const n=e.goalProgress??0,u=c.value;return`Completed ${n} of ${u} ${u===1?"loan":"loans"}`}return e.isAnnualGoal&&s.value?"You’ve completed your goal!":e.isAnnualGoal?$.value===1?`${$.value} loan to complete your goal.`:`${$.value} loans to complete your goal.`:s.value?"All badges earned!":`${((t=e.goal)==null?void 0:t.nextAchievementAt)??0} loan${((r=e.goal)==null?void 0:r.nextAchievementAt)!==1?"s":""} to unlock next badge.`}),Z=o(()=>{var r,n;if(s.value&&e.isAnnualGoal)return c.value;if(e.isAnnualGoal)return e.goalProgress;if(!s.value)return((r=e.goal)==null?void 0:r.totalLoans)??e.goalProgress;const t=Math.min(((n=e.goal)==null?void 0:n.totalLoans)??0,It);return t>Vt?ht(t).format("0.0a"):t}),m=o(()=>s.value&&e.isAnnualGoal||e.isAnnualGoal||!s.value?c.value:null),ee=t=>Number(t)>999,K=o(()=>{const t=m.value!==null&&ee(m.value);return ee(Z.value)||t}),At=o(()=>e.isAnnualGoal?"Annual goal":"Lifetime achievement"),te=o(()=>{var r;if(e.isAnnualGoal&&s.value||e.isHistoricalGoal)return"";const t=e.isAnnualGoal?e.goalProgress??0:((r=e.goal)==null?void 0:r.totalLoans)??e.goalProgress??0;return!s.value&&t<=0?"Get started":s.value?"See details":"Continue"}),F=o(()=>e.isAnnualGoal?"brand":e.goal.category===W?"marigold":e.goal.category===Y?"eco-green-3":e.goal.category===Q?"danger-highlight":e.goal.category===k?"stone-3":"eco-green-2");return(t,r)=>(p(),d("div",Wt,[g("div",Yt,[H(A(yt),{class:"progress-circle","stroke-width":20,value:pt.value,max:c.value,rotate:180,color:F.value},null,8,["value","max","color"]),g("div",{class:_(["progress-circle-content",{"tw-mt-0.5":s.value&&!l.isAnnualGoal}])},[g("p",{class:_(["progress-value tw-text-center tw-text-label",K.value?"tw-flex tw-flex-col":"tw-whitespace-nowrap"])},[g("span",null,i(Z.value),1),m.value!==null?(p(),d("span",{key:0,class:_(K.value?"":"tw-inline")},i(K.value?`/${m.value}`:` / ${m.value}`),3)):v("",!0)],2),s.value&&!l.isAnnualGoal?(p(),d("p",Qt," loans ")):v("",!0)],2)]),g("div",kt,[g("div",jt,[H(A(ft),{class:"tw-text-gray-400 tw-h-2 tw-w-2",name:l.isAnnualGoal?"annual-goal-flag":"progress-checkmark"},null,8,["name"]),g("p",$t,i(At.value),1)]),g("p",Kt,i(dt.value),1),J.value?(p(),d("p",Ft,i(J.value),1)):v("",!0),te.value?(p(),d("div",zt,[H(A(Lt),{class:"text-link !tw-text-eco-green-3"},{default:_t(()=>[vt(i(te.value),1)],void 0),_:1})])):v("",!0)]),g("img",{class:_(["tw-absolute tw-z-2","card-texture",`card-texture--${F.value}`]),alt:"Card color decorative stain",src:A(X)(`${F.value}.png`)},null,10,Ht)]))}},q=Tt(ut,[["__scopeId","data-v-aadcbf85"]]);ut.__docgenInfo={exportName:"default",displayName:"MyKivaProgressCard",description:"",tags:{},props:[{name:"goal",type:{name:"object"},required:!0},{name:"goalProgress",type:{name:"number"},required:!0},{name:"isAnnualGoal",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"year",type:{name:"number"},defaultValue:{func:!0,value:"() => GOALS_CURRENT_YEAR"}},{name:"isHistoricalGoal",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/MyKivaProgressCard.vue"]};q.preFetchOperations=[...Et];const Na={title:"MyKiva/MyKivaProgressCard",component:q},a=(l={})=>{const j=(X,{argTypes:e})=>({props:Object.keys(e),components:{MyKivaProgressCard:q},setup(){return{args:l}},template:`
      <div style="width: 379px;">
        <MyKivaProgressCard v-bind="args" style="${l.height?`height: ${l.height}px;`:""}" />
      </div>
    `});return j.args=l,j},h=a({goal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:0,isAnnualGoal:!0}),y=a({goal:{target:100,category:"ID_WOMENS_EQUALITY"},goalProgress:38,isAnnualGoal:!0}),f=a({goal:{target:100,category:"ID_WOMENS_EQUALITY"},goalProgress:100,isAnnualGoal:!0}),L=a({goal:{target:999,category:"ID_WOMENS_EQUALITY",tierTarget:1e3,totalLoans:380},goalProgress:380}),I=a({goal:{target:1e4,category:"ID_WOMENS_EQUALITY",tierTarget:1e4,totalLoans:3800},goalProgress:3800}),P=a({goal:{target:1e5,category:"ID_WOMENS_EQUALITY",tierTarget:1e5,totalLoans:38e3},goalProgress:38e3}),E=a({goal:{target:5,name:"Women",category:W,nextAchievementAt:1,totalLoans:0,tierTarget:10},goalProgress:0}),S=a({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:W,nextAchievementAt:10,totalLoans:20,tierTarget:30},goalProgress:4}),T=a({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:W,nextAchievementAt:0,totalLoans:1200},goalProgress:5}),x=a({goal:{target:10,name:"Refugees",category:Q,nextAchievementAt:1,totalLoans:0,tierTarget:20},goalProgress:0}),C=a({goal:{target:5,name:"Refugees",category:Q,nextAchievementAt:10,totalLoans:20,tierTarget:30},goalProgress:3}),N=a({goal:{target:5,name:"Refugees",category:Q,nextAchievementAt:0,totalLoans:200},goalProgress:5}),O=a({goal:{target:10,name:"Climate Action",category:Y,nextAchievementAt:1,totalLoans:0,tierTarget:100},goalProgress:0}),D=a({goal:{target:5,name:"Climate Action",category:Y,nextAchievementAt:10,totalLoans:20,tierTarget:30},goalProgress:3}),U=a({goal:{target:5,name:"Climate Action",category:Y,nextAchievementAt:0,totalLoans:200},goalProgress:5}),b=a({goal:{target:10,name:"Basic Needs",category:k,nextAchievementAt:1,totalLoans:0,tierTarget:20},goalProgress:0}),M=a({goal:{target:5,name:"Basic Needs",category:k,nextAchievementAt:10,totalLoans:20,tierTarget:30},goalProgress:3}),G=a({goal:{target:5,name:"Basic Needs",category:k,nextAchievementAt:0,totalLoans:200},goalProgress:5}),w=a({goal:{target:10,name:"U.S. Business",category:V,nextAchievementAt:1,totalLoans:0,tierTarget:20},goalProgress:0}),B=a({goal:{target:5,name:"U.S. Business",category:V,nextAchievementAt:10,totalLoans:20},goalProgress:3}),R=a({goal:{target:5,name:"U.S. Business",category:V,nextAchievementAt:0,totalLoans:200},goalProgress:5});var re,oe,se;h.parameters={...h.parameters,docs:{...(re=h.parameters)==null?void 0:re.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 0,
  isAnnualGoal: true
})`,...(se=(oe=h.parameters)==null?void 0:oe.docs)==null?void 0:se.source}}};var ne,le,ge;y.parameters={...y.parameters,docs:{...(ne=y.parameters)==null?void 0:ne.docs,source:{originalSource:`story({
  goal: {
    target: 100,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 38,
  isAnnualGoal: true
})`,...(ge=(le=y.parameters)==null?void 0:le.docs)==null?void 0:ge.source}}};var ce,ie,me;f.parameters={...f.parameters,docs:{...(ce=f.parameters)==null?void 0:ce.docs,source:{originalSource:`story({
  goal: {
    target: 100,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 100,
  isAnnualGoal: true
})`,...(me=(ie=f.parameters)==null?void 0:ie.docs)==null?void 0:me.source}}};var ue,pe,de;L.parameters={...L.parameters,docs:{...(ue=L.parameters)==null?void 0:ue.docs,source:{originalSource:`story({
  goal: {
    target: 999,
    category: 'ID_WOMENS_EQUALITY',
    tierTarget: 1000,
    totalLoans: 380
  },
  goalProgress: 380
})`,...(de=(pe=L.parameters)==null?void 0:pe.docs)==null?void 0:de.source}}};var Ae,_e,ve;I.parameters={...I.parameters,docs:{...(Ae=I.parameters)==null?void 0:Ae.docs,source:{originalSource:`story({
  goal: {
    target: 10000,
    category: 'ID_WOMENS_EQUALITY',
    tierTarget: 10000,
    totalLoans: 3800
  },
  goalProgress: 3800
})`,...(ve=(_e=I.parameters)==null?void 0:_e.docs)==null?void 0:ve.source}}};var he,ye,fe;P.parameters={...P.parameters,docs:{...(he=P.parameters)==null?void 0:he.docs,source:{originalSource:`story({
  goal: {
    target: 100000,
    category: 'ID_WOMENS_EQUALITY',
    tierTarget: 100000,
    totalLoans: 38000
  },
  goalProgress: 38000
})`,...(fe=(ye=P.parameters)==null?void 0:ye.docs)==null?void 0:fe.source}}};var Le,Ie,Pe;E.parameters={...E.parameters,docs:{...(Le=E.parameters)==null?void 0:Le.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 10
  },
  goalProgress: 0
})`,...(Pe=(Ie=E.parameters)==null?void 0:Ie.docs)==null?void 0:Pe.source}}};var Ee,Se,Te;S.parameters={...S.parameters,docs:{...(Ee=S.parameters)==null?void 0:Ee.docs,source:{originalSource:`story({
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
})`,...(Te=(Se=S.parameters)==null?void 0:Se.docs)==null?void 0:Te.source}}};var xe,Ce,Ne;T.parameters={...T.parameters,docs:{...(xe=T.parameters)==null?void 0:xe.docs,source:{originalSource:`story({
  tag: 'Lifetime achievement',
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 1200
  },
  goalProgress: 5
})`,...(Ne=(Ce=T.parameters)==null?void 0:Ce.docs)==null?void 0:Ne.source}}};var Oe,De,Ue;x.parameters={...x.parameters,docs:{...(Oe=x.parameters)==null?void 0:Oe.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 20
  },
  goalProgress: 0
})`,...(Ue=(De=x.parameters)==null?void 0:De.docs)==null?void 0:Ue.source}}};var be,Me,Ge;C.parameters={...C.parameters,docs:{...(be=C.parameters)==null?void 0:be.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20,
    tierTarget: 30
  },
  goalProgress: 3
})`,...(Ge=(Me=C.parameters)==null?void 0:Me.docs)==null?void 0:Ge.source}}};var we,Be,Re;N.parameters={...N.parameters,docs:{...(we=N.parameters)==null?void 0:we.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(Re=(Be=N.parameters)==null?void 0:Be.docs)==null?void 0:Re.source}}};var We,Ye,Qe;O.parameters={...O.parameters,docs:{...(We=O.parameters)==null?void 0:We.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 100
  },
  goalProgress: 0
})`,...(Qe=(Ye=O.parameters)==null?void 0:Ye.docs)==null?void 0:Qe.source}}};var ke,je,$e;D.parameters={...D.parameters,docs:{...(ke=D.parameters)==null?void 0:ke.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 10,
    totalLoans: 20,
    tierTarget: 30
  },
  goalProgress: 3
})`,...($e=(je=D.parameters)==null?void 0:je.docs)==null?void 0:$e.source}}};var Ke,Fe,ze;U.parameters={...U.parameters,docs:{...(Ke=U.parameters)==null?void 0:Ke.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(ze=(Fe=U.parameters)==null?void 0:Fe.docs)==null?void 0:ze.source}}};var He,Ve,qe;b.parameters={...b.parameters,docs:{...(He=b.parameters)==null?void 0:He.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 20
  },
  goalProgress: 0
})`,...(qe=(Ve=b.parameters)==null?void 0:Ve.docs)==null?void 0:qe.source}}};var Xe,Je,Ze;M.parameters={...M.parameters,docs:{...(Xe=M.parameters)==null?void 0:Xe.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 10,
    totalLoans: 20,
    tierTarget: 30
  },
  goalProgress: 3
})`,...(Ze=(Je=M.parameters)==null?void 0:Je.docs)==null?void 0:Ze.source}}};var et,tt,at;G.parameters={...G.parameters,docs:{...(et=G.parameters)==null?void 0:et.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(at=(tt=G.parameters)==null?void 0:tt.docs)==null?void 0:at.source}}};var rt,ot,st;w.parameters={...w.parameters,docs:{...(rt=w.parameters)==null?void 0:rt.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 20
  },
  goalProgress: 0
})`,...(st=(ot=w.parameters)==null?void 0:ot.docs)==null?void 0:st.source}}};var nt,lt,gt;B.parameters={...B.parameters,docs:{...(nt=B.parameters)==null?void 0:nt.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(gt=(lt=B.parameters)==null?void 0:lt.docs)==null?void 0:gt.source}}};var ct,it,mt;R.parameters={...R.parameters,docs:{...(ct=R.parameters)==null?void 0:ct.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(mt=(it=R.parameters)==null?void 0:it.docs)==null?void 0:mt.source}}};const Oa=["Default","InProgressGoal","CompletedGoal","ThreeDigitsGoalLoans","FourDigitsGoalLoans","FiveDigitsGoalLoans","AchievementWomen","AchievementWomenInProgress","AchievementWomenCompleted","AchievementRefugees","AchievementRefugeesInProgress","AchievementRefugeesCompleted","AchievementClimateAction","AchievementClimateActionInProgress","AchievementClimateActionCompleted","AchievementBasicNeeds","AchievementBasicNeedsInProgress","AchievementBasicNeedsCompleted","AchievementUSBusiness","AchievementUSBusinessInProgress","AchievementUSBusinessCompleted"];export{b as AchievementBasicNeeds,G as AchievementBasicNeedsCompleted,M as AchievementBasicNeedsInProgress,O as AchievementClimateAction,U as AchievementClimateActionCompleted,D as AchievementClimateActionInProgress,x as AchievementRefugees,N as AchievementRefugeesCompleted,C as AchievementRefugeesInProgress,w as AchievementUSBusiness,R as AchievementUSBusinessCompleted,B as AchievementUSBusinessInProgress,E as AchievementWomen,T as AchievementWomenCompleted,S as AchievementWomenInProgress,f as CompletedGoal,h as Default,P as FiveDigitsGoalLoans,I as FourDigitsGoalLoans,y as InProgressGoal,L as ThreeDigitsGoalLoans,Oa as __namedExportsOrder,Na as default};
