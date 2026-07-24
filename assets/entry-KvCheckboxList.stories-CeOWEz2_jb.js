import{c as o,a as E,t as f,g as N,F as B,r as F,h as O,o as c,d as T,e as q,j}from"./entry-vue.esm-bundler-B52OYB4W0G.js";import"./entry-KvWwwHeaderBasic-DOcfaa650D.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import{E as I}from"./entry-KvCheckbox--NpmJsMEAD.js";import"./entry-numeral-xVHG5DEP0A.js";import{_ as U}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-BW8Ws25b.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-index.browser-vcSNLBTfP4.js";const K={name:"KvCheckboxList",components:{KvCheckbox:I},emits:["updated"],props:{showSelectAll:{type:Boolean,default:!1},items:{type:Array,required:!0},selectedValues:{type:Array,default:()=>[]}},data(){return{selected:this.selectedValues}},computed:{isAllSelected(){return this.items.every(t=>this.selected.includes(t.value))}},methods:{toggleSelectAll(){const t=this.isAllSelected,e=[...this.selected];this.items.forEach(s=>{const m=e.indexOf(s.value),a=m!==-1;t?a&&e.splice(m,1):a||e.push(s.value)}),this.selected=e,this.updateSelected(e,void 0,!0)},updateSelected(t,e,s){this.$emit("updated",{values:[...t],changed:e,wasSelectAll:s})}},watch:{selectedValues(t){[...t].sort().toString()!==[...this.selected].sort().toString()&&(this.selected=t)}}},W={class:"tw-flex tw-flex-col tw-gap-1.5 tw-my-.5 tw-mb-1"},$={key:0};function z(t,e,s,m,a,p){const L=O("kv-checkbox");return c(),o("menu",W,[s.showSelectAll?(c(),o("li",$,[E("button",{class:"tw-text-link",onClick:e[0]||(e[0]=l=>p.toggleSelectAll())},f(p.isAllSelected?"Deselect":"Select")+" all ",1)])):N("",!0),(c(!0),o(B,null,F(s.items,(l,D)=>(c(),o("li",{key:D},[T(L,{value:l.value,disabled:l.disabled,modelValue:a.selected,"onUpdate:modelValue":e[1]||(e[1]=h=>a.selected=h),onChange:h=>p.updateSelected(h,l.value)},{default:q(()=>[j(f(l.title),1)],void 0),_:2},1032,["value","disabled","modelValue","onChange"])]))),128))])}const G=U(K,[["render",z]]);K.__docgenInfo={displayName:"KvCheckboxList",exportName:"default",description:"",tags:{},props:[{name:"showSelectAll",description:"Whether to show the select/deselect all link",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"items",description:`The items to display in the checkbox list
Expected format: { value: 'value', title: 'title', disabled: true }`,type:{name:"array"},required:!0},{name:"selectedValues",description:"The selected values (array of strings)",type:{name:"array"},defaultValue:{func:!1,value:"[]"}}],events:[{name:"updated",type:{names:["undefined"]}}],sourceFiles:["/home/runner/work/ui/ui/src/components/Kv/KvCheckboxList.vue"]};const le={title:"Kv/Form Elements/KvCheckboxList",component:G},r=[...Array(4)].map((t,e)=>({value:`${e}`,title:`Option ${e}`})),i={args:{items:r}},n={args:{items:r,showSelectAll:!0}},d={args:{items:r,selectedValues:r.slice(0,2).map(t=>t.value)}},u={args:{items:r.map(t=>({...t,disabled:!0}))}};var v,S,g;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    items
  }
}`,...(g=(S=i.parameters)==null?void 0:S.docs)==null?void 0:g.source}}};var x,b,k;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    items,
    showSelectAll: true
  }
}`,...(k=(b=n.parameters)==null?void 0:b.docs)==null?void 0:k.source}}};var y,_,w;d.parameters={...d.parameters,docs:{...(y=d.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    items,
    selectedValues: items.slice(0, 2).map(i => i.value)
  }
}`,...(w=(_=d.parameters)==null?void 0:_.docs)==null?void 0:w.source}}};var V,A,C;u.parameters={...u.parameters,docs:{...(V=u.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    items: items.map(i => ({
      ...i,
      disabled: true
    }))
  }
}`,...(C=(A=u.parameters)==null?void 0:A.docs)==null?void 0:C.source}}};const re=["Default","ShowSelectAll","SelectedValues","Disabled"];export{i as Default,u as Disabled,d as SelectedValues,n as ShowSelectAll,re as __namedExportsOrder,le as default};
