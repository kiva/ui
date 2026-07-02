import{C as r}from"./entry-CommentsAndWhySpecial-CVeNbKl1pg.js";import{a as i}from"./entry-apollo-story-mixin-8ULRtAv_Ha.js";import{c as s}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{f as e,c as m}from"./entry-mockLoanFixtures-B2md5mnOC8.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";import"./entry-observerUtils-DveHpw6JZJ.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-loanUtils-BMxTMkkMAR.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-click-outside-DsIhxHJU82.js";import"./entry-BorrowerImage-O1dzUA2si4.js";import"./entry-KvCarousel-BjVkRDeeNQ.js";import"./entry-KvLightbox-U4ePI2uz4l.js";import"./entry-printing-BgJfHmTIjg.js";import"./entry-KvRadio-BWapMSWU1A.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-kiva_k-DzDbbfmjWV.js";const N={title:"Components/BorrowerProfile/CommentsAndWhySpecial",component:r},n=()=>({components:{CommentsAndWhySpecial:r},mixins:[i({queryResult:m(e)}),s()],template:`
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
})`,...(g=(S=t.parameters)==null?void 0:S.docs)==null?void 0:g.source}}};const U=["WithComments","AdminWithDeleteButton","WithSubscribeToggle"];export{o as AdminWithDeleteButton,n as WithComments,t as WithSubscribeToggle,U as __namedExportsOrder,N as default};
