import{S as m}from"./entry-SocialShareV2-D9y0nY_dyZ.js";import{m as s}from"./entry-receipt-data-mock-D0dGTCl7jn.js";import{a as i}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-orderBy-D7H6IWrseo.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-get-pjbUt-rccH.js";import"./entry-isSymbol-Cs2hrTnPnb.js";import"./entry-_baseIteratee-CnqBpGgGFn.js";import"./entry-keys-Bhr1bdqzAB.js";import"./entry-KvIcon-CVvRd5jUJi.js";import"./iframe-Cewr90gv.js";import"../sb-preview/runtime.js";import"./entry-vue.esm-bundler-CCMUuEADRp.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-social-sharing-mixin-CogSmiwV__.js";import"./entry-urlUtils-BR6y7F2aaq.js";const t={data:{my:{teams:{values:[{team:{teamPublicId:"SRT",name:"Staff Reserve Team"}},{team:{teamPublicId:"testteam23",name:"TestTeam23"}}]},userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},T={title:"Components/SocialShare",component:m},a=()=>({mixins:[i()],components:{SocialShareV2:m},template:`
        <social-share-v2
            :lender="lender"
            :loans="loans"
        />
    `,props:{lender:{type:Object,default(){return{...t.data.my.userAccount,teams:t.data.my.teams.values.map(e=>e.team)}}},loans:{type:Array,default(){return s.items.values.filter(e=>e.basketItemType==="loan_reservation").map(e=>e.loan)}}}});var n,r,o;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`() => ({
  mixins: [apolloStoryMixin()],
  components: {
    SocialShareV2
  },
  template: \`
        <social-share-v2
            :lender="lender"
            :loans="loans"
        />
    \`,
  props: {
    lender: {
      type: Object,
      default() {
        return {
          ...mockedAPIResponse.data.my.userAccount,
          teams: mockedAPIResponse.data.my.teams.values.map(value => value.team)
        };
      }
    },
    loans: {
      type: Array,
      default() {
        return mockedReceiptData.items.values.filter(item => item.basketItemType === 'loan_reservation').map(item => item.loan);
      }
    }
  }
})`,...(o=(r=a.parameters)==null?void 0:r.docs)==null?void 0:o.source}}};const _=["Default"];export{a as Default,_ as __namedExportsOrder,T as default};
