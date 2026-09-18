import{g as O}from"./entry-index-CWclSTHHJk.js";import{c as R,d as U,h as W,o as X}from"./entry-vue.esm-bundler-DjLyFRslqj.js";import"./entry-KvWwwHeaderBasic-C_kuFZZQmp.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import Y from"./entry-KvContentfulImg-Cqbrwnv8ez.js";import"./entry-numeral-xVHG5DEP0A.js";import{_ as Z}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const Q={name:"HeroBackground",inject:["apollo","cookieStore"],components:{KvContentfulImg:Y},props:{loanId:{type:Number,default:0},statusCard:{type:Boolean,default:!1}},data(){return{contentfulAlt:"",contentfulSrc:"",isoCode:"",stateCode:"",city:"",placeholderKey:"bp-hero-country-placeholder",sourceSizes:[{width:1920,height:460,media:"min-width: 1024px"},{width:1024,height:320,media:"min-width: 734px"}]}},computed:{cityKey(){return`${this.stateKey}-${this.city.toLowerCase()}`},stateKey(){return`${this.countryKey}-${this.stateCode.toLowerCase()}`},countryKey(){return`bp-hero-country-${this.isoCode.toLowerCase()}`}},apollo:{query:O`
			query bpHeroBackgroundCountry($loanId: Int!) {
				lend {
					loan(id: $loanId) {
						id
						geocode {
							city
							state
							country {
								id
								isoCode
							}
						}
					}
				}
			}
		`,preFetch:!0,shouldPreFetch(e,{route:t}){var n;return!!((n=t==null?void 0:t.params)!=null&&n.id)},preFetchVariables({route:e}){var t;return{loanId:Number(((t=e==null?void 0:e.params)==null?void 0:t.id)??0)}},variables(){var e,t;return{loanId:this.loanId||Number(((t=(e=this.$route)==null?void 0:e.params)==null?void 0:t.id)??0)}},result(e){var n,i,o,r,c,s;const t=((i=(n=e==null?void 0:e.data)==null?void 0:n.lend)==null?void 0:i.loan)??{};this.isoCode=((r=(o=t==null?void 0:t.geocode)==null?void 0:o.country)==null?void 0:r.isoCode)??"",this.stateCode=((c=t==null?void 0:t.geocode)==null?void 0:c.state)??"",this.city=((s=t==null?void 0:t.geocode)==null?void 0:s.city)??""}},methods:{fetchImage(){this.apollo.query({query:O`
					query bpHeroBackgroundImage(
						$stateKey: String,
						$cityKey: String,
						$countryKey: String,
						$placeholderKey: String
						) {
						contentful {
							city: searchEntries(contentType: "background", contentKey: $cityKey) {
								total
								skip
								limit
								items {
									entryId
									entry
								}
							}
							state: searchEntries(contentType: "background", contentKey: $stateKey) {
								total
								skip
								limit
								items {
									entryId
									entry
								}
							}
							country: searchEntries(contentType: "background", contentKey: $countryKey) {
								total
								skip
								limit
								items {
									entryId
									entry
								}
							}
							placeholder: searchEntries(contentType: "background", contentKey: $placeholderKey) {
								total
								skip
								limit
								items {
									entryId
									entry
								}
							}
						}
					}
				`,variables:{cityKey:this.cityKey,stateKey:this.stateKey,countryKey:this.countryKey,placeholderKey:this.placeholderKey}}).then(e=>{var r,c,s,l,a,d,u,f,y,h,m,p,g,K,b,k,w,C,I,_,$,S,v,B,H,q,x,A,N,E,z,F,L,T,j,V,P,D,G,J;const t=((u=(d=(a=(l=(s=(c=(r=e==null?void 0:e.data)==null?void 0:r.contentful)==null?void 0:c.city)==null?void 0:s.items)==null?void 0:l[0])==null?void 0:a.entry)==null?void 0:d.fields)==null?void 0:u.backgroundMedia)??null,n=((K=(g=(p=(m=(h=(y=(f=e==null?void 0:e.data)==null?void 0:f.contentful)==null?void 0:y.state)==null?void 0:h.items)==null?void 0:m[0])==null?void 0:p.entry)==null?void 0:g.fields)==null?void 0:K.backgroundMedia)??null,i=(($=(_=(I=(C=(w=(k=(b=e==null?void 0:e.data)==null?void 0:b.contentful)==null?void 0:k.country)==null?void 0:w.items)==null?void 0:C[0])==null?void 0:I.entry)==null?void 0:_.fields)==null?void 0:$.backgroundMedia)??null,o=((A=(x=(q=(H=(B=(v=(S=e==null?void 0:e.data)==null?void 0:S.contentful)==null?void 0:v.placeholder)==null?void 0:B.items)==null?void 0:H[0])==null?void 0:q.entry)==null?void 0:x.fields)==null?void 0:A.backgroundMedia)??null;t?(this.contentfulSrc=((E=(N=t==null?void 0:t.fields)==null?void 0:N.file)==null?void 0:E.url)??null,this.contentfulAlt=((z=t==null?void 0:t.fields)==null?void 0:z.description)??null):n?(this.contentfulSrc=((L=(F=n==null?void 0:n.fields)==null?void 0:F.file)==null?void 0:L.url)??null,this.contentfulAlt=((T=n==null?void 0:n.fields)==null?void 0:T.description)??null):i?(this.contentfulSrc=((V=(j=i==null?void 0:i.fields)==null?void 0:j.file)==null?void 0:V.url)??null,this.contentfulAlt=((P=i==null?void 0:i.fields)==null?void 0:P.description)??null):o&&(this.contentfulSrc=((G=(D=o==null?void 0:o.fields)==null?void 0:D.file)==null?void 0:G.url)??null,this.contentfulAlt=((J=o==null?void 0:o.fields)==null?void 0:J.description)??null)})}},watch:{isoCode(e,t){e&&e!==t&&this.fetchImage()}}},M={class:"tw-hidden md:tw-block tw-w-full tw-h-40 lg:tw-h-57.5 tw-bg-gradient-to-r tw-from-brand tw-to-brand-300"};function tt(e,t,n,i,o,r){const c=W("kv-contentful-img");return X(),R("div",M,[U(c,{class:"tw-w-full tw-h-full tw-object-cover","contentful-src":o.contentfulSrc,"fallback-format":"jpg",fit:"fill",alt:o.contentfulAlt,width:n.statusCard?336:1024,height:n.statusCard?92:320,"source-sizes":n.statusCard?[]:o.sourceSizes},null,8,["contentful-src","alt","width","height","source-sizes"])])}const lt=Z(Q,[["render",tt]]);Q.__docgenInfo={displayName:"HeroBackground",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"statusCard",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/HeroBackground.vue"]};export{lt as H};
