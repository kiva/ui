import{D as r}from"./entry-DonationBanner-DMZYZkwCGA.js";import"./entry-KvMaterialIcon-DbyMVkeaMq.js";import"./entry-vue.esm-bundler-CTwdbZZHjD.js";import"./entry-KvWideLoanCard-CbH2sjp8GX.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-KvButton-BVwNcQukwO.js";import"./entry-KvLoadingSpinner-CKG9dUfOiG.js";import"./entry-KvContentfulImg-0AxA9fd-uA.js";import"./entry-KvPageContainer-BmR0CCWjKe.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const t={isOpen:!0,buttonAmounts:[20,35,50],headline:"Donate $50, get $25 to lend.",frequency:"monthly",bannerImageUrl:"//images.ctfassets.net/j0p9a6ql0rn7/46U7dagWY4pn1vaUPLYaYx/707ada55d0152f6d4b72aa74d894a22c/icon-heart.png"},q={title:"WwwFrame/Banners/DonationBanner",component:r,args:t},n=(m,{argTypes:s})=>({props:Object.keys(s),components:{DonationBanner:r},setup(){return t},template:`
        <div>
            <donation-banner
                :button-amounts="buttonAmounts"
              :headline="headline"
        :body="body"
        :disclaimer="hasDisclaimer"
        :banner-image-url="bannerImageUrl"
        :frequency="frequency"
        @close-banner="onCloseBanner"
            />
        </div>
    `,methods:{onCloseBanner(i){console.log(i)}}});var e,o,a;n.parameters={...n.parameters,docs:{...(e=n.parameters)==null?void 0:e.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    DonationBanner
  },
  setup() {
    return args;
  },
  template: \`
        <div>
            <donation-banner
                :button-amounts="buttonAmounts"
              :headline="headline"
        :body="body"
        :disclaimer="hasDisclaimer"
        :banner-image-url="bannerImageUrl"
        :frequency="frequency"
        @close-banner="onCloseBanner"
            />
        </div>
    \`,
  methods: {
    onCloseBanner(bannerState) {
      console.log(bannerState);
      // set cookies here and isOpen state here
    }
  }
})`,...(a=(o=n.parameters)==null?void 0:o.docs)==null?void 0:a.source}}};const v=["Default"];export{n as Default,v as __namedExportsOrder,q as default};
