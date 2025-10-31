import{c as v}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{a as x}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{k as H}from"./entry-kv-auth0-story-mixin-DxLGBTBTDx.js";import{b,f as M,w as A,i as F,l as w,a as B,c as I,d as W,e as P,g as y}from"./entry-siteThemes-1cbJUnnl6F.js";import{W as T}from"./entry-WwwPage-D-sW1TnUWL.js";import"./entry-syncDate-BmkM6LdPy7.js";import"./iframe-CWeBLAo0.js";import"./entry-vue.esm-bundler-Bf_Yeyugwo.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-kiva-logo-fyRkKmi0FM.js";import"./entry-touchEvents-DzV-rvy7P4.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-mdi-BJHOrBfjV3.js";import"./entry-CampaignLogoGroup-D5aVYDQ4uA.js";import"./entry-KvWwwHeader-CVdIzOPj6Q.js";import"./entry-KvContentfulImg-ClwkYYkTk_.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-KvMaterialIcon-DcajXwg-0j.js";import"./entry-imageUtils-_95xo2d0ng.js";import"./entry-KvLoadingPlaceholder-DUZzoT9CoU.js";import"./entry-settingsUtils-CXPrtFAPl-.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-get-D3xDH2SX94.js";import"./entry-index-COmIkRYU2t.js";import"./entry-myKivaUtils-USlSQzpKdw.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-myKivaForAllUsers-DI6rZrUMxZ.js";import"./entry-KvButton-DF0Vhz1EWA.js";import"./entry-KvLoadingSpinner-D0IZcQeh_0.js";import"./entry-KvPageContainer-B9-1kg27t_.js";import"./entry-KvUserAvatar-CcUKtQr-4i.js";import"./entry-throttle-DR-Bh3IiJx.js";import"./entry-KvThemeProvider-CJZWo36001.js";import"./entry-orderBy-CUrcrXTfYx.js";import"./entry-keys-B9dmm4b_qU.js";import"./entry-toInteger-XI_MWEAzOD.js";import"./entry-PromoCreditBanner-CCrPa6t4Rf.js";import"./entry-promoCredit-A8tDfJh8uJ.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-getCacheKey-BX3EO2qX-W.js";import"./entry-KvTextInput-DOWiWB5Pob.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-TheBasketBar-CAfv021hcH.js";import"./entry-KvButton-CZu-utW0a_.js";import"./entry-basketCount-CZ-kE9ye_Z.js";import"./entry-TheFooter-B50H37oieJ.js";import"./entry-KvAccordionItem-BUdedcIFQ1.js";import"./entry-KvExpandable-DeDyumYo7d.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-rich-text-html-renderer.es5-kBaKhcHuza.js";import"./entry-KvGrid-A3hpmYTsti.js";import"./entry-updateDonation-CfhElOgRHH.js";import"./entry-AppealBannerCircular-D3bqh_0eaU.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-KvProgressCircle-Dl0vzA6hWT.js";import"./entry-GenericPromoBanner-xsZONbxoWL.js";import"./entry-KvIcon-DpMQFaEAGT.js";import"./entry-KvProgressBar-CQtXD0YVwH.js";import"./entry-DonationBanner-BukgKHfxUA.js";const S={grayBackground:!1,hideSearchInHeader:!1,headerTheme:null,footerTheme:null},ze={title:"WwwFrame/WwwPage",component:T,args:S,argTypes:{headerTheme:{control:{type:"select",options:{none:null,lightHeader:y,iwdHeaderTheme:P,wrdHeaderTheme:W,fifteenYearHeaderTheme:I,blueHeader:B}}},footerTheme:{control:{type:"select",options:{none:null,lightFooter:w,iwdFooterTheme:F,wrdFooterTheme:A,fifteenYearFooterTheme:M,blueFooter:b},selected:"none"}}}},e=(f,{argTypes:k})=>({props:Object.keys(k),components:{WwwPage:T},mixins:[x(),v(),H],setup(){return{...S,...f}},template:`
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
})`,...(u=(l=t.parameters)==null?void 0:l.docs)==null?void 0:u.source}}};const Ce=["Default","GrayBackground","HideSearchInHeader","Themed"];export{e as Default,r as GrayBackground,o as HideSearchInHeader,t as Themed,Ce as __namedExportsOrder,ze as default};
