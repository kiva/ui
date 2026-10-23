import{C as n}from"./entry-CheckoutReceipt-BSdrQxOyhl.js";import{r as p}from"./entry-receipt-data-mock-CgZ9iipQgR.js";import"./entry-KvIcon-CCLGnEgPZA.js";import"./iframe-DuiMrmqs.js";import"./entry-vue.esm-bundler-DN41AgNdM7.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvButton-BtWM7FaLlj.js";import"./entry-KvLoadingSpinner-BoGXwWqv66.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-KvTooltip-CKmhQ5mS4i.js";import"./entry-kivaColors-CtWaAVoWDc.js";import"./entry-tokens-DbOC52mrdi.js";import"./entry-index-Dz83U07IMD.js";import"./entry-index-Dqd_Clfzvk.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-index-D4S0JsTkt8.js";const c={data:{my:{userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},_={title:"Components/CheckoutReceipt",component:n},e=()=>({components:{CheckoutReceipt:n},template:`
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
