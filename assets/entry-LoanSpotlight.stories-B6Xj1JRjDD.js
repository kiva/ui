import{t as J}from"./entry-loanUtils-5D9a5yj3H7.js";import{g as G}from"./entry-numeral-DJCTM12wUX.js";import{K as X}from"./entry-KvResponsiveImage-BlIzarww7Q.js";import{K as Y}from"./entry-KvLoadingParagraph-pZCqBoNh6x.js";import{c as y,e as p,f as L,d as u,a as Z,G as x,E as ee,b as te,r as h,I as oe,o as i,F as ae}from"./entry-vue.esm-bundler-DRMQxQJg8r.js";import{_ as ne}from"./entry-KvLoadingPlaceholder-B-QfiwCY-m.js";import{U as re}from"./entry-KvButton-Ch4xYnpy1m.js";import"./entry-KvAtbModal-DhF29XDIKL.js";import{_ as le}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{a as c}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as d}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{g as se}from"./entry-KvGrid-YP8W82wJAP.js";import{x as ie}from"./entry-KvPageContainer-CXiIxjgb42.js";import"./entry-get-BUjo_hX5jl.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-D3xDH2SX94.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-throttle-DL1zg7kAk0.js";import"./entry-toNumber-MeiYJWOH0A.js";import"./entry-getCacheKey-ZRtGK4AFY2.js";import"./entry-KvLoadingSpinner-CbEbrIIgDo.js";const ge=G`
	query allChannelsQuery {
		lend {
			loanChannels(offset:0, limit:1000) {
				values {
					id
					url
					name
					loans {
						totalCount
					}
				}
			}
		}
	}
`,ce=G`
	query spotlightLoanQuery (
		$ids: [Int],
		$limit: Int = 5,
		$offset: Int = 0,
		$imgDefaultSize: String = "w520h390",
		$imgRetinaSize: String = "w1040h780",
	) {
		lend {
			loanChannelsById (ids: $ids) {
				id
				loans (
					limit: $limit
					offset: $offset
				) {
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
`;function _(t,e){return e.filter(o=>o.url.split("/").pop()===t)}function de(t,e,n){var r,l,s;const o=_(t,n),a=_(e,n);return o.length===0?((r=a[0])==null?void 0:r.id)||null:o.length!==0&&o[0].loans.totalCount===0?((l=a[0])==null?void 0:l.id)||null:((s=o[0])==null?void 0:s.id)||null}function pe(t){var o,a,r;return(((r=(a=(o=t.lend)==null?void 0:o.loanChannelsById[0])==null?void 0:a.loans)==null?void 0:r.values)??[]).filter(l=>{var s;return l.anonymizationLevel!=="full"&&((s=l.image)==null?void 0:s.default)!==""})[0]||{}}const Q={name:"LoanSpotlight",props:{categorySlug:{type:String,default:""},fallbackCategorySlug:{type:String,default:""}},components:{KvButton:re,KvResponsiveImage:X,KvLoadingPlaceholder:ne,KvLoadingParagraph:Y},inject:["apollo","cookieStore"],data(){return{spotlightPlaceholderImageCTF:"",spotlightLoan:{},allChannelsData:[],isLoading:!0,targetedLoanChannelID:null}},computed:{altText(){var t,e;return((e=(t=this.spotlightLoan)==null?void 0:t.description)==null?void 0:e.slice(0,100))??""},getSpotlightLoanID(){return this.spotlightLoan.id??""},getSpotlightText(){return J(this.spotlightLoan.description).join(" ")??""},getSpotlightLoanLocation(){var t,e,n,o,a;return this.spotlightLoan.geocode?(t=this.spotlightLoan.geocode)!=null&&t.city&&((n=(e=this.spotlightLoan.geocode)==null?void 0:e.country)!=null&&n.name)?`${this.spotlightLoan.geocode.city}, ${this.spotlightLoan.geocode.country.name}`:`${((a=(o=this.spotlightLoan.geocode)==null?void 0:o.country)==null?void 0:a.name)??""}`:""},getSpotlightImage(){var t,e;return(t=this.spotlightLoan.image)!=null&&t.retina?[["small",this.spotlightLoan.image.retina],["small retina",this.spotlightLoan.image.retina]]:[["small",((e=this.spotlightLoan.image)==null?void 0:e.default)??""]]}},apollo:{query:ge,preFetch:!0,result(t){var e,n,o;this.allChannelsData=((o=(n=(e=t.data)==null?void 0:e.lend)==null?void 0:n.loanChannels)==null?void 0:o.values)??[]}},created(){this.targetedLoanChannelID=de(this.categorySlug,this.fallbackCategorySlug,this.allChannelsData),this.apollo.query({query:ce,variables:{ids:[this.targetedLoanChannelID]}}).then(t=>{this.isLoading=!1,this.spotlightLoan=pe(t.data)})}},ue={"data-testid":"all-categories-loan-spotlight"},me={class:"md:tw-flex md:tw-pt-8 md:tw-pb-8"},ye={key:1,class:"md:tw-mr-3 lg:tw-mr-4 md:tw-min-w-[40%]"},he={class:"md:tw-grow"},fe={class:"tw-pt-2 tw-mb-1"},Se={key:1,class:"tw-line-clamp-5"},be={key:2,class:"tw-mt-2"};function we(t,e,n,o,a,r){const l=h("kv-loading-placeholder"),s=h("kv-responsive-image"),E=h("kv-loading-paragraph"),W=h("kv-button"),U=oe("kv-track-event");return i(),y("div",ue,[e[2]||(e[2]=p("h2",{class:"md:tw-hidden tw-pb-2"}," Today's loan spotlight ",-1)),p("div",me,[a.isLoading?(i(),L(l,{key:0,class:"tw-mb-1 tw-rounded md:tw-mr-3 lg:tw-mr-4 md:tw-flex-none tw-w-full md:tw-w-1/2",style:{height:"15.75rem"}})):u("",!0),a.isLoading?u("",!0):(i(),y("div",ye,[Z(s,{class:"spotlight-loan-image",images:r.getSpotlightImage,loading:"lazy",alt:r.altText},null,8,["images","alt"])])),p("div",he,[e[1]||(e[1]=p("h2",{class:"tw-hidden md:tw-block tw-pt-1"}," Today's loan spotlight ",-1)),p("h3",fe,x(r.getSpotlightLoanLocation),1),a.isLoading?(i(),L(E,{key:0,class:"tw-mb-1.5 tw-flex-grow",style:{width:"100%",height:"5.5rem"}})):u("",!0),a.isLoading?u("",!0):(i(),y("p",Se,x(r.getSpotlightText),1)),a.isLoading?u("",!0):(i(),y("div",be,[ee((i(),L(W,{class:"tw-w-full md:tw-w-auto",to:`/lend/${r.getSpotlightLoanID}`,variant:"primary"},{default:te(()=>e[0]||(e[0]=[ae(" View loan ")]),void 0),_:1,__:[0]},8,["to"])),[[U,["Lending","click-loan-spotlight","View Loan"]]])]))])])])}const g=le(Q,[["render",we],["__scopeId","data-v-f124a9d2"]]);Q.__docgenInfo={displayName:"LoanSpotlight",exportName:"default",description:"",tags:{},props:[{name:"categorySlug",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"fallbackCategorySlug",type:{name:"string"},defaultValue:{func:!1,value:"''"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/Categories/LoanSpotlight.vue"]};const ke={id:2389631,description:"Koffi is 34 years old, married and has two children. He sells food products from his shop and gets his supply from the market. <br /><br />He is requesting a loan to develop his business by buying a sufficient quantity of rice, oil and spaghetti. His goal is to increase his income to better support his family.",lenderRepaymentTerm:7,anonymizationLevel:"none",geocode:{city:"Amlame",country:{name:"Togo"}},image:{id:4854968,default:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w520h390/908f90aaffcfb81085c7338ad9318cdd.jpg",retina:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w1040h780/908f90aaffcfb81085c7338ad9318cdd.jpg"}},ve={id:2385862,description:"Nunila is a trustworthy and hardworking person and is grateful for the opportunity to work with her community. Her general store has been able to serve the various needs of her neighbors. At this time, she wants to stock her store with cassava flour, wheat, corn, eggs, milk, and cheese. <br /><br />With her current loan, Nunila will purchase the merchandise most consumed in this season (Paraguay is now entering winter), in addition to various grocery products and charcoal to restock her store. <br /><br />Others in her group sell cosmetics, are clothing stylists or sell clothing.",lenderRepaymentTerm:7,anonymizationLevel:"none",geocode:{city:"Aregua",country:{name:"Paraguay"}},image:{id:4848710,default:"https://www-dev-kiva-org.freetls.fastly.net/img/w520h390/965a9b447b84def27a8878f29c501252.jpg",retina:"https://www-dev-kiva-org.freetls.fastly.net/img/w1040h780/965a9b447b84def27a8878f29c501252.jpg"}},C={id:2387011,description:"Atsupe is a young, 27-year-old woman who is married and has 3 children. She sells food and gets her supplies at the market.<br /><br />She is requesting a loan to develop her business by buying a large number of bags of cassava flour and rice.<br /><br />She wants to satisfy her customers and earn some money for her family.",lenderRepaymentTerm:7,anonymizationLevel:"none",geocode:{city:"Tokoin",country:{name:"Togo"}},image:{id:4850338,default:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w520h390/9812ee5ad81803cfe79d30fc2b4c9527.jpg",retina:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w1040h780/9812ee5ad81803cfe79d30fc2b4c9527.jpg"}};function m(t){return{data:{lend:{loanChannels:{values:[{url:"https://www.dev.kiva.org/lend/recommended-by-lenders",id:108,name:"Recommended by lenders",loans:{totalCount:174}}]},loanChannelsById:[{id:108,loans:{values:[t]}}]}}}}const Fe={title:"Components/Loan Spotlight",component:g,args:{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},f=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[c({loading:!0}),d()],components:{LoanSpotlight:g},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),S=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[c({queryResult:m(ke)}),d()],components:{LoanSpotlight:g},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),b=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[c({queryResult:m(ve)}),d()],components:{LoanSpotlight:g},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),w=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[c({queryResult:m(C)}),d()],components:{LoanSpotlight:g},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),k=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[c({queryResult:m(C)}),d()],components:{LoanSpotlight:g},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
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
    `}),v=(t,{argTypes:e})=>({props:Object.keys(e),mixins:[c({queryResult:m(C)}),d()],components:{LoanSpotlight:g,KvGrid:se,KvPageContainer:ie},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
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
    `});var T,I,R;f.parameters={...f.parameters,docs:{...(T=f.parameters)==null?void 0:T.docs,source:{originalSource:`(args, {
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
})`,...(R=(I=f.parameters)==null?void 0:I.docs)==null?void 0:R.source}}};var j,q,z;S.parameters={...S.parameters,docs:{...(j=S.parameters)==null?void 0:j.docs,source:{originalSource:`(args, {
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
})`,...(z=(q=S.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var A,O,D;b.parameters={...b.parameters,docs:{...(A=b.parameters)==null?void 0:A.docs,source:{originalSource:`(args, {
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
})`,...(D=(O=b.parameters)==null?void 0:O.docs)==null?void 0:D.source}}};var M,V,K;w.parameters={...w.parameters,docs:{...(M=w.parameters)==null?void 0:M.docs,source:{originalSource:`(args, {
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
})`,...(K=(V=w.parameters)==null?void 0:V.docs)==null?void 0:K.source}}};var B,H,N;k.parameters={...k.parameters,docs:{...(B=k.parameters)==null?void 0:B.docs,source:{originalSource:`(args, {
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
})`,...(N=(H=k.parameters)==null?void 0:H.docs)==null?void 0:N.source}}};var P,$,F;v.parameters={...v.parameters,docs:{...(P=v.parameters)==null?void 0:P.docs,source:{originalSource:`(args, {
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
})`,...(F=($=v.parameters)==null?void 0:$.docs)==null?void 0:F.source}}};const Ge=["SpotlightLoanLoading","SpotlightLoanHorizontal","SpotlightLoanVertical","SpotlightLoanAverageSize","SpotlightLoanDoubleAverage","SpotlightLoanInsideGrid"];export{w as SpotlightLoanAverageSize,k as SpotlightLoanDoubleAverage,S as SpotlightLoanHorizontal,v as SpotlightLoanInsideGrid,f as SpotlightLoanLoading,b as SpotlightLoanVertical,Ge as __namedExportsOrder,Fe as default};
