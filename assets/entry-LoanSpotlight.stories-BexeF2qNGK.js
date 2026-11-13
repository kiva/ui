import{t as Q}from"./entry-loanUtils-Cu0b2K4oGU.js";import{g as J}from"./entry-index-CWclSTHHJk.js";import{K as U}from"./entry-KvResponsiveImage-DR5OIirtLq.js";import{y as X}from"./entry-KvButton-BtWM7FaLlj.js";import{_ as Y}from"./entry-KvLoadingPlaceholder-gPTWuMit7I.js";import{b as Z}from"./entry-KvLoadingText-CxmXdfCoIk.js";import{c as d,a as c,f as k,g as p,d as ee,t as L,b as te,e as oe,h as m,I as ae,o as l,j as ne}from"./entry-vue.esm-bundler-DN41AgNdM7.js";import{_ as re}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{a as i}from"./entry-apollo-story-mixin-Be98L1yqJn.js";import{c as g}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{w as le}from"./entry-KvGrid-CSO_W0cVh_.js";import{u as se}from"./entry-KvPageContainer-8Ce8pJZ6Ss.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-URTN0AnQsa.js";import"./entry-get-CadldcjCrg.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-LoanStatusEnum-Cvai-0kFu9.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-KvLoadingSpinner-BoGXwWqv66.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";const ie=J`
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
`;function ge(t){return((t==null?void 0:t.values)??[]).filter(n=>{var o;return n.anonymizationLevel!=="full"&&((o=n.image)==null?void 0:o.default)!==""})[0]||{}}const $={name:"LoanSpotlight",props:{categorySlug:{type:String,default:""},fallbackCategorySlug:{type:String,default:""}},components:{KvButton:X,KvResponsiveImage:U,KvLoadingPlaceholder:Y,KvLoadingText:Z},inject:["apollo","cookieStore"],data(){return{spotlightPlaceholderImageCTF:"",spotlightLoan:{},isLoading:!0}},computed:{altText(){var t,e;return((e=(t=this.spotlightLoan)==null?void 0:t.description)==null?void 0:e.slice(0,100))??""},getSpotlightLoanID(){return this.spotlightLoan.id??""},getSpotlightText(){return Q(this.spotlightLoan.description).join(" ")??""},getSpotlightLoanLocation(){var t,e,a,n,o;return this.spotlightLoan.geocode?(t=this.spotlightLoan.geocode)!=null&&t.city&&((a=(e=this.spotlightLoan.geocode)==null?void 0:e.country)!=null&&a.name)?`${this.spotlightLoan.geocode.city}, ${this.spotlightLoan.geocode.country.name}`:`${((o=(n=this.spotlightLoan.geocode)==null?void 0:n.country)==null?void 0:o.name)??""}`:""},getSpotlightImage(){var t,e;return(t=this.spotlightLoan.image)!=null&&t.retina?[["small",this.spotlightLoan.image.retina],["small retina",this.spotlightLoan.image.retina]]:[["small",((e=this.spotlightLoan.image)==null?void 0:e.default)??""]]}},methods:{async fetchCategoryLoans(t){var n,o,r;if(!t)return null;const a=(r=(o=(n=(await this.apollo.query({query:ie,variables:{slug:t}})).data)==null?void 0:n.categoryBySlug)==null?void 0:o.savedSearch)==null?void 0:r.loans;return a!=null&&a.totalCount?a:null}},async created(){const t=await this.fetchCategoryLoans(this.categorySlug)??await this.fetchCategoryLoans(this.fallbackCategorySlug);this.spotlightLoan=ge(t),this.isLoading=!1}},ce={"data-testid":"all-categories-loan-spotlight"},pe={class:"md:tw-flex md:tw-pt-8 md:tw-pb-8"},ue={key:1,class:"md:tw-mr-3 lg:tw-mr-4 md:tw-min-w-[40%]"},de={class:"md:tw-grow"},me={class:"tw-text-title tw-pt-2 tw-mb-1"},ye={key:1,class:"tw-line-clamp-5"},he={key:2,class:"tw-mt-2"};function Se(t,e,a,n,o,r){const P=m("kv-loading-placeholder"),F=m("kv-responsive-image"),G=m("kv-loading-text"),W=m("kv-button"),E=ae("kv-track-event");return l(),d("div",ce,[e[2]||(e[2]=c("h2",{class:"tw-text-headline md:tw-hidden tw-pb-2"}," Today's loan spotlight ",-1)),c("div",pe,[o.isLoading?(l(),k(P,{key:0,class:"tw-mb-1 tw-rounded md:tw-mr-3 lg:tw-mr-4 md:tw-flex-none tw-w-full md:tw-w-1/2",style:{height:"15.75rem"}})):p("",!0),o.isLoading?p("",!0):(l(),d("div",ue,[ee(F,{class:"spotlight-loan-image",images:r.getSpotlightImage,loading:"lazy",alt:r.altText},null,8,["images","alt"])])),c("div",de,[e[1]||(e[1]=c("h2",{class:"tw-text-headline tw-hidden md:tw-block tw-pt-1"}," Today's loan spotlight ",-1)),c("h3",me,L(r.getSpotlightLoanLocation),1),o.isLoading?(l(),k(G,{key:0,class:"tw-mb-1.5",lines:5})):p("",!0),o.isLoading?p("",!0):(l(),d("p",ye,L(r.getSpotlightText),1)),o.isLoading?p("",!0):(l(),d("div",he,[te((l(),k(W,{class:"tw-w-full md:tw-w-auto",to:`/lend/${r.getSpotlightLoanID}`,variant:"primary"},{default:oe(()=>e[0]||(e[0]=[ne(" View loan ")]),void 0),_:1,__:[0]},8,["to"])),[[E,["Lending","click-loan-spotlight","View Loan"]]])]))])])])}const s=re($,[["render",Se],["__scopeId","data-v-2d8da4c5"]]);$.__docgenInfo={displayName:"LoanSpotlight",exportName:"default",description:"",tags:{},props:[{name:"categorySlug",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"fallbackCategorySlug",type:{name:"string"},defaultValue:{func:!1,value:"''"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/Categories/LoanSpotlight.vue"]};const fe={id:2389631,description:"Koffi is 34 years old, married and has two children. He sells food products from his shop and gets his supply from the market. <br /><br />He is requesting a loan to develop his business by buying a sufficient quantity of rice, oil and spaghetti. His goal is to increase his income to better support his family.",lenderRepaymentTerm:7,anonymizationLevel:"none",geocode:{city:"Amlame",country:{name:"Togo"}},image:{id:4854968,default:"https://www.kiva.org/img/w520h390/908f90aaffcfb81085c7338ad9318cdd.webp",retina:"https://www.kiva.org/img/w1040h780/908f90aaffcfb81085c7338ad9318cdd.webp"}},be={id:2385862,description:"Nunila is a trustworthy and hardworking person and is grateful for the opportunity to work with her community. Her general store has been able to serve the various needs of her neighbors. At this time, she wants to stock her store with cassava flour, wheat, corn, eggs, milk, and cheese. <br /><br />With her current loan, Nunila will purchase the merchandise most consumed in this season (Paraguay is now entering winter), in addition to various grocery products and charcoal to restock her store. <br /><br />Others in her group sell cosmetics, are clothing stylists or sell clothing.",lenderRepaymentTerm:7,anonymizationLevel:"none",geocode:{city:"Aregua",country:{name:"Paraguay"}},image:{id:4848710,default:"https://www.kiva.org/img/w520h390/965a9b447b84def27a8878f29c501252.webp",retina:"https://www.kiva.org/img/w1040h780/965a9b447b84def27a8878f29c501252.webp"}},v={id:2387011,description:"Atsupe is a young, 27-year-old woman who is married and has 3 children. She sells food and gets her supplies at the market.<br /><br />She is requesting a loan to develop her business by buying a large number of bags of cassava flour and rice.<br /><br />She wants to satisfy her customers and earn some money for her family.",lenderRepaymentTerm:7,anonymizationLevel:"none",geocode:{city:"Tokoin",country:{name:"Togo"}},image:{id:4850338,default:"https://www.kiva.org/img/w520h390/9812ee5ad81803cfe79d30fc2b4c9527.webp",retina:"https://www.kiva.org/img/w1040h780/9812ee5ad81803cfe79d30fc2b4c9527.webp"}};function u(t){return{data:{lend:{loanChannels:{values:[{url:"https://www.dev.kiva.org/lend/recommended-by-lenders",id:108,name:"Recommended by lenders",loans:{totalCount:174}}]},loanChannelsById:[{id:108,loans:{values:[t]}}]}}}}const $e={title:"Components/Loan Spotlight",component:s,args:{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},y=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[i({loading:!0}),g()],components:{LoanSpotlight:s},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),h=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[i({queryResult:u(fe)}),g()],components:{LoanSpotlight:s},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),S=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[i({queryResult:u(be)}),g()],components:{LoanSpotlight:s},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),f=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[i({queryResult:u(v)}),g()],components:{LoanSpotlight:s},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),b=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[i({queryResult:u(v)}),g()],components:{LoanSpotlight:s},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
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
    `}),w=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[i({queryResult:u(v)}),g()],components:{LoanSpotlight:s,KvGrid:le,KvPageContainer:se},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
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
    `});var x,C,_;y.parameters={...y.parameters,docs:{...(x=y.parameters)==null?void 0:x.docs,source:{originalSource:`(args, {
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
})`,...(_=(C=y.parameters)==null?void 0:C.docs)==null?void 0:_.source}}};var T,R,z;h.parameters={...h.parameters,docs:{...(T=h.parameters)==null?void 0:T.docs,source:{originalSource:`(args, {
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
})`,...(z=(R=h.parameters)==null?void 0:R.docs)==null?void 0:z.source}}};var q,I,O;S.parameters={...S.parameters,docs:{...(q=S.parameters)==null?void 0:q.docs,source:{originalSource:`(args, {
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
})`,...(O=(I=S.parameters)==null?void 0:I.docs)==null?void 0:O.source}}};var A,j,M;f.parameters={...f.parameters,docs:{...(A=f.parameters)==null?void 0:A.docs,source:{originalSource:`(args, {
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
})`,...(M=(j=f.parameters)==null?void 0:j.docs)==null?void 0:M.source}}};var V,N,K;b.parameters={...b.parameters,docs:{...(V=b.parameters)==null?void 0:V.docs,source:{originalSource:`(args, {
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
})`,...(K=(N=b.parameters)==null?void 0:N.docs)==null?void 0:K.source}}};var B,D,H;w.parameters={...w.parameters,docs:{...(B=w.parameters)==null?void 0:B.docs,source:{originalSource:`(args, {
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
})`,...(H=(D=w.parameters)==null?void 0:D.docs)==null?void 0:H.source}}};const Pe=["SpotlightLoanLoading","SpotlightLoanHorizontal","SpotlightLoanVertical","SpotlightLoanAverageSize","SpotlightLoanDoubleAverage","SpotlightLoanInsideGrid"];export{f as SpotlightLoanAverageSize,b as SpotlightLoanDoubleAverage,h as SpotlightLoanHorizontal,w as SpotlightLoanInsideGrid,y as SpotlightLoanLoading,S as SpotlightLoanVertical,Pe as __namedExportsOrder,$e as default};
