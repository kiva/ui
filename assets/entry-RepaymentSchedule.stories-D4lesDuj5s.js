import{R as a}from"./entry-RepaymentSchedule-DNO0QvD8Dr.js";import{a as i}from"./entry-apollo-story-mixin-8ULRtAv_Ha.js";import{f as t,c as m}from"./entry-mockLoanFixtures-B2md5mnOC8.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";import"./entry-KvLightbox-U4ePI2uz4l.js";import"./entry-printing-BgJfHmTIjg.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-CBEp7EZB0S.js";import"./entry-index-tAHLmhMYuW.js";const q={title:"Components/BorrowerProfile/RepaymentSchedule",component:a},e=()=>({components:{RepaymentSchedule:a},mixins:[i({queryResult:m(t)})],template:`
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
})`,...(n=(o=e.parameters)==null?void 0:o.docs)==null?void 0:n.source}}};const D=["Default"];export{e as Default,D as __namedExportsOrder,q as default};
