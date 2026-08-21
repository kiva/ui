import{M as c}from"./entry-MyKivaLatestLoanCard-CZxwYoMuoA.js";import{a as g}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import"./entry-vue.esm-bundler-D8yP9bVmC4.js";import"./entry-KvWwwHeaderBasic-BB16oz4SiS.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-Bg3M7544.js";import"./entry-KvMap-98Podx1RHA.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const D={title:"MyKiva/MyKivaLatestLoanCard",component:c},p={id:2722925,name:"Moses",image:{hash:"093374973a7cfb1f18652d3aac5bbd05"},geocode:{country:{isoCode:"EC",name:"Ecuador",geocode:{latitude:-.9676533,longitude:-80.7089101}}},borrowerCount:1,themes:[],gender:"female"},l=(t={})=>{const r=(y,{argTypes:u})=>({props:Object.keys(u),components:{MyKivaLatestLoanCard:c},mixins:[g()],setup(){return{args:t}},template:`
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
})`,...(d=(m=e.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};const G=["Default","Plural"];export{o as Default,e as Plural,G as __namedExportsOrder,D as default};
