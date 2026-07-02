import{C as i}from"./entry-ContentLightbox-DfYxePwSr9.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-index-CWclSTHHJk.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";import"./entry-KvLightbox-U4ePI2uz4l.js";import"./entry-printing-BgJfHmTIjg.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const w={title:"Components/BorrowerProfile/ContentLightbox",component:i},r={title:"Why is this borrower anonymous?",content:"<p>To protect this borrower's privacy, identifying details have been removed from their profile.</p>"},t=()=>({components:{ContentLightbox:i},data:()=>({solution:r}),template:`
        <div>
            <button
                type="button"
                class="tw-text-action hover:tw-text-action-highlight tw-underline"
                @click="$refs.lightbox.open(solution)"
            >
                Open content lightbox
            </button>
            <content-lightbox ref="lightbox" />
        </div>
    `});var o,n,e;t.parameters={...t.parameters,docs:{...(o=t.parameters)==null?void 0:o.docs,source:{originalSource:`() => ({
  components: {
    ContentLightbox
  },
  data: () => ({
    solution
  }),
  template: \`
        <div>
            <button
                type="button"
                class="tw-text-action hover:tw-text-action-highlight tw-underline"
                @click="$refs.lightbox.open(solution)"
            >
                Open content lightbox
            </button>
            <content-lightbox ref="lightbox" />
        </div>
    \`
})`,...(e=(n=t.parameters)==null?void 0:n.docs)==null?void 0:e.source}}};const y=["Default"];export{t as Default,y as __namedExportsOrder,w as default};
