import{t as X}from"./entry-loanUtils-BU90JoqrWk.js";import{g as G}from"./entry-index-CKVkeXup4D.js";import{K as Y}from"./entry-KvResponsiveImage-iiw8Kt3OxL.js";import{K as Z}from"./entry-KvLoadingParagraph-BgZNMI3ed9.js";import{K as ee}from"./entry-KvLoadingPlaceholder-D_0lEsjIvJ.js";import{K as te}from"./entry-KvButton-DkbqxWSep7.js";import{c as y,e as u,f as L,h as d,a as oe,E as _,C as ae,w as ne,r as h,G as re,o as i,D as le,R as se,S as ie}from"./entry-vue.esm-bundler-gh2KZVgkoT.js";import{_ as ge}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{a as c}from"./entry-apollo-story-mixin-CB9BNmK9U5.js";import{c as p}from"./entry-cookie-store-story-mixin-Bv_t57ys9l.js";import{K as ce}from"./entry-KvGrid-DTzIso7bTt.js";import{K as pe}from"./entry-KvPageContainer-BuwtoyQ9BL.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-get-DbzAqeWMpB.js";import"./entry-isSymbol-Cs2hrTnPnb.js";import"./entry-tslib.es6-CxsSpKd0p8.js";import"./entry-throttle-C_gUPZjI8B.js";import"./entry-toNumber-BfkLXMgxIK.js";import"./entry-getCacheKey-BeYatiuHsm.js";import"./entry-KvLoadingSpinner-Bhg3Wp0Pd3.js";const de=G`
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
`,ue=G`
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
`;function x(e,t){return t.filter(o=>o.url.split("/").pop()===e)}function me(e,t,n){var r,l,s;const o=x(e,n),a=x(t,n);return o.length===0?((r=a[0])==null?void 0:r.id)||null:o.length!==0&&o[0].loans.totalCount===0?((l=a[0])==null?void 0:l.id)||null:((s=o[0])==null?void 0:s.id)||null}function ye(e){var o,a,r;return(((r=(a=(o=e.lend)==null?void 0:o.loanChannelsById[0])==null?void 0:a.loans)==null?void 0:r.values)??[]).filter(l=>{var s;return l.anonymizationLevel!=="full"&&((s=l.image)==null?void 0:s.default)!==""})[0]||{}}const Q={name:"LoanSpotlight",props:{categorySlug:{type:String,default:""},fallbackCategorySlug:{type:String,default:""}},components:{KvButton:te,KvResponsiveImage:Y,KvLoadingPlaceholder:ee,KvLoadingParagraph:Z},inject:["apollo","cookieStore"],data(){return{spotlightPlaceholderImageCTF:"",spotlightLoan:{},allChannelsData:[],isLoading:!0,targetedLoanChannelID:null}},computed:{altText(){var e,t;return((t=(e=this.spotlightLoan)==null?void 0:e.description)==null?void 0:t.slice(0,100))??""},getSpotlightLoanID(){return this.spotlightLoan.id??""},getSpotlightText(){return X(this.spotlightLoan.description).join(" ")??""},getSpotlightLoanLocation(){var e,t,n,o,a;return this.spotlightLoan.geocode?(e=this.spotlightLoan.geocode)!=null&&e.city&&((n=(t=this.spotlightLoan.geocode)==null?void 0:t.country)!=null&&n.name)?`${this.spotlightLoan.geocode.city}, ${this.spotlightLoan.geocode.country.name}`:`${((a=(o=this.spotlightLoan.geocode)==null?void 0:o.country)==null?void 0:a.name)??""}`:""},getSpotlightImage(){var e,t;return(e=this.spotlightLoan.image)!=null&&e.retina?[["small",this.spotlightLoan.image.retina],["small retina",this.spotlightLoan.image.retina]]:[["small",((t=this.spotlightLoan.image)==null?void 0:t.default)??""]]}},apollo:{query:de,preFetch:!0,result(e){var t,n,o;this.allChannelsData=((o=(n=(t=e.data)==null?void 0:t.lend)==null?void 0:n.loanChannels)==null?void 0:o.values)??[]}},created(){this.targetedLoanChannelID=me(this.categorySlug,this.fallbackCategorySlug,this.allChannelsData),this.apollo.query({query:ue,variables:{ids:[this.targetedLoanChannelID]}}).then(e=>{this.isLoading=!1,this.spotlightLoan=ye(e.data)})}},E=e=>(se("data-v-775c9ac1"),e=e(),ie(),e),he={"data-testid":"all-categories-loan-spotlight"},fe=E(()=>u("h2",{class:"md:tw-hidden tw-pb-2"}," Today's loan spotlight ",-1)),Se={class:"md:tw-flex md:tw-pt-8 md:tw-pb-8"},we={key:1,class:"md:tw-mr-3 lg:tw-mr-4 md:tw-min-w-[40%]"},be={class:"md:tw-grow"},ke=E(()=>u("h2",{class:"tw-hidden md:tw-block tw-pt-1"}," Today's loan spotlight ",-1)),ve={class:"tw-pt-2 tw-mb-1"},Le={key:1,class:"tw-line-clamp-5"},Ce={key:2,class:"tw-mt-2"};function _e(e,t,n,o,a,r){const l=h("kv-loading-placeholder"),s=h("kv-responsive-image"),W=h("kv-loading-paragraph"),J=h("kv-button"),U=re("kv-track-event");return i(),y("div",he,[fe,u("div",Se,[a.isLoading?(i(),L(l,{key:0,class:"tw-mb-1 tw-rounded md:tw-mr-3 lg:tw-mr-4 md:tw-flex-none tw-w-full md:tw-w-1/2",style:{height:"15.75rem"}})):d("",!0),a.isLoading?d("",!0):(i(),y("div",we,[oe(s,{class:"spotlight-loan-image",images:r.getSpotlightImage,loading:"lazy",alt:r.altText},null,8,["images","alt"])])),u("div",be,[ke,u("h3",ve,_(r.getSpotlightLoanLocation),1),a.isLoading?(i(),L(W,{key:0,class:"tw-mb-1.5 tw-flex-grow",style:{width:"100%",height:"5.5rem"}})):d("",!0),a.isLoading?d("",!0):(i(),y("p",Le,_(r.getSpotlightText),1)),a.isLoading?d("",!0):(i(),y("div",Ce,[ae((i(),L(J,{class:"tw-w-full md:tw-w-auto",to:`/lend/${r.getSpotlightLoanID}`,variant:"primary"},{default:ne(()=>[le(" View loan ")],void 0),_:1},8,["to"])),[[U,["Lending","click-loan-spotlight","View Loan"]]])]))])])])}const g=ge(Q,[["render",_e],["__scopeId","data-v-775c9ac1"]]);Q.__docgenInfo={displayName:"LoanSpotlight",exportName:"default",description:"",tags:{},props:[{name:"categorySlug",type:{name:"string"},defaultValue:{func:!1,value:"''"}},{name:"fallbackCategorySlug",type:{name:"string"},defaultValue:{func:!1,value:"''"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/Categories/LoanSpotlight.vue"]};const xe={id:2389631,description:"Koffi is 34 years old, married and has two children. He sells food products from his shop and gets his supply from the market. <br /><br />He is requesting a loan to develop his business by buying a sufficient quantity of rice, oil and spaghetti. His goal is to increase his income to better support his family.",lenderRepaymentTerm:7,anonymizationLevel:"none",geocode:{city:"Amlame",country:{name:"Togo"}},image:{id:4854968,default:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w520h390/908f90aaffcfb81085c7338ad9318cdd.jpg",retina:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w1040h780/908f90aaffcfb81085c7338ad9318cdd.jpg"}},Te={id:2385862,description:"Nunila is a trustworthy and hardworking person and is grateful for the opportunity to work with her community. Her general store has been able to serve the various needs of her neighbors. At this time, she wants to stock her store with cassava flour, wheat, corn, eggs, milk, and cheese. <br /><br />With her current loan, Nunila will purchase the merchandise most consumed in this season (Paraguay is now entering winter), in addition to various grocery products and charcoal to restock her store. <br /><br />Others in her group sell cosmetics, are clothing stylists or sell clothing.",lenderRepaymentTerm:7,anonymizationLevel:"none",geocode:{city:"Aregua",country:{name:"Paraguay"}},image:{id:4848710,default:"https://www-dev-kiva-org.freetls.fastly.net/img/w520h390/965a9b447b84def27a8878f29c501252.jpg",retina:"https://www-dev-kiva-org.freetls.fastly.net/img/w1040h780/965a9b447b84def27a8878f29c501252.jpg"}},C={id:2387011,description:"Atsupe is a young, 27-year-old woman who is married and has 3 children. She sells food and gets her supplies at the market.<br /><br />She is requesting a loan to develop her business by buying a large number of bags of cassava flour and rice.<br /><br />She wants to satisfy her customers and earn some money for her family.",lenderRepaymentTerm:7,anonymizationLevel:"none",geocode:{city:"Tokoin",country:{name:"Togo"}},image:{id:4850338,default:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w520h390/9812ee5ad81803cfe79d30fc2b4c9527.jpg",retina:"https://www-dev-kiva-org-0.freetls.fastly.net/img/w1040h780/9812ee5ad81803cfe79d30fc2b4c9527.jpg"}};function m(e){return{data:{lend:{loanChannels:{values:[{url:"https://www.dev.kiva.org/lend/recommended-by-lenders",id:108,name:"Recommended by lenders",loans:{totalCount:174}}]},loanChannelsById:[{id:108,loans:{values:[e]}}]}}}}const Je={title:"Components/Loan Spotlight",component:g,args:{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},f=(e,{argTypes:t})=>({props:Object.keys(t),mixins:[c({loading:!0}),p()],components:{LoanSpotlight:g},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),S=(e,{argTypes:t})=>({props:Object.keys(t),mixins:[c({queryResult:m(xe)}),p()],components:{LoanSpotlight:g},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),w=(e,{argTypes:t})=>({props:Object.keys(t),mixins:[c({queryResult:m(Te)}),p()],components:{LoanSpotlight:g},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),b=(e,{argTypes:t})=>({props:Object.keys(t),mixins:[c({queryResult:m(C)}),p()],components:{LoanSpotlight:g},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
        <loan-spotlight
            :category-slug="categorySlug"
            :fallback-category-slug="fallbackCategorySlug"
         />
        `}),k=(e,{argTypes:t})=>({props:Object.keys(t),mixins:[c({queryResult:m(C)}),p()],components:{LoanSpotlight:g},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
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
    `}),v=(e,{argTypes:t})=>({props:Object.keys(t),mixins:[c({queryResult:m(C)}),p()],components:{LoanSpotlight:g,KvGrid:ce,KvPageContainer:pe},setup(){return{categorySlug:"recommended-by-lenders",fallbackCategorySlug:"women"}},template:`
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
})`,...(z=(q=S.parameters)==null?void 0:q.docs)==null?void 0:z.source}}};var A,D,O;w.parameters={...w.parameters,docs:{...(A=w.parameters)==null?void 0:A.docs,source:{originalSource:`(args, {
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
})`,...(O=(D=w.parameters)==null?void 0:D.docs)==null?void 0:O.source}}};var K,M,V;b.parameters={...b.parameters,docs:{...(K=b.parameters)==null?void 0:K.docs,source:{originalSource:`(args, {
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
})`,...(V=(M=b.parameters)==null?void 0:M.docs)==null?void 0:V.source}}};var B,H,N;k.parameters={...k.parameters,docs:{...(B=k.parameters)==null?void 0:B.docs,source:{originalSource:`(args, {
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
})`,...(F=($=v.parameters)==null?void 0:$.docs)==null?void 0:F.source}}};const Ue=["SpotlightLoanLoading","SpotlightLoanHorizontal","SpotlightLoanVertical","SpotlightLoanAverageSize","SpotlightLoanDoubleAverage","SpotlightLoanInsideGrid"];export{b as SpotlightLoanAverageSize,k as SpotlightLoanDoubleAverage,S as SpotlightLoanHorizontal,v as SpotlightLoanInsideGrid,f as SpotlightLoanLoading,w as SpotlightLoanVertical,Ue as __namedExportsOrder,Je as default};
