import{R as a}from"./entry-RepaymentSchedule-BYWm1Dadtt.js";import{a as i}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{f as t,c as m}from"./entry-mockLoanFixtures-CI6h-mgldC.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-B52OYB4W0G.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-BW8Ws25b.js";import"./entry-KvLightbox-DepMJA2Aa3.js";import"./entry-printing-BcRIHVBU-U.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-6TolKbZ2-J.js";import"./entry-index-BMPNuZbV7y.js";import"./entry-index-tAHLmhMYuW.js";const D={title:"Components/BorrowerProfile/RepaymentSchedule",component:a},e=()=>({components:{RepaymentSchedule:a},mixins:[i({queryResult:m(t)})],template:`
        <repayment-schedule
            :loan-id="${t.id}"
            status="payingBack"
        />
    `});var r,o,n;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`() => ({
  components: {
    RepaymentSchedule
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fundraisingPartnerLoan)
  })],
  template: \`
        <repayment-schedule
            :loan-id="\${fundraisingPartnerLoan.id}"
            status="payingBack"
        />
    \`
})`,...(n=(o=e.parameters)==null?void 0:o.docs)==null?void 0:n.source}}};const M=["Default"];export{e as Default,M as __namedExportsOrder,D as default};
