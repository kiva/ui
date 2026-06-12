import{C as o}from"./entry-CheckoutReceipt-C00SqCbKXs.js";import{r as p}from"./entry-receipt-data-mock-CgZ9iipQgR.js";import"./entry-KvIcon-DUB3O_ZZZb.js";import"./iframe-CU7a1Js9.js";import"./entry-vue.esm-bundler-D6rjCHbx5a.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvWwwHeaderBasic-4oh2xxIPzA.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-B_VjIxz4TE.js";import"./entry-index-BvXTeB4hIr.js";import"./entry-index-tAHLmhMYuW.js";const c={data:{my:{userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},b={title:"Components/CheckoutReceipt",component:o},e=()=>({components:{CheckoutReceipt:o},template:`
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
