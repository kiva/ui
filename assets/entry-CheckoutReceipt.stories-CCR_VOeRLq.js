import{C as n}from"./entry-CheckoutReceipt-YOTZh-wDYd.js";import{r as p}from"./entry-receipt-data-mock-DHPmkogL0D.js";import"./entry-KvIcon-B0ZqqslKIC.js";import"./iframe-2JtrMQ0K.js";import"../sb-preview/runtime.js";import"./entry-vue.esm-bundler-Bbq66B_iPn.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvTooltip-lCHe6hs65v.js";import"./entry-touchEvents-D1_bE1maXx.js";import"./entry-KvWideLoanCard-M9KpJ2J73i.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-KvThemeProvider-z0HeREh6v7.js";import"./entry-KvButton-C2Rfb78T-Q.js";import"./entry-KvLoadingSpinner-u2JVVBVj2i.js";import"./entry-index-DMzEMPK2qH.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-index-D4S0JsTkt8.js";const c={data:{my:{userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},g={title:"Components/CheckoutReceipt",component:n},e=()=>({components:{CheckoutReceipt:n},template:`
        <checkout-receipt
            :lender="lender"
            :receipt="receipt"
        />
    `,props:{lender:{type:Object,default(){return c.data.my.userAccount}},receipt:{type:Object,default(){return p}}}});var t,r,o;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`() => ({
  components: {
    CheckoutReceipt
  },
  template: \`
        <checkout-receipt
            :lender="lender"
            :receipt="receipt"
        />
    \`,
  props: {
    lender: {
      type: Object,
      default() {
        return mockedAPIResponse.data.my.userAccount;
      }
    },
    receipt: {
      type: Object,
      default() {
        return mockedReceiptData;
      }
    }
  }
})`,...(o=(r=e.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};const v=["Default"];export{e as Default,v as __namedExportsOrder,g as default};
