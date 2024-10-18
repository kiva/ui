import{K as n}from"./entry-KvTooltip-BS8pUZ4c_u.js";import{K as m}from"./entry-KvIcon-CVvRd5jUJi.js";import"./iframe-Cewr90gv.js";import"../sb-preview/runtime.js";import"./entry-touchEvents-D1_bE1maXx.js";import"./entry-vue.esm-bundler-CCMUuEADRp.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-kivaColors-BWaQpoCddz.js";import"./entry-KvThemeProvider-C6Xje_Q2C3.js";const b={title:"Kv/KvTooltip",component:n},o=()=>({components:{KvTooltip:n},template:`
        <div>
            <button id="my-cool-btn">Hover of Focus Me!</button>
            <kv-tooltip controller="my-cool-btn">
                <template #title>
                    What is an Experimental Field Partner?
                </template>
                If a Field Partner is labeled as Experimental, this means that Kiva has
                required only a comparatively light level of due diligence and
                monitoring, in exchange for only allowing this Field Partner access to a
                small amount of funding through Kiva at any given time.
            </kv-tooltip>
        </div>
    `}),e=()=>({components:{KvTooltip:n,KvIcon:m},template:`
        <div>
            <kv-icon
                name="question"
                id="question"
                style="fill: #d8d8d8; width: 1rem;"
            />
            <kv-tooltip controller="question">
                Staying signed in enables personalized browsing and seamless lending. You may be asked again
                for your password to view account information or make withdrawals, but uncheck this option
                if you’re using a public device.
            </kv-tooltip>
        </div>
    `});var t,i,a;o.parameters={...o.parameters,docs:{...(t=o.parameters)==null?void 0:t.docs,source:{originalSource:`() => ({
  components: {
    KvTooltip
  },
  template: \`
        <div>
            <button id="my-cool-btn">Hover of Focus Me!</button>
            <kv-tooltip controller="my-cool-btn">
                <template #title>
                    What is an Experimental Field Partner?
                </template>
                If a Field Partner is labeled as Experimental, this means that Kiva has
                required only a comparatively light level of due diligence and
                monitoring, in exchange for only allowing this Field Partner access to a
                small amount of funding through Kiva at any given time.
            </kv-tooltip>
        </div>
    \`
})`,...(a=(i=o.parameters)==null?void 0:i.docs)==null?void 0:a.source}}};var r,l,s;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`() => ({
  components: {
    KvTooltip,
    KvIcon
  },
  template: \`
        <div>
            <kv-icon
                name="question"
                id="question"
                style="fill: #d8d8d8; width: 1rem;"
            />
            <kv-tooltip controller="question">
                Staying signed in enables personalized browsing and seamless lending. You may be asked again
                for your password to view account information or make withdrawals, but uncheck this option
                if you’re using a public device.
            </kv-tooltip>
        </div>
    \`
})`,...(s=(l=e.parameters)==null?void 0:l.docs)==null?void 0:s.source}}};const k=["Default","QuestionMarkIcon"];export{o as Default,e as QuestionMarkIcon,k as __namedExportsOrder,b as default};
