import{_ as e}from"./entry-BorrowerSideSheetContent-BUTnysLyI6.js";import{a as p}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as n}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as a}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import{f as r,c as s}from"./entry-mockLoanFixtures-4xHHxu25DF.js";import"./entry-vue.esm-bundler-BYzU99W7uH.js";import"./entry-vue-router-BRJ8td2miO.js";import"./entry-KvWwwHeaderBasic-D-dYqQTzhh.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-9O9xxAVV.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-loanUtils-Dh5pODnjhO.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-LoanStatusEnum-BZ9jvWVUox.js";import"./entry-postCheckoutAchievements-CQjx4f1psm.js";import"./entry-aiLoanPillsUtils-BFE0affa1i.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-useIsMobile-BczPnZGoc0.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-CommentsAndWhySpecial-wqF-67kOlh.js";import"./entry-CommentReportLightbox-drYt2cKm3X.js";import"./entry-KvLightbox-hUYJDS8EdG.js";import"./entry-printing-Clr_ahK9Wi.js";import"./entry-KvRadio-DaOfTUdjLd.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-click-outside-DsIhxHJU82.js";import"./entry-BorrowerImage-BiTD3mHAQU.js";import"./entry-KvCarousel-BaQpOXmIy6.js";import"./entry-kiva_k-DzDbbfmjWV.js";import"./entry-BorrowerCountry-Bk2MusNSmO.js";import"./entry-KvMap-CDQbl6WSsh.js";import"./entry-observerUtils-DveHpw6JZJ.js";import"./entry-CountryInfo-deW3gO6LxH.js";import"./entry-ContributingPartners-BOY43QrqCt.js";import"./entry-useMultiMatching-XbEGhbvOiB.js";import"./entry-settingsUtils-CVQrt31Ifm.js";import"./entry-watchApolloOperation-CRDPfiJcIR.js";import"./entry-DetailsTabs-pgB0dDjpT-.js";import"./entry-KvTabs-CTxYyJnr8e.js";import"./entry-KvTabPanel-BHOo_94xTB.js";import"./entry-DescriptionListLoading-nV6mc1KZ6Q.js";import"./entry-FieldPartnerDetails-Qxmcc2YnEb.js";import"./entry-dateUtils-CQ90J503dL.js";import"./entry-index-BMPNuZbV7y.js";import"./entry-DescriptionListItem-pHh8xCFf9y.js";import"./entry-KvTextLink-DqLn7K5FjE.js";import"./entry-LoanDetails-2Snh2FshPg.js";import"./entry-RepaymentSchedule-dtRw7Yr6HL.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-index-6TolKbZ2-J.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-TrusteeDetails-B_trAKOd5d.js";import"./entry-index-7WUD3idviV.js";import"./entry-LendersAndTeams-PNQKz3OIqP.js";import"./entry-LoanProgress-B9XeE_Xw_g.js";import"./entry-MoreAboutLoan-DJhvJ1MXD-.js";import"./entry-exports-CudK1O5XNw.js";import"./entry-DefinitionsLightbox-o_UgyyMWz9.js";import"./entry-rich-text-html-renderer.es5-kBaKhcHuza.js";import"./entry-contentfulUtils-BSVc25-f1Y.js";import"./entry-PreviousLoanDescription-CbxyHTDI6o.js";import"./entry-KvExpandable-otp5Py9Dub.js";import"./entry-KvIconButton-DJIrpVP3Wh.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";const Lo={title:"Components/BorrowerSideSheet/BorrowerSideSheetContent",component:e},o=()=>({components:{BorrowerSideSheetContent:e},mixins:[p({queryResult:s(r)}),n(),a],provide:{$kvTrackEvent:()=>{}},template:`
        <borrower-side-sheet-content
            :loan-id="${r.id}"
            :is-adding="false"
            :basket-items="[]"
        />
    `});var t,i,m;o.parameters={...o.parameters,docs:{...(t=o.parameters)==null?void 0:t.docs,source:{originalSource:`() => ({
  components: {
    BorrowerSideSheetContent
  },
  mixins: [apolloStoryMixin({
    queryResult: createQueryResult(fundraisingPartnerLoan)
  }), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  provide: {
    $kvTrackEvent: () => {}
  },
  template: \`
        <borrower-side-sheet-content
            :loan-id="\${fundraisingPartnerLoan.id}"
            :is-adding="false"
            :basket-items="[]"
        />
    \`
})`,...(m=(i=o.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};const Po=["Default"];export{o as Default,Po as __namedExportsOrder,Lo as default};
