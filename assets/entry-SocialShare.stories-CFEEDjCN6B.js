import{S as m}from"./entry-SocialShareV2-BUK_cMqIDi.js";import{r as s}from"./entry-receipt-data-mock-DHPmkogL0D.js";import{a as i}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-orderBy-rT0wD1QYTc.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-_baseOrderBy-Br8wwAxQcW.js";import"./entry-get-Bzt--l23_4.js";import"./entry-isSymbol-CbR_gDhvXj.js";import"./entry-_baseIteratee-DqHyoBxxWE.js";import"./entry-keys-6kO3nYrkWo.js";import"./entry-_baseMap-hxLSR6vmhu.js";import"./entry-KvIcon-Yw6-aE_pCP.js";import"./iframe-yU5tBwVj.js";import"../sb-preview/runtime.js";import"./entry-vue.esm-bundler-Q9GDM36OM6.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-social-sharing-mixin-JaHpp-TIBg.js";import"./entry-urlUtils-BR6y7F2aaq.js";const t={data:{my:{teams:{values:[{team:{teamPublicId:"SRT",name:"Staff Reserve Team"}},{team:{teamPublicId:"testteam23",name:"TestTeam23"}}]},userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},P={title:"Components/SocialShare",component:m},a=()=>({mixins:[i()],components:{SocialShareV2:m},template:`
        <social-share-v2
            :lender="lender"
            :loans="loans"
        />
    `,props:{lender:{type:Object,default(){return{...t.data.my.userAccount,teams:t.data.my.teams.values.map(e=>e.team)}}},loans:{type:Array,default(){return s.items.values.filter(e=>e.basketItemType==="loan_reservation").map(e=>e.loan)}}}});var r,n,o;a.parameters={...a.parameters,docs:{...(r=a.parameters)==null?void 0:r.docs,source:{originalSource:`() => ({
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
})`,...(o=(n=a.parameters)==null?void 0:n.docs)==null?void 0:o.source}}};const D=["Default"];export{a as Default,D as __namedExportsOrder,P as default};
