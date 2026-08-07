import{C as n}from"./entry-CheckoutReceipt-DFfdS5zeev.js";import{r as p}from"./entry-receipt-data-mock-CgZ9iipQgR.js";import"./entry-KvIcon-DwxBcAik-4.js";import"./iframe-9O9xxAVV.js";import"./entry-vue.esm-bundler-BYzU99W7uH.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvWwwHeaderBasic-D-dYqQTzhh.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./entry-index-6TolKbZ2-J.js";import"./entry-index-BMPNuZbV7y.js";import"./entry-index-tAHLmhMYuW.js";const c={data:{my:{userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},D={title:"Components/CheckoutReceipt",component:n},e=()=>({components:{CheckoutReceipt:n},template:`
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
})`,...(o=(r=e.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};const _=["Default"];export{e as Default,_ as __namedExportsOrder,D as default};
