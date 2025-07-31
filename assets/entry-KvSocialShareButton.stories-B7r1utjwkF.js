import{K as r}from"./entry-KvSocialShareButton-B0B1ucs8bf.js";import{a as i}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-mdi-BWfL41h-RO.js";import"./entry-social-sharing-mixin-mcFPgMmQne.js";import"./entry-urlUtils-D59-4GikCB.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-D5m7h15tzB.js";import"./entry-KvMaterialIcon-9bv_WqKuLB.js";import"./entry-KvSecondaryNav-DV-NXuJ8zv.js";import"./entry-index-DzTqzqs3pZ.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-KvButton-CulXsqVgAr.js";import"./entry-KvLoadingSpinner-CrA8NiVSUP.js";import"./entry-KvLightbox-CNC-1Q3TKi.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const o={modalTitle:"This is the share modal title",shareMessage:"Kiva is an easy way to make a real difference in someone's life.",shareUrl:"/test",variant:"caution",utmCampaign:"social_share_campaign",utmContent:"testuser123"},b={title:"Kv/KvSocialShareButton",component:r,args:o,argTypes:{variant:{control:{type:"select",options:["primary","secondary","link","ghost","danger","caution"]}}}},t=(m,{argTypes:s})=>({props:Object.keys(s),components:{KvSocialShareButton:r},mixins:[i()],setup(){return o},template:`
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
})`,...(n=(e=t.parameters)==null?void 0:e.docs)==null?void 0:n.source}}};const x=["Default"];export{t as Default,x as __namedExportsOrder,b as default};
