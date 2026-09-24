import{R as v}from"./entry-RepaymentSchedule-ijRLaJbzqs.js";import{a as T}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{D as w,E as p,c as _,f as A,F as E,G as $}from"./entry-mockLoanFixtures-B1SEGQji3V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvLightbox-DVXBz7pz3Z.js";import"./entry-vue.esm-bundler-ED6DvobC3-.js";import"./entry-mdi-BeeDX8vtDa.js";import"./entry-printing-CRk90741Y_.js";import"./entry-KvMaterialIcon-BM2HtuQNzV.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-KvLoadingPlaceholder-BIZZosYllW.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-dateUtils-BK1I07QHBf.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-Dqd_Clfzvk.js";import"./entry-index-BmqS9vrVZ6.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const oe={title:"Components/BorrowerProfile/RepaymentSchedule",component:v};function a(e,O){return()=>({components:{RepaymentSchedule:v},mixins:[T({queryResult:_(e)})],template:`
            <repayment-schedule
                :loan-id="${e.id}"
                status="${O}"
            />
        `})}const n=a(A,"payingBack"),o=a(p,"payingBack"),s=a({...p,id:2000011,repayments:w.filter(({status:e})=>e!=="delinquent")},"payingBack"),i=a({...p,id:2000012,delinquent:!0,repayments:w.filter(({status:e})=>e!=="repaid")},"payingBack"),r=a(E,"payingBack"),t=a($,"payingBack");var c,m,d;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:"storyForLoan(fundraisingPartnerLoan, 'payingBack')",...(d=(m=n.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};var u,l,y;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:"storyForLoan(payingBackPartnerLoanWithRepayments, 'payingBack')",...(y=(l=o.parameters)==null?void 0:l.docs)==null?void 0:y.source}}};var g,h,k;s.parameters={...s.parameters,docs:{...(g=s.parameters)==null?void 0:g.docs,source:{originalSource:`storyForLoan({
  ...payingBackPartnerLoanWithRepayments,
  id: 2000011,
  repayments: partnerRepaymentPeriods.filter(({
    status
  }) => status !== 'delinquent')
}, 'payingBack')`,...(k=(h=s.parameters)==null?void 0:h.docs)==null?void 0:k.source}}};var B,L,f;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`storyForLoan({
  ...payingBackPartnerLoanWithRepayments,
  id: 2000012,
  // The sentence reads the loan-level flag, so a delinquent period alone is not enough.
  delinquent: true,
  repayments: partnerRepaymentPeriods.filter(({
    status
  }) => status !== 'repaid')
}, 'payingBack')`,...(f=(L=i.parameters)==null?void 0:L.docs)==null?void 0:f.source}}};var R,P,S,D,q;r.parameters={...r.parameters,docs:{...(R=r.parameters)==null?void 0:R.docs,source:{originalSource:"storyForLoan(dualStatementPartnerLoan, 'payingBack')",...(S=(P=r.parameters)==null?void 0:P.docs)==null?void 0:S.source},description:{story:"Dual-statement loans hide the advanced view, matching the legacy profile.",...(q=(D=r.parameters)==null?void 0:D.docs)==null?void 0:q.description}}};var F,W,b,x,I;t.parameters={...t.parameters,docs:{...(F=t.parameters)==null?void 0:F.docs,source:{originalSource:"storyForLoan(disbursedDirectLoanWithInstallments, 'payingBack')",...(b=(W=t.parameters)==null?void 0:W.docs)==null?void 0:b.source},description:{story:"Disbursed direct loan, showing the four-column installment table.",...(I=(x=t.parameters)==null?void 0:x.docs)==null?void 0:I.description}}};const se=["Default","PayingBackWithActualRepayments","OnTrack","Delinquent","DualStatement","DirectLoanInstallments"];export{n as Default,i as Delinquent,t as DirectLoanInstallments,r as DualStatement,s as OnTrack,o as PayingBackWithActualRepayments,se as __namedExportsOrder,oe as default};
