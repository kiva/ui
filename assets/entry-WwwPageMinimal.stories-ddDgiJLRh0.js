import{a as y}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as k}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as v}from"./entry-kv-auth0-story-mixin-CE2xB3ckte.js";import{a as c,c as x,d as M,e as b,g as S,l as h,i as F,w as H,f as W,b as P}from"./entry-siteThemes-B07ujV8qmR.js";import{C as B,T as A,d as $}from"./entry-TheBasketBar-Bd12P1txX2.js";import{a as j}from"./entry-app-install-mixin-DDT29wSpe2.js";import{a as N}from"./entry-experimentUtils-CZhauzP3sM.js";import{T as O}from"./entry-syncDate-Dl6SXm-yhr.js";import{T as Y}from"./entry-TheFooter-CUnfiByUY9.js";import{b as C,d as i,e as E,g as L,a as m,o as q}from"./entry-vue.esm-bundler-Bbq66B_iPn.js";import{_ as D}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvButton-Bg6Typ1Yo3.js";import"./entry-getCacheKey-CkBZpuZcyI.js";import"./entry-basketCount-D5V0YsUQ7f.js";import"./entry-KvMaterialIcon-CuBFcuN6wj.js";import"./entry-KvWideLoanCard-BsTIZisVnM.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-KvButton-0-Ld3y89Ed.js";import"./entry-KvLoadingSpinner-ClVIsiRPTH.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-get-DbzAqeWMpB.js";import"./entry-isSymbol-Cs2hrTnPnb.js";import"./entry-injectionCheck-7gO_RAaPL1.js";import"./entry-logReadQueryError-Codcl0QZ_g.js";import"./entry-logFormatter-DhjghUk5Me.js";import"./entry-experimentVersion-DPC15KwAMV.js";import"./entry-settingsUtils-DSo0EGYi0D.js";import"./entry-index-COmIkRYU2t.js";import"./iframe-DrritQ9C.js";import"../sb-preview/runtime.js";import"./entry-_baseIsEqual-C5d7jA8_ba.js";import"./entry-keys-CExFC6Ir8Q.js";import"./entry-orderBy-984icSd1F0.js";import"./entry-_baseIteratee-BeIMgQFEge.js";import"./entry-_baseAssignValue-CcnEM7UKty.js";import"./entry-imageUtils-DMLkgPJKqw.js";import"./entry-index-CKVkeXup4D.js";import"./entry-tslib.es6-CxsSpKd0p8.js";import"./entry-kiva-logo-C-IXhsUS8q.js";import"./entry-touchEvents-D1_bE1maXx.js";import"./entry-CampaignLogoGroup-BjyKjvzjbI.js";import"./entry-KvContentfulImg-CLEWZWe6Xb.js";import"./entry-throttle-C_gUPZjI8B.js";import"./entry-toNumber-BfkLXMgxIK.js";import"./entry-KvPageContainer-CtNIK45uwv.js";import"./entry-toInteger-ByE7uYhomK.js";import"./entry-fuse.common-CY1jHVywCQ.js";import"./entry-comparators-Dl7wUbGSK1.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-filterConfig-DA9w_9zET9.js";import"./entry-numberUtils-CJK53TfNzV.js";import"./entry-filterUtils-Dck2WLaeYf.js";import"./entry-sortOptions-CItz_gIeYG.js";import"./entry-regions-BEXjWYWvVy.js";import"./entry-KvTextInput-D5mWL__ZKJ.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-PromoCreditBanner-Bdsu_fVjlH.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-KvAccordionItem-CfJts66Bqg.js";import"./entry-KvExpandable-MAyWVe8SfS.js";import"./entry-urlUtils-BR6y7F2aaq.js";import"./entry-rich-text-html-renderer.es5-DcJ4MOIYHw.js";import"./entry-KvGrid-BYGjNZ4GYb.js";const w={name:"WwwPageMinimal",inject:["apollo","cookieStore"],components:{CookieBanner:B,TheBasketBar:A,TheFooter:Y,TheHeader:O},mixins:[j],apollo:{preFetch(t,e){return Promise.all([e.query({query:$}),N(e)])}}},I={class:"www-page"};function V(t,e,z,G,J,K){const f=m("the-header"),g=m("the-footer"),T=m("the-basket-bar"),_=m("cookie-banner");return q(),C("div",I,[i(f,{minimal:!0}),E("main",null,[L(t.$slots,"default")]),i(g),i(T),i(_)])}const u=D(w,[["render",V]]);w.__docgenInfo={displayName:"WwwPageMinimal",exportName:"default",description:"",tags:{},slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/WwwPageMinimal.vue"]};const io={title:"WwwFrame/WwwPageMinimal",component:u,args:{headerTheme:null,footerTheme:null},argTypes:{headerTheme:{control:{type:"select",options:{none:null,lightHeader:c,iwdHeaderTheme:x,wrdHeaderTheme:M,fifteenYearHeaderTheme:b,blueHeader:S}}},footerTheme:{control:{type:"select",options:{none:null,lightFooter:h,iwdFooterTheme:F,wrdFooterTheme:H,fifteenYearFooterTheme:W,blueFooter:P}}}}},o=(t,{argTypes:e})=>({props:Object.keys(e),components:{WwwPageMinimal:u},mixins:[y(),k(),v],setup(){return t},template:`
        <www-page-minimal
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page-minimal>
    `}),r=o.bind({});r.args={headerTheme:c,footerTheme:h};var a,n,s;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`(args, {
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
})`,...(s=(n=o.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};var p,l,d;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`(args, {
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
})`,...(d=(l=r.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};const mo=["Default","Themed"];export{o as Default,r as Themed,mo as __namedExportsOrder,io as default};
