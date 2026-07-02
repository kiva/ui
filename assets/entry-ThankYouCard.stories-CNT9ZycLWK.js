import{q as p,x as k}from"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-numeral-xVHG5DEP0A.js";import{T as o}from"./entry-ThankYouCard-4emcLl3BB5.js";import{a as s}from"./entry-apollo-story-mixin-8ULRtAv_Ha.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const z={title:"MyKiva/ThankYouCard",component:o},y=(t={})=>{const e=(v,{argTypes:x})=>({props:Object.keys(x),components:{ThankYouCard:o,KvMaterialIcon:k,mdiEmailOutline:p},mixins:[s()],setup(){return{args:t}},data(){return{mdiEmailOutline:p}},template:`
            <div style="width: 336px; height: 362px;">
                <ThankYouCard v-bind="args">
                    <template #header>
                        <span
                            class="tw-inline-flex tw-items-center tw-gap-1 tw-rounded-md tw-bg-eco-green-1 tw-px-1.5 tw-py-0.5"
                        >
                            <KvMaterialIcon
                                class="tw-w-2 tw-h-2 tw-shrink-0"
                                :icon="mdiEmailOutline"
                            />
                            <span class="tw-text-primary tw-font-medium tw-align-middle" style="font-size: 0.875rem;">
                                Email updates
                            </span>
                        </span>
                    </template>
                    <template #content>
                        <span>We’ll keep you updated. Change your <a
                            href="/settings/email"
                            target="_blank"
                            v-kv-track-event="['portfolio', 'click', 'email-preferences-settings']"
                        >email preferences</a> at any time.</span>
                    </template>
                </ThankYouCard>
            </div>
        `});return e.args=t,e},n=y({}),a=(t,{argTypes:e})=>({props:Object.keys(e),components:{ThankYouCard:o},mixins:[s()],setup(){return{args}},template:`
        <div style="width: 336px; height: 362px;">
            <ThankYouCard>
                <template #header>
                    <h3 class="tw-text-center tw-m-0 tw-text-action-highlight">Achievement Unlocked!</h3>
                </template>
                <template #content>
                    <p>
                        You've supported 10 borrowers this year!
                    </p>
                </template>
            </ThankYouCard>
        </div>
    `}),r=(t,{argTypes:e})=>({props:Object.keys(e),components:{ThankYouCard:o},mixins:[s()],setup(){return{args}},template:`
            <div style="width: 336px; height: 362px;">
                <ThankYouCard>
                    <template #header>
                        <h3 class="tw-text-center tw-m-0">Amazing work!</h3>
                    </template>
                    <template #content>
                        <p>
                            Your generous loan of $25 will help Maria expand her business
                            and provide for her family. Together, we're building a better future.
                        </p>
                    </template>
                </ThankYouCard>
            </div>
        `});var i,m,l;n.parameters={...n.parameters,docs:{...(i=n.parameters)==null?void 0:i.docs,source:{originalSource:"story({})",...(l=(m=n.parameters)==null?void 0:m.docs)==null?void 0:l.source}}};var d,h,c;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`(_args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    ThankYouCard
  },
  mixins: [apolloStoryMixin()],
  setup() {
    return {
      args
    };
  },
  template: \`
        <div style="width: 336px; height: 362px;">
            <ThankYouCard>
                <template #header>
                    <h3 class="tw-text-center tw-m-0 tw-text-action-highlight">Achievement Unlocked!</h3>
                </template>
                <template #content>
                    <p>
                        You've supported 10 borrowers this year!
                    </p>
                </template>
            </ThankYouCard>
        </div>
    \`
})`,...(c=(h=a.parameters)==null?void 0:h.docs)==null?void 0:c.source}}};var u,g,w;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`(_args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    ThankYouCard
  },
  mixins: [apolloStoryMixin()],
  setup() {
    return {
      args
    };
  },
  template: \`
            <div style="width: 336px; height: 362px;">
                <ThankYouCard>
                    <template #header>
                        <h3 class="tw-text-center tw-m-0">Amazing work!</h3>
                    </template>
                    <template #content>
                        <p>
                            Your generous loan of $25 will help Maria expand her business
                            and provide for her family. Together, we're building a better future.
                        </p>
                    </template>
                </ThankYouCard>
            </div>
        \`
})`,...(w=(g=r.parameters)==null?void 0:g.docs)==null?void 0:w.source}}};const K=["Default","WithCustomHeader","WithLongContent"];export{n as Default,a as WithCustomHeader,r as WithLongContent,K as __namedExportsOrder,z as default};
