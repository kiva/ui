import{C as n}from"./entry-CheckoutReceipt-DdEa6LjYyn.js";import{r as p}from"./entry-receipt-data-mock-DHPmkogL0D.js";import"./entry-KvIcon-4qIKz7bYED.js";import"./iframe-CQwDJU1e.js";import"./entry-vue.esm-bundler-6I7BZrzll1.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvTooltip-CESCL8nqCZ.js";import"./entry-touchEvents-DzV-rvy7P4.js";import"./entry-KvWwwHeader-DfIV6OlGkO.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-DzTqzqs3pZ.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-KvThemeProvider-Ck5PNUQ_JX.js";import"./entry-KvButton-DXNHq24Xyy.js";import"./entry-KvLoadingSpinner-Ce3EiOXc_k.js";import"./entry-index-CGacd2nhU3.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-index-D4S0JsTkt8.js";const c={data:{my:{userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},g={title:"Components/CheckoutReceipt",component:n},e=()=>({components:{CheckoutReceipt:n},template:`
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
