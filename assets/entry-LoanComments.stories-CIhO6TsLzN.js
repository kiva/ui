import{L as e}from"./entry-LoanComments-D9pKoI46Ts.js";import{c as t}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as m}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import"./entry-index-CWclSTHHJk.js";import"./entry-purify.es-CqxHTgmJCD.js";import"./entry-vue.esm-bundler-D8yP9bVmC4.js";import"./entry-KvWwwHeaderBasic-BB16oz4SiS.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-Bg3M7544.js";import"./entry-KvLightbox-Bijtdqydwv.js";import"./entry-printing-DjnSCsmPoI.js";import"./entry-KvTextLink-lPIxsG65ya.js";import"./entry-CommentReportLightbox-BQ0JeKL1mv.js";import"./entry-KvRadio-QfmcjypV8Y.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-loanAddComment-DvQEPf3nxH.js";import"./entry-index-6TolKbZ2-J.js";import"./entry-index-BMPNuZbV7y.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";const P="https://www.kiva.org/img/s100/9673d0722a7675b9b8d11f90849d9b44.jpg",p=Array.from({length:20},(l,o)=>({id:o+1,author:{name:o===3?"Aisha":`Lender ${o+1}`,imageUrl:o<5?P:null,role:o===3?"borrower":"lender",__typename:"CommentAuthor"},body:o===3?"Thank you so much for your support! My dairy business is growing and I can now sell more milk.":`This is a wonderful loan. I'm happy to support this borrower. Comment #${o+1}.`,date:new Date(2025,2,15-o).toISOString(),timeFlagged:null}));function r(l,o={}){const{isAdmin:_=!1,subscribed:W=!1}=o,d={data:{lend:{loan:{id:123,comments:{values:l},userProperties:{subscribed:W}}},my:{id:123,isAdmin:_}}};return{provide:{apollo:{mutate:()=>Promise.resolve({}),readQuery:()=>({}),watchQuery:()=>({subscribe:({next:F})=>F(d),setVariables(){}}),query:()=>Promise.resolve(d),readFragment:()=>null}}}}const so={title:"Components/BorrowerProfile/LoanComments",component:e},s=()=>({components:{LoanComments:e},mixins:[r(p),t(),m],template:'<loan-comments :loan-id="123" />'}),n=()=>({components:{LoanComments:e},mixins:[r(p,{isAdmin:!0}),t(),m],template:'<loan-comments :loan-id="123" />'});n.storyName="With Comments (Admin)";const i=()=>({components:{LoanComments:e},mixins:[r(p.slice(0,3)),t(),m],template:'<loan-comments :loan-id="123" />'}),a=()=>({components:{LoanComments:e},mixins:[r(p.slice(0,5),{subscribed:!0}),t(),m],template:'<loan-comments :loan-id="123" />'}),c=()=>({components:{LoanComments:e},mixins:[r([]),t(),m],template:'<loan-comments :loan-id="123" />'});var u,x,y;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`() => ({
  components: {
    LoanComments
  },
  mixins: [commentsMixin(mockComments), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-comments :loan-id="123" />'
})`,...(y=(x=s.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var S,C,h;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`() => ({
  components: {
    LoanComments
  },
  mixins: [commentsMixin(mockComments, {
    isAdmin: true
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-comments :loan-id="123" />'
})`,...(h=(C=n.parameters)==null?void 0:C.docs)==null?void 0:h.source}}};var k,b,M;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:`() => ({
  components: {
    LoanComments
  },
  mixins: [commentsMixin(mockComments.slice(0, 3)), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-comments :loan-id="123" />'
})`,...(M=(b=i.parameters)==null?void 0:b.docs)==null?void 0:M.source}}};var A,g,w;a.parameters={...a.parameters,docs:{...(A=a.parameters)==null?void 0:A.docs,source:{originalSource:`() => ({
  components: {
    LoanComments
  },
  mixins: [commentsMixin(mockComments.slice(0, 5), {
    subscribed: true
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-comments :loan-id="123" />'
})`,...(w=(g=a.parameters)==null?void 0:g.docs)==null?void 0:w.source}}};var f,v,L;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`() => ({
  components: {
    LoanComments
  },
  mixins: [commentsMixin([]), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-comments :loan-id="123" />'
})`,...(L=(v=c.parameters)==null?void 0:v.docs)==null?void 0:L.source}}};const io=["WithComments","WithCommentsAdmin","FewComments","Subscribed","Empty"];export{c as Empty,i as FewComments,a as Subscribed,s as WithComments,n as WithCommentsAdmin,io as __namedExportsOrder,so as default};
