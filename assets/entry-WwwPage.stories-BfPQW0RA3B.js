import{c as v}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{a as x}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{k as H}from"./entry-kv-auth0-story-mixin-DjXxFMOTMN.js";import{b,f as M,w as A,i as F,l as w,a as B,c as I,d as W,e as P,g as y}from"./entry-siteThemes-1cbJUnnl6F.js";import{W as T}from"./entry-WwwPage-Bdb8AIfsEa.js";import"./entry-syncDate-BRiqKRp-cF.js";import"./iframe-Dd3MfrQK.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-kiva-logo-CXWq-YcmJ4.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-mdi-B1ONwcTkQ2.js";import"./entry-CampaignLogoGroup-DvqZ68aAlx.js";import"./entry-KvWwwHeader-K_aXJrsvke.js";import"./entry-KvContentfulImg-JLtx_2PxYm.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-KvMaterialIcon-B1UgUIVXS0.js";import"./entry-imageUtils-XCIqTGZvrk.js";import"./entry-KvLoadingPlaceholder-C8l3iom59y.js";import"./entry-settingsUtils-CXPrtFAPl-.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-get-D3xDH2SX94.js";import"./entry-index-COmIkRYU2t.js";import"./entry-myKivaUtils-BAaLqOlYjt.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-myKivaForAllUsers-DI6rZrUMxZ.js";import"./entry-KvButton-2WLASe3tCZ.js";import"./entry-KvLoadingSpinner-B-Httn77Py.js";import"./entry-KvPageContainer-B9B1ON9WYm.js";import"./entry-KvUserAvatar-b8HRct0DTf.js";import"./entry-throttle-4FNEI5INvC.js";import"./entry-KvThemeProvider-hQ4Q4UyWeS.js";import"./entry-orderBy-CUrcrXTfYx.js";import"./entry-keys-B9dmm4b_qU.js";import"./entry-toInteger-XI_MWEAzOD.js";import"./entry-PromoCreditBanner-XUiEvDBm5F.js";import"./entry-promoCredit-w2GeqDaA1T.js";import"./entry-confetti.module-BCnSlh9tqh.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-getCacheKey-9GTnTklOjf.js";import"./entry-KvTextInput-Cwf1rssvKe.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-TheBasketBar-BsCSNV9Fst.js";import"./entry-KvButton-C9WvITgRyG.js";import"./entry-basketCount-CZ-kE9ye_Z.js";import"./entry-TheFooter-C0sVexfG0u.js";import"./entry-KvAccordionItem-k5OKKWqAsg.js";import"./entry-KvExpandable-Bd-oWmSPhz.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-rich-text-html-renderer.es5-kBaKhcHuza.js";import"./entry-KvGrid-tJUXtKQ9NU.js";import"./entry-updateDonation-CfhElOgRHH.js";import"./entry-AppealBannerCircular-BP0cvUZqYy.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-KvProgressCircle-Pjk1xBU9rv.js";import"./entry-GenericPromoBanner-DFPZIGXsYn.js";import"./entry-KvIcon-b0e16r4G06.js";import"./entry-KvProgressBar-BmpdT0Dz1a.js";import"./entry-DonationBanner-Cb4x0Edwvo.js";const S={grayBackground:!1,hideSearchInHeader:!1,headerTheme:null,footerTheme:null},Ce={title:"WwwFrame/WwwPage",component:T,args:S,argTypes:{headerTheme:{control:{type:"select",options:{none:null,lightHeader:y,iwdHeaderTheme:P,wrdHeaderTheme:W,fifteenYearHeaderTheme:I,blueHeader:B}}},footerTheme:{control:{type:"select",options:{none:null,lightFooter:w,iwdFooterTheme:F,wrdFooterTheme:A,fifteenYearFooterTheme:M,blueFooter:b},selected:"none"}}}},e=(f,{argTypes:k})=>({props:Object.keys(k),components:{WwwPage:T},mixins:[x(),v(),H],setup(){return{...S,...f}},template:`
        <www-page
            :gray-background="grayBackground"
            :hide-search-in-header="hideSearchInHeader"
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page>
    `}),r=e.bind({});r.args={grayBackground:!0};const o=e.bind({});o.args={hideSearchInHeader:!0};const t=e.bind({});t.args={headerTheme:y,footerTheme:w};var n,a,i;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`(otherArgs, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    WwwPage
  },
  mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  setup() {
    return {
      ...args,
      ...otherArgs
    };
  },
  template: \`
        <www-page
            :gray-background="grayBackground"
            :hide-search-in-header="hideSearchInHeader"
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page>
    \`
})`,...(i=(a=e.parameters)==null?void 0:a.docs)==null?void 0:i.source}}};var m,s,p;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`(otherArgs, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    WwwPage
  },
  mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  setup() {
    return {
      ...args,
      ...otherArgs
    };
  },
  template: \`
        <www-page
            :gray-background="grayBackground"
            :hide-search-in-header="hideSearchInHeader"
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page>
    \`
})`,...(p=(s=r.parameters)==null?void 0:s.docs)==null?void 0:p.source}}};var d,h,c;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`(otherArgs, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    WwwPage
  },
  mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  setup() {
    return {
      ...args,
      ...otherArgs
    };
  },
  template: \`
        <www-page
            :gray-background="grayBackground"
            :hide-search-in-header="hideSearchInHeader"
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page>
    \`
})`,...(c=(h=o.parameters)==null?void 0:h.docs)==null?void 0:c.source}}};var g,l,u;t.parameters={...t.parameters,docs:{...(g=t.parameters)==null?void 0:g.docs,source:{originalSource:`(otherArgs, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    WwwPage
  },
  mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  setup() {
    return {
      ...args,
      ...otherArgs
    };
  },
  template: \`
        <www-page
            :gray-background="grayBackground"
            :hide-search-in-header="hideSearchInHeader"
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page>
    \`
})`,...(u=(l=t.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};const Je=["Default","GrayBackground","HideSearchInHeader","Themed"];export{e as Default,r as GrayBackground,o as HideSearchInHeader,t as Themed,Je as __namedExportsOrder,Ce as default};
