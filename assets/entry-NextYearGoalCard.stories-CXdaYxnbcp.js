import{q as u,x as L}from"./entry-vue.esm-bundler-D6rjCHbx5a.js";import{M as b}from"./entry-NextYearGoalCard-Dn6GSxLoVS.js";import"./entry-KvWwwHeaderBasic-4oh2xxIPzA.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-B_VjIxz4TE.js";import"./iframe-CU7a1Js9.js";import"./entry-useGoalData-DZRM4VLdpn.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-myKivaUtils-4-ur9tt9PN.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-flssUtils-Dvro--xiTZ.js";import"./entry-loanCardFields-C8Gn393jhu.js";import"./entry-filterUtils-BxjxFhmwJz.js";import"./entry-orderBy-CIk3iUp8RR.js";import"./entry-_baseOrderBy-BPsxOUZwUK.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseMap-C_yvelnzih.js";import"./entry-keys-Bpp3ntPRcJ.js";import"./entry-useBadgeData-DEkzn0bjyJ.js";import"./entry-achievementUtils-DcTubJ55vm.js";import"./entry-imageUtils-BO57SRLi2g.js";import"./entry-contentfulUtils-JT_-ZZ_Xjb.js";import"./entry-index-Dew-HucFLB.js";import"./entry-goalCopy-DD5tgFDmMt.js";import"./entry-vue-router-DMPYrtx6MO.js";import"./entry-confetti.module-DDw6jB6FNo.js";import"./entry-GoalProgressRing-DrH6MkniBe.js";import"./entry-KvProgressCircle-C9dUbhfhhK.js";import"./entry-useBreakpoints-C2NBIsKhxe.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const Tr={title:"MyKiva/MyKivaNextYearGoalCard",component:b},e=(q={})=>{const r={loading:!1,...q},d=()=>({components:{MyKivaNextYearGoalCard:b},setup(){const j=u(()=>{var G;const g=((G=r==null?void 0:r.userGoal)==null?void 0:G.target)||0,m=(r==null?void 0:r.goalProgress)||0;return g?Math.min(Math.round(m/g*100),100):0}),z=u(()=>{const{height:g,...m}=r;return m}),B=u(()=>r!=null&&r.height?{height:`${r.height}px`}:{});return L("goalData",{getCtaHref:()=>"/lend/filter",getGoalDisplayName:()=>"women",goalProgressPercentage:j,setHideGoalCardPreference:()=>Promise.resolve()}),L("$kvTrackEvent",()=>{}),{cardStyle:B,componentArgs:z}},template:`
            <div style="width: 379px;">
                <MyKivaNextYearGoalCard v-bind="componentArgs" :style="cardStyle" />
            </div>
        `});return d.args=r,d},o=e({prevYearLoans:5,userGoal:null}),a=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:0}),s=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:2}),t=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:5}),n=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:8}),p=e({prevYearLoans:8,userGoal:{target:10,category:"ID_WOMENS_EQUALITY"},goalProgress:10}),c=e({prevYearLoans:100,userGoal:{target:101,category:"ID_WOMENS_EQUALITY"},goalProgress:100}),l=e({prevYearLoans:1e3,userGoal:{target:9089,category:"ID_WOMENS_EQUALITY"},goalProgress:9087}),i=e({prevYearLoans:1e4,userGoal:{target:90890,category:"ID_WOMENS_EQUALITY"},goalProgress:90870});var Y,y,_;o.parameters={...o.parameters,docs:{...(Y=o.parameters)==null?void 0:Y.docs,source:{originalSource:`story({
  prevYearLoans: 5,
  userGoal: null
})`,...(_=(y=o.parameters)==null?void 0:y.docs)==null?void 0:_.source}}};var E,I,v;a.parameters={...a.parameters,docs:{...(E=a.parameters)==null?void 0:E.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 0
})`,...(v=(I=a.parameters)==null?void 0:I.docs)==null?void 0:v.source}}};var P,S,D;s.parameters={...s.parameters,docs:{...(P=s.parameters)==null?void 0:P.docs,source:{originalSource:`story({
  prevYearLoans: 8,
  userGoal: {
    target: 10,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 2
})`,...(D=(S=s.parameters)==null?void 0:S.docs)==null?void 0:D.source}}};var U,M,W;t.parameters={...t.parameters,docs:{...(U=t.parameters)==null?void 0:U.docs,source:{originalSource:`story({
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
})`,...(Q=(A=p.parameters)==null?void 0:A.docs)==null?void 0:Q.source}}};var f,x,C;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`story({
  prevYearLoans: 100,
  userGoal: {
    target: 101,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 100
})`,...(C=(x=c.parameters)==null?void 0:x.docs)==null?void 0:C.source}}};var F,H,K;l.parameters={...l.parameters,docs:{...(F=l.parameters)==null?void 0:F.docs,source:{originalSource:`story({
  prevYearLoans: 1000,
  userGoal: {
    target: 9089,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 9087
})`,...(K=(H=l.parameters)==null?void 0:H.docs)==null?void 0:K.source}}};var k,w,$;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`story({
  prevYearLoans: 10000,
  userGoal: {
    target: 90890,
    category: 'ID_WOMENS_EQUALITY'
  },
  goalProgress: 90870
})`,...($=(w=i.parameters)==null?void 0:w.docs)==null?void 0:$.source}}};const Or=["Default","UserGoalWithoutProgress","UserGoalWithProgress","UserGoalWithHalfProgress","UserGoalAlmostCompleted","UserGoalCompleted","ThreeDigitsGoalLoans","FourDigitsGoalLoans","FiveDigitsGoalLoans"];export{o as Default,i as FiveDigitsGoalLoans,l as FourDigitsGoalLoans,c as ThreeDigitsGoalLoans,n as UserGoalAlmostCompleted,p as UserGoalCompleted,t as UserGoalWithHalfProgress,s as UserGoalWithProgress,a as UserGoalWithoutProgress,Or as __namedExportsOrder,Tr as default};
