import{M as c}from"./entry-MyKivaLatestLoanCard-aiOMjJs7ob.js";import{a as g}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-vue.esm-bundler-B8AARAaDW0.js";import"./entry-mdi-B1ONwcTkQ2.js";import"./entry-KvMaterialIcon-CFFX08EKse.js";import"./entry-KvWwwHeader-Pg76_XcPb_.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-KvBorrowerImage-GFuYGQUp8z.js";import"./entry-imageUtils-XCIqTGZvrk.js";import"./entry-KvButton-CS01RnGux4.js";import"./entry-KvLoadingSpinner-DrgdGXZpi7.js";import"./iframe-CewekOak.js";import"./entry-stringParserUtils-DNVsfKTBwa.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const G={title:"MyKiva/MyKivaLatestLoanCard",component:c},p={id:2722925,name:"Moses",image:{hash:"093374973a7cfb1f18652d3aac5bbd05"},geocode:{country:{isoCode:"EC",name:"Ecuador",geocode:{latitude:-.9676533,longitude:-80.7089101}}},borrowerCount:1,themes:[],gender:"female"},l=(t={})=>{const r=(y,{argTypes:u})=>({props:Object.keys(u),components:{MyKivaLatestLoanCard:c},mixins:[g()],setup(){return{args:t}},template:`
            <div style="width: 336px;">
                <MyKivaLatestLoanCard v-bind="args" />
            </div>
        `});return r.args=t,r},o=l({loan:p}),e=l({loan:{...p,name:"Siara Group",borrowerCount:2,geocode:{country:{isoCode:"US",name:"United States",geocode:{latitude:39.76,longitude:-98.5}}}}});var a,n,s;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`story({
  loan: loanMock
})`,...(s=(n=o.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};var i,m,d;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`story({
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
})`,...(d=(m=e.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};const O=["Default","Plural"];export{o as Default,e as Plural,O as __namedExportsOrder,G as default};
