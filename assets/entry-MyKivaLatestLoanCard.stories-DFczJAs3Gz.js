import{M as c}from"./entry-MyKivaLatestLoanCard-DeuQa7890h.js";import{a as g}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import"./entry-vue.esm-bundler-ED6DvobC3-.js";import"./entry-KvBorrowerImage-CSLyDHr5cq.js";import"./entry-imageUtils-Bap1kCOa3o.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-KvButton-C8S99vq6YZ.js";import"./entry-KvLoadingSpinner-BNTDmGd79q.js";import"./iframe-DmiUPxZA.js";import"./entry-tokens-B1GtbUGZM0.js";import"./entry-KvMaterialIcon-BM2HtuQNzV.js";import"./entry-mdi-BeeDX8vtDa.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const E={title:"MyKiva/MyKivaLatestLoanCard",component:c},p={id:2722925,name:"Moses",image:{hash:"093374973a7cfb1f18652d3aac5bbd05"},geocode:{country:{isoCode:"EC",name:"Ecuador",geocode:{latitude:-.9676533,longitude:-80.7089101}}},borrowerCount:1,themes:[],gender:"female"},l=(t={})=>{const r=(y,{argTypes:u})=>({props:Object.keys(u),components:{MyKivaLatestLoanCard:c},mixins:[g()],setup(){return{args:t}},template:`
            <div style="width: 336px;">
                <MyKivaLatestLoanCard v-bind="args" />
            </div>
        `});return r.args=t,r},o=l({loan:p}),e=l({loan:{...p,name:"Siara Group",borrowerCount:2,geocode:{country:{isoCode:"US",name:"United States",geocode:{latitude:39.76,longitude:-98.5}}}}});var a,n,s;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`story({
  loan: loanMock
})`,...(s=(n=o.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};var i,d,m;e.parameters={...e.parameters,docs:{...(i=e.parameters)==null?void 0:i.docs,source:{originalSource:`story({
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
})`,...(m=(d=e.parameters)==null?void 0:d.docs)==null?void 0:m.source}}};const D=["Default","Plural"];export{o as Default,e as Plural,D as __namedExportsOrder,E as default};
