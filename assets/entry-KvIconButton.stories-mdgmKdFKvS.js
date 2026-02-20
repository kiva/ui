import{K as p}from"./entry-KvIcon-BUhAos7YaB.js";import{_ as u}from"./entry-KvButton-C9WvITgRyG.js";import{z as v,C as d,G as f,r as h,o as k,q as t,v as o}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import{_ as b}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./iframe-Cc_r_Bkf.js";const r={name:"KvIconButton",components:{KvButton:u},props:{theme:{type:String,default:"default"}},computed:{cssVars(){return this.theme==="default"?{"--kv-left-icon-background":"rgb(var(--bg-secondary))","--kv-left-icon-color":"rgb(var(--text-primary))","--kv-left-icon-hover":"rgb(var(--bg-action))","--kv-color-hover":"rgb(var(--bg-primary))","--kv-left-icon-color-active":"var(--bg-action)"}:{}}}},g={class:"icon-btn__icon-background"},_={class:"icon-btn__icon-wrapper icon-btn__icon--left"},B={class:"icon-btn__icon-wrapper icon-btn__icon--right"};function E(e,I,w,x,y,l){const m=h("kv-button");return k(),v(m,{class:"icon-btn tw-text-h3",style:f(l.cssVars)},{default:d(()=>[t("div",g,[t("div",_,[o(e.$slots,"icon-left",{},void 0,!0)])]),t("span",null,[o(e.$slots,"default",{},void 0,!0)]),t("div",B,[o(e.$slots,"icon-right",{},void 0,!0)])],void 0),_:3},8,["style"])}const s=b(r,[["render",E],["__scopeId","data-v-0eb07088"]]);r.__docgenInfo={displayName:"KvIconButton",description:`This component is a wrapper that creates a kv-button with icons on the left and/or right and a unique kvButton style.
IT SHOULD ONLY BE USED ON THE THANKS PAGE V2 EXPERIMENT
until site-wide button styling is finalized.`,tags:{},exportName:"default",props:[{name:"theme",type:{name:"string"},defaultValue:{func:!1,value:"'default'"}}],slots:[{name:"icon-left"},{name:"default"},{name:"icon-right"}],sourceFiles:["/home/runner/work/ui/ui/src/components/Kv/KvIconButton.vue"]};const H={title:"KV/KvIconButton",component:s},n=()=>({components:{KvIconButton:s,KvIcon:p},template:`
    <div>
        <p>
         This component is a wrapper that creates a kv-button with icons on the left and/or right and a unique kvButton style.
         IT SHOULD ONLY BE USED ON THE THANKS PAGE V2 EXPERIMENT
         until site-wide button styling is finalized.
        </p>
        <kv-icon-button class="expanded">
            <template #icon-left>
                <kv-icon
                    class="share-icon"
                    name="share"
                />
            </template>
            Button
            <template #icon-right>
                <kv-icon
                    name="fat-chevron"
                    :from-sprite="true"
                />
            </template>
        </kv-icon-button>
        <kv-icon-button class="active expanded">
            <template #icon-left>
                <kv-icon
                    class="share-icon"
                    name="share"
                />
            </template>
            Button
            <template #icon-right>
                <kv-icon
                    name="fat-chevron"
                    :from-sprite="true"
                />
            </template>
        </kv-icon-button>
        <kv-icon-button class="expanded">
            <template #icon-left>
                <kv-icon
                    name="alert-circle"
                />
            </template>
            Button
            <template #icon-right>
                <kv-icon
                    name="fat-chevron"
                    :from-sprite="true"
                />
            </template>
        </kv-icon-button>
        <kv-icon-button class="active expanded">
            <template #icon-left>
                <kv-icon
                    name="alert-circle"
                />
            </template>
            Button
            <template #icon-right>
                <kv-icon
                    name="fat-chevron"
                    :from-sprite="true"
                />
            </template>
        </kv-icon-button>
        <kv-icon-button class="expanded">
            <template #icon-left>
                <kv-icon
                    name="receipt-outline"
                />
            </template>
            Button
            <template #icon-right>
                <kv-icon
                    name="fat-chevron"
                    :from-sprite="true"
                />
            </template>
        </kv-icon-button>
        <kv-icon-button class="active expanded">
            <template #icon-left>
                <kv-icon
                    name="receipt-outline"
                />
            </template>
            Button
            <template #icon-right>
                <kv-icon
                    name="fat-chevron"
                    :from-sprite="true"
                />
            </template>
        </kv-icon-button>
        <component is="style">
        // Icon sizes can be overwritten
        .share-icon {
            height: 1.15rem;
            width: 1.15rem;
        }
        </component>
    </div>
    `});var a,i,c;n.parameters={...n.parameters,docs:{...(a=n.parameters)==null?void 0:a.docs,source:{originalSource:`() => ({
  components: {
    KvIconButton,
    KvIcon
  },
  template: \`
    <div>
        <p>
         This component is a wrapper that creates a kv-button with icons on the left and/or right and a unique kvButton style.
         IT SHOULD ONLY BE USED ON THE THANKS PAGE V2 EXPERIMENT
         until site-wide button styling is finalized.
        </p>
        <kv-icon-button class="expanded">
            <template #icon-left>
                <kv-icon
                    class="share-icon"
                    name="share"
                />
            </template>
            Button
            <template #icon-right>
                <kv-icon
                    name="fat-chevron"
                    :from-sprite="true"
                />
            </template>
        </kv-icon-button>
        <kv-icon-button class="active expanded">
            <template #icon-left>
                <kv-icon
                    class="share-icon"
                    name="share"
                />
            </template>
            Button
            <template #icon-right>
                <kv-icon
                    name="fat-chevron"
                    :from-sprite="true"
                />
            </template>
        </kv-icon-button>
        <kv-icon-button class="expanded">
            <template #icon-left>
                <kv-icon
                    name="alert-circle"
                />
            </template>
            Button
            <template #icon-right>
                <kv-icon
                    name="fat-chevron"
                    :from-sprite="true"
                />
            </template>
        </kv-icon-button>
        <kv-icon-button class="active expanded">
            <template #icon-left>
                <kv-icon
                    name="alert-circle"
                />
            </template>
            Button
            <template #icon-right>
                <kv-icon
                    name="fat-chevron"
                    :from-sprite="true"
                />
            </template>
        </kv-icon-button>
        <kv-icon-button class="expanded">
            <template #icon-left>
                <kv-icon
                    name="receipt-outline"
                />
            </template>
            Button
            <template #icon-right>
                <kv-icon
                    name="fat-chevron"
                    :from-sprite="true"
                />
            </template>
        </kv-icon-button>
        <kv-icon-button class="active expanded">
            <template #icon-left>
                <kv-icon
                    name="receipt-outline"
                />
            </template>
            Button
            <template #icon-right>
                <kv-icon
                    name="fat-chevron"
                    :from-sprite="true"
                />
            </template>
        </kv-icon-button>
        <component is="style">
        // Icon sizes can be overwritten
        .share-icon {
            height: 1.15rem;
            width: 1.15rem;
        }
        </component>
    </div>
    \`
})`,...(c=(i=n.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};const D=["Default"];export{n as Default,D as __namedExportsOrder,H as default};
