import{C as n}from"./entry-CheckoutReceipt-DiNN_EAoev.js";import{r as p}from"./entry-receipt-data-mock-CgZ9iipQgR.js";import"./entry-KvIcon-B7nRpqD9wh.js";import"./iframe-zM18a6JW.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvWwwHeader-K_aXJrsvke.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-KvButton-2WLASe3tCZ.js";import"./entry-KvLoadingSpinner-B-Httn77Py.js";import"./entry-KvTooltip-BQND6OVBCO.js";import"./entry-KvThemeProvider-hQ4Q4UyWeS.js";import"./entry-index-CGacd2nhU3.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-index-D4S0JsTkt8.js";const c={data:{my:{userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},N={title:"Components/CheckoutReceipt",component:n},e=()=>({components:{CheckoutReceipt:n},template:`
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
})`,...(o=(r=e.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};const g=["Default"];export{e as Default,g as __namedExportsOrder,N as default};
