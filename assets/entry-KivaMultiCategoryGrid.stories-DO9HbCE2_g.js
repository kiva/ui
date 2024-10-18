import{N as j}from"./entry-NewHomePageLoanCard-CVMGvUCxUu.js";import{K as A}from"./entry-KvCarousel-CV-EzWfExZ.js";import{K as H}from"./entry-KvButton-CplWdZYNKD.js";import{c as i,f as y,O as P,G as x,w as r,n as G,h as f,F as k,e as d,a as w,r as s,N as O,o,D as W,I as b,H as g,R,S as U}from"./entry-vue.esm-bundler-CCMUuEADRp.js";import{_ as B}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{a as F}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as $}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{K as q,a as z}from"./entry-KvTabs-CEidMLZS-R.js";import{K as E}from"./entry-KvGrid-CI1zEoosXE.js";import{l as J}from"./entry-loan-data-mock-K6LggmKLGT.js";import"./entry-mdi-Dz4iKpiukw.js";import"./entry-index-CKVkeXup4D.js";import"./entry-tslib.es6-CxsSpKd0p8.js";import"./entry-time-left-mixin-C8HfaHj9He.js";import"./entry-index-BTftIkQSSB.js";import"./entry-index-COmIkRYU2t.js";import"./entry-index-D4S0JsTkt8.js";import"./entry-index-CN90oFOzzG.js";import"./entry-index-CbPSoDvqj7.js";import"./entry-index-BSZLBqOjEU.js";import"./entry-index-E9YXH6yDgX.js";import"./entry-BorrowerImage-B3GWN-qTdY.js";import"./entry-imageUtils-DMLkgPJKqw.js";import"./entry-SummaryTag-TSieHh7s5w.js";import"./entry-KvLoadingParagraph-Dqvtg0DcnR.js";import"./entry-getCacheKey-C-sPWEGSr2.js";import"./entry-KvLoadingPlaceholder-BggctNa6n7.js";import"./entry-loanUtils-C0BTH8jzD8.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-get-pjbUt-rccH.js";import"./entry-isSymbol-Cs2hrTnPnb.js";import"./entry-observerUtils-DveHpw6JZJ.js";import"./entry-KvProgressBar--348OHfFfG.js";import"./entry-KvMaterialIcon-D8DnGkc65h.js";import"./entry-exports-QxsLoHZpMP.js";import"./entry-embla-carousel.esm-DYTkN8ZyLX.js";import"./entry-mdi-DelXZw8dIC.js";import"./entry-KvLoadingSpinner-BFva1V4s4F.js";function Q(e,n){switch(e){case 5:case 52:return"loans to women";case 96:return"COVID-19 loans";case 93:return"shelter loans";case 89:return"arts loans";case 87:return"agriculture loans";case 102:return"technology loans";case 4:return"education loans";case 25:return"health loans";case 32:return"loans to refugees and IDPs";default:return String(n).replace(/\s\[.*\]/g,"")}}const V={name:"KivaLoanCardCategory",components:{KvCarousel:A,NewHomePageLoanCard:j,KvButton:H},props:{loanIds:{type:Array,default:()=>[]},selectedChannel:{type:Object,default:()=>{}},newHomeExp:{type:Boolean,default:!1},showViewMoreCard:{type:Boolean,default:!1},showCheckBackMessage:{type:Boolean,default:!1}},data(){return{name:"",id:0,url:"",browseButtonStyle:"primary",categoryButtonStyle:"secondary",lendByCategoryUrl:"lend-by-category"}},computed:{augmentedLoanIds(){return[...this.loanIds]},cleanUrl(){const e=this.url.lastIndexOf("/"),n=this.url.slice(e);let t=String(n);return(this.url.includes("loans-with-research-backed-impact")===!0||this.url.includes("recently-viewed-loans")===!0||this.url==="")&&(t=""),this.url.includes("new-countries-for-you")?"/lend/countries-not-lent":`/lend-by-category${t}`},viewAllLoansCategoryTitle(){return`View all ${this.cleanCategoryName(this.id)}`},singleSlideWidth(){return(typeof window<"u"?window.innerWidth:1024)<414?"278px":"267px"}},watch:{selectedChannel:{handler(e){this.name=(e==null?void 0:e.name)||"",this.url=(e==null?void 0:e.url)||"",this.id=(e==null?void 0:e.id)||""},immediate:!0}},methods:{cleanCategoryName(e){return Q(e,this.name)},onInteractCarousel(e){this.$kvTrackEvent("carousel","click-carousel-horizontal-scroll",e)}}},X=e=>(R("data-v-134975f1"),e=e(),U(),e),Y={class:"tw-pt-4"},Z={class:"tw-w-full tw-text-center"},ee={key:1,class:"tw-flex tw-items-center tw-h-full tw-w-full tw-border-action-highlight tw-rounded"},te=X(()=>d("div",{class:"tw-w-full tw-text-center"},[d("h3",null,"Check back later, we add new loans everyday.")],-1)),ae=[te],ne={class:"tw-hidden md:tw-grid md:tw-grid-cols-2 md:tw-gap-4 lg:tw-grid-cols-3"},oe={class:"tw-mt-4 tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-w-auto tw-mx-auto"};function re(e,n,t,c,m,a){const p=s("new-home-page-loan-card"),C=s("router-link"),_=s("kv-carousel"),l=s("kv-button"),L=O("kv-track-event");return o(),i("div",Y,[a.augmentedLoanIds.length>0?(o(),y(_,{key:0,id:"loan-category-carousel",class:G(["tw-w-full tw-overflow-visible md:tw-overflow-hidden",{"md:tw-hidden":t.newHomeExp}]),"embla-options":{loop:!1},ref:"categoryCarousel","multiple-slides-visible":!0,"slides-to-scroll":"visible","slide-max-width":a.singleSlideWidth,onInteractCarousel:a.onInteractCarousel},P({default:r(()=>[t.showViewMoreCard?W((o(),y(C,{key:"view-more-card",class:"tw-flex tw-items-center tw-h-full tw-w-full hover:tw-bg-action-highlight hover:tw-text-primary-inverse tw-rounded",to:a.cleanUrl},{default:r(()=>[d("div",Z,[d("h3",null,b(a.viewAllLoansCategoryTitle),1)])],void 0,!0),_:1},8,["to"])),[[L,["Lending","click-carousel-view-all-category-loans",`${a.viewAllLoansCategoryTitle}`]]]):f("",!0),t.showCheckBackMessage?(o(),i("div",ee,ae)):f("",!0)],void 0),_:2},[x(a.augmentedLoanIds,(h,u)=>({name:`slide${u}`,fn:r(()=>[w(p,{"item-index":u,"loan-id":h},null,8,["item-index","loan-id"])])}))]),1032,["class","slide-max-width","onInteractCarousel"])):f("",!0),t.newHomeExp?(o(),i(k,{key:1},[d("div",ne,[(o(!0),i(k,null,x(a.augmentedLoanIds,(h,u)=>(o(),y(p,{key:`loan-${h||u}`,"item-index":u,"loan-id":h},null,8,["item-index","loan-id"]))),128))]),d("div",oe,[w(l,{class:"tw-mx-1 tw-mb-3 tw-whitespace-nowrap",variant:m.categoryButtonStyle,to:a.cleanUrl},{default:r(()=>[g(b(a.viewAllLoansCategoryTitle),1)],void 0),_:1},8,["variant","to"]),w(l,{class:"tw-block md:tw-hidden tw-mx-1 md:tw-mb-3 tw-whitespace-nowrap",to:"/lend-by-category",variant:m.browseButtonStyle},{default:r(()=>[g(" Browse all ")],void 0),_:1},8,["variant"])])],64)):f("",!0)])}const K=B(V,[["render",re],["__scopeId","data-v-134975f1"]]);V.__docgenInfo={displayName:"KivaLoanCardCategory",exportName:"default",description:"",tags:{},props:[{name:"loanIds",type:{name:"array"},defaultValue:{func:!1,value:"[]"}},{name:"selectedChannel",type:{name:"object"},defaultValue:{func:!0,value:"() => {}"}},{name:"newHomeExp",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"showViewMoreCard",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}},{name:"showCheckBackMessage",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/LoanCollections/HomeExp/KivaLoanCardCategory.vue"]};const D={name:"LoanCategorySelectorHomeExp",components:{KvButton:H,KvTab:q,KvTabs:z},data(){return{categoryBtnStyle:"vertical-tab",buttonStyle:"secondary",categoryPage:"/lend-by-category/"}},emits:["handle-category-click"],props:{loanChannels:{type:Array,default:()=>[]},selectedChannel:{type:Number,default:0}},methods:{handleCategoryClick(e){const n=(e==null?void 0:e.id)??null,t=(e==null?void 0:e.shortName)??"",c=this.$route.path==="/"?"homepage":this.$route.path.replace(/\//g,"-").replace("-","");return this.$kvTrackEvent(c,"click-contentful-loan-carousel-category",t,n,n),this.$emit("handle-category-click",{categoryId:n}),!1}}},le={class:"tw-justify-start tw-flex-row md:tw-flex-col md:tw-justify-center md:tw-flex-wrap tw-mx-auto tw-overflow-x-auto md:tw-overflow-x-none"};function se(e,n,t,c,m,a){const p=s("kv-tab"),C=s("kv-tabs"),_=s("kv-button");return o(),i("div",le,[w(C,{vertical:!0,class:"tabs-container"},{tabNav:r(()=>[(o(!0),i(k,null,x(t.loanChannels,l=>(o(),y(p,{class:"md:tw-truncate",vertical:!0,key:l.id,"for-panel":`tab-${l.id}`,onClick:L=>a.handleCategoryClick(l)},{default:r(()=>[g(b(l.shortName),1)],void 0,!0),_:2},1032,["for-panel","onClick"]))),128))]),_:1}),w(_,{class:"tw-hidden md:tw-block tw-mx-1 md:tw-mb-3 tw-whitespace-nowrap",variant:m.buttonStyle,to:m.categoryPage},{default:r(()=>[g(" Browse all ")],void 0),_:1},8,["variant","to"])])}const M=B(D,[["render",se],["__scopeId","data-v-00b01dd3"]]);D.__docgenInfo={displayName:"LoanCategorySelectorHomeExp",exportName:"default",description:"",tags:{},props:[{name:"loanChannels",description:"Array of loan channel data in an object",type:{name:"array"},defaultValue:{func:!1,value:"[]"}},{name:"selectedChannel",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],events:[{name:"handle-category-click",type:{names:["undefined"]}}],sourceFiles:["/home/runner/work/ui/ui/src/components/LoanCollections/HomeExp/LoanCategorySelectorHomeExp.vue"]};const ie={data:{lend:{loan:J[0]}}},T={showAllButton:!0,combinedLoanChannelData:[{id:32,name:"Refugees and IDPs",url:"https://www.dev.kiva.org/lend/refugees-and-i-d-ps",shortName:"Refugees and IDPs",__typename:"LoanChannel"},{id:5,name:"Women",url:"https://www.dev.kiva.org/lend/women",shortName:"Women",__typename:"LoanChannel"},{id:6,name:"Health",url:"https://www.dev.kiva.org/lend/women",shortName:"Health",__typename:"LoanChannel"}],selectedChannel:{id:5,url:"women"},showCarousel:!0,showViewMoreCard:!1,selectedChannelLoanIds:[2414972,2411407,2428657,2422009,2421968,2422012],newHomeExp:!0,loanLimit:6},ze={title:"New Home Page/Kiva Multi Category Grid",components:{LoanCategorySelectorHomeExp:M,KivaLoanCardCategory:K,KvGrid:E},args:T},v=(e,{argTypes:n})=>({props:Object.keys(n),components:{LoanCategorySelectorHomeExp:M,KivaLoanCardCategory:K,KvGrid:E},mixins:[F({queryResult:ie}),$()],methods:{handleCategoryClick(t){this.selectedChannel=this.combinedLoanChannelData.find(c=>c.id===t.categoryId)}},setup(){return T},template:`
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
    `});var I,S,N;v.parameters={...v.parameters,docs:{...(I=v.parameters)==null?void 0:I.docs,source:{originalSource:`(_, {
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
})`,...(N=(S=v.parameters)==null?void 0:S.docs)==null?void 0:N.source}}};const Je=["DefaultGrid"];export{v as DefaultGrid,Je as __namedExportsOrder,ze as default};
