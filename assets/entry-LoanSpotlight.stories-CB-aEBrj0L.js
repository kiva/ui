import{t as U}from"./entry-loanUtils-Dm0t5xUMSO.js";import{g as X}from"./entry-index-CWclSTHHJk.js";import{K as Y}from"./entry-KvResponsiveImage-RJlpUZ_-nl.js";import{y as Z}from"./entry-KvButton-C8S99vq6YZ.js";import{_ as $}from"./entry-KvLoadingPlaceholder-BIZZosYllW.js";import{q as ee,o as s,c as l,F as te,r as oe,n as ae,a as g,d as F,f as k,g as u,t as L,b as ne,e as re,h as m,I as se,j as le}from"./entry-vue.esm-bundler-ED6DvobC3-.js";import{s as ie}from"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import{_ as ge}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{a as c}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as p}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{w as ce}from"./entry-KvGrid-BN9fhjDIW-.js";import{u as pe}from"./entry-KvPageContainer-BW7DbNeESQ.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-URTN0AnQsa.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-LoanStatusEnum-Cvai-0kFu9.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-KvLoadingSpinner-BNTDmGd79q.js";const ue={class:"kv-loading-text"},de={class:"kv-loading-text-placeholder"},me={__name:"KvLoadingText",props:{lines:{type:Number,default:1}},setup(t){const e=t,n=ee(()=>{const a=Math.floor(e.lines);return Number.isFinite(a)&&a>1?a:1});return(a,o)=>(s(),l("div",ue,[(s(!0),l(te,null,oe(n.value,r=>(s(),l("div",{key:r,class:ae(["kv-loading-text-line",{"extra-line":r!==1}])},[g("div",de,[F($)])],2))),128))]))}},ye=ie(me,[["__scopeId","data-v-9be8a005"]]),he=X`
	query spotlightLoanQuery (
		$slug: String!,
		$limit: Int = 5,
		$pageNumber: Int = 0,
		$imgDefaultSize: String = "w520h390",
		$imgRetinaSize: String = "w1040h780",
	) {
		categoryBySlug (slug: $slug) {
			id
			... on LoanCategorySearchOutput {
				savedSearch (
					limit: $limit
					pageNumber: $pageNumber
				) {
					id
					loans {
						totalCount
						values {
							id
							description
							lenderRepaymentTerm
							anonymizationLevel
							geocode {
								city
								country {
									id
									name
								}
							}
							image {
								id
								default: url(customSize: $imgDefaultSize)
								retina: url(customSize: $imgRetinaSize)
							}
						}
					}
				}
			}
		}
	}
`;function fe(t){return((t==null?void 0:t.values)??[]).filter(a=>{var o;return a.anonymizationLevel!=="full"&&((o=a.image)==null?void 0:o.default)!==""})[0]||{}}const P={name:"LoanSpotlight",props:{categorySlug:{type:String,default:""},fallbackCategorySlug:{type:String,default:""}},components:{KvButton:Z,KvResponsiveImage:Y,KvLoadingPlaceholder:$,KvLoadingText:ye},inject:["apollo","cookieStore"],data(){return{spotlightPlaceholderImageCTF:"",spotlightLoan:{},isLoading:!0}},computed:{altText(){var t,e;return((e=(t=this.spotlightLoan)==null?void 0:t.description)==null?void 0:e.slice(0,100))??""},getSpotlightLoanID(){return this.spotlightLoan.id??""},getSpotlightText(){return U(this.spotlightLoan.description).join(" ")??""},getSpotlightLoanLocation(){var t,e,n,a,o;return this.spotlightLoan.geocode?(t=this.spotlightLoan.geocode)!=null&&t.city&&((n=(e=this.spotlightLoan.geocode)==null?void 0:e.country)!=null&&n.name)?`${this.spotlightLoan.geocode.city}, ${this.spotlightLoan.geocode.country.name}`:`${((o=(a=this.spotlightLoan.geocode)==null?void 0:a.country)==null?void 0:o.name)??""}`:""},getSpotlightImage(){var t,e;return(t=this.spotlightLoan.image)!=null&&t.retina?[["small",this.spotlightLoan.image.retina],["small retina",this.spotlightLoan.image.retina]]:[["small",((e=this.spotlightLoan.image)==null?void 0:e.default)??""]]}},methods:{async fetchCategoryLoans(t){var a,o,r;if(!t)return null;const n=(r=(o=(a=(await this.apollo.query({query:he,variables:{slug:t}})).data)==null?void 0:a.categoryBySlug)==null?void 0:o.savedSearch)==null?void 0:r.loans;return n!=null&&n.totalCount?n:null}},async created(){const t=await this.fetchCategoryLoans(this.categorySlug)??await this.fetchCategoryLoans(this.fallbackCategorySlug);this.spotlightLoan=fe(t),this.isLoading=!1}},Se={"data-testid":"all-categories-loan-spotlight"},be={class:"md:tw-flex md:tw-pt-8 md:tw-pb-8"},we={key:1,class:"md:tw-mr-3 lg:tw-mr-4 md:tw-min-w-[40%]"},ke={class:"md:tw-grow"},ve={class:"tw-text-title tw-pt-2 tw-mb-1"},Le={key:1,class:"tw-line-clamp-5"},xe={key:2,class:"tw-mt-2"};function _e(t,e,n,a,o,r){const G=m("kv-loading-placeholder"),W=m("kv-responsive-image"),E=m("kv-loading-text"),Q=m("kv-button"),J=se("kv-track-event");return s(),l("div",Se,[e[2]||(e[2]=g("h2",{class:"tw-text-headline md:tw-hidden tw-pb-2"}," Today's loan spotlight ",-1)),g("div",be,[o.isLoading?(s(),k(G,{key:0,class:"tw-mb-1 tw-rounded md:tw-mr-3 lg:tw-mr-4 md:tw-flex-none tw-w-full md:tw-w-1/2",style:{height:"15.75rem"}})):u("",!0),o.isLoading?u("",!0):(s(),l("div",we,[F(W,{class:"spotlight-loan-image",images:r.getSpotlightImage,loading:"lazy",alt:r.altText},null,8,["images","alt"])])),g("div",ke,[e[1]||(e[1]=g("h2",{class:"tw-text-headline tw-hidden md:tw-block tw-pt-1"}," Today's loan spotlight ",-1)),g("h3",ve,L(r.getSpotlightLoanLocation),1),o.isLoading?(s(),k(E,{key:0,class:"tw-mb-1.5",lines:5})):u("",!0),o.isLoading?u("",!0):(s(),l("p",Le,L(r.getSpotlightText),1)),o.isLoading?u("",!0):(s(),l("div",xe,[ne((s(),k(Q,{class:"tw-w-full md:tw-w-auto",to:`/lend/${r.getSpotlightLoanID}`,variant:"primary"},{default:re(()=>e[0]||(e[0]=[le(" View loan ")]),void 0),_:1,__:[0]},8,["to"])),[[J,["Lending","click-loan-spotlight","View Loan"]]])]))])])])}const i=ge(P,[["render",_e],["__scopeId","data-v-2d8da4c5"]]);P.__docgenInfo={displayName:"LoanSpotlight",exportName:"default",description:"",tags:{},props:[{name:"categorySlug",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"fallbackCategorySlug",type:{name:"string"},defaultValue:{func:!1,value:"''"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/Categories/LoanSpotlight.vue"]};const Ce={id:2389631,description:"Koffi is 34 years old, married and has two children. He sells food products from his shop and gets his supply from the market. <br /><br />He is requesting a loan to develop his business by buying a sufficient quantity of rice, oil and spaghetti. His goal is to increase his income to better support his family.",lenderRepaymentTerm:7,anonymizationLevel:"none",geocode:{city:"Amlame",country:{name:"Togo"}},image:{id:4854968,default:"https://www.kiva.org/img/w520h390/908f90aaffcfb81085c7338ad9318cdd.webp",retina:"https://www.kiva.org/img/w1040h780/908f90aaffcfb81085c7338ad9318cdd.webp"}},Te={id:2385862,description:"Nunila is a trustworthy and hardworking person and is grateful for the opportunity to work with her community. Her general store has been able to serve the various needs of her neighbors. At this time, she wants to stock her store with cassava flour, wheat, corn, eggs, milk, and cheese. <br /><br />With her current loan, Nunila will purchase the merchandise most consumed in this season (Paraguay is now entering winter), in addition to various grocery products and charcoal to restock her store. <br /><br />Others in her group sell cosmetics, are clothing stylists or sell clothing.",lenderRepaymentTerm:7,anonymizationLevel:"none",geocode:{city:"Aregua",country:{name:"Paraguay"}},image:{id:4848710,default:"https://www.kiva.org/img/w520h390/965a9b447b84def27a8878f29c501252.webp",retina:"https://www.kiva.org/img/w1040h780/965a9b447b84def27a8878f29c501252.webp"}},v={id:2387011,description:"Atsupe is a young, 27-year-old woman who is married and has 3 children. She sells food and gets her supplies at the market.<br /><br />She is requesting a loan to develop her business by buying a large number of bags of cassava flour and rice.<br /><br />She wants to satisfy her customers and earn some money for her family.",lenderRepaymentTerm:7,anonymizationLevel:"none",geocode:{city:"Tokoin",country:{name:"Togo"}},image:{id:4850338,default:"https://www.kiva.org/img/w520h390/9812ee5ad81803cfe79d30fc2b4c9527.webp",retina:"https://www.kiva.org/img/w1040h780/9812ee5ad81803cfe79d30fc2b4c9527.webp"}};function d(t){return{data:{lend:{loanChannels:{values:[{url:"https://www.dev.kiva.org/lend/recommended-by-lenders",id:108,name:"Recommended by lenders",loans:{totalCount:174}}]},loanChannelsById:[{id:108,loans:{values:[t]}}]}}}}const Je={title:"Components/Loan Spotlight",component:i,args:{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},y=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[c({loading:!0}),p()],components:{LoanSpotlight:i},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),h=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[c({queryResult:d(Ce)}),p()],components:{LoanSpotlight:i},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),f=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[c({queryResult:d(Te)}),p()],components:{LoanSpotlight:i},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),S=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[c({queryResult:d(v)}),p()],components:{LoanSpotlight:i},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),b=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[c({queryResult:d(v)}),p()],components:{LoanSpotlight:i},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <div style="width: 100%; max-width: 1200px; display:flex">
            <div>
                <loan-spotlight
                :category-slug="categorySlug"
                :fallback-category-slug="fallbackCategorySlug"
                />
            </div>
            <div>
                <loan-spotlight
                :category-slug="categorySlug"
                :fallback-category-slug="fallbackCategorySlug"
                />
            </div>
        </div>
    `}),w=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[c({queryResult:d(v)}),p()],components:{LoanSpotlight:i,KvGrid:ce,KvPageContainer:pe},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <kv-page-container>
            <kv-grid class="tw-grid-cols-12">
                <div class="tw-col-span-12 lg:tw-col-span-6">
                    <loan-spotlight
                    :category-slug="categorySlug"
                    :fallback-category-slug="fallbackCategorySlug"
                    />
                </div>
                <div class="tw-col-span-12 lg:tw-col-span-6 tw-bg-secondary tw-p-5">
                    Other Content
                </div>
            </kv-grid>
        </kv-page-container>
    `});var x,_,C;y.parameters={...y.parameters,docs:{...(x=y.parameters)==null?void 0:x.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  mixins: [apolloStoryMixin({
    loading: true
  }), cookieStoreStoryMixin()],
  components: {
    LoanSpotlight
  },
  setup() {
    return {
      categorySlug: 'recommended-by-lenders',
      fallbackCategorySlug: 'women'
    };
  },
  template: \`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        \`
})`,...(C=(_=y.parameters)==null?void 0:_.docs)==null?void 0:C.source}}};var T,z,R;h.parameters={...h.parameters,docs:{...(T=h.parameters)==null?void 0:T.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  mixins: [apolloStoryMixin({
    queryResult: getLoan(loanHorizontal)
  }), cookieStoreStoryMixin()],
  components: {
    LoanSpotlight
  },
  setup() {
    return {
      categorySlug: 'recommended-by-lenders',
      fallbackCategorySlug: 'women'
    };
  },
  template: \`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        \`
})`,...(R=(z=h.parameters)==null?void 0:z.docs)==null?void 0:R.source}}};var q,I,O;f.parameters={...f.parameters,docs:{...(q=f.parameters)==null?void 0:q.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  mixins: [apolloStoryMixin({
    queryResult: getLoan(loanVertical)
  }), cookieStoreStoryMixin()],
  components: {
    LoanSpotlight
  },
  setup() {
    return {
      categorySlug: 'recommended-by-lenders',
      fallbackCategorySlug: 'women'
    };
  },
  template: \`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        \`
})`,...(O=(I=f.parameters)==null?void 0:I.docs)==null?void 0:O.source}}};var A,j,M;S.parameters={...S.parameters,docs:{...(A=S.parameters)==null?void 0:A.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  mixins: [apolloStoryMixin({
    queryResult: getLoan(loanAverage)
  }), cookieStoreStoryMixin()],
  components: {
    LoanSpotlight
  },
  setup() {
    return {
      categorySlug: 'recommended-by-lenders',
      fallbackCategorySlug: 'women'
    };
  },
  template: \`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        \`
})`,...(M=(j=S.parameters)==null?void 0:j.docs)==null?void 0:M.source}}};var N,V,K;b.parameters={...b.parameters,docs:{...(N=b.parameters)==null?void 0:N.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  mixins: [apolloStoryMixin({
    queryResult: getLoan(loanAverage)
  }), cookieStoreStoryMixin()],
  components: {
    LoanSpotlight
  },
  setup() {
    return {
      categorySlug: 'recommended-by-lenders',
      fallbackCategorySlug: 'women'
    };
  },
  template: \`
        <div style="width: 100%; max-width: 1200px; display:flex">
            <div>
                <loan-spotlight
                :category-slug="categorySlug"
                :fallback-category-slug="fallbackCategorySlug"
                />
            </div>
            <div>
                <loan-spotlight
                :category-slug="categorySlug"
                :fallback-category-slug="fallbackCategorySlug"
                />
            </div>
        </div>
    \`
})`,...(K=(V=b.parameters)==null?void 0:V.docs)==null?void 0:K.source}}};var B,D,H;w.parameters={...w.parameters,docs:{...(B=w.parameters)==null?void 0:B.docs,source:{originalSource:`(args, {
  argTypes
}) => ({
  props: Object.keys(argTypes),
  mixins: [apolloStoryMixin({
    queryResult: getLoan(loanAverage)
  }), cookieStoreStoryMixin()],
  components: {
    LoanSpotlight,
    KvGrid,
    KvPageContainer
  },
  setup() {
    return {
      categorySlug: 'recommended-by-lenders',
      fallbackCategorySlug: 'women'
    };
  },
  template: \`
        <kv-page-container>
            <kv-grid class="tw-grid-cols-12">
                <div class="tw-col-span-12 lg:tw-col-span-6">
                    <loan-spotlight
                    :category-slug="categorySlug"
                    :fallback-category-slug="fallbackCategorySlug"
                    />
                </div>
                <div class="tw-col-span-12 lg:tw-col-span-6 tw-bg-secondary tw-p-5">
                    Other Content
                </div>
            </kv-grid>
        </kv-page-container>
    \`
})`,...(H=(D=w.parameters)==null?void 0:D.docs)==null?void 0:H.source}}};const Ue=["SpotlightLoanLoading","SpotlightLoanHorizontal","SpotlightLoanVertical","SpotlightLoanAverageSize","SpotlightLoanDoubleAverage","SpotlightLoanInsideGrid"];export{S as SpotlightLoanAverageSize,b as SpotlightLoanDoubleAverage,h as SpotlightLoanHorizontal,w as SpotlightLoanInsideGrid,y as SpotlightLoanLoading,f as SpotlightLoanVertical,Ue as __namedExportsOrder,Je as default};
