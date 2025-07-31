import{K as t}from"./entry-KvTooltip-DX-jfSdei2.js";import{K as m}from"./entry-KvIcon-f0biGstwRH.js";import"./iframe-Dd418KK-.js";import"./entry-touchEvents-DzV-rvy7P4.js";import"./entry-vue.esm-bundler-D5m7h15tzB.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvSecondaryNav-DV-NXuJ8zv.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index-DzTqzqs3pZ.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-KvThemeProvider-vvx232kLOD.js";const w={title:"Kv/KvTooltip",component:t},o=()=>({components:{KvTooltip:t},template:`
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
