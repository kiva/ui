import{S as d}from"./entry-SummaryCard-53p5zHXtBC.js";import{a as O}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as _}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as A}from"./entry-kv-auth0-story-mixin-BLZ7YbBSGk.js";import{f as p,c as N,l as e,t as z,g as b,z as j,h as D,p as G}from"./entry-mockLoanFixtures-CI6h-mgldC.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-B52OYB4W0G.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-BW8Ws25b.js";import"./entry-heart-comment-CzjCck_HPB.js";import"./entry-KvIconButton-B_5CFf3JS2.js";import"./entry-KvTextLink-C1IR_OG8XM.js";import"./entry-loanUtils-D_zTGanKUU.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-LoanStatusEnum-BZ9jvWVUox.js";import"./entry-BorrowerImage-2godQmxmcR.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-SummaryTag-CQOsfgLtHU.js";import"./entry-LoanProgress-ncvHoFD7g4.js";import"./entry-LoanBookmark-Mb1Rzg423-.js";import"./entry-updateLoanFavorite-i9Umk6mQom.js";import"./entry-syncDate-B_-s0TM4YD.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-DhjghUk5Me.js";function r(c,Q=null){const w=N(c,Q);return()=>({components:{SummaryCard:d},mixins:[O({queryResult:w}),_(),A],setup(){return{loan:c}},template:`
            <summary-card
                :loan="loan"
            />
        `})}const xr={title:"Components/BorrowerProfile/SummaryCard",component:d},s=r(p,e),t=r(z),n=r(b,e),a=r(j,e);a.storyName="Paying Back (overpaid)";const m=r(D,e),o=r(G,e);o.storyName="Private Fundraising Period";const i=()=>({components:{SummaryCard:d},mixins:[O({queryResult:N(p),loading:!0}),_(),A],setup(){return{loan:p}},template:`
        <summary-card
            :loan="loan"
        />
    `});var u,l,y;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:"summaryCardStory(fundraisingPartnerLoan, loggedInUser)",...(y=(l=s.parameters)==null?void 0:l.docs)==null?void 0:y.source}}};var g,S,P;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:"summaryCardStory(fullyFundedLoan)",...(P=(S=t.parameters)==null?void 0:S.docs)==null?void 0:P.source}}};var f,L,k;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:"summaryCardStory(payingBackLoan, loggedInUser)",...(k=(L=n.parameters)==null?void 0:L.docs)==null?void 0:k.source}}};var C,x,F;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:"summaryCardStory(overpaidPayingBackLoan, loggedInUser)",...(F=(x=a.parameters)==null?void 0:x.docs)==null?void 0:F.source}}};var B,v,I;m.parameters={...m.parameters,docs:{...(B=m.parameters)==null?void 0:B.docs,source:{originalSource:"summaryCardStory(endedLoan, loggedInUser)",...(I=(v=m.parameters)==null?void 0:v.docs)==null?void 0:I.source}}};var M,U,R;o.parameters={...o.parameters,docs:{...(M=o.parameters)==null?void 0:M.docs,source:{originalSource:"summaryCardStory(pfpLoan, loggedInUser)",...(R=(U=o.parameters)==null?void 0:U.docs)==null?void 0:R.source}}};var h,q,E;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`() => ({
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
})`,...(E=(q=i.parameters)==null?void 0:q.docs)==null?void 0:E.source}}};const Fr=["Fundraising","FullyFunded","PayingBack","PayingBackOverpaid","Ended","PFP","Loading"];export{m as Ended,t as FullyFunded,s as Fundraising,i as Loading,o as PFP,n as PayingBack,a as PayingBackOverpaid,Fr as __namedExportsOrder,xr as default};
