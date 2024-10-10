import{C as n}from"./entry-CheckoutReceipt--mqo4avIZu.js";import{m as p}from"./entry-receipt-data-mock-D0dGTCl7jn.js";import"./entry-KvIcon-DVZanYfqea.js";import"./iframe-p1qz-4tL.js";import"../sb-preview/runtime.js";import"./entry-vue.esm-bundler-CCMUuEADRp.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvTooltip-BvMpZXN_OQ.js";import"./entry-touchEvents-D1_bE1maXx.js";import"./entry-kivaColors-BWaQpoCddz.js";import"./entry-KvThemeProvider-C6Xje_Q2C3.js";import"./entry-KvButton-CplWdZYNKD.js";import"./entry-KvLoadingSpinner-BFva1V4s4F.js";import"./entry-index-DMzEMPK2qH.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-index-D4S0JsTkt8.js";const c={data:{my:{userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},_={title:"Components/CheckoutReceipt",component:n},e=()=>({components:{CheckoutReceipt:n},template:`
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
})`,...(o=(r=e.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};const N=["Default"];export{e as Default,N as __namedExportsOrder,_ as default};
