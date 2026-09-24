import{q as y,y as E}from"./entry-vue.esm-bundler-ED6DvobC3-.js";import{_ as mr}from"./entry-NextYearGoalCard-D60pmmKfFZ.js";import"./entry-KvButton-C8S99vq6YZ.js";import"./entry-KvLoadingSpinner-BNTDmGd79q.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-KvLoadingPlaceholder-BIZZosYllW.js";import"./entry-useGoalData-Ca-l9jJ9X4.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-index-CWclSTHHJk.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-flssUtils-Deq-f7S6K3.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-zWFMkXXE5P.js";import"./entry-filterUtils-DVtQjHZnxi.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-orderBy-DoJGiSbsDH.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseIteratee-CDxluaBz8l.js";import"./entry-keys-L20xH3fuYR.js";import"./entry-useBadgeData-Cne6ifq3GA.js";import"./entry-achievementUtils-Czo-s8jp_f.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-contentfulUtils-BxnXHmGqQJ.js";import"./entry-index-7WUD3idviV.js";import"./entry-tokens-B1GtbUGZM0.js";import"./entry-index-C7qYbrGKZY.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-COmIkRYU2t.js";import"./entry-goalCopy-lrFfIjZjvL.js";import"./entry-vue-router-DJm5fYqkEO.js";import"./entry-confetti.module-B5JVzsfHJX.js";import"./entry-GoalProgressRing-CuuKTLi5uq.js";import"./entry-mdi-BeeDX8vtDa.js";import"./entry-KvMaterialIcon-BM2HtuQNzV.js";import"./entry-KvProgressCircle-BdWqRhpYNV.js";import"./entry-useGoalInReview-NsJEYspHlF.js";import"./entry-goalInReview-zdLSpaXyvq.js";import"./entry-dateUtils-BK1I07QHBf.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-Dqd_Clfzvk.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-index-Dz83U07IMD.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const le={title:"MyKiva/MyKivaNextYearGoalCard",component:mr},e=(gr={},{recapDate:_=null}={})=>{const r={loading:!1,...gr},D=()=>({components:{MyKivaNextYearGoalCard:mr},setup(){const d=new URL(window.location.href);_?d.searchParams.set("recapDate",_):d.searchParams.delete("recapDate"),window.history.replaceState({},"",d);const ur=y(()=>{var v;const G=((v=r==null?void 0:r.userGoal)==null?void 0:v.target)||0,L=(r==null?void 0:r.goalProgress)||0;return G?Math.min(Math.round(L/G*100),100):0}),dr=y(()=>{const{height:G,...L}=r;return L}),Gr=y(()=>r!=null&&r.height?{height:`${r.height}px`}:{});return E("goalData",{getCtaHref:()=>"/lend/filter",getGoalDisplayName:()=>"women",goalProgressPercentage:ur,setHideGoalCardPreference:()=>Promise.resolve()}),E("$kvTrackEvent",()=>{}),{cardStyle:Gr,componentArgs:dr}},template:`
            <div style="width: 379px;">
                <MyKivaNextYearGoalCard v-bind="componentArgs" :style="cardStyle" />
            </div>
        `});return D.args=r,D},t=e({prevYearLoans:5,userGoal:null}),n=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:0}),p=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:2}),i=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:5}),c=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:8}),l=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:10}),m=e({prevYearLoans:100,userGoal:{target:101,category:"ID_WOMENS_EQUALITY"},goalProgress:100}),g=e({prevYearLoans:1e3,userGoal:{target:9089,category:"ID_WOMENS_EQUALITY"},goalProgress:9087}),u=e({prevYearLoans:1e4,userGoal:{target:90890,category:"ID_WOMENS_EQUALITY"},goalProgress:90870}),Y={target:10,category:"ID_WOMENS_EQUALITY",dateStarted:"2026-02-01T12:00:00.000Z"},o=e({prevYearLoans:8,userGoal:Y,goalProgress:2},{recapDate:"2026-11-15"}),a=e({prevYearLoans:8,userGoal:Y,goalProgress:8},{recapDate:"2026-12-31"}),s=e({prevYearLoans:8,userGoal:Y,goalProgress:10},{recapDate:"2026-11-15"});var I,P,U;t.parameters={...t.parameters,docs:{...(I=t.parameters)==null?void 0:I.docs,source:{originalSource:`story({
  prevYearLoans: 5,
  userGoal: null
})`,...(U=(P=t.parameters)==null?void 0:P.docs)==null?void 0:U.source}}};var S,W,h;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 0
})`,...(h=(W=n.parameters)==null?void 0:W.docs)==null?void 0:h.source}}};var M,N,f;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 2
})`,...(f=(N=p.parameters)==null?void 0:N.docs)==null?void 0:f.source}}};var T,O,A;i.parameters={...i.parameters,docs:{...(T=i.parameters)==null?void 0:T.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 5
})`,...(A=(O=i.parameters)==null?void 0:O.docs)==null?void 0:A.source}}};var Q,w,C;c.parameters={...c.parameters,docs:{...(Q=c.parameters)==null?void 0:Q.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 8
})`,...(C=(w=c.parameters)==null?void 0:w.docs)==null?void 0:C.source}}};var x,F,H;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 10
})`,...(H=(F=l.parameters)==null?void 0:F.docs)==null?void 0:H.source}}};var K,k,$;m.parameters={...m.parameters,docs:{...(K=m.parameters)==null?void 0:K.docs,source:{originalSource:`story({
  prevYearLoans: 100,
  userGoal: {
    target: 101,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 100
})`,...($=(k=m.parameters)==null?void 0:k.docs)==null?void 0:$.source}}};var b,q,R;g.parameters={...g.parameters,docs:{...(b=g.parameters)==null?void 0:b.docs,source:{originalSource:`story({
  prevYearLoans: 1000,
  userGoal: {
    target: 9089,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 9087
})`,...(R=(q=g.parameters)==null?void 0:q.docs)==null?void 0:R.source}}};var Z,j,z;u.parameters={...u.parameters,docs:{...(Z=u.parameters)==null?void 0:Z.docs,source:{originalSource:`story({
  prevYearLoans: 10000,
  userGoal: {
    target: 90890,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 90870
})`,...(z=(j=u.parameters)==null?void 0:j.docs)==null?void 0:z.source}}};var B,J,V,X,rr;o.parameters={...o.parameters,docs:{...(B=o.parameters)==null?void 0:B.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: inWindowGoal,
  goalProgress: 2
}, {
  recapDate: '2026-11-15'
})`,...(V=(J=o.parameters)==null?void 0:J.docs)==null?void 0:V.source},description:{story:'Nov 15 → "47 days left!" under the title.',...(rr=(X=o.parameters)==null?void 0:X.docs)==null?void 0:rr.description}}};var er,or,ar,sr,tr;a.parameters={...a.parameters,docs:{...(er=a.parameters)==null?void 0:er.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: inWindowGoal,
  goalProgress: 8
}, {
  recapDate: '2026-12-31'
})`,...(ar=(or=a.parameters)==null?void 0:or.docs)==null?void 0:ar.source},description:{story:'Dec 31 → singular "1 day left!".',...(tr=(sr=a.parameters)==null?void 0:sr.docs)==null?void 0:tr.description}}};var nr,pr,ir,cr,lr;s.parameters={...s.parameters,docs:{...(nr=s.parameters)==null?void 0:nr.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: inWindowGoal,
  goalProgress: 10
}, {
  recapDate: '2026-11-15'
})`,...(ir=(pr=s.parameters)==null?void 0:pr.docs)==null?void 0:ir.source},description:{story:"Completed goal inside the window → no countdown.",...(lr=(cr=s.parameters)==null?void 0:cr.docs)==null?void 0:lr.description}}};const me=["Default","UserGoalWithoutProgress","UserGoalWithProgress","UserGoalWithHalfProgress","UserGoalAlmostCompleted","UserGoalCompleted","ThreeDigitsGoalLoans","FourDigitsGoalLoans","FiveDigitsGoalLoans","UserGoalDaysLeft","UserGoalLastDayLeft","UserGoalCompletedInWindow"];export{t as Default,u as FiveDigitsGoalLoans,g as FourDigitsGoalLoans,m as ThreeDigitsGoalLoans,c as UserGoalAlmostCompleted,l as UserGoalCompleted,s as UserGoalCompletedInWindow,o as UserGoalDaysLeft,a as UserGoalLastDayLeft,i as UserGoalWithHalfProgress,p as UserGoalWithProgress,n as UserGoalWithoutProgress,me as __namedExportsOrder,le as default};
