import{S as m}from"./entry-SocialShareV2-CPH-H-QcOU.js";import{r as s}from"./entry-receipt-data-mock-DHPmkogL0D.js";import{a as i}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-orderBy-CUrcrXTfYx.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-D3xDH2SX94.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-keys-B9dmm4b_qU.js";import"./entry-KvIcon-f0biGstwRH.js";import"./iframe-Dd418KK-.js";import"./entry-vue.esm-bundler-D5m7h15tzB.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-social-sharing-mixin-mcFPgMmQne.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-KvMaterialIcon-9bv_WqKuLB.js";import"./entry-KvSecondaryNav-DV-NXuJ8zv.js";import"./entry-index-DzTqzqs3pZ.js";import"./entry-numeral-xVHG5DEP0A.js";const t={data:{my:{teams:{values:[{team:{teamPublicId:"SRT",name:"Staff Reserve Team"}},{team:{teamPublicId:"testteam23",name:"TestTeam23"}}]},userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},P={title:"Components/SocialShare",component:m},a=()=>({mixins:[i()],components:{SocialShareV2:m},template:`
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
