import{n as c}from"./entry-index.browser-vcSNLBTfP4.js";import{v as K,b as m,d as k,x as V,o as f,c as v,e as t,z as _,H as C,L as N,n as d,h as B,g as x,M as D}from"./entry-vue.esm-bundler-gh2KZVgkoT.js";import{u as L}from"./entry-chunk-3HK4G4NT-BNowqM5Bqg.js";import{_ as z}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const b=["change","update:modelValue"],g={inheritAttrs:!1,model:{prop:"modelValue",event:"update:modelValue"},props:{value:{type:[String,Number,Boolean],required:!0},disabled:{type:Boolean,default:!1},name:{type:String,default:""},checked:{type:[String,Number,Boolean],default:!1},modelValue:{type:[String,Number,Boolean],default:!1}},emits:b,setup(l,o){const{emit:a}=o,{value:e,checked:r,modelValue:s}=K(l),n=m(`kvr-${c(10)}`),i=m(null),{classes:p,styles:h,inputAttrs:w,inputListeners:y}=L(o,b),R=k(()=>typeof s.value==typeof e.value?s.value===e.value:!!r.value);return V(()=>{n.value=`kvr-${c(10)}`}),{uuid:n,isChecked:R,radioRef:i,onChange:u=>{a("change",u.target.value),a("update:modelValue",u.target.value)},focus:()=>i.focus(),blur:()=>i.blur(),classes:p,styles:h,inputAttrs:w,inputListeners:y}}},S=["for"],M=["id","checked","name","value","disabled"],A={key:0,class:"tw-rounded-full tw-bg-action",style:{width:"0.75rem",height:"0.75rem"}},E={class:"tw-flex-1 peer-focus-visible:tw-ring-2 peer-focus-visible:tw-ring-action"};function G(l,o,a,e,r,s){return f(),v("div",{class:d(e.classes),style:D(e.styles)},[t("label",{class:d(["tw-inline-flex tw-items-center tw-align-middle",{"tw-opacity-low":a.disabled}]),for:e.uuid},[t("input",_(e.inputAttrs,{id:e.uuid,ref:"radioRef",class:"tw-peer tw-appearance-none tw-w-max",type:"radio",checked:e.isChecked,name:a.name,value:a.value,disabled:a.disabled},N(e.inputListeners,!0),{onChange:o[0]||(o[0]=C((...n)=>e.onChange&&e.onChange(...n),["prevent"]))}),null,16,M),t("div",{class:d(["tw-w-3 tw-h-3 tw-mr-2 tw-rounded-full tw-border tw-flex-shrink-0 tw-overflow-hidden tw-flex tw-justify-center tw-items-center tw-transition-all tw-duration-100 peer-focus-visible:tw-ring-2 peer-focus-visible:tw-ring-action",{"tw-border-secondary":!e.isChecked,"tw-border-action":e.isChecked}])},[e.isChecked?(f(),v("div",A)):B("",!0)],2),t("div",E,[x(l.$slots,"default")])],10,S)],6)}const T=z(g,[["render",G]]);g.__docgenInfo={description:'Use as you would an `<input type="radio" />`. Ensure you\'re using a fieldset and legend for a11y.',tags:{usage:[{description:`\`\`\`
<fieldset>
  <legend>Choose an item</legend>
  <KvRadio value="foo" v-model="someDataValue">Label for foo</KvRadio>
  <KvRadio value="bar" v-model="someDataValue">Label for bar</KvRadio>
  <KvRadio value="baz" v-model="someDataValue">Label for baz</KvRadio>
</fieldset>

or

<fieldset>
  <legend>Choose an item</legend>
  <KvRadio value="foo" name="myGroupName" @change="(val) => someDataValue = val" :checked="someDataValue === 'foo'" />Label for foo</KvRadio>
  <KvRadio value="bar" name="myGroupName" @change="(val) => someDataValue = val" :checked="someDataValue === 'bar'" />Label for bar</KvRadio>
  <KvRadio value="baz" name="myGroupName" @change="(val) => someDataValue = val" :checked="someDataValue === 'baz'" />Label for baz</KvRadio>
</fieldset>
\`\`\``,title:"usage"}]},exportName:"default",displayName:"KvRadio",props:[{name:"value",description:"Value of the input",type:{name:"string|number|boolean"},required:!0},{name:"disabled",description:"Prevents the radio from being toggled or focused",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"name",description:`Native name attribute. Used to group radios if you're not using v-model. E.g.,
\`\`\`
 <KvRadio name="cats">Tabby</KvRadio>
 <KvRadio name="cats">Siamese</KvRadio>
 <KvRadio name="dogs">Husky</KvRadio>
 <KvRadio name="dogs">Boxer</KvRadio>
\`\`\``,type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"checked",description:'Native checked attribute. Used to select the radio if you\'re not using v-model E.g.,\n```\n <KvRadio value="foo" :checked="myModel === foo">Foo</KvRadio>\n <KvRadio value="bar" :checked="myModel === bar">Bar</KvRadio>\n```',type:{name:"string|number|boolean"},defaultValue:{func:!1,value:"false"}},{name:"v-model",type:{name:"string|number|boolean"},defaultValue:{func:!1,value:"false"}}],slots:[{name:"default"}],sourceFiles:["/home/runner/work/ui/ui/node_modules/@kiva/kv-components/dist/components/KvRadio.vue"]};export{T as K};
