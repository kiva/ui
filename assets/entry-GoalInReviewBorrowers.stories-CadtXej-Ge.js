import k from"./entry-GoalInReviewBorrowers-FqtUs3zcaW.js";import{M as w}from"./entry-goalInReview-DBDaSELZMk.js";import{s as r}from"./entry-goalInReviewSampleData-YU4OCIUT6t.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-BorrowerImage-l4VVjAcZ0b.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-D22wPJfH.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-useBadgeData-BM_PPpZWd3.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-achievementUtils-DQbJirzL4R.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-contentfulUtils-BhganbZZnz.js";import"./entry-index-7WUD3idviV.js";import"./entry-useGoalData-CGxKGkbOuM.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-flssUtils-B88iANwyB2.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-5YY4tepa23.js";import"./entry-filterUtils-DVtQjHZnxi.js";import"./entry-orderBy-iPSOJk4XXi.js";import"./entry-_baseOrderBy-KaK2JLUByg.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseMap-CIOY77EeAM.js";import"./entry-keys-WbbxK4vnp3.js";import"./entry-dateUtils-qZzGtZF0jQ.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";const Eo={title:"MyKiva/GoalInReview/GoalInReviewBorrowers",component:k,parameters:{layout:"fullscreen"}},o=(e={})=>{const s=(q,{argTypes:K})=>({props:Object.keys(K),components:{GoalInReviewBorrowers:k},setup(){return{args:e}},template:'<GoalInReviewBorrowers v-bind="args" />'});return s.args=e,s},a=o({loans:r,borrowerCount:14}),n=o({loans:r.slice(0,1),borrowerCount:1}),t=o({loans:r.slice(0,6),borrowerCount:6}),m=o({loans:r.slice(0,w),borrowerCount:w}),l=o({loans:r.slice(0,w+1),borrowerCount:w+1}),p=o({loans:r,borrowerCount:1248}),i=o({loans:r.slice(0,4),borrowerCount:20}),c=o({loans:r.map(e=>({...e,name:`${e.name} Del Carmen Villalobos Hernández`})),borrowerCount:14}),u=o({loans:r.slice(0,6).map((e,s)=>s%2===0?{...e,image:null}:e),borrowerCount:6}),d=o({loans:[],borrowerCount:null});var C,R,b;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`story({
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
})`,...(A=(B=m.parameters)==null?void 0:B.docs)==null?void 0:A.source}}};var v,f,D;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.slice(0, MAX_BORROWER_CARDS + 1),
  borrowerCount: MAX_BORROWER_CARDS + 1
})`,...(D=(f=l.parameters)==null?void 0:f.docs)==null?void 0:D.source}}};var M,E,x;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`story({
  loans: sampleGoalLoans,
  borrowerCount: 1248
})`,...(x=(E=p.parameters)==null?void 0:E.docs)==null?void 0:x.source}}};var I,W,X;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`story({
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
})`,...(j=($=d.parameters)==null?void 0:$.docs)==null?void 0:j.source}}};const xo=["Default","SingleBorrower","FullRow","AtCardLimit","OneOverCardLimit","LargeOverflow","GroupLoans","LongBorrowerNames","MissingPhotos","NoLoans"];export{m as AtCardLimit,a as Default,t as FullRow,i as GroupLoans,p as LargeOverflow,c as LongBorrowerNames,u as MissingPhotos,d as NoLoans,l as OneOverCardLimit,n as SingleBorrower,xo as __namedExportsOrder,Eo as default};
