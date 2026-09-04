import{q as u,y as L}from"./entry-vue.esm-bundler-CkX4CbCAj4.js";import{_ as b}from"./entry-NextYearGoalCard-YVl1IwA6za.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-D22wPJfH.js";import"./entry-useGoalData-CGxKGkbOuM.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-flssUtils-B88iANwyB2.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-5YY4tepa23.js";import"./entry-filterUtils-DVtQjHZnxi.js";import"./entry-orderBy-iPSOJk4XXi.js";import"./entry-_baseOrderBy-KaK2JLUByg.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseMap-CIOY77EeAM.js";import"./entry-keys-WbbxK4vnp3.js";import"./entry-useBadgeData-BM_PPpZWd3.js";import"./entry-achievementUtils-DQbJirzL4R.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-contentfulUtils-BhganbZZnz.js";import"./entry-index-7WUD3idviV.js";import"./entry-goalCopy-BdzkadAqJg.js";import"./entry-vue-router-FhvgPHqR7g.js";import"./entry-confetti.module-B5JVzsfHJX.js";import"./entry-GoalProgressRing-DmCBb1HGS6.js";import"./entry-KvProgressCircle-BkwnSJB5ye.js";import"./entry-goalInReview-DBDaSELZMk.js";import"./entry-dateUtils-qZzGtZF0jQ.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const Qr={title:"MyKiva/MyKivaNextYearGoalCard",component:b},e=(q={})=>{const r={loading:!1,...q},d=()=>({components:{MyKivaNextYearGoalCard:b},setup(){const j=u(()=>{var G;const g=((G=r==null?void 0:r.userGoal)==null?void 0:G.target)||0,m=(r==null?void 0:r.goalProgress)||0;return g?Math.min(Math.round(m/g*100),100):0}),z=u(()=>{const{height:g,...m}=r;return m}),B=u(()=>r!=null&&r.height?{height:`${r.height}px`}:{});return L("goalData",{getCtaHref:()=>"/lend/filter",getGoalDisplayName:()=>"women",goalProgressPercentage:j,setHideGoalCardPreference:()=>Promise.resolve()}),L("$kvTrackEvent",()=>{}),{cardStyle:B,componentArgs:z}},template:`
            <div style="width: 379px;">
                <MyKivaNextYearGoalCard v-bind="componentArgs" :style="cardStyle" />
            </div>
        `});return d.args=r,d},o=e({prevYearLoans:5,userGoal:null}),a=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:0}),s=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:2}),t=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:5}),n=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:8}),p=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:10}),i=e({prevYearLoans:100,userGoal:{target:101,category:"ID_WOMENS_EQUALITY"},goalProgress:100}),c=e({prevYearLoans:1e3,userGoal:{target:9089,category:"ID_WOMENS_EQUALITY"},goalProgress:9087}),l=e({prevYearLoans:1e4,userGoal:{target:90890,category:"ID_WOMENS_EQUALITY"},goalProgress:90870});var _,Y,y;o.parameters={...o.parameters,docs:{...(_=o.parameters)==null?void 0:_.docs,source:{originalSource:`story({
  prevYearLoans: 5,
  userGoal: null
})`,...(y=(Y=o.parameters)==null?void 0:Y.docs)==null?void 0:y.source}}};var E,I,v;a.parameters={...a.parameters,docs:{...(E=a.parameters)==null?void 0:E.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 0
})`,...(v=(I=a.parameters)==null?void 0:I.docs)==null?void 0:v.source}}};var D,P,S;s.parameters={...s.parameters,docs:{...(D=s.parameters)==null?void 0:D.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 2
})`,...(S=(P=s.parameters)==null?void 0:P.docs)==null?void 0:S.source}}};var U,M,W;t.parameters={...t.parameters,docs:{...(U=t.parameters)==null?void 0:U.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 5
})`,...(W=(M=t.parameters)==null?void 0:M.docs)==null?void 0:W.source}}};var N,h,T;n.parameters={...n.parameters,docs:{...(N=n.parameters)==null?void 0:N.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 8
})`,...(T=(h=n.parameters)==null?void 0:h.docs)==null?void 0:T.source}}};var O,A,Q;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 10
})`,...(Q=(A=p.parameters)==null?void 0:A.docs)==null?void 0:Q.source}}};var f,C,x;i.parameters={...i.parameters,docs:{...(f=i.parameters)==null?void 0:f.docs,source:{originalSource:`story({
  prevYearLoans: 100,
  userGoal: {
    target: 101,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 100
})`,...(x=(C=i.parameters)==null?void 0:C.docs)==null?void 0:x.source}}};var F,H,K;c.parameters={...c.parameters,docs:{...(F=c.parameters)==null?void 0:F.docs,source:{originalSource:`story({
  prevYearLoans: 1000,
  userGoal: {
    target: 9089,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 9087
})`,...(K=(H=c.parameters)==null?void 0:H.docs)==null?void 0:K.source}}};var k,w,$;l.parameters={...l.parameters,docs:{...(k=l.parameters)==null?void 0:k.docs,source:{originalSource:`story({
  prevYearLoans: 10000,
  userGoal: {
    target: 90890,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 90870
})`,...($=(w=l.parameters)==null?void 0:w.docs)==null?void 0:$.source}}};const fr=["Default","UserGoalWithoutProgress","UserGoalWithProgress","UserGoalWithHalfProgress","UserGoalAlmostCompleted","UserGoalCompleted","ThreeDigitsGoalLoans","FourDigitsGoalLoans","FiveDigitsGoalLoans"];export{o as Default,l as FiveDigitsGoalLoans,c as FourDigitsGoalLoans,i as ThreeDigitsGoalLoans,n as UserGoalAlmostCompleted,p as UserGoalCompleted,t as UserGoalWithHalfProgress,s as UserGoalWithProgress,a as UserGoalWithoutProgress,fr as __namedExportsOrder,Qr as default};
