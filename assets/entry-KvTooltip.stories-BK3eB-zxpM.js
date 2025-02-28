import{K as t}from"./entry-KvTooltip-kukFDi3N3O.js";import{K as m}from"./entry-KvIcon-tDC1KD03tU.js";import"./iframe-DwWGQ_M3.js";import"../sb-preview/runtime.js";import"./entry-touchEvents-D1_bE1maXx.js";import"./entry-vue.esm-bundler-CTwdbZZHjD.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvWideLoanCard-CbH2sjp8GX.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-KvThemeProvider-mmG8D6Zeen.js";const w={title:"Kv/KvTooltip",component:t},o=()=>({components:{KvTooltip:t},template:`
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
    `}),e=()=>({components:{KvTooltip:t,KvIcon:m},template:`
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
    `});var n,i,a;o.parameters={...o.parameters,docs:{...(n=o.parameters)==null?void 0:n.docs,source:{originalSource:`() => ({
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
})`,...(s=(l=e.parameters)==null?void 0:l.docs)==null?void 0:s.source}}};const K=["Default","QuestionMarkIcon"];export{o as Default,e as QuestionMarkIcon,K as __namedExportsOrder,w as default};
