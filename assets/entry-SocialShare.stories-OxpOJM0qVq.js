import{S as m}from"./entry-SocialShareV2-0TH5Mn0tXI.js";import{r as s}from"./entry-receipt-data-mock-DHPmkogL0D.js";import{a as i}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-orderBy-BHxczOJVTo.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-CNsXUaDw28.js";import"./entry-isSymbol-CW-Mfw5CbL.js";import"./entry-_baseIteratee-C8yU5wbHrO.js";import"./entry-keys-CuD-aaEZFB.js";import"./entry-KvIcon-DW7toGGp4u.js";import"./iframe-C0KmlhQA.js";import"../sb-preview/runtime.js";import"./entry-vue.esm-bundler-CTwdbZZHjD.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-social-sharing-mixin-Cw-ztzqvXu.js";import"./entry-urlUtils-BR6y7F2aaq.js";const t={data:{my:{teams:{values:[{team:{teamPublicId:"SRT",name:"Staff Reserve Team"}},{team:{teamPublicId:"testteam23",name:"TestTeam23"}}]},userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},T={title:"Components/SocialShare",component:m},a=()=>({mixins:[i()],components:{SocialShareV2:m},template:`
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
})`,...(o=(n=a.parameters)==null?void 0:n.docs)==null?void 0:o.source}}};const _=["Default"];export{a as Default,_ as __namedExportsOrder,T as default};
