import{a as y}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as k}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as v}from"./entry-kv-auth0-story-mixin-Co3PJhPUDo.js";import{b as x,f as M,w as S,i as b,l as d,a as F,c as H,d as W,e as P,g as h}from"./entry-siteThemes-1cbJUnnl6F.js";import{T as B,C as A,_ as $}from"./entry-TheBasketBar-BQVCRhMS2f.js";import{a as j}from"./entry-app-install-mixin-QMobgVNZvx.js";import{a as N}from"./entry-myKivaUtils-DJeEaqKE-b.js";import{T as O}from"./entry-syncDate--YnInxWv4h.js";import{T as Y}from"./entry-TheFooter-BToRc1GLVq.js";import{c as q,a,e as C,g as E,r as i,o as L}from"./entry-vue.esm-bundler-DRMQxQJg8r.js";import{_ as D}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvButton-U52zchXZWJ.js";import"./entry-getCacheKey-Cm-nxeAR-9.js";import"./entry-basketCount-CZ-kE9ye_Z.js";import"./entry-mdi-BLrElsGAq2.js";import"./entry-KvMaterialIcon-CFyzC4J9vc.js";import"./entry-KvAtbModal-DhF29XDIKL.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvButton-Ch4xYnpy1m.js";import"./entry-KvLoadingSpinner-CbEbrIIgDo.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-get-D3xDH2SX94.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-injectionCheck-7gO_RAaPL1.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-experimentVersion-B5y4RTPkgZ.js";import"./entry-settingsUtils-BglWvcCZaO.js";import"./entry-index-COmIkRYU2t.js";import"./iframe-DK1W5Kk4.js";import"./entry-orderBy-BpW2cj9Byi.js";import"./entry-keys-B9dmm4b_qU.js";import"./entry-imageUtils-DMLkgPJKqw.js";import"./entry-kiva-logo-j0DJ8iDvdW.js";import"./entry-touchEvents-DzV-rvy7P4.js";import"./entry-CampaignLogoGroup-mBP43cP0qh.js";import"./entry-KvContentfulImg-BLSyPcUXeC.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-KvPageContainer-CXiIxjgb42.js";import"./entry-toInteger-XI_MWEAzOD.js";import"./entry-fuse.common-C458_7fIOE.js";import"./entry-comparators-BRogqMVmB_.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-KvTextInput-C5UEjC6OK2.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-PromoCreditBanner-BbI6ymtxvx.js";import"./entry-KvAccordionItem-U48d3djgi4.js";import"./entry-KvExpandable-XPVfq9sG7p.js";import"./entry-urlUtils-BR6y7F2aaq.js";import"./entry-rich-text-html-renderer.es5-kBaKhcHuza.js";import"./entry-KvGrid-YP8W82wJAP.js";const w={name:"WwwPageMinimal",inject:["apollo","cookieStore"],components:{CookieBanner:A,TheBasketBar:B,TheFooter:Y,TheHeader:O},mixins:[j],apollo:{preFetch(t,e){return Promise.all([e.query({query:$}),N(e)])}}},I={class:"www-page"};function V(t,e,z,G,J,K){const f=i("the-header"),g=i("the-footer"),T=i("the-basket-bar"),_=i("cookie-banner");return L(),q("div",I,[a(f,{minimal:!0}),C("main",null,[E(t.$slots,"default")]),a(g),a(T),a(_)])}const u=D(w,[["render",V]]);w.__docgenInfo={displayName:"WwwPageMinimal",exportName:"default",description:"",tags:{},slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/WwwPageMinimal.vue"]};const Ke={title:"WwwFrame/WwwPageMinimal",component:u,args:{headerTheme:null,footerTheme:null},argTypes:{headerTheme:{control:{type:"select",options:{none:null,lightHeader:h,iwdHeaderTheme:P,wrdHeaderTheme:W,fifteenYearHeaderTheme:H,blueHeader:F}}},footerTheme:{control:{type:"select",options:{none:null,lightFooter:d,iwdFooterTheme:b,wrdFooterTheme:S,fifteenYearFooterTheme:M,blueFooter:x}}}}},o=(t,{argTypes:e})=>({props:Object.keys(e),components:{WwwPageMinimal:u},mixins:[y(),k(),v],setup(){return t},template:`
        <www-page-minimal
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page-minimal>
    `}),r=o.bind({});r.args={headerTheme:h,footerTheme:d};var m,n,s;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    WwwPageMinimal
  },
  mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  setup() {
    return args;
  },
  template: \`
        <www-page-minimal
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page-minimal>
    \`
})`,...(s=(n=o.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};var p,l,c;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    WwwPageMinimal
  },
  mixins: [apolloStoryMixin(), cookieStoreStoryMixin(), kvAuth0StoryMixin],
  setup() {
    return args;
  },
  template: \`
        <www-page-minimal
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page-minimal>
    \`
})`,...(c=(l=r.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};const Qe=["Default","Themed"];export{o as Default,r as Themed,Qe as __namedExportsOrder,Ke as default};
