import{D as r}from"./entry-DonationBanner-7RI-GJmEu8.js";import"./entry-mdi-B1ONwcTkQ2.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-KvMaterialIcon-C3KLX5OV-L.js";import"./entry-KvWwwHeader-C1bm1YMh4q.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvButton-BA7nBLyz1b.js";import"./entry-KvLoadingSpinner-CpYE5b1xV2.js";import"./entry-KvContentfulImg-B0t9ZCrx8O.js";import"./entry-KvPageContainer-Dh8GJwjiow.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const t={isOpen:!0,buttonAmounts:[20,35,50],headline:"Donate $50, get $25 to lend.",frequency:"monthly",bannerImageUrl:"//images.ctfassets.net/j0p9a6ql0rn7/46U7dagWY4pn1vaUPLYaYx/707ada55d0152f6d4b72aa74d894a22c/icon-heart.png"},O={title:"WwwFrame/Banners/DonationBanner",component:r,args:t},n=(m,{argTypes:s})=>({props:Object.keys(s),components:{DonationBanner:r},setup(){return t},template:`
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
})`,...(a=(o=n.parameters)==null?void 0:o.docs)==null?void 0:a.source}}};const U=["Default"];export{n as Default,U as __namedExportsOrder,O as default};
