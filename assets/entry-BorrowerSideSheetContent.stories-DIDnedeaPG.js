import{_ as p}from"./entry-BorrowerSideSheetContent-5kTk4ptp5x.js";import{a as e}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as n}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as a}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import{f as r,c as s}from"./entry-mockLoanFixtures-C0EICqiR9b.js";import"./entry-vue.esm-bundler-D8yP9bVmC4.js";import"./entry-vue-router-CpkYp7v6za.js";import"./entry-KvWwwHeaderBasic-BB16oz4SiS.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-Bg3M7544.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-loanUtils-Dh5pODnjhO.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-LoanStatusEnum-BZ9jvWVUox.js";import"./entry-postCheckoutAchievements-CQjx4f1psm.js";import"./entry-aiLoanPillsUtils-BFE0affa1i.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-useIsMobile-BWvPSCgrcL.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-CommentsAndWhySpecial-D6phWb-Exp.js";import"./entry-CommentReportLightbox-BQ0JeKL1mv.js";import"./entry-KvLightbox-Bijtdqydwv.js";import"./entry-printing-DjnSCsmPoI.js";import"./entry-KvRadio-QfmcjypV8Y.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-click-outside-DsIhxHJU82.js";import"./entry-BorrowerImage-CbPcvs9VP5.js";import"./entry-KvCarousel-mVz4KExbYA.js";import"./entry-kiva_k-DzDbbfmjWV.js";import"./entry-BorrowerCountry-B0EVfeh2gs.js";import"./entry-KvMap-BOo6EhrDiZ.js";import"./entry-observerUtils-DveHpw6JZJ.js";import"./entry-CountryInfo-BKkM2lUmXK.js";import"./entry-ContributingPartners-DiBSmyCvlV.js";import"./entry-useMultiMatching-B3M2lHBBDX.js";import"./entry-settingsUtils-CVQrt31Ifm.js";import"./entry-useApolloQuery-vwcAJ8FTrS.js";import"./entry-watchApolloOperation-CRDPfiJcIR.js";import"./entry-DetailsTabs-CawTMQ5SV3.js";import"./entry-KvTabs-Bk8vjwJJ5u.js";import"./entry-KvTabPanel-B-hakpgUHb.js";import"./entry-DescriptionListLoading-DeV-hxlJGZ.js";import"./entry-FieldPartnerDetails-2YZgxwn9AZ.js";import"./entry-dateUtils-CQ90J503dL.js";import"./entry-index-BMPNuZbV7y.js";import"./entry-DescriptionListItem-DeStsFqBsJ.js";import"./entry-KvTextLink-lPIxsG65ya.js";import"./entry-LoanDetails-B7xZnDDmX2.js";import"./entry-RepaymentSchedule--H4IBwFuRn.js";import"./entry-stringParserUtils-ltRuUwZbQA.js";import"./entry-index-6TolKbZ2-J.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-TrusteeDetails-BOtkkbwRvn.js";import"./entry-index-7WUD3idviV.js";import"./entry-LendersAndTeams-YXW7LxeIpR.js";import"./entry-LoanProgress-CuN5ok6BYw.js";import"./entry-MoreAboutLoan-BxD0TixPR_.js";import"./entry-exports-CudK1O5XNw.js";import"./entry-DefinitionsLightbox-B-_Ttzn3d5.js";import"./entry-rich-text-html-renderer.es5-kBaKhcHuza.js";import"./entry-contentfulUtils-BSVc25-f1Y.js";import"./entry-PreviousLoanDescription-D7QKxmZ1HB.js";import"./entry-KvExpandable-DetrRB6M8b.js";import"./entry-KvIconButton-CdCW7xU74E.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";const Po={title:"Components/BorrowerSideSheet/BorrowerSideSheetContent",component:p},o=()=>({components:{BorrowerSideSheetContent:p},mixins:[e({queryResult:s(r)}),n(),a],provide:{$kvTrackEvent:()=>{}},template:`
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
})`,...(m=(i=o.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};const qo=["Default"];export{o as Default,qo as __namedExportsOrder,Po as default};
