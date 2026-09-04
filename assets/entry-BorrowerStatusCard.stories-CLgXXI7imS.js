import{_ as Y}from"./entry-BorrowerStatusCard-CxQG1ef-A2.js";import{m as j}from"./entry-utils-LVhxYihmNs.js";import{a as T}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as $}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{P as O,F as h,a as z,R as H,E as J,b as Q,c as V}from"./entry-LoanStatusEnum-Cvai-0kFu9.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-HeroBackground-BbR5-6T0Wb.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-D22wPJfH.js";import"./entry-KvContentfulImg-CR0W9gzMB1.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-BorrowerImage-l4VVjAcZ0b.js";import"./entry-loan-data-mock-B1RgYuoN0n.js";const Rr={title:"MyKiva/BorrowerStatusCard",component:Y},r=j(3),W={data:{lend:{loan:r[0]}}},o=(u={})=>{const d=(Z,{argTypes:X})=>({props:Object.keys(X),components:{BorrowerStatusCard:Y},mixins:[T({queryResult:W}),$()],setup(){return{args:u}},provide:{$kvTrackEvent:()=>Promise.resolve({fn:()=>({})})},template:`
            <borrower-status-card v-bind="args" />
        `});return d.args=u,d},s=o({loan:r[0]}),a=o({loan:{...r[0],status:O}}),e=o({loan:{...r[0],status:h}}),t=o({loan:{...r[0],status:z}}),n=o({loan:{...r[0],status:H}}),c=o({loan:{...r[0],status:O,delinquent:!0}}),m=o({loan:{...r[0],status:J}}),p=o({loan:{...r[0],status:Q}}),i=o({loan:{...r[0],status:V}});var l,D,E;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`story({
  loan: mockLoans[0]
})`,...(E=(D=s.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var y,S,g;a.parameters={...a.parameters,docs:{...(y=a.parameters)==null?void 0:y.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: PAYING_BACK
  }
})`,...(g=(S=a.parameters)==null?void 0:S.docs)==null?void 0:g.source}}};var k,R,N;e.parameters={...e.parameters,docs:{...(k=e.parameters)==null?void 0:k.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: FUNDRAISING
  }
})`,...(N=(R=e.parameters)==null?void 0:R.docs)==null?void 0:N.source}}};var f,_,A;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: FUNDED
  }
})`,...(A=(_=t.parameters)==null?void 0:_.docs)==null?void 0:A.source}}};var F,I,L;n.parameters={...n.parameters,docs:{...(F=n.parameters)==null?void 0:F.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: RAISED
  }
})`,...(L=(I=n.parameters)==null?void 0:I.docs)==null?void 0:L.source}}};var P,B,x;c.parameters={...c.parameters,docs:{...(P=c.parameters)==null?void 0:P.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: PAYING_BACK,
    delinquent: true
  }
})`,...(x=(B=c.parameters)==null?void 0:B.docs)==null?void 0:x.source}}};var v,C,U;m.parameters={...m.parameters,docs:{...(v=m.parameters)==null?void 0:v.docs,source:{originalSource:`story({
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
})`,...(M=(K=i.parameters)==null?void 0:K.docs)==null?void 0:M.source}}};const Nr=["Default","Repaying","Fundraising","Funded","Raised","PayingBackDelinquent","Expired","Refunded","Ended"];export{s as Default,i as Ended,m as Expired,t as Funded,e as Fundraising,c as PayingBackDelinquent,n as Raised,p as Refunded,a as Repaying,Nr as __namedExportsOrder,Rr as default};
