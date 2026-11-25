import{z as Lr,q as y,y as E}from"./entry-vue.esm-bundler-DH3zKjNq_R.js";import{u as Yr}from"./entry-vue-router-x2O2Zij-Un.js";import{_ as mr}from"./entry-NextYearGoalCard-DeiVsuPwg4.js";import"./entry-KvButton-DhnDSkEAjx.js";import"./entry-KvLoadingSpinner-DtktcxlsJZ.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-KvLoadingPlaceholder-COAtZHfxh0.js";import"./entry-useGoalData-C9Ki20S9TH.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-userPreferenceUtils-CND_2oBzoj.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-flssUtils-CvbChVVTMZ.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-DEAS3GXiOC.js";import"./entry-numberUtils-fsNTpyFeOk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-filterUtils-D-4UasJaYo.js";import"./entry-orderBy-DoJGiSbsDH.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseIteratee-CDxluaBz8l.js";import"./entry-keys-L20xH3fuYR.js";import"./entry-useBadgeData-sXRJsH_zBc.js";import"./entry-achievementUtils-C4y7wIEqHF.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-contentfulUtils-CWtQNCE4aD.js";import"./entry-index-DXtFkc4D2t.js";import"./entry-tokens-Cdn1heMTVo.js";import"./entry-index-C7qYbrGKZY.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-BRVyLNfZZN.js";import"./entry-goalCopy-BFTeZ1M0uD.js";import"./entry-get-URTN0AnQsa.js";import"./entry-confetti.module-B5JVzsfHJX.js";import"./entry-GoalProgressRing-DQmCv-g9OU.js";import"./entry-mdi-CqWyar1Kn0.js";import"./entry-KvMaterialIcon-YIvJXPLD5t.js";import"./entry-KvProgressCircle-CJzowGz-P_.js";import"./entry-goalInReview-dtsZpw6kKR.js";import"./entry-dateUtils-BK1I07QHBf.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-Dqd_Clfzvk.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-index-BjwKhfFwPW.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const Ge={title:"MyKiva/MyKivaNextYearGoalCard",component:mr},e=(gr={},{goalDate:Y=null}={})=>{const r={loading:!1,...gr},_=()=>({components:{MyKivaNextYearGoalCard:mr},setup(){const ur=Yr(),v=Lr(!1);ur.replace({query:Y?{goalDate:Y}:{}}).finally(()=>{v.value=!0});const dr=y(()=>{var D;const d=((D=r==null?void 0:r.userGoal)==null?void 0:D.target)||0,G=(r==null?void 0:r.goalProgress)||0;return d?Math.min(Math.round(G/d*100),100):0}),Gr=y(()=>{const{height:d,...G}=r;return G}),yr=y(()=>r!=null&&r.height?{height:`${r.height}px`}:{});return E("goalData",{getCtaHref:()=>"/lend/filter",getGoalDisplayName:()=>"women",goalProgressPercentage:dr,setHideGoalCardPreference:()=>Promise.resolve()}),E("$kvTrackEvent",()=>{}),{cardStyle:yr,componentArgs:Gr,routeReady:v}},template:`
            <div style="width: 379px;">
                <MyKivaNextYearGoalCard v-if="routeReady" v-bind="componentArgs" :style="cardStyle" />
            </div>
        `});return _.args=r,_},t=e({prevYearLoans:5,userGoal:null}),n=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:0}),p=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:2}),i=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:5}),l=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:8}),c=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:10}),m=e({prevYearLoans:100,userGoal:{target:101,category:"ID_WOMENS_EQUALITY"},goalProgress:100}),g=e({prevYearLoans:1e3,userGoal:{target:9089,category:"ID_WOMENS_EQUALITY"},goalProgress:9087}),u=e({prevYearLoans:1e4,userGoal:{target:90890,category:"ID_WOMENS_EQUALITY"},goalProgress:90870}),L={target:10,category:"ID_WOMENS_EQUALITY",dateStarted:"2026-02-01T12:00:00.000Z"},o=e({prevYearLoans:8,userGoal:L,goalProgress:2},{goalDate:"2026-11-15"}),a=e({prevYearLoans:8,userGoal:L,goalProgress:8},{goalDate:"2026-12-31"}),s=e({prevYearLoans:8,userGoal:L,goalProgress:10},{goalDate:"2026-11-15"});var I,P,U;t.parameters={...t.parameters,docs:{...(I=t.parameters)==null?void 0:I.docs,source:{originalSource:`story({
  prevYearLoans: 5,
  userGoal: null
})`,...(U=(P=t.parameters)==null?void 0:P.docs)==null?void 0:U.source}}};var S,W,f;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 0
})`,...(f=(W=n.parameters)==null?void 0:W.docs)==null?void 0:f.source}}};var M,N,h;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 2
})`,...(h=(N=p.parameters)==null?void 0:N.docs)==null?void 0:h.source}}};var T,O,A;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 5
})`,...(A=(O=i.parameters)==null?void 0:O.docs)==null?void 0:A.source}}};var Q,C,w;l.parameters={...l.parameters,docs:{...(Q=l.parameters)==null?void 0:Q.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 8
})`,...(w=(C=l.parameters)==null?void 0:C.docs)==null?void 0:w.source}}};var x,F,H;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 10
})`,...(H=(F=c.parameters)==null?void 0:F.docs)==null?void 0:H.source}}};var K,R,k;m.parameters={...m.parameters,docs:{...(K=m.parameters)==null?void 0:K.docs,source:{originalSource:`story({
  prevYearLoans: 100,
  userGoal: {
    target: 101,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 100
})`,...(k=(R=m.parameters)==null?void 0:R.docs)==null?void 0:k.source}}};var q,$,b;g.parameters={...g.parameters,docs:{...(q=g.parameters)==null?void 0:q.docs,source:{originalSource:`story({
  prevYearLoans: 1000,
  userGoal: {
    target: 9089,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 9087
})`,...(b=($=g.parameters)==null?void 0:$.docs)==null?void 0:b.source}}};var z,Z,j;u.parameters={...u.parameters,docs:{...(z=u.parameters)==null?void 0:z.docs,source:{originalSource:`story({
  prevYearLoans: 10000,
  userGoal: {
    target: 90890,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 90870
})`,...(j=(Z=u.parameters)==null?void 0:Z.docs)==null?void 0:j.source}}};var B,J,V,X,rr;o.parameters={...o.parameters,docs:{...(B=o.parameters)==null?void 0:B.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: inWindowGoal,
  goalProgress: 2
}, {
  goalDate: '2026-11-15'
})`,...(V=(J=o.parameters)==null?void 0:J.docs)==null?void 0:V.source},description:{story:'Nov 15 → "47 days left!" under the title.',...(rr=(X=o.parameters)==null?void 0:X.docs)==null?void 0:rr.description}}};var er,or,ar,sr,tr;a.parameters={...a.parameters,docs:{...(er=a.parameters)==null?void 0:er.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: inWindowGoal,
  goalProgress: 8
}, {
  goalDate: '2026-12-31'
})`,...(ar=(or=a.parameters)==null?void 0:or.docs)==null?void 0:ar.source},description:{story:'Dec 31 → singular "1 day left!".',...(tr=(sr=a.parameters)==null?void 0:sr.docs)==null?void 0:tr.description}}};var nr,pr,ir,lr,cr;s.parameters={...s.parameters,docs:{...(nr=s.parameters)==null?void 0:nr.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: inWindowGoal,
  goalProgress: 10
}, {
  goalDate: '2026-11-15'
})`,...(ir=(pr=s.parameters)==null?void 0:pr.docs)==null?void 0:ir.source},description:{story:"Completed goal inside the window → no countdown.",...(cr=(lr=s.parameters)==null?void 0:lr.docs)==null?void 0:cr.description}}};const ye=["Default","UserGoalWithoutProgress","UserGoalWithProgress","UserGoalWithHalfProgress","UserGoalAlmostCompleted","UserGoalCompleted","ThreeDigitsGoalLoans","FourDigitsGoalLoans","FiveDigitsGoalLoans","UserGoalDaysLeft","UserGoalLastDayLeft","UserGoalCompletedInWindow"];export{t as Default,u as FiveDigitsGoalLoans,g as FourDigitsGoalLoans,m as ThreeDigitsGoalLoans,l as UserGoalAlmostCompleted,c as UserGoalCompleted,s as UserGoalCompletedInWindow,o as UserGoalDaysLeft,a as UserGoalLastDayLeft,i as UserGoalWithHalfProgress,p as UserGoalWithProgress,n as UserGoalWithoutProgress,ye as __namedExportsOrder,Ge as default};
