import{m as M,a as $,r as V,u as P}from"./entry-index-C6hFcg-rEP.js";import{K as O}from"./entry-KvCurrencyInput-7U5c7OVo1k.js";import{c as u,m as r,J as T,I as q,L as c,A as i,r as N,o as l,D as I,q as k,a as v,Z as R,C as U,T as D}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import{_ as E}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-KvWwwHeader-C1bm1YMh4q.js";import"./entry-index-CWclSTHHJk.js";import"./entry-KvTextInput-CnVgGp-sYq.js";import"./entry-mdi-B1ONwcTkQ2.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-KvMaterialIcon-C3KLX5OV-L.js";const _={name:"MultiAmountSelector",components:{KvCurrencyInput:O},emits:["pill-toggled","custom-amount-updated"],props:{id:{type:String,required:!0},options:{type:Array,required:!0,default(){return[{title:"",key:"",disabled:!1}]}},selected:{type:String,default:""},splitPills:{type:Boolean,default:!1},customAmount:{type:Number,default:25},minCustomAmount:{type:Number,default:25},maxCustomAmount:{type:Number,default:1e4}},data(){return{checked:this.selected,customAmountModel:this.customAmount}},setup(){return{v$:P()}},validations(){return{customAmountModel:{required:V,minValue:$(this.minCustomAmount),maxValue:M(this.maxCustomAmount)}}},watch:{customAmount(t,n){t!==n&&(this.customAmountModel=t)},customAmountModel(t){this.$emit("custom-amount-updated",t)},selected(t,n){t==="custom"&&this.$nextTick(()=>{try{this.$refs[`${this.id}-kvCurrencyRef`][0].$refs.kvCurrencyInputRef.focus()}catch{}}),t!=="custom"&&this.v$.$invalid&&(this.customAmountModel=this.minCustomAmount),t!=="custom"&&t!==n&&(this.checked=t)}},methods:{onChange(t){this.$emit("pill-toggled",t)}}},B=["id","disabled","value","onChange"],F=["for"],j={key:0,class:"custom-amount-holder"},K={key:0,class:"validation-errors"},L={key:0};function z(t,n,e,a,s,x){var p,f,y,h;const S=N("kv-currency-input");return l(),u("div",{class:i({"kv-pill-toggle":!0,"split-pills":e.splitPills})},[(l(!0),u(T,null,q(e.options,o=>(l(),u("div",{key:o.key,class:i({pill:!0,"split-pill":e.splitPills})},[I(k("input",{class:"radio",type:"radio",id:`${e.id}-${o.key}`,disabled:o.disabled,value:o.key,"onUpdate:modelValue":n[0]||(n[0]=m=>s.checked=m),onChange:m=>x.onChange(o.key)},null,40,B),[[R,s.checked]]),k("label",{class:i({label:!0,"split-pill-label":e.splitPills}),for:`${e.id}-${o.key}`},c(o.title),11,F),v(D,{name:"kvfade"},{default:U(()=>[e.selected==="custom"&&o.key==="custom"?(l(),u("div",j,[v(S,{id:`${e.id}-custom-amount-input`,ref_for:!0,ref:`${e.id}-kvCurrencyRef`,class:i(["input-element",{"custom-input-element":!0,error:a.v$.$invalid}]),modelValue:s.customAmountModel,"onUpdate:modelValue":n[1]||(n[1]=m=>s.customAmountModel=m),"aria-disabled":!e.selected==="custom",disabled:!e.selected==="custom"},null,8,["id","class","modelValue","aria-disabled","disabled"])])):r("",!0)],void 0),_:2},1024)],2))),128)),a.v$.$invalid?(l(),u("ul",K,[(f=(p=a.v$.customAmountModel)==null?void 0:p.minValue)!=null&&f.$invalid||(h=(y=a.v$.customAmountModel)==null?void 0:y.maxValue)!=null&&h.$invalid?(l(),u("li",L," Enter an amount of $"+c(e.minCustomAmount)+"–$"+c(e.maxCustomAmount),1)):r("",!0)])):r("",!0)],2)}const b=E(_,[["render",z],["__scopeId","data-v-13a0f20b"]]);_.__docgenInfo={displayName:"MultiAmountSelector",exportName:"default",description:"",tags:{},props:[{name:"id",type:{name:"string"},required:!0},{name:"options",type:{name:"array"},required:!0,defaultValue:{func:!1,value:`[
    {
        title: '',
        key: '',
        disabled: false
    }
]`}},{name:"selected",description:"A key from options array you want to be selected",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"splitPills",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"customAmount",type:{name:"number"},defaultValue:{func:!1,value:"25"}},{name:"minCustomAmount",type:{name:"number"},defaultValue:{func:!1,value:"25"}},{name:"maxCustomAmount",type:{name:"number"},defaultValue:{func:!1,value:"10000"}}],events:[{name:"pill-toggled",type:{names:["undefined"]}},{name:"custom-amount-updated",type:{names:["undefined"]}}],sourceFiles:["/home/runner/work/ui/ui/src/components/Forms/MultiAmountSelector.vue"]};const oe={title:"Forms/MultiAmountSelector",component:b,args:{minCustomAmount:5,maxCustomAmount:1e3}},d=(t,{argTypes:n})=>({components:{MultiAmountSelector:b},data(){return{amountOptions:[{title:"$5",key:"5"},{title:"$10",key:"10"},{title:"$25",key:"25"},{title:"$50",key:"50"},{title:"Other",key:"custom"}],amountSelected:"25"}},props:Object.keys(n),template:`
        <multi-amount-selector
            id="amount-selector"
            :options="amountOptions"
            :selected="amountSelected"
            @pill-toggled="handlePillToggled"
            :min-custom-amount="minCustomAmount"
            :max-custom-amount="maxCustomAmount"
            @custom-amount-updated="handleCustomAmountUpdated"
            :split-pills="true"
            :custom-amount="25"
        />
    `,methods:{handlePillToggled(e){e==="custom"?this.amountSelected="custom":this.amountSelected=e},handleCustomAmountUpdated(e){}}});var A,g,C;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  components: {
    MultiAmountSelector
  },
  data() {
    return {
      amountOptions: [{
        title: '$5',
        key: '5'
      }, {
        title: '$10',
        key: '10'
      }, {
        title: '$25',
        key: '25'
      }, {
        title: '$50',
        key: '50'
      }, {
        title: 'Other',
        key: 'custom'
      }],
      amountSelected: '25'
    };
  },
  props: Object.keys(argTypes),
  template: \`
        <multi-amount-selector
            id="amount-selector"
            :options="amountOptions"
            :selected="amountSelected"
            @pill-toggled="handlePillToggled"
            :min-custom-amount="minCustomAmount"
            :max-custom-amount="maxCustomAmount"
            @custom-amount-updated="handleCustomAmountUpdated"
            :split-pills="true"
            :custom-amount="25"
        />
    \`,
  methods: {
    // Implementation Required in Parent Component
    // Enables tracking of selected option/key
    handlePillToggled(value) {
      if (value === 'custom') {
        this.amountSelected = 'custom';
      } else {
        this.amountSelected = value;
      }
    },
    // Implementation Required in Parent Component
    // Enables tracking of selected option/key associated value
    handleCustomAmountUpdated(value) {}
  }
})`,...(C=(g=d.parameters)==null?void 0:g.docs)==null?void 0:C.source}}};const ue=["Default"];export{d as Default,ue as __namedExportsOrder,oe as default};
