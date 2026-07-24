import{L as e}from"./entry-LoanTags-C1r0Kv9LYr.js";import{c as t}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as r}from"./entry-kv-auth0-story-mixin-BLZ7YbBSGk.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-vue.esm-bundler-B52OYB4W0G.js";import"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-BW8Ws25b.js";import"./entry-KvCheckbox--NpmJsMEAD.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-syncDate-B_-s0TM4YD.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";const B=[{id:1,name:"Education",description:"Loans for education purposes",status:"active",vocabularyId:2},{id:2,name:"Sustainable Agriculture",description:"Farming practices that are environmentally friendly",status:"active",vocabularyId:2},{id:3,name:"Women-Owned Business",description:"Businesses owned and operated by women",status:"active",vocabularyId:2},{id:4,name:"First-Time Borrower",description:"Borrower applying for their first loan",status:"active",vocabularyId:2},{id:5,name:"Rural Area",description:"Located in a rural community",status:"active",vocabularyId:2}];function s(L=[]){function u(o){return o!=null&&o.loanId?{data:{lend:{loan:{id:o.loanId,tags:L}}}}:{data:{lend:{tag:B}}}}return{provide:{apollo:{mutate(){return Promise.resolve({})},readQuery(){return{}},watchQuery({variables:o}={}){const b=u(o);return{subscribe:({next:I})=>{I(b)},setVariables(){}}},query({variables:o}={}){return Promise.resolve(u(o))},readFragment(){return null}}}}}const U={title:"Components/BorrowerProfile/LoanTags",component:e},i=()=>({components:{LoanTags:e},mixins:[s(["Education","Sustainable Agriculture","Women-Owned Business"]),t(),r],template:'<loan-tags :loan-id="12345" />'}),c=()=>({components:{LoanTags:e},mixins:[s(["Education","Sustainable Agriculture"]),t(),r],template:'<loan-tags :loan-id="12345" :is-logged-in="true" />'}),a=()=>({components:{LoanTags:e},mixins:[s([]),t(),r],data(){return{showTags:!0}},template:'<loan-tags v-if="showTags" :loan-id="23456" @hide-section="showTags = false" />'});a.storyName="No Tags (Anonymous)";const n=()=>({components:{LoanTags:e},mixins:[s([]),t(),r],template:'<loan-tags :loan-id="23456" :is-logged-in="true" />'});n.storyName="No Tags (Logged In)";const m=()=>({components:{LoanTags:e},mixins:[s(["Education","Sustainable Agriculture","Women-Owned Business","First-Time Borrower","Rural Area"]),t(),r],template:'<loan-tags :loan-id="34567" :is-logged-in="true" />'});var l,d,g;i.parameters={...i.parameters,docs:{...(l=i.parameters)==null?void 0:l.docs,source:{originalSource:`() => ({
  components: {
    LoanTags
  },
  mixins: [loanTagsMixin(['Education', 'Sustainable Agriculture', 'Women-Owned Business']), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-tags :loan-id="12345" />'
})`,...(g=(d=i.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};var p,T,x;c.parameters={...c.parameters,docs:{...(p=c.parameters)==null?void 0:p.docs,source:{originalSource:`() => ({
  components: {
    LoanTags
  },
  mixins: [loanTagsMixin(['Education', 'Sustainable Agriculture']), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-tags :loan-id="12345" :is-logged-in="true" />'
})`,...(x=(T=c.parameters)==null?void 0:T.docs)==null?void 0:x.source}}};var S,y,h;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:`() => ({
  components: {
    LoanTags
  },
  mixins: [loanTagsMixin([]), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  data() {
    return {
      showTags: true
    };
  },
  template: '<loan-tags v-if="showTags" :loan-id="23456" @hide-section="showTags = false" />'
})`,...(h=(y=a.parameters)==null?void 0:y.docs)==null?void 0:h.source}}};var M,w,v;n.parameters={...n.parameters,docs:{...(M=n.parameters)==null?void 0:M.docs,source:{originalSource:`() => ({
  components: {
    LoanTags
  },
  mixins: [loanTagsMixin([]), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-tags :loan-id="23456" :is-logged-in="true" />'
})`,...(v=(w=n.parameters)==null?void 0:w.docs)==null?void 0:v.source}}};var A,f,k;m.parameters={...m.parameters,docs:{...(A=m.parameters)==null?void 0:A.docs,source:{originalSource:`() => ({
  components: {
    LoanTags
  },
  mixins: [loanTagsMixin(['Education', 'Sustainable Agriculture', 'Women-Owned Business', 'First-Time Borrower', 'Rural Area']), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-tags :loan-id="34567" :is-logged-in="true" />'
})`,...(k=(f=m.parameters)==null?void 0:f.docs)==null?void 0:k.source}}};const X=["WithTags","WithTagsLoggedIn","NoTags","NoTagsLoggedIn","MaxTagsReached"];export{m as MaxTagsReached,a as NoTags,n as NoTagsLoggedIn,i as WithTags,c as WithTagsLoggedIn,X as __namedExportsOrder,U as default};
