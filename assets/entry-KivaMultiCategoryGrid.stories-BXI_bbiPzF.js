import{N as P}from"./entry-NewHomePageLoanCard-0m07Z9Rs32.js";import{c as d,f as y,d as f,P as j,L as x,b as r,n as A,H as k,e as i,a as w,r as s,I as G,o,E as W,G as b,F as g}from"./entry-vue.esm-bundler-D5m7h15tzB.js";import"./entry-KvSecondaryNav-DRnkkPAFON.js";import{U as N}from"./entry-KvButton-D1VxatPqgB.js";import{l as O}from"./entry-KvCarousel-CEJ06n4NwB.js";import"./entry-numeral-DJCTM12wUX.js";import{_ as B}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{a as U}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as F}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{H as R,_ as $}from"./entry-KvTabs-D2_9bjjzAy.js";import{g as E}from"./entry-KvGrid-CHAaLr28WG.js";import{l as q}from"./entry-loan-data-mock-K6LggmKLGT.js";import"./entry-mdi-Jyy_kRgyKq.js";import"./entry-time-left-mixin-uDnxYTFHu3.js";import"./entry-index-BTftIkQSSB.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-xRmxT6p7Lm.js";import"./entry-index-D_23gIjsxn.js";import"./entry-BorrowerImage-CdtTc8Mupg.js";import"./entry-imageUtils-DMLkgPJKqw.js";import"./entry-SummaryTag-CS4ZIe7cIi.js";import"./entry-KvLoadingParagraph-Bz1TPjDK-6.js";import"./entry-getCacheKey-K1ze_RYMi5.js";import"./entry-KvLoadingPlaceholder-DqQtKDngqv.js";import"./entry-loanUtils-5D9a5yj3H7.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-D3xDH2SX94.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-observerUtils-DveHpw6JZJ.js";import"./entry-KvMaterialIcon-BLPGYhAoqx.js";import"./entry-KvProgressBar-DBpOwvcbud.js";import"./entry-exports-CudK1O5XNw.js";import"./entry-KvLoadingSpinner-BUbLLRkPCw.js";function z(e,t){switch(e){case 5:case 52:return"loans to women";case 96:return"COVID-19 loans";case 93:return"shelter loans";case 89:return"arts loans";case 87:return"agriculture loans";case 102:return"technology loans";case 4:return"education loans";case 25:return"health loans";case 32:return"loans to refugees and IDPs";default:return String(t).replace(/\s\[.*\]/g,"")}}const V={name:"KivaLoanCardCategory",components:{KvCarousel:O,NewHomePageLoanCard:P,KvButton:N},props:{loanIds:{type:Array,default:()=>[]},selectedChannel:{type:Object,default:()=>{}},newHomeExp:{type:Boolean,default:!1},showViewMoreCard:{type:Boolean,default:!1},showCheckBackMessage:{type:Boolean,default:!1}},data(){return{name:"",id:0,url:"",browseButtonStyle:"primary",categoryButtonStyle:"secondary",lendByCategoryUrl:"lend-by-category"}},computed:{augmentedLoanIds(){return[...this.loanIds]},cleanUrl(){const e=this.url.lastIndexOf("/"),t=this.url.slice(e);let a=String(t);return(this.url.includes("loans-with-research-backed-impact")===!0||this.url.includes("recently-viewed-loans")===!0||this.url==="")&&(a=""),this.url.includes("new-countries-for-you")?"/lend/countries-not-lent":`/lend-by-category${a}`},viewAllLoansCategoryTitle(){return`View all ${this.cleanCategoryName(this.id)}`},singleSlideWidth(){return(typeof window<"u"?window.innerWidth:1024)<414?"278px":"267px"}},watch:{selectedChannel:{handler(e){this.name=(e==null?void 0:e.name)||"",this.url=(e==null?void 0:e.url)||"",this.id=(e==null?void 0:e.id)||""},immediate:!0}},methods:{cleanCategoryName(e){return z(e,this.name)},onInteractCarousel(e){this.$kvTrackEvent("carousel","click-carousel-horizontal-scroll",e)}}},J={class:"tw-pt-4"},Q={class:"tw-w-full tw-text-center"},X={key:1,class:"tw-flex tw-items-center tw-h-full tw-w-full tw-border-action-highlight tw-rounded"},Y={class:"tw-hidden md:tw-grid md:tw-grid-cols-2 md:tw-gap-4 lg:tw-grid-cols-3"},Z={class:"tw-mt-4 tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-w-auto tw-mx-auto"};function ee(e,t,a,c,m,n){const p=s("new-home-page-loan-card"),C=s("router-link"),_=s("kv-carousel"),l=s("kv-button"),L=G("kv-track-event");return o(),d("div",J,[n.augmentedLoanIds.length>0?(o(),y(_,{key:0,id:"loan-category-carousel",class:A(["tw-w-full tw-overflow-visible md:tw-overflow-hidden",{"md:tw-hidden":a.newHomeExp}]),"embla-options":{loop:!1},ref:"categoryCarousel","multiple-slides-visible":!0,"slides-to-scroll":"visible","slide-max-width":n.singleSlideWidth,onInteractCarousel:n.onInteractCarousel},j({default:r(()=>[a.showViewMoreCard?W((o(),y(C,{key:"view-more-card",class:"tw-flex tw-items-center tw-h-full tw-w-full hover:tw-bg-action-highlight hover:tw-text-primary-inverse tw-rounded",to:n.cleanUrl},{default:r(()=>[i("div",Q,[i("h3",null,b(n.viewAllLoansCategoryTitle),1)])],void 0,!0),_:1},8,["to"])),[[L,["Lending","click-carousel-view-all-category-loans",`${n.viewAllLoansCategoryTitle}`]]]):f("",!0),a.showCheckBackMessage?(o(),d("div",X,t[0]||(t[0]=[i("div",{class:"tw-w-full tw-text-center"},[i("h3",null,"Check back later, we add new loans everyday.")],-1)]))):f("",!0)],void 0),_:2},[x(n.augmentedLoanIds,(h,u)=>({name:`slide${u}`,fn:r(()=>[w(p,{"item-index":u,"loan-id":h},null,8,["item-index","loan-id"])])}))]),1032,["class","slide-max-width","onInteractCarousel"])):f("",!0),a.newHomeExp?(o(),d(k,{key:1},[i("div",Y,[(o(!0),d(k,null,x(n.augmentedLoanIds,(h,u)=>(o(),y(p,{key:`loan-${h||u}`,"item-index":u,"loan-id":h},null,8,["item-index","loan-id"]))),128))]),i("div",Z,[w(l,{class:"tw-mx-1 tw-mb-3 tw-whitespace-nowrap",variant:m.categoryButtonStyle,to:n.cleanUrl},{default:r(()=>[g(b(n.viewAllLoansCategoryTitle),1)],void 0),_:1},8,["variant","to"]),w(l,{class:"tw-block md:tw-hidden tw-mx-1 md:tw-mb-3 tw-whitespace-nowrap",to:"/lend-by-category",variant:m.browseButtonStyle},{default:r(()=>t[1]||(t[1]=[g(" Browse all ")]),void 0),_:1,__:[1]},8,["variant"])])],64)):f("",!0)])}const D=B(V,[["render",ee],["__scopeId","data-v-d38c3373"]]);V.__docgenInfo={displayName:"KivaLoanCardCategory",exportName:"default",description:"",tags:{},props:[{name:"loanIds",type:{name:"array"},defaultValue:{func:!1,value:"[]"}},{name:"selectedChannel",type:{name:"object"},defaultValue:{func:!0,value:"() => {}"}},{name:"newHomeExp",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"showViewMoreCard",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"showCheckBackMessage",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/LoanCollections/HomeExp/KivaLoanCardCategory.vue"]};const K={name:"LoanCategorySelectorHomeExp",components:{KvButton:N,KvTab:$,KvTabs:R},data(){return{categoryBtnStyle:"vertical-tab",buttonStyle:"secondary",categoryPage:"/lend-by-category/"}},emits:["handle-category-click"],props:{loanChannels:{type:Array,default:()=>[]},selectedChannel:{type:Number,default:0}},methods:{handleCategoryClick(e){const t=(e==null?void 0:e.id)??null,a=(e==null?void 0:e.shortName)??"",c=this.$route.path==="/"?"homepage":this.$route.path.replace(/\//g,"-").replace("-","");return this.$kvTrackEvent(c,"click-contentful-loan-carousel-category",a,t,t),this.$emit("handle-category-click",{categoryId:t}),!1}}},te={class:"tw-justify-start tw-flex-row md:tw-flex-col md:tw-justify-center md:tw-flex-wrap tw-mx-auto tw-overflow-x-auto md:tw-overflow-x-none"};function ae(e,t,a,c,m,n){const p=s("kv-tab"),C=s("kv-tabs"),_=s("kv-button");return o(),d("div",te,[w(C,{vertical:!0,class:"tabs-container"},{tabNav:r(()=>[(o(!0),d(k,null,x(a.loanChannels,l=>(o(),y(p,{class:"md:tw-truncate",vertical:!0,key:l.id,"for-panel":`tab-${l.id}`,onClick:L=>n.handleCategoryClick(l)},{default:r(()=>[g(b(l.shortName),1)],void 0,!0),_:2},1032,["for-panel","onClick"]))),128))]),_:1}),w(_,{class:"tw-hidden md:tw-block tw-mx-1 md:tw-mb-3 tw-whitespace-nowrap",variant:m.buttonStyle,to:m.categoryPage},{default:r(()=>t[0]||(t[0]=[g(" Browse all ")]),void 0),_:1,__:[0]},8,["variant","to"])])}const M=B(K,[["render",ae],["__scopeId","data-v-9a8790a8"]]);K.__docgenInfo={displayName:"LoanCategorySelectorHomeExp",exportName:"default",description:"",tags:{},props:[{name:"loanChannels",description:"Array of loan channel data in an object",type:{name:"array"},defaultValue:{func:!1,value:"[]"}},{name:"selectedChannel",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],events:[{name:"handle-category-click",type:{names:["undefined"]}}],sourceFiles:["/home/runner/work/ui/ui/src/components/LoanCollections/HomeExp/LoanCategorySelectorHomeExp.vue"]};const ne={data:{lend:{loan:q[0]}}},T={showAllButton:!0,combinedLoanChannelData:[{id:32,name:"Refugees and IDPs",url:"https://www.dev.kiva.org/lend/refugees-and-i-d-ps",shortName:"Refugees and IDPs",__typename:"LoanChannel"},{id:5,name:"Women",url:"https://www.dev.kiva.org/lend/women",shortName:"Women",__typename:"LoanChannel"},{id:6,name:"Health",url:"https://www.dev.kiva.org/lend/women",shortName:"Health",__typename:"LoanChannel"}],selectedChannel:{id:5,url:"women"},showCarousel:!0,showViewMoreCard:!1,selectedChannelLoanIds:[2414972,2411407,2428657,2422009,2421968,2422012],newHomeExp:!0,loanLimit:6},We={title:"New Home Page/Kiva Multi Category Grid",components:{LoanCategorySelectorHomeExp:M,KivaLoanCardCategory:D,KvGrid:E},args:T},v=(e,{argTypes:t})=>({props:Object.keys(t),components:{LoanCategorySelectorHomeExp:M,KivaLoanCardCategory:D,KvGrid:E},mixins:[U({queryResult:ne}),F()],methods:{handleCategoryClick(a){this.selectedChannel=this.combinedLoanChannelData.find(c=>c.id===a.categoryId)}},setup(){return T},template:`
        <kv-grid class="tw-grid-cols-12" style="max-width: 1200px;">
            <div class="tw-col-span-12 md:tw-col-span-3">
                <div class="tw-mr-4">
                    <p class="tw-text-h3 tw-font-medium tw-mb-2 tw-text-secondary">I want to support</p>
                    <loan-category-selector-home-exp
                        :loan-channels="combinedLoanChannelData"
                        :selected-channel="selectedChannel.id"
                        @handle-category-click="handleCategoryClick"
                    />
                </div>
            </div>
            <div class="tw-col-span-12 md:tw-col-span-9">
                <kiva-loan-card-category
                    :new-home-exp="newHomeExp"
                    :is-visible="showCarousel"
                    :loan-ids="selectedChannelLoanIds"
                    :selected-channel="selectedChannel"
                    :show-view-more-card="showViewMoreCard"
                    :new-home-exp="newHomeExp"
                />
            </div>
        </kv-grid>
    `});var I,S,H;v.parameters={...v.parameters,docs:{...(I=v.parameters)==null?void 0:I.docs,source:{originalSource:`(_, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  components: {
    LoanCategorySelectorHomeExp,
    KivaLoanCardCategory,
    KvGrid
  },
  mixins: [apolloStoryMixin({
    queryResult
  }), cookieStoreStoryMixin()],
  methods: {
    handleCategoryClick(payload) {
      this.selectedChannel = this.combinedLoanChannelData.find(loanChannel => loanChannel.id === payload.categoryId);
    }
  },
  setup() {
    return args;
  },
  template: \`
        <kv-grid class="tw-grid-cols-12" style="max-width: 1200px;">
            <div class="tw-col-span-12 md:tw-col-span-3">
                <div class="tw-mr-4">
                    <p class="tw-text-h3 tw-font-medium tw-mb-2 tw-text-secondary">I want to support</p>
                    <loan-category-selector-home-exp
                        :loan-channels="combinedLoanChannelData"
                        :selected-channel="selectedChannel.id"
                        @handle-category-click="handleCategoryClick"
                    />
                </div>
            </div>
            <div class="tw-col-span-12 md:tw-col-span-9">
                <kiva-loan-card-category
                    :new-home-exp="newHomeExp"
                    :is-visible="showCarousel"
                    :loan-ids="selectedChannelLoanIds"
                    :selected-channel="selectedChannel"
                    :show-view-more-card="showViewMoreCard"
                    :new-home-exp="newHomeExp"
                />
            </div>
        </kv-grid>
    \`
})`,...(H=(S=v.parameters)==null?void 0:S.docs)==null?void 0:H.source}}};const Oe=["DefaultGrid"];export{v as DefaultGrid,Oe as __namedExportsOrder,We as default};
