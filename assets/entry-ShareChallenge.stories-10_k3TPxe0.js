import{S as h}from"./entry-ShareChallenge-lF3BmkM8jc.js";import{a as y}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-team-goal-mixin-BAgUP46IZ0.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-COmIkRYU2t.js";import"./entry-KvProgressCircle-Dg2dNVsd17.js";import"./entry-vue.esm-bundler-gh2KZVgkoT.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-rewards-D0_KBszLKf.js";import"./entry-social-sharing-mixin-CogSmiwV__.js";import"./entry-urlUtils-BR6y7F2aaq.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-KvMaterialIcon-YL3bYtTma_.js";import"./entry-KvIcon-CsOL-khJbW.js";import"./iframe-DF_SRe9G.js";import"../sb-preview/runtime.js";import"./entry-KvPageContainer-BuwtoyQ9BL.js";import"./entry-KvGrid-DTzIso7bTt.js";const B={title:"Components/ShareChallenge",component:h},I=()=>({methods:{handleFacebookResponse:()=>{},showSharePopUp:()=>{},twitterShareUrl:()=>{},facebookShareUrl:()=>{},linkedInShareUrl:()=>{},copyLink:()=>{}}}),t=(S={})=>(P,{argTypes:b})=>({props:Object.keys(b),components:{ShareChallenge:h},mixins:[y(),I()],setup(){return S},template:'<share-challenge :goal="goal" :loan="loan" :lender="lender" :team-public-id="teamPublicId" />'}),a={participation:{values:[{amountLent:10}]},targets:{values:[{targetLendAmount:20}]}},s={id:1,name:"Test Loan"},L={inviterName:"Test Lender",public:!0,publicId:"test-lender"},e=t({goal:a,loan:s}),r=t({goal:a,loan:s,teamPublicId:"aplus"}),o=t({goal:a,loan:s,lender:L,teamPublicId:"aplus"});var n,l,p;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`story({
  goal,
  loan
})`,...(p=(l=e.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var m,i,c;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`story({
  goal,
  loan,
  teamPublicId: 'aplus'
})`,...(c=(i=r.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var d,u,g;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`story({
  goal,
  loan,
  lender,
  teamPublicId: 'aplus'
})`,...(g=(u=o.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};const G=["Default","Team","Lender"];export{e as Default,o as Lender,r as Team,G as __namedExportsOrder,B as default};
