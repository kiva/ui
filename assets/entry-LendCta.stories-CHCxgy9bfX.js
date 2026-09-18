import{_ as e}from"./entry-LendCta-Dyw05z3Fxu.js";import{a as t}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as n}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as o}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import{u as h,f as u,v as y,m as S,h as x,w as M,c as r}from"./entry-mockLoanFixtures-B1SEGQji3V.js";import"./entry-KvWwwHeaderBasic-C_kuFZZQmp.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-DjLyFRslqj.js";import"./entry-index-ykU41f_qhj.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-agQorjtY.js";import"./entry-basketUtils-CjhIUDfBlL.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-basketCount-CZ-kE9ye_Z.js";import"./entry-basketItems-B-09YWrzPC.js";import"./entry-updateLoanReservation-BaDuxVurTB.js";import"./entry-exports-CudK1O5XNw.js";import"./entry-index-C1c4cvJ8FT.js";import"./entry-loanUtils-CyTFUJOVA8.js";import"./entry-get-URTN0AnQsa.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-LoanStatusEnum-Cvai-0kFu9.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-observerUtils-DveHpw6JZJ.js";import"./entry-experimentUtils-SiX3DtH2EU.js";import"./entry-settingsUtils-ClNbELb3kn.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-useMultiMatching-CKXSHuZVC4.js";import"./entry-useApolloQuery-K1P_i_88t-.js";import"./entry-vue-router-D4k6g03Mt4.js";import"./entry-watchApolloOperation-CRDPfiJcIR.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-LoanBookmark-Sw34hj-CXJ.js";import"./entry-bookmarkUtil-BUI6FsicJC.js";import"./entry-updateLoanFavorite-i9Umk6mQom.js";import"./entry-LendAmountButton-DEZIX_mB-W.js";import"./entry-SimultaneousMatchingInfo-Bk2e8UhOZ_.js";import"./entry-KvIcon-UTSiGCdoyH.js";import"./entry-KvGrid-Cfa_tuITqx.js";import"./entry-postCheckoutAchievements-CQjx4f1psm.js";import"./entry-KvCartPill-DMW2pbThNL.js";import"./entry-useBadgeData-DV1-MrltJl.js";import"./entry-achievementUtils-4YR0vuRrR2.js";import"./entry-imageUtils-D6MmKkERiK.js";import"./entry-contentfulUtils-BYNyFhm6CJ.js";import"./entry-index-7WUD3idviV.js";import"./entry-useGoalData-C8JmTMUqoc.js";import"./entry-myKivaUtils-BGrca31vfE.js";import"./entry-flssUtils-Deq-f7S6K3.js";import"./entry-loanCardFields-B0P-5lp--W.js";import"./entry-filterConfig-zWFMkXXE5P.js";import"./entry-filterUtils-DVtQjHZnxi.js";import"./entry-orderBy-DoJGiSbsDH.js";import"./entry-_baseIteratee-CDxluaBz8l.js";import"./entry-keys-L20xH3fuYR.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";const Ze={title:"Components/BorrowerProfile/LendCta",component:e},i=()=>({components:{LendCta:e},mixins:[t({queryResult:r(u)}),n(),o],template:`<lend-cta :loan-id="${u.id}" />`}),a=()=>({components:{LendCta:e},mixins:[t({queryResult:r(u),loadingQueries:["lendCtaUser"]}),n(),o],template:`<lend-cta :loan-id="${u.id}" />`}),s=()=>({components:{LendCta:e},mixins:[t({queryResult:r(S)}),n(),o],template:`<lend-cta :loan-id="${S.id}" />`}),m=()=>({components:{LendCta:e},mixins:[t({queryResult:r(M)}),n(),o],template:`<lend-cta :loan-id="${M.id}" />`}),d=()=>({components:{LendCta:e},mixins:[t({queryResult:r(y)}),n(),o],template:`<lend-cta :loan-id="${y.id}" />`}),l=()=>{const L=r(y);return L.data.general.multiMatchingEnabled={key:"multiMatchingEnabled",value:"false"},{components:{LendCta:e},mixins:[t({queryResult:L}),n(),o],template:`<lend-cta :loan-id="${y.id}" />`}},p=()=>({components:{LendCta:e},mixins:[t({queryResult:r(h)}),n(),o],template:`<lend-cta :loan-id="${h.id}" />`}),c=()=>({components:{LendCta:e},mixins:[t({queryResult:r(x)}),n(),o],template:`<lend-cta :loan-id="${x.id}" />`});var g,R,f;i.parameters={...i.parameters,docs:{...(g=i.parameters)==null?void 0:g.docs,source:{originalSource:`() => ({
  components: {
    LendCta
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fundraisingPartnerLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<lend-cta :loan-id="\${fundraisingPartnerLoan.id}" />\`
})`,...(f=(R=i.parameters)==null?void 0:R.docs)==null?void 0:f.source}}};var k,C,q;a.parameters={...a.parameters,docs:{...(k=a.parameters)==null?void 0:k.docs,source:{originalSource:`() => ({
  components: {
    LendCta
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fundraisingPartnerLoan),
    loadingQueries: ['lendCtaUser']
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<lend-cta :loan-id="\${fundraisingPartnerLoan.id}" />\`
})`,...(q=(C=a.parameters)==null?void 0:C.docs)==null?void 0:q.source}}};var $,v,F;s.parameters={...s.parameters,docs:{...($=s.parameters)==null?void 0:$.docs,source:{originalSource:`() => ({
  components: {
    LendCta
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(multiMatchedLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<lend-cta :loan-id="\${multiMatchedLoan.id}" />\`
})`,...(F=(v=s.parameters)==null?void 0:v.docs)==null?void 0:F.source}}};var Q,A,N;m.parameters={...m.parameters,docs:{...(Q=m.parameters)==null?void 0:Q.docs,source:{originalSource:`() => ({
  components: {
    LendCta
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(singleLenderLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  // The stats pill should read "powered by 1 lender" (singular)
  template: \`<lend-cta :loan-id="\${singleLenderLoan.id}" />\`
})`,...(N=(A=m.parameters)==null?void 0:A.docs)==null?void 0:N.source}}};var P,_,b;d.parameters={...d.parameters,docs:{...(P=d.parameters)==null?void 0:P.docs,source:{originalSource:`() => ({
  components: {
    LendCta
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(matchedNoLendersLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  // Every LendCta story enables multi matching, which suppresses the matching
  // text. With no lenders either, the stats slot has nothing to show and the
  // stats pill stays collapsed.
  template: \`<lend-cta :loan-id="\${matchedNoLendersLoan.id}" />\`
})`,...(b=(_=d.parameters)==null?void 0:_.docs)==null?void 0:b.source}}};var w,E,B;l.parameters={...l.parameters,docs:{...(w=l.parameters)==null?void 0:w.docs,source:{originalSource:`() => {
  const queryResult = createQueryResult(matchedNoLendersLoan);
  queryResult.data.general.multiMatchingEnabled = {
    key: 'multiMatchingEnabled',
    value: 'false'
  };
  return {
    components: {
      LendCta
    },
    mixins: [apolloStoryMixin({
      queryResult
    }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
    // With multi matching off, the matching text is the only stat and shows
    // in the pill
    template: \`<lend-cta :loan-id="\${matchedNoLendersLoan.id}" />\`
  };
}`,...(B=(E=l.parameters)==null?void 0:E.docs)==null?void 0:B.source}}};var U,O,W;p.parameters={...p.parameters,docs:{...(U=p.parameters)==null?void 0:U.docs,source:{originalSource:`() => ({
  components: {
    LendCta
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fullyFundedLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<lend-cta :loan-id="\${fullyFundedLoan.id}" />\`
})`,...(W=(O=p.parameters)==null?void 0:O.docs)==null?void 0:W.source}}};var D,T,j;c.parameters={...c.parameters,docs:{...(D=c.parameters)==null?void 0:D.docs,source:{originalSource:`() => ({
  components: {
    LendCta
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(payingBackLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  template: \`<lend-cta :loan-id="\${payingBackLoan.id}" />\`
})`,...(j=(T=c.parameters)==null?void 0:T.docs)==null?void 0:j.source}}};const et=["Fundraising","LoadingUserState","MultiMatched","SingleLender","MatchedNoLenders","MatchedNoLendersMultiMatchingOff","FullyFunded","PostFundraising"];export{p as FullyFunded,i as Fundraising,a as LoadingUserState,d as MatchedNoLenders,l as MatchedNoLendersMultiMatchingOff,s as MultiMatched,c as PostFundraising,m as SingleLender,et as __namedExportsOrder,Ze as default};
