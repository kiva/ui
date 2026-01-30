import{g as r,c as Q,q as s,a as R,u as m,A as j,m as et,L as i,C as tt,o as K,M as at}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import{K as ot}from"./entry-KvProgressCircle-Pjk1xBU9rv.js";import{K as rt}from"./entry-KvIcon-B7nRpqD9wh.js";import{_ as st}from"./entry-KvButton-C9WvITgRyG.js";import{M as nt,d as b,b as M,c as O,I as T,a as W}from"./entry-useBadgeData-D1AJjY82g-.js";import{n as lt}from"./entry-numeral-xVHG5DEP0A.js";import{m as ct}from"./entry-importHelpers-zIMYNa8D_v.js";import{_ as gt}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./iframe-zM18a6JW.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-achievementUtils-Cf0LlmQMSn.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";const it=""+new URL("brand-DRsde_GU.png",import.meta.url).href,mt=Object.freeze(Object.defineProperty({__proto__:null,default:it},Symbol.toStringTag,{value:"Module"})),ut=""+new URL("danger-highlight-NoVmckvK.png",import.meta.url).href,dt=Object.freeze(Object.defineProperty({__proto__:null,default:ut},Symbol.toStringTag,{value:"Module"})),pt=""+new URL("eco-green-2-NN39MRhM.png",import.meta.url).href,At=Object.freeze(Object.defineProperty({__proto__:null,default:pt},Symbol.toStringTag,{value:"Module"})),_t=""+new URL("eco-green-3-BrUWi9qr.png",import.meta.url).href,vt=Object.freeze(Object.defineProperty({__proto__:null,default:_t},Symbol.toStringTag,{value:"Module"})),ht=""+new URL("marigold-BvOK8dxz.png",import.meta.url).href,yt=Object.freeze(Object.defineProperty({__proto__:null,default:ht},Symbol.toStringTag,{value:"Module"})),ft=""+new URL("stone-3-ctGo-BuV.png",import.meta.url).href,It=Object.freeze(Object.defineProperty({__proto__:null,default:ft},Symbol.toStringTag,{value:"Module"})),Pt={class:"progress-card"},Lt={class:"tw-relative tw-z-docked"},St={style:{"letter-spacing":"-0.05rem"}},Et={key:0,class:"tw-text-small"},Ct={class:"tw-w-full"},xt={class:"tw-flex tw-items-center tw-gap-0.5"},Nt={class:"tw-text-secondary"},Ut={class:"tw-font-medium"},bt={class:"tw-text-small"},Mt={class:"tw-w-full tw-flex tw-justify-end tw-mt-1"},Ot=["src"],$=100,Tt=1e3,ze={__name:"MyKivaProgressCard",props:{goal:{type:Object,required:!0},goalProgress:{type:Number,required:!0},isAnnualGoal:{type:Boolean,default:!1}},setup(n){const Y=ct(Object.assign({"/src/assets/images/my-kiva/goal-progress-texture/brand.png":mt,"/src/assets/images/my-kiva/goal-progress-texture/danger-highlight.png":dt,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-2.png":At,"/src/assets/images/my-kiva/goal-progress-texture/eco-green-3.png":vt,"/src/assets/images/my-kiva/goal-progress-texture/marigold.png":yt,"/src/assets/images/my-kiva/goal-progress-texture/stone-3.png":It}),"/src/assets/images/my-kiva/goal-progress-texture/"),e=n,Ve=r(()=>{var c,w,k;if(e.isAnnualGoal)return!((c=e.goal)!=null&&c.target)||e.goalProgress<=0?0:Math.min(Math.round(e.goalProgress/e.goal.target*100),$);const o=((w=e.goal)==null?void 0:w.tierTarget)||0,t=((k=e.goal)==null?void 0:k.totalLoans)??0;return!o||t<=0?0:Math.min(Math.round(t/o*100),$)}),g=r(()=>{var o,t,c;return((o=e.goal)==null?void 0:o.nextAchievementAt)>0?(t=e.goal)==null?void 0:t.tierTarget:((c=e.goal)==null?void 0:c.target)||0}),l=r(()=>e.goalProgress>=g.value),G=r(()=>{var t;const o=((t=e.goal)==null?void 0:t.totalLoans)??e.goalProgress;return Math.max(g.value-o,0)}),Fe=r(()=>e.isAnnualGoal?"Your goal":e.goal.name),He=r(()=>{var o,t;return e.isAnnualGoal&&l.value?"You’ve completed your goal!":e.isAnnualGoal?G.value===1?`${G.value} loan to complete your goal.`:`${G.value} loans to complete your goal.`:l.value?"All badges earned!":`${((o=e.goal)==null?void 0:o.nextAchievementAt)??0} loan${((t=e.goal)==null?void 0:t.nextAchievementAt)!==1?"s":""} to unlock next badge.`}),Xe=r(()=>{var t,c;if(l.value&&e.isAnnualGoal)return`${g.value} / ${g.value}`;if(e.isAnnualGoal)return`${e.goalProgress} / ${g.value}`;if(!l.value)return`${((t=e.goal)==null?void 0:t.totalLoans)??e.goalProgress} / ${g.value}`;const o=Math.min(((c=e.goal)==null?void 0:c.totalLoans)??0,nt);return o>Tt?lt(o).format("0.0a"):o}),Je=r(()=>e.isAnnualGoal?"2026 annual goal":"Lifetime achievement"),Ze=r(()=>{var t;if(e.isAnnualGoal&&l.value)return"";const o=e.isAnnualGoal?e.goalProgress??0:((t=e.goal)==null?void 0:t.totalLoans)??e.goalProgress??0;return!l.value&&o<=0?"Get started":l.value?"See details":"Continue"}),B=r(()=>e.isAnnualGoal?"brand":e.goal.category===b?"marigold":e.goal.category===M?"eco-green-3":e.goal.category===O?"danger-highlight":e.goal.category===T?"stone-3":"eco-green-2");return(o,t)=>(K(),Q("div",Pt,[s("div",Lt,[R(m(ot),{class:"progress-circle","stroke-width":20,value:Ve.value,max:g.value,rotate:180,color:B.value},null,8,["value","max","color"]),s("div",{class:j(["progress-circle-content",{"tw-mt-0.5":l.value&&!n.isAnnualGoal}])},[s("h5",St,i(Xe.value),1),l.value&&!n.isAnnualGoal?(K(),Q("p",Et," loans ")):et("",!0)],2)]),s("div",Ct,[s("div",xt,[R(m(rt),{class:"tw-text-gray-400 tw-h-2 tw-w-2",name:n.isAnnualGoal?"annual-goal-flag":"progress-checkmark"},null,8,["name"]),s("h5",Nt,i(Je.value),1)]),s("p",Ut,i(Fe.value),1),s("p",bt,i(He.value),1),s("div",Mt,[R(m(st),{class:"text-link tw-font-medium !tw-text-eco-green-3"},{default:tt(()=>[at(i(Ze.value),1)],void 0),_:1})])]),s("img",{class:j(["tw-absolute tw-z-2","card-texture",`card-texture--${B.value}`]),alt:"Card color decorative stain",src:m(Y)(`${B.value}.png`)},null,10,Ot)]))}},qe=gt(ze,[["__scopeId","data-v-4cad7632"]]);ze.__docgenInfo={exportName:"default",displayName:"MyKivaProgressCard",description:"",tags:{},props:[{name:"goal",type:{name:"object"},required:!0},{name:"goalProgress",type:{name:"number"},required:!0},{name:"isAnnualGoal",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/MyKivaProgressCard.vue"]};const qt={title:"MyKiva/MyKivaProgressCard",component:qe},a=(n={})=>{const D=(Y,{argTypes:e})=>({props:Object.keys(e),components:{MyKivaProgressCard:qe},setup(){return{args:n}},template:`
      <div style="width: 379px;">
        <MyKivaProgressCard v-bind="args" style="${n.height?`height: ${n.height}px;`:""}" />
      </div>
    `});return D.args=n,D},u=a({goal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:0,isAnnualGoal:!0}),d=a({goal:{target:100,category:"ID_WOMENS_EQUALITY"},goalProgress:38,isAnnualGoal:!0}),p=a({goal:{target:100,category:"ID_WOMENS_EQUALITY"},goalProgress:100,isAnnualGoal:!0}),A=a({goal:{target:5,name:"Women",category:b,nextAchievementAt:1,totalLoans:0},goalProgress:0}),_=a({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:b,nextAchievementAt:10,totalLoans:20},goalProgress:4}),v=a({tag:"Lifetime achievement",goal:{target:5,name:"Women",category:b,nextAchievementAt:0,totalLoans:1200},goalProgress:5}),h=a({goal:{target:10,name:"Refugees",category:O,nextAchievementAt:1,totalLoans:0},goalProgress:0}),y=a({goal:{target:5,name:"Refugees",category:O,nextAchievementAt:10,totalLoans:20},goalProgress:3}),f=a({goal:{target:5,name:"Refugees",category:O,nextAchievementAt:0,totalLoans:200},goalProgress:5}),I=a({goal:{target:10,name:"Climate Action",category:M,nextAchievementAt:1,totalLoans:0},goalProgress:0}),P=a({goal:{target:5,name:"Climate Action",category:M,nextAchievementAt:10,totalLoans:20},goalProgress:3}),L=a({goal:{target:5,name:"Climate Action",category:M,nextAchievementAt:0,totalLoans:200},goalProgress:5}),S=a({goal:{target:10,name:"Basic Needs",category:T,nextAchievementAt:1,totalLoans:0},goalProgress:0}),E=a({goal:{target:5,name:"Basic Needs",category:T,nextAchievementAt:10,totalLoans:20},goalProgress:3}),C=a({goal:{target:5,name:"Basic Needs",category:T,nextAchievementAt:0,totalLoans:200},goalProgress:5}),x=a({goal:{target:10,name:"U.S. Business",category:W,nextAchievementAt:1,totalLoans:0},goalProgress:0}),N=a({goal:{target:5,name:"U.S. Business",category:W,nextAchievementAt:10,totalLoans:20},goalProgress:3}),U=a({goal:{target:5,name:"U.S. Business",category:W,nextAchievementAt:0,totalLoans:200},goalProgress:5});var z,q,V;u.parameters={...u.parameters,docs:{...(z=u.parameters)==null?void 0:z.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 0,
  isAnnualGoal: true
})`,...(V=(q=u.parameters)==null?void 0:q.docs)==null?void 0:V.source}}};var F,H,X;d.parameters={...d.parameters,docs:{...(F=d.parameters)==null?void 0:F.docs,source:{originalSource:`story({
  goal: {
    target: 100,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 38,
  isAnnualGoal: true
})`,...(X=(H=d.parameters)==null?void 0:H.docs)==null?void 0:X.source}}};var J,Z,ee;p.parameters={...p.parameters,docs:{...(J=p.parameters)==null?void 0:J.docs,source:{originalSource:`story({
  goal: {
    target: 100,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 100,
  isAnnualGoal: true
})`,...(ee=(Z=p.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var te,ae,oe;A.parameters={...A.parameters,docs:{...(te=A.parameters)==null?void 0:te.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(oe=(ae=A.parameters)==null?void 0:ae.docs)==null?void 0:oe.source}}};var re,se,ne;_.parameters={..._.parameters,docs:{...(re=_.parameters)==null?void 0:re.docs,source:{originalSource:`story({
  tag: 'Lifetime achievement',
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 4
})`,...(ne=(se=_.parameters)==null?void 0:se.docs)==null?void 0:ne.source}}};var le,ce,ge;v.parameters={...v.parameters,docs:{...(le=v.parameters)==null?void 0:le.docs,source:{originalSource:`story({
  tag: 'Lifetime achievement',
  goal: {
    target: 5,
    name: 'Women',
    category: ID_WOMENS_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 1200
  },
  goalProgress: 5
})`,...(ge=(ce=v.parameters)==null?void 0:ce.docs)==null?void 0:ge.source}}};var ie,me,ue;h.parameters={...h.parameters,docs:{...(ie=h.parameters)==null?void 0:ie.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(ue=(me=h.parameters)==null?void 0:me.docs)==null?void 0:ue.source}}};var de,pe,Ae;y.parameters={...y.parameters,docs:{...(de=y.parameters)==null?void 0:de.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(Ae=(pe=y.parameters)==null?void 0:pe.docs)==null?void 0:Ae.source}}};var _e,ve,he;f.parameters={...f.parameters,docs:{...(_e=f.parameters)==null?void 0:_e.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Refugees',
    category: ID_REFUGEE_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(he=(ve=f.parameters)==null?void 0:ve.docs)==null?void 0:he.source}}};var ye,fe,Ie;I.parameters={...I.parameters,docs:{...(ye=I.parameters)==null?void 0:ye.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(Ie=(fe=I.parameters)==null?void 0:fe.docs)==null?void 0:Ie.source}}};var Pe,Le,Se;P.parameters={...P.parameters,docs:{...(Pe=P.parameters)==null?void 0:Pe.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(Se=(Le=P.parameters)==null?void 0:Le.docs)==null?void 0:Se.source}}};var Ee,Ce,xe;L.parameters={...L.parameters,docs:{...(Ee=L.parameters)==null?void 0:Ee.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Climate Action',
    category: ID_CLIMATE_ACTION,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(xe=(Ce=L.parameters)==null?void 0:Ce.docs)==null?void 0:xe.source}}};var Ne,Ue,be;S.parameters={...S.parameters,docs:{...(Ne=S.parameters)==null?void 0:Ne.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(be=(Ue=S.parameters)==null?void 0:Ue.docs)==null?void 0:be.source}}};var Me,Oe,Te;E.parameters={...E.parameters,docs:{...(Me=E.parameters)==null?void 0:Me.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(Te=(Oe=E.parameters)==null?void 0:Oe.docs)==null?void 0:Te.source}}};var De,Ge,Be;C.parameters={...C.parameters,docs:{...(De=C.parameters)==null?void 0:De.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'Basic Needs',
    category: ID_BASIC_NEEDS,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...(Be=(Ge=C.parameters)==null?void 0:Ge.docs)==null?void 0:Be.source}}};var we,Re,We;x.parameters={...x.parameters,docs:{...(we=x.parameters)==null?void 0:we.docs,source:{originalSource:`story({
  goal: {
    target: 10,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 1,
    totalLoans: 0
  },
  goalProgress: 0
})`,...(We=(Re=x.parameters)==null?void 0:Re.docs)==null?void 0:We.source}}};var Ye,ke,Qe;N.parameters={...N.parameters,docs:{...(Ye=N.parameters)==null?void 0:Ye.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 10,
    totalLoans: 20
  },
  goalProgress: 3
})`,...(Qe=(ke=N.parameters)==null?void 0:ke.docs)==null?void 0:Qe.source}}};var je,Ke,$e;U.parameters={...U.parameters,docs:{...(je=U.parameters)==null?void 0:je.docs,source:{originalSource:`story({
  goal: {
    target: 5,
    name: 'U.S. Business',
    category: ID_US_ECONOMIC_EQUALITY,
    nextAchievementAt: 0,
    totalLoans: 200
  },
  goalProgress: 5
})`,...($e=(Ke=U.parameters)==null?void 0:Ke.docs)==null?void 0:$e.source}}};const Vt=["Default","InProgressGoal","CompletedGoal","AchievementWomen","AchievementWomenInProgress","AchievementWomenCompleted","AchievementRefugees","AchievementRefugeesInProgress","AchievementRefugeesCompleted","AchievementClimateAction","AchievementClimateActionInProgress","AchievementClimateActionCompleted","AchievementBasicNeeds","AchievementBasicNeedsInProgress","AchievementBasicNeedsCompleted","AchievementUSBusiness","AchievementUSBusinessInProgress","AchievementUSBusinessCompleted"];export{S as AchievementBasicNeeds,C as AchievementBasicNeedsCompleted,E as AchievementBasicNeedsInProgress,I as AchievementClimateAction,L as AchievementClimateActionCompleted,P as AchievementClimateActionInProgress,h as AchievementRefugees,f as AchievementRefugeesCompleted,y as AchievementRefugeesInProgress,x as AchievementUSBusiness,U as AchievementUSBusinessCompleted,N as AchievementUSBusinessInProgress,A as AchievementWomen,v as AchievementWomenCompleted,_ as AchievementWomenInProgress,p as CompletedGoal,u as Default,d as InProgressGoal,Vt as __namedExportsOrder,qt as default};
