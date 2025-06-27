import{B as Y,P as O,F as j,a as T,R as $,E as h,b as z,c as H}from"./entry-BorrowerStatusCard-CBSEJTP6pr.js";import{m as J}from"./entry-utils-DPTlI_yqzd.js";import{a as Q}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as V}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-vue.esm-bundler-D5m7h15tzB.js";import"./entry-HeroBackground-Dzka24qSsR.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvSecondaryNav-DRnkkPAFON.js";import"./entry-KvContentfulImg-BPpUk7xXAO.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-BorrowerImage-CdtTc8Mupg.js";import"./entry-imageUtils-DMLkgPJKqw.js";import"./entry-mdi-Jyy_kRgyKq.js";import"./entry-KvExpandable-BqONlQr5Hf.js";import"./entry-KvMaterialIcon-BLPGYhAoqx.js";import"./entry-vue-router-zq2_5VAmAT.js";import"./entry-index-BTftIkQSSB.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-D_23gIjsxn.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-loan-data-mock-K6LggmKLGT.js";const Fr={title:"MyKiva/BorrowerStatusCard",component:Y},r=J(3),W={data:{lend:{loan:r[0]}}},s=(u={})=>{const d=(Z,{argTypes:X})=>({props:Object.keys(X),components:{BorrowerStatusCard:Y},mixins:[Q({queryResult:W}),V()],setup(){return{args:u}},provide:{$kvTrackEvent:()=>Promise.resolve({fn:()=>({})})},template:`
            <borrower-status-card v-bind="args" />
        `});return d.args=u,d},o=s({loan:r[0]}),a=s({loan:{...r[0],status:O}}),e=s({loan:{...r[0],status:j}}),t=s({loan:{...r[0],status:T}}),n=s({loan:{...r[0],status:$}}),c=s({loan:{...r[0],status:O,delinquent:!0}}),m=s({loan:{...r[0],status:h}}),p=s({loan:{...r[0],status:z}}),i=s({loan:{...r[0],status:H}});var l,E,D;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`story({
  loan: mockLoans[0]
})`,...(D=(E=o.parameters)==null?void 0:E.docs)==null?void 0:D.source}}};var y,S,g;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: PAYING_BACK
  }
})`,...(g=(S=a.parameters)==null?void 0:S.docs)==null?void 0:g.source}}};var k,R,N;e.parameters={...e.parameters,docs:{...(k=e.parameters)==null?void 0:k.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: FUNDRAISING
  }
})`,...(N=(R=e.parameters)==null?void 0:R.docs)==null?void 0:N.source}}};var A,F,I;t.parameters={...t.parameters,docs:{...(A=t.parameters)==null?void 0:A.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: FUNDED
  }
})`,...(I=(F=t.parameters)==null?void 0:F.docs)==null?void 0:I.source}}};var L,f,B;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: RAISED
  }
})`,...(B=(f=n.parameters)==null?void 0:f.docs)==null?void 0:B.source}}};var P,x,_;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: PAYING_BACK,
    delinquent: true
  }
})`,...(_=(x=c.parameters)==null?void 0:x.docs)==null?void 0:_.source}}};var v,C,U;m.parameters={...m.parameters,docs:{...(v=m.parameters)==null?void 0:v.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: EXPIRED
  }
})`,...(U=(C=m.parameters)==null?void 0:C.docs)==null?void 0:U.source}}};var q,G,b;p.parameters={...p.parameters,docs:{...(q=p.parameters)==null?void 0:q.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: REFUNDED
  }
})`,...(b=(G=p.parameters)==null?void 0:G.docs)==null?void 0:b.source}}};var w,K,M;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: ENDED
  }
})`,...(M=(K=i.parameters)==null?void 0:K.docs)==null?void 0:M.source}}};const Ir=["Default","Repaying","Fundraising","Funded","Raised","PayingBackDelinquent","Expired","Refunded","Ended"];export{o as Default,i as Ended,m as Expired,t as Funded,e as Fundraising,c as PayingBackDelinquent,n as Raised,p as Refunded,a as Repaying,Ir as __namedExportsOrder,Fr as default};
