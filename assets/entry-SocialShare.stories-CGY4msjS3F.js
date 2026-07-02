import{S as n}from"./entry-SocialShareV2-Cjj_g1huCD.js";import{r as s}from"./entry-receipt-data-mock-CgZ9iipQgR.js";import{a as i}from"./entry-apollo-story-mixin-8ULRtAv_Ha.js";import"./entry-orderBy-CuF8cTvHI1.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-_baseOrderBy-p4qs5UUyWO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseMap-Y3vx4Wl8dz.js";import"./entry-keys-WbbxK4vnp3.js";import"./entry-KvIcon-Dux0tIgRb3.js";import"./iframe-LCVN7OV2.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-social-sharing-mixin-mcFPgMmQne.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";const a={data:{my:{teams:{values:[{team:{teamPublicId:"SRT",name:"Staff Reserve Team"}},{team:{teamPublicId:"testteam23",name:"TestTeam23"}}]},userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},j={title:"Components/SocialShare",component:n},t=()=>({mixins:[i()],components:{SocialShareV2:n},template:`
        <social-share-v2
            :lender="lender"
            :loans="loans"
        />
    `,props:{lender:{type:Object,default(){return{...a.data.my.userAccount,teams:a.data.my.teams.values.map(e=>e.team)}}},loans:{type:Array,default(){return s.items.values.filter(e=>e.basketItemType==="loan_reservation").map(e=>e.loan)}}}});var r,o,m;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`() => ({
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
})`,...(m=(o=t.parameters)==null?void 0:o.docs)==null?void 0:m.source}}};const M=["Default"];export{t as Default,M as __namedExportsOrder,j as default};
