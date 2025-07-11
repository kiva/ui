import{B as Y,P as O,F as j,a as T,R as $,E as h,b as z,c as H}from"./entry-BorrowerStatusCard-bxrKtMsMaZ.js";import{m as J}from"./entry-utils-DPTlI_yqzd.js";import{a as Q}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as V}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import"./entry-vue.esm-bundler-Duz9TGGLcr.js";import"./entry-HeroBackground-DKDF0YrgDX.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvSecondaryNav-Bp1Uuall6y.js";import"./entry-KvContentfulImg-DxafLgvmGY.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-BorrowerImage-jPu7FOVQQx.js";import"./entry-imageUtils-DMLkgPJKqw.js";import"./entry-loan-data-mock-K6LggmKLGT.js";const Es={title:"MyKiva/BorrowerStatusCard",component:Y},s=J(3),W={data:{lend:{loan:s[0]}}},r=(i={})=>{const d=(Z,{argTypes:X})=>({props:Object.keys(X),components:{BorrowerStatusCard:Y},mixins:[Q({queryResult:W}),V()],setup(){return{args:i}},provide:{$kvTrackEvent:()=>Promise.resolve({fn:()=>({})})},template:`
            <borrower-status-card v-bind="args" />
        `});return d.args=i,d},a=r({loan:s[0]}),o=r({loan:{...s[0],status:O}}),e=r({loan:{...s[0],status:j}}),t=r({loan:{...s[0],status:T}}),n=r({loan:{...s[0],status:$}}),c=r({loan:{...s[0],status:O,delinquent:!0}}),m=r({loan:{...s[0],status:h}}),u=r({loan:{...s[0],status:z}}),p=r({loan:{...s[0],status:H}});var l,E,D;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`story({
  loan: mockLoans[0]
})`,...(D=(E=a.parameters)==null?void 0:E.docs)==null?void 0:D.source}}};var y,S,g;o.parameters={...o.parameters,docs:{...(y=o.parameters)==null?void 0:y.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: PAYING_BACK
  }
})`,...(g=(S=o.parameters)==null?void 0:S.docs)==null?void 0:g.source}}};var k,R,N;e.parameters={...e.parameters,docs:{...(k=e.parameters)==null?void 0:k.docs,source:{originalSource:`story({
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
})`,...(U=(C=m.parameters)==null?void 0:C.docs)==null?void 0:U.source}}};var q,G,b;u.parameters={...u.parameters,docs:{...(q=u.parameters)==null?void 0:q.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: REFUNDED
  }
})`,...(b=(G=u.parameters)==null?void 0:G.docs)==null?void 0:b.source}}};var w,K,M;p.parameters={...p.parameters,docs:{...(w=p.parameters)==null?void 0:w.docs,source:{originalSource:`story({
  loan: {
    ...mockLoans[0],
    status: ENDED
  }
})`,...(M=(K=p.parameters)==null?void 0:K.docs)==null?void 0:M.source}}};const Ds=["Default","Repaying","Fundraising","Funded","Raised","PayingBackDelinquent","Expired","Refunded","Ended"];export{a as Default,p as Ended,m as Expired,t as Funded,e as Fundraising,c as PayingBackDelinquent,n as Raised,u as Refunded,o as Repaying,Ds as __namedExportsOrder,Es as default};
