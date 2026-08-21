import k from"./entry-GoalInReviewBorrowers-DVUQNjqLRu.js";import{M as w}from"./entry-goalInReview-CNr5wl2h0-.js";import{s as r}from"./entry-goalInReviewSampleData-YU4OCIUT6t.js";import"./entry-vue.esm-bundler-D8yP9bVmC4.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-BorrowerImage-CbPcvs9VP5.js";import"./entry-KvWwwHeaderBasic-BB16oz4SiS.js";import"./entry-index-CWclSTHHJk.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-Bg3M7544.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-useBadgeData-cXsiLwR3fo.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-achievementUtils-D2hR7yj5fV.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-contentfulUtils-BSVc25-f1Y.js";import"./entry-index-7WUD3idviV.js";import"./entry-useGoalData-Cil8VJ-eUi.js";import"./entry-myKivaUtils-4-ur9tt9PN.js";import"./entry-flssUtils-DutmBwZDt1.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterUtils-DVtQjHZnxi.js";import"./entry-orderBy-CuF8cTvHI1.js";import"./entry-_baseOrderBy-p4qs5UUyWO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseMap-Y3vx4Wl8dz.js";import"./entry-keys-WbbxK4vnp3.js";import"./entry-dateUtils-CQ90J503dL.js";import"./entry-index-BMPNuZbV7y.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-index-6TolKbZ2-J.js";import"./entry-index-tAHLmhMYuW.js";const Io={title:"MyKiva/GoalInReview/GoalInReviewBorrowers",component:k,parameters:{layout:"fullscreen"}},o=(e={})=>{const s=(q,{argTypes:K})=>({props:Object.keys(K),components:{GoalInReviewBorrowers:k},setup(){return{args:e}},template:'<GoalInReviewBorrowers v-bind="args" />'});return s.args=e,s},a=o({loans:r,borrowerCount:14}),n=o({loans:r.slice(0,1),borrowerCount:1}),t=o({loans:r.slice(0,6),borrowerCount:6}),m=o({loans:r.slice(0,w),borrowerCount:w}),p=o({loans:r.slice(0,w+1),borrowerCount:w+1}),l=o({loans:r,borrowerCount:1248}),i=o({loans:r.slice(0,4),borrowerCount:20}),c=o({loans:r.map(e=>({...e,name:`${e.name} Del Carmen Villalobos Hernández`})),borrowerCount:14}),u=o({loans:r.slice(0,6).map((e,s)=>s%2===0?{...e,image:null}:e),borrowerCount:6}),d=o({loans:[],borrowerCount:null});var C,R,b;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`story({
  loans: sampleGoalLoans,
  borrowerCount: 14
})`,...(b=(R=a.parameters)==null?void 0:R.docs)==null?void 0:b.source}}};var g,L,O;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.slice(0, 1),
  borrowerCount: 1
})`,...(O=(L=n.parameters)==null?void 0:L.docs)==null?void 0:O.source}}};var _,G,S;t.parameters={...t.parameters,docs:{...(_=t.parameters)==null?void 0:_.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.slice(0, 6),
  borrowerCount: 6
})`,...(S=(G=t.parameters)==null?void 0:G.docs)==null?void 0:S.source}}};var y,B,A;m.parameters={...m.parameters,docs:{...(y=m.parameters)==null?void 0:y.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.slice(0, MAX_BORROWER_CARDS),
  borrowerCount: MAX_BORROWER_CARDS
})`,...(A=(B=m.parameters)==null?void 0:B.docs)==null?void 0:A.source}}};var v,f,D;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.slice(0, MAX_BORROWER_CARDS + 1),
  borrowerCount: MAX_BORROWER_CARDS + 1
})`,...(D=(f=p.parameters)==null?void 0:f.docs)==null?void 0:D.source}}};var M,E,x;l.parameters={...l.parameters,docs:{...(M=l.parameters)==null?void 0:M.docs,source:{originalSource:`story({
  loans: sampleGoalLoans,
  borrowerCount: 1248
})`,...(x=(E=l.parameters)==null?void 0:E.docs)==null?void 0:x.source}}};var I,W,X;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.slice(0, 4),
  borrowerCount: 20
})`,...(X=(W=i.parameters)==null?void 0:W.docs)==null?void 0:X.source}}};var N,h,z;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.map(loan => ({
    ...loan,
    name: \`\${loan.name} Del Carmen Villalobos Hernández\`
  })),
  borrowerCount: 14
})`,...(z=(h=c.parameters)==null?void 0:h.docs)==null?void 0:z.source}}};var F,H,P;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.slice(0, 6).map((loan, index) => index % 2 === 0 ? {
    ...loan,
    image: null
  } : loan),
  borrowerCount: 6
})`,...(P=(H=u.parameters)==null?void 0:H.docs)==null?void 0:P.source}}};var V,$,j;d.parameters={...d.parameters,docs:{...(V=d.parameters)==null?void 0:V.docs,source:{originalSource:`story({
  loans: [],
  borrowerCount: null
})`,...(j=($=d.parameters)==null?void 0:$.docs)==null?void 0:j.source}}};const Wo=["Default","SingleBorrower","FullRow","AtCardLimit","OneOverCardLimit","LargeOverflow","GroupLoans","LongBorrowerNames","MissingPhotos","NoLoans"];export{m as AtCardLimit,a as Default,t as FullRow,i as GroupLoans,l as LargeOverflow,c as LongBorrowerNames,u as MissingPhotos,d as NoLoans,p as OneOverCardLimit,n as SingleBorrower,Wo as __namedExportsOrder,Io as default};
