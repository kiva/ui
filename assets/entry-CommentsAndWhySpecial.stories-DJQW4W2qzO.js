import{_ as r}from"./entry-CommentsAndWhySpecial-wqF-67kOlh.js";import{a as i}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as a}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{f as t,l as s,c as m}from"./entry-mockLoanFixtures-4xHHxu25DF.js";import"./entry-KvWwwHeaderBasic-D-dYqQTzhh.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-BYzU99W7uH.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-9O9xxAVV.js";import"./entry-useIsMobile-BczPnZGoc0.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-loanUtils-Dh5pODnjhO.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-LoanStatusEnum-BZ9jvWVUox.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-CommentReportLightbox-drYt2cKm3X.js";import"./entry-KvLightbox-hUYJDS8EdG.js";import"./entry-printing-Clr_ahK9Wi.js";import"./entry-KvRadio-DaOfTUdjLd.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-click-outside-DsIhxHJU82.js";import"./entry-BorrowerImage-BiTD3mHAQU.js";import"./entry-KvCarousel-BaQpOXmIy6.js";import"./entry-kiva_k-DzDbbfmjWV.js";const te={title:"Components/BorrowerProfile/CommentsAndWhySpecial",component:r},e=()=>({components:{CommentsAndWhySpecial:r},mixins:[i({queryResult:m(t)}),a()],template:`
        <comments-and-why-special
            :loan-id="${t.id}"
        />
    `}),o=()=>({components:{CommentsAndWhySpecial:r},mixins:[i({queryResult:m(t)}),a()],template:`
        <comments-and-why-special
            :loan-id="${t.id}"
            :is-logged-in="true"
        />
    `}),n=()=>({components:{CommentsAndWhySpecial:r},mixins:[i({queryResult:m(s)}),a()],template:`
        <comments-and-why-special
            :loan-id="${s.id}"
            :is-logged-in="true"
        />
    `});var p,c,l,d,u;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:`() => ({
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
})`,...(l=(c=e.parameters)==null?void 0:c.docs)==null?void 0:l.source},description:{story:"Logged out: no comment menu, so the report flow is unreachable.",...(u=(d=e.parameters)==null?void 0:d.docs)==null?void 0:u.description}}};var g,h,y,S,x;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`() => ({
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
        />
    \`
})`,...(y=(h=o.parameters)==null?void 0:h.docs)==null?void 0:y.source},description:{story:`Logged in, which is the only thing isLoggedIn gates: the comment menu button
appears, opening "Report this comment" and the report lightbox.`,...(x=(S=o.parameters)==null?void 0:S.docs)==null?void 0:x.description}}};var L,f,C,R,w;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`() => ({
  components: {
    CommentsAndWhySpecial
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(longTeamNameCommentsLoan)
  }), cookieStoreStoryMixin()],
  template: \`
        <comments-and-why-special
            :loan-id="\${longTeamNameCommentsLoan.id}"
            :is-logged-in="true"
        />
    \`
})`,...(C=(f=n.parameters)==null?void 0:f.docs)==null?void 0:C.source},description:{story:`Team name long enough to wrap. The avatar must stay circular rather than
being squeezed into an oval. Step through the carousel to see each avatar
branch: photo, letter, anonymous Kiva K, then a short-name control.`,...(w=(R=n.parameters)==null?void 0:R.docs)==null?void 0:w.description}}};const re=["WithComments","LoggedIn","LongTeamName"];export{o as LoggedIn,n as LongTeamName,e as WithComments,re as __namedExportsOrder,te as default};
