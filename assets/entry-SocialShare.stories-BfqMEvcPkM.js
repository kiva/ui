import{S as m}from"./entry-SocialShareV2-DUIMsWe4wJ.js";import{r as s}from"./entry-receipt-data-mock-DHPmkogL0D.js";import{a as i}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-orderBy-BpW2cj9Byi.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-D3xDH2SX94.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-keys-B9dmm4b_qU.js";import"./entry-KvIcon-DwaD1s8XhK.js";import"./iframe-DK1W5Kk4.js";import"./entry-vue.esm-bundler-DRMQxQJg8r.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-social-sharing-mixin-8ocVq_kb4W.js";import"./entry-urlUtils-BR6y7F2aaq.js";import"./entry-KvMaterialIcon-CFyzC4J9vc.js";import"./entry-KvAtbModal-DhF29XDIKL.js";import"./entry-numeral-DJCTM12wUX.js";const t={data:{my:{teams:{values:[{team:{teamPublicId:"SRT",name:"Staff Reserve Team"}},{team:{teamPublicId:"testteam23",name:"TestTeam23"}}]},userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},_={title:"Components/SocialShare",component:m},a=()=>({mixins:[i()],components:{SocialShareV2:m},template:`
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
})`,...(o=(n=a.parameters)==null?void 0:n.docs)==null?void 0:o.source}}};const P=["Default"];export{a as Default,P as __namedExportsOrder,_ as default};
