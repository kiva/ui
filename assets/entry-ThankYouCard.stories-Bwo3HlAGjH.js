import{F as d}from"./entry-mdi-CxS5kPhO5v.js";import{c as _,e as a,g as l,a as T,u as b,o as C}from"./entry-vue.esm-bundler-BthIfLPEGH.js";import{w as Y}from"./entry-KvMaterialIcon-DjW6IUJXeQ.js";import"./entry-KvWwwHeader-COss86YtUr.js";import"./entry-numeral-DJCTM12wUX.js";import{T as M}from"./entry-thumbs-up-Di9UhQH0u4.js";import{_ as O}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{a as i}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";const S={class:"card-container tw-h-full goal-card-bg"},j={class:"card-header tw-py-0"},E={class:"card-body tw-text-center tw-text-base tw-pt-4 tw-pb-2"},W={class:"card-footer tw-py-0 tw-text-center tw-mx-auto tw-mb-2"},f={__name:"ThankYouCard",setup(t){return(e,p)=>(C(),_("div",S,[a("div",j,[l(e.$slots,"header",{},void 0,!0)]),a("div",E,[p[0]||(p[0]=a("h2",{class:"tw-pb-2"}," Thank you! ",-1)),l(e.$slots,"content",{},void 0,!0)]),a("div",W,[T(b(M),{class:"tw-w-12 tw-h-12",viewBox:"25 20 175 175"})])]))}},s=O(f,[["__scopeId","data-v-d1d21e7e"]]);f.__docgenInfo={exportName:"default",displayName:"ThankYouCard",description:"",tags:{},slots:[{name:"header"},{name:"content"}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/ThankYouCard.vue"]};const H={title:"MyKiva/ThankYouCard",component:s},A=(t={})=>{const e=(p,{argTypes:v})=>({props:Object.keys(v),components:{ThankYouCard:s,KvMaterialIcon:Y,mdiEmailOutline:d},mixins:[i()],setup(){return{args:t}},data(){return{mdiEmailOutline:d}},template:`
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
        `});return e.args=t,e},n=A({}),r=(t,{argTypes:e})=>({props:Object.keys(e),components:{ThankYouCard:s},mixins:[i()],setup(){return{args}},template:`
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
    `}),o=(t,{argTypes:e})=>({props:Object.keys(e),components:{ThankYouCard:s},mixins:[i()],setup(){return{args}},template:`
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
        `});var m,c,u;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:"story({})",...(u=(c=n.parameters)==null?void 0:c.docs)==null?void 0:u.source}}};var h,w,g;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`(_args, {
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
})`,...(g=(w=r.parameters)==null?void 0:w.docs)==null?void 0:g.source}}};var k,x,y;o.parameters={...o.parameters,docs:{...(k=o.parameters)==null?void 0:k.docs,source:{originalSource:`(_args, {
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
})`,...(y=(x=o.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};const L=["Default","WithCustomHeader","WithLongContent"];export{n as Default,r as WithCustomHeader,o as WithLongContent,L as __namedExportsOrder,H as default};
