import{B as Y}from"./entry-BorrowerStatusCard-DRbSWEQG5A.js";import{m as j}from"./entry-utils-LVhxYihmNs.js";import{a as T}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as $}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{P as O,F as h,a as z,R as H,E as J,b as Q,c as V}from"./entry-LoanStatusEnum-BZ9jvWVUox.js";import"./entry-vue.esm-bundler-B52OYB4W0G.js";import"./entry-HeroBackground-BFFflCstG3.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-BW8Ws25b.js";import"./entry-KvContentfulImg-CWIeocqfyW.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-BorrowerImage-2godQmxmcR.js";import"./entry-loan-data-mock-B1RgYuoN0n.js";const Rr={title:"MyKiva/BorrowerStatusCard",component:Y},r=j(3),W={data:{lend:{loan:r[0]}}},s=(u={})=>{const d=(Z,{argTypes:X})=>({props:Object.keys(X),components:{BorrowerStatusCard:Y},mixins:[T({queryResult:W}),$()],setup(){return{args:u}},provide:{$kvTrackEvent:()=>Promise.resolve({fn:()=>({})})},template:`
            <borrower-status-card v-bind="args" />
        `});return d.args=u,d},o=s({loan:r[0]}),a=s({loan:{...r[0],status:O}}),e=s({loan:{...r[0],status:h}}),t=s({loan:{...r[0],status:z}}),n=s({loan:{...r[0],status:H}}),c=s({loan:{...r[0],status:O,delinquent:!0}}),m=s({loan:{...r[0],status:J}}),p=s({loan:{...r[0],status:Q}}),i=s({loan:{...r[0],status:V}});var l,E,D;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`story({
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
})`,...(N=(R=e.parameters)==null?void 0:R.docs)==null?void 0:N.source}}};var f,A,F;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: FUNDED
  }
})`,...(F=(A=t.parameters)==null?void 0:A.docs)==null?void 0:F.source}}};var I,L,B;n.parameters={...n.parameters,docs:{...(I=n.parameters)==null?void 0:I.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: RAISED
  }
})`,...(B=(L=n.parameters)==null?void 0:L.docs)==null?void 0:B.source}}};var P,x,_;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`story({
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
})`,...(M=(K=i.parameters)==null?void 0:K.docs)==null?void 0:M.source}}};const Nr=["Default","Repaying","Fundraising","Funded","Raised","PayingBackDelinquent","Expired","Refunded","Ended"];export{o as Default,i as Ended,m as Expired,t as Funded,e as Fundraising,c as PayingBackDelinquent,n as Raised,p as Refunded,a as Repaying,Nr as __namedExportsOrder,Rr as default};
