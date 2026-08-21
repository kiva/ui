import{a as y}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as k}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{k as v}from"./entry-kv-auth0-story-mixin-BcDGj1FIz0.js";import{b as M,f as x,w as b,i as S,l as c,a as F,c as H,d as W,e as P,g as h}from"./entry-siteThemes-1cbJUnnl6F.js";import{T as B,C as $}from"./entry-TheBasketBar-CxeFPdFalT.js";import{_ as N}from"./entry-TheHeader-y1Gt5XF4SA.js";import{T as O}from"./entry-TheFooter-CWFZsBIuxs.js";import{c as Y,d as r,a as j,E as A,h as t,o as C}from"./entry-vue.esm-bundler-D8yP9bVmC4.js";import{_ as D}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-syncDate-C1Yb7n1xF6.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-_commonjs-dynamic-modules-TDtrdbi37h.js";import"./entry-logFormatter-C3zJjaAqCL.js";import"./entry-KvButton-MrL-mFbsD6.js";import"./entry-getCacheKey-BQZEmBDkIz.js";import"./entry-basketCount-CZ-kE9ye_Z.js";import"./entry-KvWwwHeaderBasic-BB16oz4SiS.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-Bg3M7544.js";import"./entry-index-C1c4cvJ8FT.js";import"./entry-kiva-logo-Bqo5R24NZM.js";import"./entry-CampaignLogoGroup-iO3lwqwgpp.js";import"./entry-KvContentfulImg-Dz7EdpaAeS.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-settingsUtils-CVQrt31Ifm.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-experimentVersion-B5y4RTPkgZ.js";import"./entry-useMyKivaHome-Dcc_c7pwbV.js";import"./entry-useApolloQuery-vwcAJ8FTrS.js";import"./entry-vue-router-CpkYp7v6za.js";import"./entry-watchApolloOperation-CRDPfiJcIR.js";import"./entry-logReadQueryError-BL2yt7MPC5.js";import"./entry-headerUtils-DCYXj7N7oP.js";import"./entry-_baseMap-Y3vx4Wl8dz.js";import"./entry-keys-WbbxK4vnp3.js";import"./entry-toInteger-sFBEvOuEHH.js";import"./entry-PromoCreditBanner-NGSUuYFXJY.js";import"./entry-promoCredit-BPne-2XqN5.js";import"./entry-confettiUtils-Cu2ZQx-gOy.js";import"./entry-confetti.module-B5JVzsfHJX.js";import"./entry-lock-scroll-Bww220JhDP.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-KvAccordionItem-CpfEJgtXxC.js";import"./entry-KvExpandable-DetrRB6M8b.js";import"./entry-rich-text-html-renderer.es5-kBaKhcHuza.js";import"./entry-KvGrid-BlihQ0NZ3g.js";const w={name:"WwwPageMinimal",components:{CookieBanner:$,TheBasketBar:B,TheFooter:O,TheHeader:N}},E={class:"www-page"};function L(i,m,V,I,q,z){const f=t("the-header"),g=t("the-footer"),T=t("the-basket-bar"),_=t("cookie-banner");return C(),Y("div",E,[r(f,{minimal:!0}),j("main",null,[A(i.$slots,"default")]),r(g),r(T),r(_)])}const u=D(w,[["render",L]]);w.__docgenInfo={displayName:"WwwPageMinimal",exportName:"default",description:"",tags:{},slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/src/components/WwwFrame/WwwPageMinimal.vue"]};const Ge={title:"WwwFrame/WwwPageMinimal",component:u,args:{headerTheme:null,footerTheme:null},argTypes:{headerTheme:{control:{type:"select",options:{none:null,lightHeader:h,iwdHeaderTheme:P,wrdHeaderTheme:W,fifteenYearHeaderTheme:H,blueHeader:F}}},footerTheme:{control:{type:"select",options:{none:null,lightFooter:c,iwdFooterTheme:S,wrdFooterTheme:b,fifteenYearFooterTheme:x,blueFooter:M}}}}},e=(i,{argTypes:m})=>({props:Object.keys(m),components:{WwwPageMinimal:u},mixins:[y(),k(),v],setup(){return i},template:`
        <www-page-minimal
            :header-theme="headerTheme"
            :footer-theme="footerTheme"
        >
            <div class="row" style="padding: 1.625rem 0;">
                <div class="small-12 columns"><h1>Lorem ipsum</h1></div>
            </div>
        </www-page-minimal>
    `}),o=e.bind({});o.args={headerTheme:h,footerTheme:c};var a,n,s;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`(args, {
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
})`,...(s=(n=e.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};var p,l,d;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`(args, {
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
})`,...(d=(l=o.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};const Je=["Default","Themed"];export{e as Default,o as Themed,Je as __namedExportsOrder,Ge as default};
