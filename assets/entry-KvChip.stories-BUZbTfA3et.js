import{K as d}from"./entry-KvIcon-BUhAos7YaB.js";import{c as u,q as n,L as k,a as _,r as v,o as C}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import{_ as f}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./iframe-Cc_r_Bkf.js";const l={name:"KvChip",components:{KvIcon:d},emits:["click-chip"],props:{title:{type:String,required:!0}},methods:{handleClick(){this.$emit("click-chip")}}},g={class:"filter-chip-container"},K={class:"filter-title tw-text-small"},y={class:"filter-close-button-container"};function x(i,e,p,N,q,s){const m=v("kv-icon");return C(),u("div",g,[n("button",{onClick:e[0]||(e[0]=(...h)=>s.handleClick&&s.handleClick(...h)),class:"filter-chip"},[n("div",K,k(p.title),1),n("div",y,[_(m,{name:"small-x",class:"filter-close-button","from-sprite":!0})])])])}const a=f(l,[["render",x],["__scopeId","data-v-bff8a431"]]);l.__docgenInfo={displayName:"KvChip",exportName:"default",description:"",tags:{},props:[{name:"title",type:{name:"string"},required:!0}],events:[{name:"click-chip"}],sourceFiles:["/home/runner/work/ui/ui/src/components/Kv/KvChip.vue"]};const b={title:"Chip Title"},S={title:"Kv/KvChip",component:a,args:b},t=(i,{argTypes:e})=>({props:Object.keys(e),components:{KvChip:a},methods:{handleClickChip(){console.log("click chip")}},setup(){return i},template:`
        <kv-chip
            :title="title"
            @click-chip="handleClickChip"
        />
    `});var c,o,r;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    KvChip
  },
  methods: {
    handleClickChip() {
      console.log('click chip');
    }
  },
  setup() {
    return args;
  },
  template: \`
        <kv-chip
            :title="title"
            @click-chip="handleClickChip"
        />
    \`
})`,...(r=(o=t.parameters)==null?void 0:o.docs)==null?void 0:r.source}}};const T=["Default"];export{t as Default,T as __namedExportsOrder,S as default};
