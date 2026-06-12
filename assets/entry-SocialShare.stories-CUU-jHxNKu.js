import{S as m}from"./entry-SocialShareV2-B0mELFe376.js";import{r as s}from"./entry-receipt-data-mock-CgZ9iipQgR.js";import{a as i}from"./entry-apollo-story-mixin-NCMtMfZ7e5.js";import"./entry-orderBy-CIk3iUp8RR.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-_baseOrderBy-BPsxOUZwUK.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseMap-C_yvelnzih.js";import"./entry-keys-Bpp3ntPRcJ.js";import"./entry-KvIcon-DUB3O_ZZZb.js";import"./iframe-CU7a1Js9.js";import"./entry-vue.esm-bundler-D6rjCHbx5a.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-social-sharing-mixin-mcFPgMmQne.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-KvWwwHeaderBasic-4oh2xxIPzA.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-B_VjIxz4TE.js";const a={data:{my:{teams:{values:[{team:{teamPublicId:"SRT",name:"Staff Reserve Team"}},{team:{teamPublicId:"testteam23",name:"TestTeam23"}}]},userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},O={title:"Components/SocialShare",component:m},t=()=>({mixins:[i()],components:{SocialShareV2:m},template:`
        <social-share-v2
            :lender="lender"
            :loans="loans"
        />
    `,props:{lender:{type:Object,default(){return{...a.data.my.userAccount,teams:a.data.my.teams.values.map(e=>e.team)}}},loans:{type:Array,default(){return s.items.values.filter(e=>e.basketItemType==="loan_reservation").map(e=>e.loan)}}}});var r,o,n;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`() => ({
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
})`,...(n=(o=t.parameters)==null?void 0:o.docs)==null?void 0:n.source}}};const g=["Default"];export{t as Default,g as __namedExportsOrder,O as default};
