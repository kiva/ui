import{G as k,M as w}from"./entry-GoalInReviewSlide2-C6hu-Ev4Tz.js";import{c as r}from"./entry-goalInReviewSampleData-BT48uD-bWX.js";import"./entry-vue.esm-bundler-BYzU99W7uH.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-BorrowerImage-BiTD3mHAQU.js";import"./entry-KvWwwHeaderBasic-D-dYqQTzhh.js";import"./entry-index-CWclSTHHJk.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-9O9xxAVV.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const co={title:"MyKiva/GoalInReview/GoalInReviewSlide2",component:k,parameters:{layout:"fullscreen"}},o=(e={})=>{const s=(q,{argTypes:K})=>({props:Object.keys(K),components:{GoalInReviewSlide2:k},setup(){return{args:e}},template:'<GoalInReviewSlide2 v-bind="args" />'});return s.args=e,s},a=o({loans:r,borrowerCount:14}),n=o({loans:r.slice(0,1),borrowerCount:1}),t=o({loans:r.slice(0,6),borrowerCount:6}),l=o({loans:r.slice(0,w),borrowerCount:w}),c=o({loans:r.slice(0,w+1),borrowerCount:w+1}),m=o({loans:r,borrowerCount:1248}),p=o({loans:r.slice(0,4),borrowerCount:20}),i=o({loans:r.map(e=>({...e,name:`${e.name} Del Carmen Villalobos Hernández`})),borrowerCount:14}),u=o({loans:r.slice(0,6).map((e,s)=>s%2===0?{...e,image:null}:e),borrowerCount:6}),d=o({loans:[],borrowerCount:null});var C,R,b;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`story({
  loans: sampleGoalLoans,
  borrowerCount: 14
})`,...(b=(R=a.parameters)==null?void 0:R.docs)==null?void 0:b.source}}};var g,L,S;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.slice(0, 1),
  borrowerCount: 1
})`,...(S=(L=n.parameters)==null?void 0:L.docs)==null?void 0:S.source}}};var G,O,y;t.parameters={...t.parameters,docs:{...(G=t.parameters)==null?void 0:G.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.slice(0, 6),
  borrowerCount: 6
})`,...(y=(O=t.parameters)==null?void 0:O.docs)==null?void 0:y.source}}};var _,A,v;l.parameters={...l.parameters,docs:{...(_=l.parameters)==null?void 0:_.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.slice(0, MAX_BORROWER_CARDS),
  borrowerCount: MAX_BORROWER_CARDS
})`,...(v=(A=l.parameters)==null?void 0:A.docs)==null?void 0:v.source}}};var B,D,M;c.parameters={...c.parameters,docs:{...(B=c.parameters)==null?void 0:B.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.slice(0, MAX_BORROWER_CARDS + 1),
  borrowerCount: MAX_BORROWER_CARDS + 1
})`,...(M=(D=c.parameters)==null?void 0:D.docs)==null?void 0:M.source}}};var f,E,x;m.parameters={...m.parameters,docs:{...(f=m.parameters)==null?void 0:f.docs,source:{originalSource:`story({
  loans: sampleGoalLoans,
  borrowerCount: 1248
})`,...(x=(E=m.parameters)==null?void 0:E.docs)==null?void 0:x.source}}};var I,W,X;p.parameters={...p.parameters,docs:{...(I=p.parameters)==null?void 0:I.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.slice(0, 4),
  borrowerCount: 20
})`,...(X=(W=p.parameters)==null?void 0:W.docs)==null?void 0:X.source}}};var N,h,z;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.map(loan => ({
    ...loan,
    name: \`\${loan.name} Del Carmen Villalobos Hernández\`
  })),
  borrowerCount: 14
})`,...(z=(h=i.parameters)==null?void 0:h.docs)==null?void 0:z.source}}};var F,H,P;u.parameters={...u.parameters,docs:{...(F=u.parameters)==null?void 0:F.docs,source:{originalSource:`story({
  loans: sampleGoalLoans.slice(0, 6).map((loan, index) => index % 2 === 0 ? {
    ...loan,
    image: null
  } : loan),
  borrowerCount: 6
})`,...(P=(H=u.parameters)==null?void 0:H.docs)==null?void 0:P.source}}};var V,$,j;d.parameters={...d.parameters,docs:{...(V=d.parameters)==null?void 0:V.docs,source:{originalSource:`story({
  loans: [],
  borrowerCount: null
})`,...(j=($=d.parameters)==null?void 0:$.docs)==null?void 0:j.source}}};const mo=["Default","SingleBorrower","FullRow","AtCardLimit","OneOverCardLimit","LargeOverflow","GroupLoans","LongBorrowerNames","MissingPhotos","NoLoans"];export{l as AtCardLimit,a as Default,t as FullRow,p as GroupLoans,m as LargeOverflow,i as LongBorrowerNames,u as MissingPhotos,d as NoLoans,c as OneOverCardLimit,n as SingleBorrower,mo as __namedExportsOrder,co as default};
