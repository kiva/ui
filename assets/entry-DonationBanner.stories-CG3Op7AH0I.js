import{D as r}from"./entry-DonationBanner-CJwAuP7A35.js";import"./entry-mdi-CMeqivaQKM.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-smooth-scroll-mixin-Coaqv0J44m.js";import"./entry-vue.esm-bundler-DRMQxQJg8r.js";import"./entry-KvMaterialIcon-Bzq2cnQaw_.js";import"./entry-KvAtbModal-DBQkdQ0mEi.js";import"./entry-KvButton-CY3aJPxGKN.js";import"./entry-KvLoadingSpinner-bVlI0d9FIU.js";import"./entry-KvContentfulImg-oQCwviilu7.js";import"./entry-KvPageContainer-BZjtohPN7T.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const t={isOpen:!0,buttonAmounts:[20,35,50],headline:"Donate $50, get $25 to lend.",frequency:"monthly",bannerImageUrl:"//images.ctfassets.net/j0p9a6ql0rn7/46U7dagWY4pn1vaUPLYaYx/707ada55d0152f6d4b72aa74d894a22c/icon-heart.png"},v={title:"WwwFrame/Banners/DonationBanner",component:r,args:t},n=(m,{argTypes:s})=>({props:Object.keys(s),components:{DonationBanner:r},setup(){return t},template:`
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
})`,...(a=(o=n.parameters)==null?void 0:o.docs)==null?void 0:a.source}}};const O=["Default"];export{n as Default,O as __namedExportsOrder,v as default};
