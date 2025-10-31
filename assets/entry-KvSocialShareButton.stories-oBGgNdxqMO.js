import{K as r}from"./entry-KvSocialShareButton-7rHfWlFtkv.js";import{a as i}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-mdi-BJHOrBfjV3.js";import"./entry-social-sharing-mixin-mcFPgMmQne.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-Bf_Yeyugwo.js";import"./entry-KvMaterialIcon-DcajXwg-0j.js";import"./entry-KvWwwHeader-CVdIzOPj6Q.js";import"./entry-numeral-DJCTM12wUX.js";import"./entry-KvButton-DF0Vhz1EWA.js";import"./entry-KvLoadingSpinner-D0IZcQeh_0.js";import"./entry-KvLightbox-Ccr5YlTKqp.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const o={modalTitle:"This is the share modal title",shareMessage:"Kiva is an easy way to make a real difference in someone's life.",shareUrl:"/test",variant:"caution",utmCampaign:"social_share_campaign",utmContent:"testuser123"},_={title:"Kv/KvSocialShareButton",component:r,args:o,argTypes:{variant:{control:{type:"select",options:["primary","secondary","link","ghost","danger","caution"]}}}},t=(m,{argTypes:s})=>({props:Object.keys(s),components:{KvSocialShareButton:r},mixins:[i()],setup(){return o},template:`
        <kv-social-share-button
            :modal-title="modalTitle"
            :share-message="shareMessage"
            :share-url="shareUrl"
            :variant="variant"
            :utm-campaign="utmCampaign"
            :utm-content="utmContent"
        >
            Share this thing
            <template #modal-content>
                Did you know that this fact is super fascinating? Share it with your friends!
            </template>
        </kv-social-share-button>
    `});var a,e,n;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvSocialShareButton
  },
  mixins: [apolloStoryMixin()],
  setup() {
    return args;
  },
  template: \`
        <kv-social-share-button
            :modal-title="modalTitle"
            :share-message="shareMessage"
            :share-url="shareUrl"
            :variant="variant"
            :utm-campaign="utmCampaign"
            :utm-content="utmContent"
        >
            Share this thing
            <template #modal-content>
                Did you know that this fact is super fascinating? Share it with your friends!
            </template>
        </kv-social-share-button>
    \`
})`,...(n=(e=t.parameters)==null?void 0:e.docs)==null?void 0:n.source}}};const b=["Default"];export{t as Default,b as __namedExportsOrder,_ as default};
