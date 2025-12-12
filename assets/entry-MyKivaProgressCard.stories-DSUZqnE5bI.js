import{j as o,c as W,e as r,a as w,u as i,n as Y,d as Je,K as l,b as Xe,o as k,J as Ze}from"./entry-vue.esm-bundler-BthIfLPEGH.js";import{K as et}from"./entry-KvProgressCircle-bPCvVuPg8I.js";import{K as tt}from"./entry-KvIcon-CfgCx9igZy.js";import{_ as at}from"./entry-KvButton-CBBItbLSAS.js";import{d as U,b as N,c as O,I as M,a as B}from"./entry-useBadgeData-B8TrHL8kpc.js";import{n as ot}from"./entry-numeral-xVHG5DEP0A.js";import{m as rt}from"./entry-importHelpers-zIMYNa8D_v.js";import{_ as st}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./iframe-bZMg_mab.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-achievementUtils-Cf0LlmQMSn.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";const nt=""+new URL("brand-DRsde_GU.png",import.meta.url).href,ct=Object.freeze(Object.defineProperty({__proto__:null,default:nt},Symbol.toStringTag,{value:"Module"})),lt=""+new URL("danger-highlight-NoVmckvK.png",import.meta.url).href,gt=Object.freeze(Object.defineProperty({__proto__:null,default:lt},Symbol.toStringTag,{value:"Module"})),it=""+new URL("eco-green-2-NN39MRhM.png",import.meta.url).href,mt=Object.freeze(Object.defineProperty({__proto__:null,default:it},Symbol.toStringTag,{value:"Module"})),ut=""+new URL("eco-green-3-BrUWi9qr.png",import.meta.url).href,dt=Object.freeze(Object.defineProperty({__proto__:null,default:ut},Symbol.toStringTag,{value:"Module"})),pt=""+new URL("marigold-BvOK8dxz.png",import.meta.url).href,At=Object.freeze(Object.defineProperty({__proto__:null,default:pt},Symbol.toStringTag,{value:"Module"})),_t=""+new URL("stone-3-ctGo-BuV.png",import.meta.url).href,vt=Object.freeze(Object.defineProperty({__proto__:null,default:_t},Symbol.toStringTag,{value:"Module"})),ht={class:"progress-card"},yt={class:"tw-relative tw-z-docked"},ft={key:0,class:"tw-text-small"},It={class:"tw-w-full"},Pt={class:"tw-flex tw-items-center tw-gap-0.5"},Lt={class:"tw-text-secondary"},St={class:"tw-font-medium"},Ct={class:"tw-text-small"},xt={class:"tw-w-full tw-flex tw-justify-end tw-mt-1"},Et=["src"],bt=100,Ut=1e3,je={__name:"MyKivaProgressCard",props:{goal:{type:Object,required:!0},goalProgress:{type:Number,required:!0},isAnnualGoal:{type:Boolean,default:!1}},setup(s){const G=rt(Object.assign({"/src/assets/images/my-kiva/goal-progress-texture/brand.png":ct,"/src/assets/images/my-kiva/goal-progress-texture/danger-highlight.png":gt,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-2.png":mt,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-3.png":dt,"/src/assets/images/my-kiva/goal-progress-texture/marigold.png":At,"/src/assets/images/my-kiva/goal-progress-texture/stone-3.png":vt}),"/src/assets/images/my-kiva/goal-progress-texture/"),e=s,Ke=o(()=>{var a;return!((a=e.goal)!=null&&a.target)||e.goalProgress<=0?0:Math.min(Math.round(e.goalProgress/e.goal.target*100),bt)}),g=o(()=>{var a;return((a=e.goal)==null?void 0:a.target)||0}),n=o(()=>e.goalProgress>=g.value),ze=o(()=>Math.max(g.value-e.goalProgress,0)),$e=o(()=>e.isAnnualGoal?"Your goal":e.goal.name),qe=o(()=>{var a,c;return e.isAnnualGoal&&n.value?"You’ve completed your goal!":e.isAnnualGoal?`${ze.value} loans to complete your goal.`:n.value?"All badges earned!":`${((a=e.goal)==null?void 0:a.nextAchievementAt)??0} loan${((c=e.goal)==null?void 0:c.nextAchievementAt)!==1?"s":""} to unlock next badge.`}),Ve=o(()=>{var a,c,R;return e.isAnnualGoal||!n.value?`${e.goalProgress} / ${g.value}`:((a=e.goal)==null?void 0:a.totalLoans)>Ut?ot(((c=e.goal)==null?void 0:c.totalLoans)??0).format("0.0a"):((R=e.goal)==null?void 0:R.totalLoans)??0}),Fe=o(()=>e.isAnnualGoal?"2026 annual goal":"Lifetime achievement"),He=o(()=>e.isAnnualGoal&&n.value?"":n.value?"See details":"Continue"),T=o(()=>e.isAnnualGoal?"brand":e.goal.category===U?"marigold":e.goal.category===N?"eco-green-3":e.goal.category===O?"danger-highlight":e.goal.category===M?"stone-3":"eco-green-2");return(a,c)=>(k(),W("div",ht,[r("div",yt,[w(i(et),{class:"progress-circle","stroke-width":20,value:Ke.value,max:g.value,rotate:180,color:T.value},null,8,["value","max","color"]),r("div",{class:Y(["progress-circle-content",{"tw-mt-0.5":n.value&&!s.isAnnualGoal}])},[r("h5",null,l(Ve.value),1),n.value&&!s.isAnnualGoal?(k(),W("p",ft," loans ")):Je("",!0)],2)]),r("div",It,[r("div",Pt,[w(i(tt),{class:"tw-text-gray-400 tw-h-2 tw-w-2",name:s.isAnnualGoal?"annual-goal-flag":"progress-checkmark"},null,8,["name"]),r("h5",Lt,l(Fe.value),1)]),r("p",St,l($e.value),1),r("p",Ct,l(qe.value),1),r("div",xt,[w(i(at),{class:"text-link tw-font-medium !tw-text-eco-green-3"},{default:Xe(()=>[Ze(l(He.value),1)],void 0),_:1})])]),r("img",{class:Y(["tw-absolute tw-z-2","card-texture",`card-texture--${T.value}`]),alt:"Card color decorative stain",src:i(G)(`${T.value}.png`)},null,10,Et)]))}},Qe=st(je,[["__scopeId","data-v-de30c3b6"]]);je.__docgenInfo={exportName:"default",displayName:"MyKivaProgressCard",description:"",tags:{},props:[{name:"goal",type:{name:"object"},required:!0},{name:"goalProgress",type:{name:"number"},required:!0},{name:"isAnnualGoal",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/MyKivaProgressCard.vue"]};const Qt={title:"MyKiva/MyKivaProgressCard",component:Qe},t=(s={})=>{const D=(G,{argTypes:e})=>({props:Object.keys(e),components:{MyKivaProgressCard:Qe},setup(){return{args:s}},template:`
      <div style="width: 379px;">
        <MyKivaProgressCard v-bind="args" style="${s.height?`height: ${s.height}px;`:""}" />
      </div>
    `});return D.args=s,D},m=t({goal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:0,isAnnualGoal:!0}),u=t({goal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:5,isAnnualGoal:!0}),d=t({goal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:10,isAnnualGoal:!0}),p=t({goal:{target:5,name:"Women",category:U,nextAchievementAt:1,totalLoans:0},goalProgress:0}),A=t({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:U,nextAchievementAt:10,totalLoans:20},goalProgress:4}),_=t({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:U,nextAchievementAt:0,totalLoans:1200},goalProgress:5}),v=t({goal:{target:10,name:"Refugees",category:O,nextAchievementAt:1,totalLoans:0},goalProgress:0}),h=t({goal:{target:5,name:"Refugees",category:O,nextAchievementAt:10,totalLoans:20},goalProgress:3}),y=t({goal:{target:5,name:"Refugees",category:O,nextAchievementAt:0,totalLoans:200},goalProgress:5}),f=t({goal:{target:10,name:"Climate Action",category:N,nextAchievementAt:1,totalLoans:0},goalProgress:0}),I=t({goal:{target:5,name:"Climate Action",category:N,nextAchievementAt:10,totalLoans:20},goalProgress:3}),P=t({goal:{target:5,name:"Climate Action",category:N,nextAchievementAt:0,totalLoans:200},goalProgress:5}),L=t({goal:{target:10,name:"Basic Needs",category:M,nextAchievementAt:1,totalLoans:0},goalProgress:0}),S=t({goal:{target:5,name:"Basic Needs",category:M,nextAchievementAt:10,totalLoans:20},goalProgress:3}),C=t({goal:{target:5,name:"Basic Needs",category:M,nextAchievementAt:0,totalLoans:200},goalProgress:5}),x=t({goal:{target:10,name:"U.S. Business",category:B,nextAchievementAt:1,totalLoans:0},goalProgress:0}),E=t({goal:{target:5,name:"U.S. Business",category:B,nextAchievementAt:10,totalLoans:20},goalProgress:3}),b=t({goal:{target:5,name:"U.S. Business",category:B,nextAchievementAt:0,totalLoans:200},goalProgress:5});var j,Q,K;m.parameters={...m.parameters,docs:{...(j=m.parameters)==null?void 0:j.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 0,
  isAnnualGoal: true
})`,...(K=(Q=m.parameters)==null?void 0:Q.docs)==null?void 0:K.source}}};var z,$,q;u.parameters={...u.parameters,docs:{...(z=u.parameters)==null?void 0:z.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 5,
  isAnnualGoal: true
})`,...(q=($=u.parameters)==null?void 0:$.docs)==null?void 0:q.source}}};var V,F,H;d.parameters={...d.parameters,docs:{...(V=d.parameters)==null?void 0:V.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 10,
  isAnnualGoal: true
})`,...(H=(F=d.parameters)==null?void 0:F.docs)==null?void 0:H.source}}};var J,X,Z;p.parameters={...p.parameters,docs:{...(J=p.parameters)==null?void 0:J.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(Z=(X=p.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var ee,te,ae;A.parameters={...A.parameters,docs:{...(ee=A.parameters)==null?void 0:ee.docs,source:{originalSource:`story({
  tag: 'Lifetime achievement',
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 4
})`,...(ae=(te=A.parameters)==null?void 0:te.docs)==null?void 0:ae.source}}};var oe,re,se;_.parameters={..._.parameters,docs:{...(oe=_.parameters)==null?void 0:oe.docs,source:{originalSource:`story({
  tag: 'Lifetime achievement',
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 1200
  },
  goalProgress: 5
})`,...(se=(re=_.parameters)==null?void 0:re.docs)==null?void 0:se.source}}};var ne,ce,le;v.parameters={...v.parameters,docs:{...(ne=v.parameters)==null?void 0:ne.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(le=(ce=v.parameters)==null?void 0:ce.docs)==null?void 0:le.source}}};var ge,ie,me;h.parameters={...h.parameters,docs:{...(ge=h.parameters)==null?void 0:ge.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(me=(ie=h.parameters)==null?void 0:ie.docs)==null?void 0:me.source}}};var ue,de,pe;y.parameters={...y.parameters,docs:{...(ue=y.parameters)==null?void 0:ue.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(pe=(de=y.parameters)==null?void 0:de.docs)==null?void 0:pe.source}}};var Ae,_e,ve;f.parameters={...f.parameters,docs:{...(Ae=f.parameters)==null?void 0:Ae.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(ve=(_e=f.parameters)==null?void 0:_e.docs)==null?void 0:ve.source}}};var he,ye,fe;I.parameters={...I.parameters,docs:{...(he=I.parameters)==null?void 0:he.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(fe=(ye=I.parameters)==null?void 0:ye.docs)==null?void 0:fe.source}}};var Ie,Pe,Le;P.parameters={...P.parameters,docs:{...(Ie=P.parameters)==null?void 0:Ie.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(Le=(Pe=P.parameters)==null?void 0:Pe.docs)==null?void 0:Le.source}}};var Se,Ce,xe;L.parameters={...L.parameters,docs:{...(Se=L.parameters)==null?void 0:Se.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(xe=(Ce=L.parameters)==null?void 0:Ce.docs)==null?void 0:xe.source}}};var Ee,be,Ue;S.parameters={...S.parameters,docs:{...(Ee=S.parameters)==null?void 0:Ee.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(Ue=(be=S.parameters)==null?void 0:be.docs)==null?void 0:Ue.source}}};var Ne,Oe,Me;C.parameters={...C.parameters,docs:{...(Ne=C.parameters)==null?void 0:Ne.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(Me=(Oe=C.parameters)==null?void 0:Oe.docs)==null?void 0:Me.source}}};var De,Te,we;x.parameters={...x.parameters,docs:{...(De=x.parameters)==null?void 0:De.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(we=(Te=x.parameters)==null?void 0:Te.docs)==null?void 0:we.source}}};var Be,Ge,Re;E.parameters={...E.parameters,docs:{...(Be=E.parameters)==null?void 0:Be.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(Re=(Ge=E.parameters)==null?void 0:Ge.docs)==null?void 0:Re.source}}};var We,Ye,ke;b.parameters={...b.parameters,docs:{...(We=b.parameters)==null?void 0:We.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(ke=(Ye=b.parameters)==null?void 0:Ye.docs)==null?void 0:ke.source}}};const Kt=["Default","InProgressGoal","CompletedGoal","AchievementWomen","AchievementWomenInProgress","AchievementWomenCompleted","AchievementRefugees","AchievementRefugeesInProgress","AchievementRefugeesCompleted","AchievementClimateAction","AchievementClimateActionInProgress","AchievementClimateActionCompleted","AchievementBasicNeeds","AchievementBasicNeedsInProgress","AchievementBasicNeedsCompleted","AchievementUSBusiness","AchievementUSBusinessInProgress","AchievementUSBusinessCompleted"];export{L as AchievementBasicNeeds,C as AchievementBasicNeedsCompleted,S as AchievementBasicNeedsInProgress,f as AchievementClimateAction,P as AchievementClimateActionCompleted,I as AchievementClimateActionInProgress,v as AchievementRefugees,y as AchievementRefugeesCompleted,h as AchievementRefugeesInProgress,x as AchievementUSBusiness,b as AchievementUSBusinessCompleted,E as AchievementUSBusinessInProgress,p as AchievementWomen,_ as AchievementWomenCompleted,A as AchievementWomenInProgress,d as CompletedGoal,m as Default,u as InProgressGoal,Kt as __namedExportsOrder,Qt as default};
