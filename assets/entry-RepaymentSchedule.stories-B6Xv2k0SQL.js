import{R as v}from"./entry-RepaymentSchedule--H4IBwFuRn.js";import{a as T}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{D as w,E as p,c as _,f as A,F as E,G as $}from"./entry-mockLoanFixtures-C0EICqiR9b.js";import"./entry-index-CWclSTHHJk.js";import"./entry-vue.esm-bundler-D8yP9bVmC4.js";import"./entry-KvWwwHeaderBasic-BB16oz4SiS.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-Bg3M7544.js";import"./entry-KvLightbox-Bijtdqydwv.js";import"./entry-printing-DjnSCsmPoI.js";import"./entry-dateUtils-CQ90J503dL.js";import"./entry-index-BMPNuZbV7y.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const te={title:"Components/BorrowerProfile/RepaymentSchedule",component:v};function a(e,O){return()=>({components:{RepaymentSchedule:v},mixins:[T({queryResult:_(e)})],template:`
            <repayment-schedule
                :loan-id="${e.id}"
                status="${O}"
            />
        `})}const n=a(A,"payingBack"),s=a(p,"payingBack"),o=a({...p,id:2000011,repayments:w.filter(({status:e})=>e!=="delinquent")},"payingBack"),i=a({...p,id:2000012,delinquent:!0,repayments:w.filter(({status:e})=>e!=="repaid")},"payingBack"),r=a(E,"payingBack"),t=a($,"payingBack");var c,m,d;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:"storyForLoan(fundraisingPartnerLoan, 'payingBack')",...(d=(m=n.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};var u,l,y;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:"storyForLoan(payingBackPartnerLoanWithRepayments, 'payingBack')",...(y=(l=s.parameters)==null?void 0:l.docs)==null?void 0:y.source}}};var g,h,k;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`storyForLoan({
  ...payingBackPartnerLoanWithRepayments,
  id: 2000011,
  repayments: partnerRepaymentPeriods.filter(({
    status
  }) => status !== 'delinquent')
}, 'payingBack')`,...(k=(h=o.parameters)==null?void 0:h.docs)==null?void 0:k.source}}};var B,L,f;i.parameters={...i.parameters,docs:{...(B=i.parameters)==null?void 0:B.docs,source:{originalSource:`storyForLoan({
  ...payingBackPartnerLoanWithRepayments,
  id: 2000012,
  // The sentence reads the loan-level flag, so a delinquent period alone is not enough.
  delinquent: true,
  repayments: partnerRepaymentPeriods.filter(({
    status
  }) => status !== 'repaid')
}, 'payingBack')`,...(f=(L=i.parameters)==null?void 0:L.docs)==null?void 0:f.source}}};var R,P,S,D,q;r.parameters={...r.parameters,docs:{...(R=r.parameters)==null?void 0:R.docs,source:{originalSource:"storyForLoan(dualStatementPartnerLoan, 'payingBack')",...(S=(P=r.parameters)==null?void 0:P.docs)==null?void 0:S.source},description:{story:"Dual-statement loans hide the advanced view, matching the legacy profile.",...(q=(D=r.parameters)==null?void 0:D.docs)==null?void 0:q.description}}};var F,W,b,x,I;t.parameters={...t.parameters,docs:{...(F=t.parameters)==null?void 0:F.docs,source:{originalSource:"storyForLoan(disbursedDirectLoanWithInstallments, 'payingBack')",...(b=(W=t.parameters)==null?void 0:W.docs)==null?void 0:b.source},description:{story:"Disbursed direct loan, showing the four-column installment table.",...(I=(x=t.parameters)==null?void 0:x.docs)==null?void 0:I.description}}};const ne=["Default","PayingBackWithActualRepayments","OnTrack","Delinquent","DualStatement","DirectLoanInstallments"];export{n as Default,i as Delinquent,t as DirectLoanInstallments,r as DualStatement,o as OnTrack,s as PayingBackWithActualRepayments,ne as __namedExportsOrder,te as default};
