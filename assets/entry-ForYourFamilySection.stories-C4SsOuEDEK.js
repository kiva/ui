import{q as N,c as r,a as t,F as O,r as V,I as j,o as a,t as u,g as D,u as s,b as T,f as I,e as R,j as U}from"./entry-vue.esm-bundler-DN41AgNdM7.js";import{y as W}from"./entry-KvButton-BtWM7FaLlj.js";import{_ as M}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-KvLoadingSpinner-BoGXwWqv66.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";const E=""+new URL("birthday-candles-CFx0dht5.jpg",import.meta.url).href,H=""+new URL("hands-heart-CVWPEnuZ.svg",import.meta.url).href,A=""+new URL("person-catherine-5G9cIjgn.svg",import.meta.url).href,G=""+new URL("person-ana-julia-DIzDJkTf.svg",import.meta.url).href,J=""+new URL("person-aman-Cnt1jPgs.svg",import.meta.url).href,K={class:"tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-2 lg:tw-gap-4"},P={class:"tw-flex tw-flex-col tw-gap-1.5 tw-text-center tw-text-action-highlight"},q={class:"tw-text-title"},z={key:0,class:"tw-text-base"},Z={class:"tw-grow tw-flex tw-items-center tw-justify-center tw-w-full"},$=["src"],Q={key:1,class:"illustration"},X=["src"],ee={key:2,class:"illustration people"},te=["src"],ae=["src"],re=["src"],C=Object.assign({name:"ForYourFamilySection"},{__name:"ForYourFamilySection",props:{bdayCardName:{type:String,default:""},bdayCardLinkOverride:{type:String,default:""},lendLinkOverride:{type:String,default:""},impactLinkOverride:{type:String,default:""},hideBdayCard:{type:Boolean,default:!1}},setup(m){const n=m,Y=N(()=>[!n.hideBdayCard&&{key:"birthday",title:n.bdayCardName?`Happy birthday ${n.bdayCardName}!`:"Happy birthday!",body:"You have funds ready to lend.",ctaText:"Get started",href:n.bdayCardLinkOverride||"/lend",variant:"primary",trackingLabel:"for-your-family-birthday"},{key:"family",title:"Involve the whole family.",body:"Discuss how the borrower’s life differs from yours.",ctaText:"Browse loans",href:n.lendLinkOverride||"/lend",variant:"secondary",trackingLabel:"for-your-family-browse-loans"},{key:"impact",title:"See who you helped anytime.",ctaText:"View your impact",href:n.impactLinkOverride||"/portfolio",variant:"secondary",trackingLabel:"for-your-family-view-impact"}].filter(Boolean));return(ne,p)=>{const B=j("kv-track-event");return a(),r("section",null,[p[0]||(p[0]=t("h2",{class:"tw-text-primary tw-mb-2 !tw-text-title"}," For your family ",-1)),t("div",K,[(a(!0),r(O,null,V(Y.value,e=>(a(),r("div",{key:e.key,class:"tw-bg-white tw-rounded tw-shadow tw-p-2 tw-flex tw-flex-col tw-gap-2 tw-items-center"},[t("div",P,[t("h3",q,u(e.title),1),e.body?(a(),r("p",z,u(e.body),1)):D("",!0)]),t("div",Z,[e.key==="birthday"?(a(),r("img",{key:0,src:s(E),alt:"Lit birthday candles on a cake",class:"tw-w-full tw-rounded-md tw-object-cover birthday-photo"},null,8,$)):e.key==="family"?(a(),r("div",Q,[t("img",{src:s(H),alt:""},null,8,X)])):(a(),r("div",ee,[t("img",{src:s(A),alt:"",class:"person catherine"},null,8,te),t("img",{src:s(G),alt:"",class:"person ana-julia"},null,8,ae),t("img",{src:s(J),alt:"",class:"person aman"},null,8,re)]))]),T((a(),I(s(W),{href:e.href,variant:e.variant,class:"tw-w-full"},{default:R(()=>[U(u(e.ctaText),1)],void 0),_:2},1032,["href","variant"])),[[B,["portfolio","click",e.trackingLabel]]])]))),128))])])}}}),L=M(C,[["__scopeId","data-v-377314c8"]]);C.__docgenInfo={name:"ForYourFamilySection",exportName:"default",displayName:"ForYourFamilySection",description:"",tags:{},props:[{name:"bdayCardName",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"bdayCardLinkOverride",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"lendLinkOverride",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"impactLinkOverride",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"hideBdayCard",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/MyKiva/ForYourFamilySection.vue"]};const de={title:"MyKiva/ForYourFamilySection",component:L,parameters:{layout:"fullscreen",chromatic:{viewports:[414,834,1440]}}},d=m=>({components:{ForYourFamilySection:L},setup(){return{args:m}},template:`
        <div class="tw-bg-eco-green-1 tw-p-2 md:tw-p-4">
            <div class="tw-mx-auto" style="max-width: 1073px;">
                <ForYourFamilySection v-bind="args" />
            </div>
        </div>
    `}),c=d.bind({}),o=d.bind({});o.args={bdayCardName:"Tanya"};const i=d.bind({});i.args={hideBdayCard:!0};const l=d.bind({});l.parameters={viewport:{defaultViewport:"mobile1"}};var y,w,v;c.parameters={...c.parameters,docs:{...(y=c.parameters)==null?void 0:y.docs,source:{originalSource:`args => ({
  components: {
    ForYourFamilySection
  },
  setup() {
    return {
      args
    };
  },
  template: \`
        <div class="tw-bg-eco-green-1 tw-p-2 md:tw-p-4">
            <div class="tw-mx-auto" style="max-width: 1073px;">
                <ForYourFamilySection v-bind="args" />
            </div>
        </div>
    \`
})`,...(v=(w=c.parameters)==null?void 0:w.docs)==null?void 0:v.source}}};var f,g,h;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`args => ({
  components: {
    ForYourFamilySection
  },
  setup() {
    return {
      args
    };
  },
  template: \`
        <div class="tw-bg-eco-green-1 tw-p-2 md:tw-p-4">
            <div class="tw-mx-auto" style="max-width: 1073px;">
                <ForYourFamilySection v-bind="args" />
            </div>
        </div>
    \`
})`,...(h=(g=o.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var b,_,F;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`args => ({
  components: {
    ForYourFamilySection
  },
  setup() {
    return {
      args
    };
  },
  template: \`
        <div class="tw-bg-eco-green-1 tw-p-2 md:tw-p-4">
            <div class="tw-mx-auto" style="max-width: 1073px;">
                <ForYourFamilySection v-bind="args" />
            </div>
        </div>
    \`
})`,...(F=(_=i.parameters)==null?void 0:_.docs)==null?void 0:F.source}}};var x,k,S;l.parameters={...l.parameters,docs:{...(x=l.parameters)==null?void 0:x.docs,source:{originalSource:`args => ({
  components: {
    ForYourFamilySection
  },
  setup() {
    return {
      args
    };
  },
  template: \`
        <div class="tw-bg-eco-green-1 tw-p-2 md:tw-p-4">
            <div class="tw-mx-auto" style="max-width: 1073px;">
                <ForYourFamilySection v-bind="args" />
            </div>
        </div>
    \`
})`,...(S=(k=l.parameters)==null?void 0:k.docs)==null?void 0:S.source}}};const me=["Default","WithName","WithoutBirthdayCard","Mobile"];export{c as Default,l as Mobile,o as WithName,i as WithoutBirthdayCard,me as __namedExportsOrder,de as default};
