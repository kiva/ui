import{S as u}from"./entry-SummaryCard-B76cSK7BsG.js";import{a as j}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as z}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as D}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import{f as d,c as G,b as o,H as V,u as W,h as X,I as Y,i as Z,p as $}from"./entry-mockLoanFixtures-B1SEGQji3V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-mdi-CqWyar1Kn0.js";import"./entry-heart-comment-ClO79vWuDO.js";import"./entry-vue.esm-bundler-DH3zKjNq_R.js";import"./entry-KvIconButton.script-s7fUiuiVy7.js";import"./entry-KvMaterialIcon-YIvJXPLD5t.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-KvLoadingPlaceholder-COAtZHfxh0.js";import"./entry-KvTextLink-DU3XpJzEwk.js";import"./entry-KvUtilityMenu-DVCnUWUQMD.js";import"./entry-loanUtils-Cu0b2K4oGU.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-URTN0AnQsa.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-LoanStatusEnum-Cvai-0kFu9.js";import"./entry-BorrowerImage-DU84l4nY06.js";import"./entry-imageUtils-Bap1kCOa3o.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-SummaryTag-5yJeOOH6Kd.js";import"./entry-LoanProgress-rUrnnbNsio.js";import"./entry-KvProgressBar-DXl-MzWqVJ.js";import"./entry-LoanBookmark-DpRotqzIP5.js";import"./entry-bookmarkUtil-BUI6FsicJC.js";import"./entry-updateLoanFavorite-i9Umk6mQom.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-C3zJjaAqCL.js";function r(l,J=null,K={}){const T=G(l,J);return()=>({components:{SummaryCard:u},mixins:[j({queryResult:T}),z(),D],setup(){return{loan:l,props:K}},template:`
            <summary-card
                :loan="loan"
                v-bind="props"
            />
        `})}const qr={title:"Components/BorrowerProfile/SummaryCard",component:u},t=r(d,o),a=r(V,o);a.storyName="Long location";const i=r(W),m=r(X,o),e=r(Y,o);e.storyName="Paying Back (overpaid)";const c=r(Z,o),s=r($,o);s.storyName="Private Fundraising Period";const n=r(d,null,{showActions:!0});n.storyName="New user version (actions in card)";const p=()=>({components:{SummaryCard:u},mixins:[j({queryResult:G(d),loading:!0}),z(),D],setup(){return{loan:d}},template:`
        <summary-card
            :loan="loan"
        />
    `});var y,g,S;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:"summaryCardStory(fundraisingPartnerLoan, loggedInUser)",...(S=(g=t.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var L,P,f;a.parameters={...a.parameters,docs:{...(L=a.parameters)==null?void 0:L.docs,source:{originalSource:"summaryCardStory(longLocationPartnerLoan, loggedInUser)",...(f=(P=a.parameters)==null?void 0:P.docs)==null?void 0:f.source}}};var k,C,x;i.parameters={...i.parameters,docs:{...(k=i.parameters)==null?void 0:k.docs,source:{originalSource:"summaryCardStory(fullyFundedLoan)",...(x=(C=i.parameters)==null?void 0:C.docs)==null?void 0:x.source}}};var F,v,B;m.parameters={...m.parameters,docs:{...(F=m.parameters)==null?void 0:F.docs,source:{originalSource:"summaryCardStory(payingBackLoan, loggedInUser)",...(B=(v=m.parameters)==null?void 0:v.docs)==null?void 0:B.source}}};var U,I,N;e.parameters={...e.parameters,docs:{...(U=e.parameters)==null?void 0:U.docs,source:{originalSource:"summaryCardStory(overpaidPayingBackLoan, loggedInUser)",...(N=(I=e.parameters)==null?void 0:I.docs)==null?void 0:N.source}}};var w,A,M;c.parameters={...c.parameters,docs:{...(w=c.parameters)==null?void 0:w.docs,source:{originalSource:"summaryCardStory(endedLoan, loggedInUser)",...(M=(A=c.parameters)==null?void 0:A.docs)==null?void 0:M.source}}};var h,R,q;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:"summaryCardStory(pfpLoan, loggedInUser)",...(q=(R=s.parameters)==null?void 0:R.docs)==null?void 0:q.source}}};var E,O,_;n.parameters={...n.parameters,docs:{...(E=n.parameters)==null?void 0:E.docs,source:{originalSource:`summaryCardStory(fundraisingPartnerLoan, null, {
  showActions: true
})`,...(_=(O=n.parameters)==null?void 0:O.docs)==null?void 0:_.source}}};var b,Q,H;p.parameters={...p.parameters,docs:{...(b=p.parameters)==null?void 0:b.docs,source:{originalSource:`() => ({
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
})`,...(H=(Q=p.parameters)==null?void 0:Q.docs)==null?void 0:H.source}}};const Er=["Fundraising","LongLocation","FullyFunded","PayingBack","PayingBackOverpaid","Ended","PFP","NewUserActions","Loading"];export{c as Ended,i as FullyFunded,t as Fundraising,p as Loading,a as LongLocation,n as NewUserActions,s as PFP,m as PayingBack,e as PayingBackOverpaid,Er as __namedExportsOrder,qr as default};
