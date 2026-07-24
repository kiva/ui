import{C as r}from"./entry-CommentsAndWhySpecial-CCoHxSRSHh.js";import{a as i}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as s}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{f as e,c as m}from"./entry-mockLoanFixtures-CI6h-mgldC.js";import"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-B52OYB4W0G.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-BW8Ws25b.js";import"./entry-useIsMobile-BYiWeE-S8I.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-loanUtils-D_zTGanKUU.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-LoanStatusEnum-BZ9jvWVUox.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-CommentReportLightbox-BzFW6E3SUw.js";import"./entry-KvLightbox-DepMJA2Aa3.js";import"./entry-printing-BcRIHVBU-U.js";import"./entry-KvRadio-D0vJqzIulj.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-click-outside-DsIhxHJU82.js";import"./entry-BorrowerImage-2godQmxmcR.js";import"./entry-KvCarousel-PYy4h8YwHk.js";import"./entry-kiva_k-DzDbbfmjWV.js";const V={title:"Components/BorrowerProfile/CommentsAndWhySpecial",component:r},n=()=>({components:{CommentsAndWhySpecial:r},mixins:[i({queryResult:m(e)}),s()],template:`
        <comments-and-why-special
            :loan-id="${e.id}"
        />
    `}),o=()=>({components:{CommentsAndWhySpecial:r},mixins:[i({queryResult:m(e)}),s()],template:`
        <comments-and-why-special
            :loan-id="${e.id}"
            :is-admin="true"
            :is-logged-in="true"
        />
    `}),t=()=>({components:{CommentsAndWhySpecial:r},mixins:[i({queryResult:m(e)}),s()],template:`
        <comments-and-why-special
            :loan-id="${e.id}"
            :is-logged-in="true"
            :is-subscribed="true"
        />
    `});var a,p,c;n.parameters={...n.parameters,docs:{...(a=n.parameters)==null?void 0:a.docs,source:{originalSource:`() => ({
  components: {
    CommentsAndWhySpecial
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fundraisingPartnerLoan)
  }), cookieStoreStoryMixin()],
  template: \`
        <comments-and-why-special
            :loan-id="\${fundraisingPartnerLoan.id}"
        />
    \`
})`,...(c=(p=n.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};var l,d,u;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`() => ({
  components: {
    CommentsAndWhySpecial
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fundraisingPartnerLoan)
  }), cookieStoreStoryMixin()],
  template: \`
        <comments-and-why-special
            :loan-id="\${fundraisingPartnerLoan.id}"
            :is-admin="true"
            :is-logged-in="true"
        />
    \`
})`,...(u=(d=o.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var y,S,g;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`() => ({
  components: {
    CommentsAndWhySpecial
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fundraisingPartnerLoan)
  }), cookieStoreStoryMixin()],
  template: \`
        <comments-and-why-special
            :loan-id="\${fundraisingPartnerLoan.id}"
            :is-logged-in="true"
            :is-subscribed="true"
        />
    \`
})`,...(g=(S=t.parameters)==null?void 0:S.docs)==null?void 0:g.source}}};const X=["WithComments","AdminWithDeleteButton","WithSubscribeToggle"];export{o as AdminWithDeleteButton,n as WithComments,t as WithSubscribeToggle,X as __namedExportsOrder,V as default};
