import{C as n}from"./entry-CheckoutReceipt-CNMgVfB7bC.js";import{r as p}from"./entry-receipt-data-mock-DHPmkogL0D.js";import"./entry-KvIcon-MD7an-7TgF.js";import"./iframe-8J__a5wJ.js";import"../sb-preview/runtime.js";import"./entry-vue.esm-bundler-CTwdbZZHjD.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvTooltip-DXeBXGvGWE.js";import"./entry-touchEvents-D1_bE1maXx.js";import"./entry-KvWideLoanCard-CfbcqIxttL.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-KvThemeProvider-Dz9VaoJsdH.js";import"./entry-KvButton-CBJoMUsMFr.js";import"./entry-KvLoadingSpinner-qUlMzbXzEe.js";import"./entry-index-DMzEMPK2qH.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-index-D4S0JsTkt8.js";const c={data:{my:{userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},g={title:"Components/CheckoutReceipt",component:n},e=()=>({components:{CheckoutReceipt:n},template:`
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
