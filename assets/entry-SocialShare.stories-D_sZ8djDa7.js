import{S as m}from"./entry-SocialShareV2-BVTX1RGn26.js";import{r as s}from"./entry-receipt-data-mock-DHPmkogL0D.js";import{a as i}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-orderBy-CUolv3c6xC.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-_baseToString-C08wEDsWoH.js";import"./entry-isSymbol-Cs2hrTnPnb.js";import"./entry-get-iRc4pJ7r6H.js";import"./entry-_baseIteratee-g1uSU7iPXJ.js";import"./entry-keys-CWqrnc1fyR.js";import"./entry-_baseIsEqual-IhsH9XTvIm.js";import"./entry-KvIcon-MD7an-7TgF.js";import"./iframe-8J__a5wJ.js";import"../sb-preview/runtime.js";import"./entry-vue.esm-bundler-CTwdbZZHjD.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-social-sharing-mixin-CogSmiwV__.js";import"./entry-urlUtils-BR6y7F2aaq.js";const t={data:{my:{teams:{values:[{team:{teamPublicId:"SRT",name:"Staff Reserve Team"}},{team:{teamPublicId:"testteam23",name:"TestTeam23"}}]},userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},P={title:"Components/SocialShare",component:m},a=()=>({mixins:[i()],components:{SocialShareV2:m},template:`
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
