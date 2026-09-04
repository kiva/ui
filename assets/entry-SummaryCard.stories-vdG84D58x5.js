import{S as d}from"./entry-SummaryCard-9yP1i0D-OU.js";import{a as Q}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as b}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as w}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import{f as c,c as H,b as o,H as D,u as G,h as J,I as K,i as T,p as V}from"./entry-mockLoanFixtures-B1SEGQji3V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-D22wPJfH.js";import"./entry-heart-comment-DkAGy8_IZb.js";import"./entry-KvIconButton-kJP7FHVk0W.js";import"./entry-KvTextLink-MXkuOZP6Vy.js";import"./entry-loanUtils-BXS_2y9zuz.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-LoanStatusEnum-Cvai-0kFu9.js";import"./entry-BorrowerImage-l4VVjAcZ0b.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-SummaryTag-Bs9Z4YXrQo.js";import"./entry-LoanProgress-CBJRdD4M9n.js";import"./entry-LoanBookmark-DXaolS7hI1.js";import"./entry-bookmarkUtil-BUI6FsicJC.js";import"./entry-updateLoanFavorite-i9Umk6mQom.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-C3zJjaAqCL.js";function r(u,j=null){const z=H(u,j);return()=>({components:{SummaryCard:d},mixins:[Q({queryResult:z}),b(),w],setup(){return{loan:u}},template:`
            <summary-card
                :loan="loan"
            />
        `})}const Mr={title:"Components/BorrowerProfile/SummaryCard",component:d},s=r(c,o),a=r(D,o);a.storyName="Long location";const t=r(G),m=r(J,o),e=r(K,o);e.storyName="Paying Back (overpaid)";const i=r(T,o),n=r(V,o);n.storyName="Private Fundraising Period";const p=()=>({components:{SummaryCard:d},mixins:[Q({queryResult:H(c),loading:!0}),b(),w],setup(){return{loan:c}},template:`
        <summary-card
            :loan="loan"
        />
    `});var l,y,g;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:"summaryCardStory(fundraisingPartnerLoan, loggedInUser)",...(g=(y=s.parameters)==null?void 0:y.docs)==null?void 0:g.source}}};var S,L,P;a.parameters={...a.parameters,docs:{...(S=a.parameters)==null?void 0:S.docs,source:{originalSource:"summaryCardStory(longLocationPartnerLoan, loggedInUser)",...(P=(L=a.parameters)==null?void 0:L.docs)==null?void 0:P.source}}};var f,k,C;t.parameters={...t.parameters,docs:{...(f=t.parameters)==null?void 0:f.docs,source:{originalSource:"summaryCardStory(fullyFundedLoan)",...(C=(k=t.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};var x,F,B;m.parameters={...m.parameters,docs:{...(x=m.parameters)==null?void 0:x.docs,source:{originalSource:"summaryCardStory(payingBackLoan, loggedInUser)",...(B=(F=m.parameters)==null?void 0:F.docs)==null?void 0:B.source}}};var v,I,U;e.parameters={...e.parameters,docs:{...(v=e.parameters)==null?void 0:v.docs,source:{originalSource:"summaryCardStory(overpaidPayingBackLoan, loggedInUser)",...(U=(I=e.parameters)==null?void 0:I.docs)==null?void 0:U.source}}};var M,R,h;i.parameters={...i.parameters,docs:{...(M=i.parameters)==null?void 0:M.docs,source:{originalSource:"summaryCardStory(endedLoan, loggedInUser)",...(h=(R=i.parameters)==null?void 0:R.docs)==null?void 0:h.source}}};var q,E,N;n.parameters={...n.parameters,docs:{...(q=n.parameters)==null?void 0:q.docs,source:{originalSource:"summaryCardStory(pfpLoan, loggedInUser)",...(N=(E=n.parameters)==null?void 0:E.docs)==null?void 0:N.source}}};var O,_,A;p.parameters={...p.parameters,docs:{...(O=p.parameters)==null?void 0:O.docs,source:{originalSource:`() => ({
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
})`,...(A=(_=p.parameters)==null?void 0:_.docs)==null?void 0:A.source}}};const Rr=["Fundraising","LongLocation","FullyFunded","PayingBack","PayingBackOverpaid","Ended","PFP","Loading"];export{i as Ended,t as FullyFunded,s as Fundraising,p as Loading,a as LongLocation,n as PFP,m as PayingBack,e as PayingBackOverpaid,Rr as __namedExportsOrder,Mr as default};
