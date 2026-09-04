import{S as n}from"./entry-SocialShareV2-DFDaHyYaRx.js";import{r as s}from"./entry-receipt-data-mock-CgZ9iipQgR.js";import{a as i}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import"./entry-orderBy-iPSOJk4XXi.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-_baseOrderBy-KaK2JLUByg.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-_baseMap-CIOY77EeAM.js";import"./entry-keys-WbbxK4vnp3.js";import"./entry-KvIcon-hDZLSek-V-.js";import"./iframe-D22wPJfH.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-social-sharing-mixin-DPfgj_7cmE.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";const a={data:{my:{teams:{values:[{team:{teamPublicId:"SRT",name:"Staff Reserve Team"}},{team:{teamPublicId:"testteam23",name:"TestTeam23"}}]},userAccount:{firstName:"Alan",lastName:"Smithee",email:"user_1003394@braincrave.org",inviterName:"alans"}}}},j={title:"Components/SocialShare",component:n},t=()=>({mixins:[i()],components:{SocialShareV2:n},template:`
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
