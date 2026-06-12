import{M as m}from"./entry-MyKivaLatestLoanCard-kDJHR_HyFJ.js";import{a as g}from"./entry-apollo-story-mixin-NCMtMfZ7e5.js";import"./entry-vue.esm-bundler-D6rjCHbx5a.js";import"./entry-KvWwwHeaderBasic-4oh2xxIPzA.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-B_VjIxz4TE.js";import"./iframe-CU7a1Js9.js";import"./entry-stringParserUtils-DNVsfKTBwa.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const U={title:"MyKiva/MyKivaLatestLoanCard",component:m},p={id:2722925,name:"Moses",image:{hash:"093374973a7cfb1f18652d3aac5bbd05"},geocode:{country:{isoCode:"EC",name:"Ecuador",geocode:{latitude:-.9676533,longitude:-80.7089101}}},borrowerCount:1,themes:[],gender:"female"},l=(t={})=>{const a=(y,{argTypes:u})=>({props:Object.keys(u),components:{MyKivaLatestLoanCard:m},mixins:[g()],setup(){return{args:t}},template:`
            <div style="width: 336px;">
                <MyKivaLatestLoanCard v-bind="args" />
            </div>
        `});return a.args=t,a},o=l({loan:p}),e=l({loan:{...p,name:"Siara Group",borrowerCount:2,geocode:{country:{isoCode:"US",name:"United States",geocode:{latitude:39.76,longitude:-98.5}}}}});var r,n,s;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`story({
  loan: loanMock
})`,...(s=(n=o.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};var i,d,c;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`story({
  loan: {
    ...loanMock,
    name: 'Siara Group',
    borrowerCount: 2,
    geocode: {
      country: {
        isoCode: "US",
        name: "United States",
        geocode: {
          latitude: 39.76,
          longitude: -98.5
        }
      }
    }
  }
})`,...(c=(d=e.parameters)==null?void 0:d.docs)==null?void 0:c.source}}};const _=["Default","Plural"];export{o as Default,e as Plural,_ as __namedExportsOrder,U as default};
