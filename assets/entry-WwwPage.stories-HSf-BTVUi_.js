import{c as v}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{a as x}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{k as H}from"./entry-kv-auth0-story-mixin-o-TzSP8Hzw.js";import{b,f as M,w as A,i as F,l as w,a as B,c as I,d as W,e as P,g as y}from"./entry-siteThemes-1cbJUnnl6F.js";import{W as T}from"./entry-WwwPage-Dnl5yxJ_F5.js";import"./entry-syncDate-YRmxLv9Jrr.js";import"./iframe-k8E8OEl0.js";import"./entry-vue.esm-bundler-6I7BZrzll1.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-kiva-logo-BzAuztT5jL.js";import"./entry-touchEvents-DzV-rvy7P4.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-mdi-BJHOrBfjV3.js";import"./entry-CampaignLogoGroup-BGHS_ux-Qz.js";import"./entry-KvWwwHeader-BMN7jlaLiz.js";import"./entry-KvContentfulImg-iCsRurgeXB.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-KvMaterialIcon-CJhhgY5k8z.js";import"./entry-imageUtils-_95xo2d0ng.js";import"./entry-KvLoadingPlaceholder-DlopOSLIxY.js";import"./entry-settingsUtils-CXPrtFAPl-.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-get-D3xDH2SX94.js";import"./entry-index-COmIkRYU2t.js";import"./entry-myKivaUtils-USlSQzpKdw.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-myKivaForAllUsers-DI6rZrUMxZ.js";import"./entry-KvButton-BJ9DFW0h9t.js";import"./entry-KvLoadingSpinner-DvsCYFM9xF.js";import"./entry-KvPageContainer-Cwl0EO3RAU.js";import"./entry-KvUserAvatar-Cm7ijjK2RG.js";import"./entry-throttle-DR-Bh3IiJx.js";import"./entry-KvThemeProvider-BQMa3vJ2NV.js";import"./entry-orderBy-CUrcrXTfYx.js";import"./entry-keys-B9dmm4b_qU.js";import"./entry-toInteger-XI_MWEAzOD.js";import"./entry-comparators-BRogqMVmB_.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-getCacheKey-DXkCPRJNfJ.js";import"./entry-KvTextInput-Czft905cUt.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-PromoCreditBanner-CpvQAdwAEi.js";import"./entry-promoCredit-A8tDfJh8uJ.js";import"./entry-TheBasketBar-pyBnPqCFVD.js";import"./entry-KvButton-CQ3gigg4cW.js";import"./entry-basketCount-CZ-kE9ye_Z.js";import"./entry-TheFooter-gDax9gWh1B.js";import"./entry-KvAccordionItem-DqTooCewa2.js";import"./entry-KvExpandable--r0Qaerw2J.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-rich-text-html-renderer.es5-kBaKhcHuza.js";import"./entry-KvGrid-yu6LedLzpd.js";import"./entry-updateDonation-BtYhI8BWVz.js";import"./entry-AppealBannerCircular-DB3njHsTOn.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-KvProgressCircle-CSs3_pxl8F.js";import"./entry-GenericPromoBanner-BYR58Qzv3k.js";import"./entry-KvIcon-CX8v2dIT_5.js";import"./entry-KvProgressBar-CRXStDQ6m_.js";import"./entry-DonationBanner-CYMHbp-NqD.js";const S={grayBackground:!1,hideSearchInHeader:!1,headerTheme:null,footerTheme:null},Ce={title:"WwwFrame/WwwPage",component:T,args:S,argTypes:{headerTheme:{control:{type:"select",options:{none:null,lightHeader:y,iwdHeaderTheme:P,wrdHeaderTheme:W,fifteenYearHeaderTheme:I,blueHeader:B}}},footerTheme:{control:{type:"select",options:{none:null,lightFooter:w,iwdFooterTheme:F,wrdFooterTheme:A,fifteenYearFooterTheme:M,blueFooter:b},selected:"none"}}}},e=(f,{argTypes:k})=>({props:Object.keys(k),components:{WwwPage:T},mixins:[x(),v(),H],setup(){return{...S,...f}},template:`
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
