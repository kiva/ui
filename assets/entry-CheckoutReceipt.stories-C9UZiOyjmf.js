import{C as o}from"./entry-CheckoutReceipt-CVH-l2mKe8.js";import{r as p}from"./entry-receipt-data-mock-CgZ9iipQgR.js";import"./entry-KvIcon-Dux0tIgRb3.js";import"./iframe-LCVN7OV2.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./entry-index-CBEp7EZB0S.js";import"./entry-index-tAHLmhMYuW.js";const c={data:{my:{userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},j={title:"Components/CheckoutReceipt",component:o},e=()=>({components:{CheckoutReceipt:o},template:`
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
})`,...(n=(r=e.parameters)==null?void 0:r.docs)==null?void 0:n.source}}};const D=["Default"];export{e as Default,D as __namedExportsOrder,j as default};
