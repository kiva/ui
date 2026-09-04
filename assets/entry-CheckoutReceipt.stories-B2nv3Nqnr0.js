import{C as o}from"./entry-CheckoutReceipt-DecEY1XxN4.js";import{r as p}from"./entry-receipt-data-mock-CgZ9iipQgR.js";import"./entry-KvIcon-hDZLSek-V-.js";import"./iframe-D22wPJfH.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";const c={data:{my:{userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},b={title:"Components/CheckoutReceipt",component:o},e=()=>({components:{CheckoutReceipt:o},template:`
        <checkout-receipt
            :lender="lender"
            :receipt="receipt"
        />
    `,props:{lender:{type:Object,default(){return c.data.my.userAccount}},receipt:{type:Object,default(){return p}}}});var t,r,n;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`() => ({
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
})`,...(n=(r=e.parameters)==null?void 0:r.docs)==null?void 0:n.source}}};const O=["Default"];export{e as Default,O as __namedExportsOrder,b as default};
