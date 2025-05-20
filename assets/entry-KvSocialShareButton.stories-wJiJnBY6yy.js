import{K as r}from"./entry-KvSocialShareButton-BwBx66kccw.js";import{a as i}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-KvMaterialIcon-zoO3pT-PAH.js";import"./entry-vue.esm-bundler-Q9GDM36OM6.js";import"./entry-KvWideLoanCard-BcPVF-r37T.js";import"./entry-numeral-CMfb424cHV.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-social-sharing-mixin-JaHpp-TIBg.js";import"./entry-urlUtils-BR6y7F2aaq.js";import"./entry-KvButton-UOIg3lzKaw.js";import"./entry-KvLoadingSpinner-C-UVvwKT3n.js";import"./entry-KvLightbox-CN_cjNV9Yz.js";import"./entry-bluesky-CD_Q14_qw-.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const o={modalTitle:"This is the share modal title",shareMessage:"Kiva is an easy way to make a real difference in someone's life.",shareUrl:"/test",variant:"caution",utmCampaign:"social_share_campaign",utmContent:"testuser123"},_={title:"Kv/KvSocialShareButton",component:r,args:o,argTypes:{variant:{control:{type:"select",options:["primary","secondary","link","ghost","danger","caution"]}}}},t=(m,{argTypes:s})=>({props:Object.keys(s),components:{KvSocialShareButton:r},mixins:[i()],setup(){return o},template:`
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
