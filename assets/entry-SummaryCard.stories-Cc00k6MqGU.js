import{S as d}from"./entry-SummaryCard-Bs-F6ZeALU.js";import{a as O}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as _}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as A}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import{f as p,c as N,b as e,u as w,h as G,G as j,i as z,p as D}from"./entry-mockLoanFixtures-4xHHxu25DF.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvWwwHeaderBasic-D-dYqQTzhh.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-BYzU99W7uH.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-9O9xxAVV.js";import"./entry-heart-comment-DLVYDx8MY_.js";import"./entry-KvIconButton-DJIrpVP3Wh.js";import"./entry-KvTextLink-DqLn7K5FjE.js";import"./entry-loanUtils-Dh5pODnjhO.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-LoanStatusEnum-BZ9jvWVUox.js";import"./entry-BorrowerImage-BiTD3mHAQU.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-SummaryTag-DZsZ0wKGv-.js";import"./entry-LoanProgress-B9XeE_Xw_g.js";import"./entry-LoanBookmark-CRqM6LdduU.js";import"./entry-updateLoanFavorite-i9Umk6mQom.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-C3zJjaAqCL.js";function r(c,Q=null){const b=N(c,Q);return()=>({components:{SummaryCard:d},mixins:[O({queryResult:b}),_(),A],setup(){return{loan:c}},template:`
            <summary-card
                :loan="loan"
            />
        `})}const xr={title:"Components/BorrowerProfile/SummaryCard",component:d},s=r(p,e),n=r(w),t=r(G,e),a=r(j,e);a.storyName="Paying Back (overpaid)";const m=r(z,e),o=r(D,e);o.storyName="Private Fundraising Period";const i=()=>({components:{SummaryCard:d},mixins:[O({queryResult:N(p),loading:!0}),_(),A],setup(){return{loan:p}},template:`
        <summary-card
            :loan="loan"
        />
    `});var u,l,y;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:"summaryCardStory(fundraisingPartnerLoan, loggedInUser)",...(y=(l=s.parameters)==null?void 0:l.docs)==null?void 0:y.source}}};var g,S,P;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:"summaryCardStory(fullyFundedLoan)",...(P=(S=n.parameters)==null?void 0:S.docs)==null?void 0:P.source}}};var f,L,k;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:"summaryCardStory(payingBackLoan, loggedInUser)",...(k=(L=t.parameters)==null?void 0:L.docs)==null?void 0:k.source}}};var C,x,F;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:"summaryCardStory(overpaidPayingBackLoan, loggedInUser)",...(F=(x=a.parameters)==null?void 0:x.docs)==null?void 0:F.source}}};var B,v,I;m.parameters={...m.parameters,docs:{...(B=m.parameters)==null?void 0:B.docs,source:{originalSource:"summaryCardStory(endedLoan, loggedInUser)",...(I=(v=m.parameters)==null?void 0:v.docs)==null?void 0:I.source}}};var M,U,R;o.parameters={...o.parameters,docs:{...(M=o.parameters)==null?void 0:M.docs,source:{originalSource:"summaryCardStory(pfpLoan, loggedInUser)",...(R=(U=o.parameters)==null?void 0:U.docs)==null?void 0:R.source}}};var h,q,E;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`() => ({
  components: {
    SummaryCard
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fundraisingPartnerLoan),
    loading: true
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  setup() {
    return {
      loan: fundraisingPartnerLoan
    };
  },
  template: \`
        <summary-card
            :loan="loan"
        />
    \`
})`,...(E=(q=i.parameters)==null?void 0:q.docs)==null?void 0:E.source}}};const Fr=["Fundraising","FullyFunded","PayingBack","PayingBackOverpaid","Ended","PFP","Loading"];export{m as Ended,n as FullyFunded,s as Fundraising,i as Loading,o as PFP,t as PayingBack,a as PayingBackOverpaid,Fr as __namedExportsOrder,xr as default};
