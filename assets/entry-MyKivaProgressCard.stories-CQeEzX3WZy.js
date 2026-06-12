import{q as o,c as j,b as n,a as K,u,H as d,t as i,e as J,j as _t,o as $,N as vt}from"./entry-vue.esm-bundler-D6rjCHbx5a.js";import"./entry-KvWwwHeaderBasic-4oh2xxIPzA.js";import"./entry-tailwind.config-DnDN25xoV6.js";import{n as ht}from"./entry-numeral-xVHG5DEP0A.js";import{M as yt}from"./entry-KvProgressCircle-C9dUbhfhhK.js";import{K as ft}from"./entry-KvIcon-DUB3O_ZZZb.js";import{_ as Lt}from"./entry-KvButton-vMjvOQ2KYp.js";import{M as It,d as w,b as G,c as B,I as R,a as z}from"./entry-useBadgeData-DEkzn0bjyJ.js";import{m as Pt}from"./entry-importHelpers-zIMYNa8D_v.js";import{_ as Et}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-B_VjIxz4TE.js";import"./iframe-CU7a1Js9.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-achievementUtils-DcTubJ55vm.js";import"./entry-imageUtils-BO57SRLi2g.js";import"./entry-contentfulUtils-JT_-ZZ_Xjb.js";import"./entry-index-Dew-HucFLB.js";const St=""+new URL("brand-DRsde_GU.png",import.meta.url).href,Tt=Object.freeze(Object.defineProperty({__proto__:null,default:St},Symbol.toStringTag,{value:"Module"})),xt=""+new URL("danger-highlight-NoVmckvK.png",import.meta.url).href,Ct=Object.freeze(Object.defineProperty({__proto__:null,default:xt},Symbol.toStringTag,{value:"Module"})),Nt=""+new URL("eco-green-2-NN39MRhM.png",import.meta.url).href,Dt=Object.freeze(Object.defineProperty({__proto__:null,default:Nt},Symbol.toStringTag,{value:"Module"})),Mt=""+new URL("eco-green-3-BrUWi9qr.png",import.meta.url).href,Ut=Object.freeze(Object.defineProperty({__proto__:null,default:Mt},Symbol.toStringTag,{value:"Module"})),Ot=""+new URL("marigold-BvOK8dxz.png",import.meta.url).href,bt=Object.freeze(Object.defineProperty({__proto__:null,default:Ot},Symbol.toStringTag,{value:"Module"})),wt=""+new URL("stone-3-ctGo-BuV.png",import.meta.url).href,Gt=Object.freeze(Object.defineProperty({__proto__:null,default:wt},Symbol.toStringTag,{value:"Module"})),Bt={class:"progress-card"},Rt={class:"tw-relative tw-z-docked"},Wt={key:0,class:"tw-text-small"},Yt={class:"tw-w-full"},Qt={class:"tw-flex tw-items-center tw-gap-0.5"},kt={class:"tw-text-secondary tw-text-label tw-font-medium"},jt={class:"tw-font-medium"},Kt={class:"tw-text-small"},$t={class:"tw-w-full tw-flex tw-justify-end tw-mt-1"},zt=["src"],Z=100,Ft=1e3,ct={__name:"MyKivaProgressCard",props:{goal:{type:Object,required:!0},goalProgress:{type:Number,required:!0},isAnnualGoal:{type:Boolean,default:!1}},setup(l){const F=Pt(Object.assign({"/src/assets/images/my-kiva/goal-progress-texture/brand.png":Tt,"/src/assets/images/my-kiva/goal-progress-texture/danger-highlight.png":Ct,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-2.png":Dt,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-3.png":Ut,"/src/assets/images/my-kiva/goal-progress-texture/marigold.png":bt,"/src/assets/images/my-kiva/goal-progress-texture/stone-3.png":Gt}),"/src/assets/images/my-kiva/goal-progress-texture/"),e=l,mt=o(()=>{var g,H,X;if(e.isAnnualGoal)return!((g=e.goal)!=null&&g.target)||e.goalProgress<=0?0:Math.min(Math.round(e.goalProgress/e.goal.target*100),Z);const t=((H=e.goal)==null?void 0:H.tierTarget)||0,r=((X=e.goal)==null?void 0:X.totalLoans)??0;return!t||r<=0?0:Math.min(Math.round(r/t*100),Z)}),c=o(()=>{var t,r,g;return((t=e.goal)==null?void 0:t.nextAchievementAt)>0?(r=e.goal)==null?void 0:r.tierTarget:((g=e.goal)==null?void 0:g.target)||0}),s=o(()=>e.goalProgress>=c.value),Y=o(()=>{var r;const t=((r=e.goal)==null?void 0:r.totalLoans)??e.goalProgress;return Math.max(c.value-t,0)}),ut=o(()=>e.isAnnualGoal?"Your goal":e.goal.name),dt=o(()=>{var t,r;return e.isAnnualGoal&&s.value?"You’ve completed your goal!":e.isAnnualGoal?Y.value===1?`${Y.value} loan to complete your goal.`:`${Y.value} loans to complete your goal.`:s.value?"All badges earned!":`${((t=e.goal)==null?void 0:t.nextAchievementAt)??0} loan${((r=e.goal)==null?void 0:r.nextAchievementAt)!==1?"s":""} to unlock next badge.`}),q=o(()=>{var r,g;if(s.value&&e.isAnnualGoal)return c.value;if(e.isAnnualGoal)return e.goalProgress;if(!s.value)return((r=e.goal)==null?void 0:r.totalLoans)??e.goalProgress;const t=Math.min(((g=e.goal)==null?void 0:g.totalLoans)??0,It);return t>Ft?ht(t).format("0.0a"):t}),m=o(()=>s.value&&e.isAnnualGoal||e.isAnnualGoal||!s.value?c.value:null),V=t=>Number(t)>999,Q=o(()=>{const t=m.value!==null&&V(m.value);return V(q.value)||t}),pt=o(()=>e.isAnnualGoal?"2026 annual goal":"Lifetime achievement"),At=o(()=>{var r;if(e.isAnnualGoal&&s.value)return"";const t=e.isAnnualGoal?e.goalProgress??0:((r=e.goal)==null?void 0:r.totalLoans)??e.goalProgress??0;return!s.value&&t<=0?"Get started":s.value?"See details":"Continue"}),k=o(()=>e.isAnnualGoal?"brand":e.goal.category===w?"marigold":e.goal.category===G?"eco-green-3":e.goal.category===B?"danger-highlight":e.goal.category===R?"stone-3":"eco-green-2");return(t,r)=>($(),j("div",Bt,[n("div",Rt,[K(u(yt),{class:"progress-circle","stroke-width":20,value:mt.value,max:c.value,rotate:180,color:k.value},null,8,["value","max","color"]),n("div",{class:d(["progress-circle-content",{"tw-mt-0.5":s.value&&!l.isAnnualGoal}])},[n("h5",{class:d(["progress-value tw-text-center tw-text-label tw-font-medium",Q.value?"tw-flex tw-flex-col tw-leading-tight":"tw-whitespace-nowrap"]),style:{"letter-spacing":"-0.05rem"}},[n("span",null,i(q.value),1),m.value!==null?($(),j("span",{key:0,class:d(Q.value?"":"tw-inline")},i(Q.value?`/${m.value}`:` / ${m.value}`),3)):J("",!0)],2),s.value&&!l.isAnnualGoal?($(),j("p",Wt," loans ")):J("",!0)],2)]),n("div",Yt,[n("div",Qt,[K(u(ft),{class:"tw-text-gray-400 tw-h-2 tw-w-2",name:l.isAnnualGoal?"annual-goal-flag":"progress-checkmark"},null,8,["name"]),n("h5",kt,i(pt.value),1)]),n("p",jt,i(ut.value),1),n("p",Kt,i(dt.value),1),n("div",$t,[K(u(Lt),{class:"text-link tw-font-medium !tw-text-eco-green-3"},{default:_t(()=>[vt(i(At.value),1)],void 0),_:1})])]),n("img",{class:d(["tw-absolute tw-z-2","card-texture",`card-texture--${k.value}`]),alt:"Card color decorative stain",src:u(F)(`${k.value}.png`)},null,10,zt)]))}},it=Et(ct,[["__scopeId","data-v-ba330117"]]);ct.__docgenInfo={exportName:"default",displayName:"MyKivaProgressCard",description:"",tags:{},props:[{name:"goal",type:{name:"object"},required:!0},{name:"goalProgress",type:{name:"number"},required:!0},{name:"isAnnualGoal",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/MyKivaProgressCard.vue"]};const pa={title:"MyKiva/MyKivaProgressCard",component:it},a=(l={})=>{const W=(F,{argTypes:e})=>({props:Object.keys(e),components:{MyKivaProgressCard:it},setup(){return{args:l}},template:`
      <div style="width: 379px;">
        <MyKivaProgressCard v-bind="args" style="${l.height?`height: ${l.height}px;`:""}" />
      </div>
    `});return W.args=l,W},p=a({goal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:0,isAnnualGoal:!0}),A=a({goal:{target:100,category:"ID_WOMENS_EQUALITY"},goalProgress:38,isAnnualGoal:!0}),_=a({goal:{target:100,category:"ID_WOMENS_EQUALITY"},goalProgress:100,isAnnualGoal:!0}),v=a({goal:{target:999,category:"ID_WOMENS_EQUALITY",tierTarget:1e3,totalLoans:380},goalProgress:380}),h=a({goal:{target:1e4,category:"ID_WOMENS_EQUALITY",tierTarget:1e4,totalLoans:3800},goalProgress:3800}),y=a({goal:{target:1e5,category:"ID_WOMENS_EQUALITY",tierTarget:1e5,totalLoans:38e3},goalProgress:38e3}),f=a({goal:{target:5,name:"Women",category:w,nextAchievementAt:1,totalLoans:0,tierTarget:10},goalProgress:0}),L=a({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:w,nextAchievementAt:10,totalLoans:20,tierTarget:30},goalProgress:4}),I=a({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:w,nextAchievementAt:0,totalLoans:1200},goalProgress:5}),P=a({goal:{target:10,name:"Refugees",category:B,nextAchievementAt:1,totalLoans:0,tierTarget:20},goalProgress:0}),E=a({goal:{target:5,name:"Refugees",category:B,nextAchievementAt:10,totalLoans:20,tierTarget:30},goalProgress:3}),S=a({goal:{target:5,name:"Refugees",category:B,nextAchievementAt:0,totalLoans:200},goalProgress:5}),T=a({goal:{target:10,name:"Climate Action",category:G,nextAchievementAt:1,totalLoans:0,tierTarget:100},goalProgress:0}),x=a({goal:{target:5,name:"Climate Action",category:G,nextAchievementAt:10,totalLoans:20,tierTarget:30},goalProgress:3}),C=a({goal:{target:5,name:"Climate Action",category:G,nextAchievementAt:0,totalLoans:200},goalProgress:5}),N=a({goal:{target:10,name:"Basic Needs",category:R,nextAchievementAt:1,totalLoans:0,tierTarget:20},goalProgress:0}),D=a({goal:{target:5,name:"Basic Needs",category:R,nextAchievementAt:10,totalLoans:20,tierTarget:30},goalProgress:3}),M=a({goal:{target:5,name:"Basic Needs",category:R,nextAchievementAt:0,totalLoans:200},goalProgress:5}),U=a({goal:{target:10,name:"U.S. Business",category:z,nextAchievementAt:1,totalLoans:0,tierTarget:20},goalProgress:0}),O=a({goal:{target:5,name:"U.S. Business",category:z,nextAchievementAt:10,totalLoans:20},goalProgress:3}),b=a({goal:{target:5,name:"U.S. Business",category:z,nextAchievementAt:0,totalLoans:200},goalProgress:5});var ee,te,ae;p.parameters={...p.parameters,docs:{...(ee=p.parameters)==null?void 0:ee.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 0,
  isAnnualGoal: true
})`,...(ae=(te=p.parameters)==null?void 0:te.docs)==null?void 0:ae.source}}};var re,oe,se;A.parameters={...A.parameters,docs:{...(re=A.parameters)==null?void 0:re.docs,source:{originalSource:`story({
  goal: {
    target: 100,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 38,
  isAnnualGoal: true
})`,...(se=(oe=A.parameters)==null?void 0:oe.docs)==null?void 0:se.source}}};var ne,le,ge;_.parameters={..._.parameters,docs:{...(ne=_.parameters)==null?void 0:ne.docs,source:{originalSource:`story({
  goal: {
    target: 100,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 100,
  isAnnualGoal: true
})`,...(ge=(le=_.parameters)==null?void 0:le.docs)==null?void 0:ge.source}}};var ce,ie,me;v.parameters={...v.parameters,docs:{...(ce=v.parameters)==null?void 0:ce.docs,source:{originalSource:`story({
  goal: {
    target: 999,
    category: 'ID_WOMENS_EQUALITY',
    tierTarget: 1000,
    totalLoans: 380
  },
  goalProgress: 380
})`,...(me=(ie=v.parameters)==null?void 0:ie.docs)==null?void 0:me.source}}};var ue,de,pe;h.parameters={...h.parameters,docs:{...(ue=h.parameters)==null?void 0:ue.docs,source:{originalSource:`story({
  goal: {
    target: 10000,
    category: 'ID_WOMENS_EQUALITY',
    tierTarget: 10000,
    totalLoans: 3800
  },
  goalProgress: 3800
})`,...(pe=(de=h.parameters)==null?void 0:de.docs)==null?void 0:pe.source}}};var Ae,_e,ve;y.parameters={...y.parameters,docs:{...(Ae=y.parameters)==null?void 0:Ae.docs,source:{originalSource:`story({
  goal: {
    target: 100000,
    category: 'ID_WOMENS_EQUALITY',
    tierTarget: 100000,
    totalLoans: 38000
  },
  goalProgress: 38000
})`,...(ve=(_e=y.parameters)==null?void 0:_e.docs)==null?void 0:ve.source}}};var he,ye,fe;f.parameters={...f.parameters,docs:{...(he=f.parameters)==null?void 0:he.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 10
  },
  goalProgress: 0
})`,...(fe=(ye=f.parameters)==null?void 0:ye.docs)==null?void 0:fe.source}}};var Le,Ie,Pe;L.parameters={...L.parameters,docs:{...(Le=L.parameters)==null?void 0:Le.docs,source:{originalSource:`story({
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
})`,...(Pe=(Ie=L.parameters)==null?void 0:Ie.docs)==null?void 0:Pe.source}}};var Ee,Se,Te;I.parameters={...I.parameters,docs:{...(Ee=I.parameters)==null?void 0:Ee.docs,source:{originalSource:`story({
  tag: 'Lifetime achievement',
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 1200
  },
  goalProgress: 5
})`,...(Te=(Se=I.parameters)==null?void 0:Se.docs)==null?void 0:Te.source}}};var xe,Ce,Ne;P.parameters={...P.parameters,docs:{...(xe=P.parameters)==null?void 0:xe.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 20
  },
  goalProgress: 0
})`,...(Ne=(Ce=P.parameters)==null?void 0:Ce.docs)==null?void 0:Ne.source}}};var De,Me,Ue;E.parameters={...E.parameters,docs:{...(De=E.parameters)==null?void 0:De.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20,
    tierTarget: 30
  },
  goalProgress: 3
})`,...(Ue=(Me=E.parameters)==null?void 0:Me.docs)==null?void 0:Ue.source}}};var Oe,be,we;S.parameters={...S.parameters,docs:{...(Oe=S.parameters)==null?void 0:Oe.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(we=(be=S.parameters)==null?void 0:be.docs)==null?void 0:we.source}}};var Ge,Be,Re;T.parameters={...T.parameters,docs:{...(Ge=T.parameters)==null?void 0:Ge.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 100
  },
  goalProgress: 0
})`,...(Re=(Be=T.parameters)==null?void 0:Be.docs)==null?void 0:Re.source}}};var We,Ye,Qe;x.parameters={...x.parameters,docs:{...(We=x.parameters)==null?void 0:We.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 10,
    totalLoans: 20,
    tierTarget: 30
  },
  goalProgress: 3
})`,...(Qe=(Ye=x.parameters)==null?void 0:Ye.docs)==null?void 0:Qe.source}}};var ke,je,Ke;C.parameters={...C.parameters,docs:{...(ke=C.parameters)==null?void 0:ke.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(Ke=(je=C.parameters)==null?void 0:je.docs)==null?void 0:Ke.source}}};var $e,ze,Fe;N.parameters={...N.parameters,docs:{...($e=N.parameters)==null?void 0:$e.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 20
  },
  goalProgress: 0
})`,...(Fe=(ze=N.parameters)==null?void 0:ze.docs)==null?void 0:Fe.source}}};var qe,Ve,He;D.parameters={...D.parameters,docs:{...(qe=D.parameters)==null?void 0:qe.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 10,
    totalLoans: 20,
    tierTarget: 30
  },
  goalProgress: 3
})`,...(He=(Ve=D.parameters)==null?void 0:Ve.docs)==null?void 0:He.source}}};var Xe,Je,Ze;M.parameters={...M.parameters,docs:{...(Xe=M.parameters)==null?void 0:Xe.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(Ze=(Je=M.parameters)==null?void 0:Je.docs)==null?void 0:Ze.source}}};var et,tt,at;U.parameters={...U.parameters,docs:{...(et=U.parameters)==null?void 0:et.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0,
    tierTarget: 20
  },
  goalProgress: 0
})`,...(at=(tt=U.parameters)==null?void 0:tt.docs)==null?void 0:at.source}}};var rt,ot,st;O.parameters={...O.parameters,docs:{...(rt=O.parameters)==null?void 0:rt.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(st=(ot=O.parameters)==null?void 0:ot.docs)==null?void 0:st.source}}};var nt,lt,gt;b.parameters={...b.parameters,docs:{...(nt=b.parameters)==null?void 0:nt.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(gt=(lt=b.parameters)==null?void 0:lt.docs)==null?void 0:gt.source}}};const Aa=["Default","InProgressGoal","CompletedGoal","ThreeDigitsGoalLoans","FourDigitsGoalLoans","FiveDigitsGoalLoans","AchievementWomen","AchievementWomenInProgress","AchievementWomenCompleted","AchievementRefugees","AchievementRefugeesInProgress","AchievementRefugeesCompleted","AchievementClimateAction","AchievementClimateActionInProgress","AchievementClimateActionCompleted","AchievementBasicNeeds","AchievementBasicNeedsInProgress","AchievementBasicNeedsCompleted","AchievementUSBusiness","AchievementUSBusinessInProgress","AchievementUSBusinessCompleted"];export{N as AchievementBasicNeeds,M as AchievementBasicNeedsCompleted,D as AchievementBasicNeedsInProgress,T as AchievementClimateAction,C as AchievementClimateActionCompleted,x as AchievementClimateActionInProgress,P as AchievementRefugees,S as AchievementRefugeesCompleted,E as AchievementRefugeesInProgress,U as AchievementUSBusiness,b as AchievementUSBusinessCompleted,O as AchievementUSBusinessInProgress,f as AchievementWomen,I as AchievementWomenCompleted,L as AchievementWomenInProgress,_ as CompletedGoal,p as Default,y as FiveDigitsGoalLoans,h as FourDigitsGoalLoans,A as InProgressGoal,v as ThreeDigitsGoalLoans,Aa as __namedExportsOrder,pa as default};
