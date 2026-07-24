import{L as e}from"./entry-LoanComments--PiyK2BNiC.js";import{c as t}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as m}from"./entry-kv-auth0-story-mixin-BLZ7YbBSGk.js";import"./entry-index-CWclSTHHJk.js";import"./entry-purify.es-bRchjNq8Ei.js";import"./entry-vue.esm-bundler-B52OYB4W0G.js";import"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-BW8Ws25b.js";import"./entry-KvLightbox-DepMJA2Aa3.js";import"./entry-printing-BcRIHVBU-U.js";import"./entry-KvTextLink-C1IR_OG8XM.js";import"./entry-CommentReportLightbox-BzFW6E3SUw.js";import"./entry-KvRadio-D0vJqzIulj.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-loanAddComment-DvQEPf3nxH.js";import"./entry-index-6TolKbZ2-J.js";import"./entry-index-BMPNuZbV7y.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-syncDate-B_-s0TM4YD.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";const p=Array.from({length:20},(l,o)=>({id:o+1,authorName:o===3?"Aisha":`Lender ${o+1}`,authorImageUrl:o<5?"https://www.kiva.org/img/s100/9673d0722a7675b9b8d11f90849d9b44.jpg":null,authorRole:o===3?"Borrower":"Lender",body:o===3?"Thank you so much for your support! My dairy business is growing and I can now sell more milk.":`This is a wonderful loan. I'm happy to support this borrower. Comment #${o+1}.`,date:new Date(2025,2,15-o).toISOString(),timeFlagged:null}));function r(l,o={}){const{isAdmin:W=!1,subscribed:F=!1}=o,d={data:{lend:{loan:{id:123,comments:{values:l},userProperties:{subscribed:F}}},my:{id:123,isAdmin:W}}};return{provide:{apollo:{mutate:()=>Promise.resolve({}),readQuery:()=>({}),watchQuery:()=>({subscribe:({next:I})=>I(d),setVariables(){}}),query:()=>Promise.resolve(d),readFragment:()=>null}}}}const ro={title:"Components/BorrowerProfile/LoanComments",component:e},s=()=>({components:{LoanComments:e},mixins:[r(p),t(),m],template:'<loan-comments :loan-id="123" />'}),n=()=>({components:{LoanComments:e},mixins:[r(p,{isAdmin:!0}),t(),m],template:'<loan-comments :loan-id="123" />'});n.storyName="With Comments (Admin)";const i=()=>({components:{LoanComments:e},mixins:[r(p.slice(0,3)),t(),m],template:'<loan-comments :loan-id="123" />'}),a=()=>({components:{LoanComments:e},mixins:[r(p.slice(0,5),{subscribed:!0}),t(),m],template:'<loan-comments :loan-id="123" />'}),c=()=>({components:{LoanComments:e},mixins:[r([]),t(),m],template:'<loan-comments :loan-id="123" />'});var u,x,S;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`() => ({
  components: {
    LoanComments
  },
  mixins: [commentsMixin(mockComments), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-comments :loan-id="123" />'
})`,...(S=(x=s.parameters)==null?void 0:x.docs)==null?void 0:S.source}}};var y,h,k;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`() => ({
  components: {
    LoanComments
  },
  mixins: [commentsMixin(mockComments, {
    isAdmin: true
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-comments :loan-id="123" />'
})`,...(k=(h=n.parameters)==null?void 0:h.docs)==null?void 0:k.source}}};var C,b,M;i.parameters={...i.parameters,docs:{...(C=i.parameters)==null?void 0:C.docs,source:{originalSource:`() => ({
  components: {
    LoanComments
  },
  mixins: [commentsMixin(mockComments.slice(0, 3)), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-comments :loan-id="123" />'
})`,...(M=(b=i.parameters)==null?void 0:b.docs)==null?void 0:M.source}}};var g,A,w;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`() => ({
  components: {
    LoanComments
  },
  mixins: [commentsMixin(mockComments.slice(0, 5), {
    subscribed: true
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-comments :loan-id="123" />'
})`,...(w=(A=a.parameters)==null?void 0:A.docs)==null?void 0:w.source}}};var f,v,L;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`() => ({
  components: {
    LoanComments
  },
  mixins: [commentsMixin([]), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: '<loan-comments :loan-id="123" />'
})`,...(L=(v=c.parameters)==null?void 0:v.docs)==null?void 0:L.source}}};const so=["WithComments","WithCommentsAdmin","FewComments","Subscribed","Empty"];export{c as Empty,i as FewComments,a as Subscribed,s as WithComments,n as WithCommentsAdmin,so as __namedExportsOrder,ro as default};
