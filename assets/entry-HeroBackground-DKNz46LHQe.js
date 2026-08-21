import{g as E}from"./entry-index-CWclSTHHJk.js";import{c as G,d as J,h as O,o as Q}from"./entry-vue.esm-bundler-D8yP9bVmC4.js";import"./entry-KvWwwHeaderBasic-BB16oz4SiS.js";import"./entry-tailwind.config-DbyGLZVW5i.js";import R from"./entry-KvContentfulImg-Dz7EdpaAeS.js";import"./entry-numeral-xVHG5DEP0A.js";import{_ as U}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const D={name:"HeroBackground",inject:["apollo","cookieStore"],components:{KvContentfulImg:R},props:{loanId:{type:Number,default:0},statusCard:{type:Boolean,default:!1}},data(){return{contentfulAlt:"",contentfulSrc:"",isoCode:"",stateCode:"",city:"",placeholderKey:"bp-hero-country-placeholder",sourceSizes:[{width:1920,height:460,media:"min-width: 1024px"},{width:1024,height:320,media:"min-width: 734px"}]}},computed:{cityKey(){return`${this.stateKey}-${this.city.toLowerCase()}`},stateKey(){return`${this.countryKey}-${this.stateCode.toLowerCase()}`},countryKey(){return`bp-hero-country-${this.isoCode.toLowerCase()}`}},apollo:{query:E`
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
		`,preFetch:!0,shouldPreFetch(t,{route:e}){var o;return!!((o=e==null?void 0:e.params)!=null&&o.id)},preFetchVariables({route:t}){var e;return{loanId:Number(((e=t==null?void 0:t.params)==null?void 0:e.id)??0)}},variables(){var t,e;return{loanId:this.loanId||Number(((e=(t=this.$route)==null?void 0:t.params)==null?void 0:e.id)??0)}},result(t){var o,c,n,l,i,r;const e=((c=(o=t==null?void 0:t.data)==null?void 0:o.lend)==null?void 0:c.loan)??{};this.isoCode=((l=(n=e==null?void 0:e.geocode)==null?void 0:n.country)==null?void 0:l.isoCode)??"",this.stateCode=((i=e==null?void 0:e.geocode)==null?void 0:i.state)??"",this.city=((r=e==null?void 0:e.geocode)==null?void 0:r.city)??""}},methods:{fetchImage(){this.apollo.query({query:E`
					query bpHeroBackgroundImage(
						$stateKey: String,
						$cityKey: String,
						$countryKey: String,
						$placeholderKey: String
						) {
						contentful {
							city: entries(contentType: "background", contentKey: $cityKey)
							state: entries(contentType: "background", contentKey: $stateKey)
							country: entries(contentType: "background", contentKey: $countryKey)
							placeholder: entries(contentType: "background", contentKey: $placeholderKey)
						}
					}
				`,variables:{cityKey:this.cityKey,stateKey:this.stateKey,countryKey:this.countryKey,placeholderKey:this.placeholderKey}}).then(t=>{var l,i,r,s,a,d,u,f,h,y,p,m,g,K,b,w,k,C,_,$,I,S,v,B,H,q,x,A,N,z,F,L,T,j,V,P;const e=((d=(a=(s=(r=(i=(l=t==null?void 0:t.data)==null?void 0:l.contentful)==null?void 0:i.city)==null?void 0:r.items)==null?void 0:s[0])==null?void 0:a.fields)==null?void 0:d.backgroundMedia)??null,o=((m=(p=(y=(h=(f=(u=t==null?void 0:t.data)==null?void 0:u.contentful)==null?void 0:f.state)==null?void 0:h.items)==null?void 0:y[0])==null?void 0:p.fields)==null?void 0:m.backgroundMedia)??null,c=((C=(k=(w=(b=(K=(g=t==null?void 0:t.data)==null?void 0:g.contentful)==null?void 0:K.country)==null?void 0:b.items)==null?void 0:w[0])==null?void 0:k.fields)==null?void 0:C.backgroundMedia)??null,n=((B=(v=(S=(I=($=(_=t==null?void 0:t.data)==null?void 0:_.contentful)==null?void 0:$.placeholder)==null?void 0:I.items)==null?void 0:S[0])==null?void 0:v.fields)==null?void 0:B.backgroundMedia)??null;e?(this.contentfulSrc=((q=(H=e==null?void 0:e.fields)==null?void 0:H.file)==null?void 0:q.url)??null,this.contentfulAlt=((x=e==null?void 0:e.fields)==null?void 0:x.description)??null):o?(this.contentfulSrc=((N=(A=o==null?void 0:o.fields)==null?void 0:A.file)==null?void 0:N.url)??null,this.contentfulAlt=((z=o==null?void 0:o.fields)==null?void 0:z.description)??null):c?(this.contentfulSrc=((L=(F=c==null?void 0:c.fields)==null?void 0:F.file)==null?void 0:L.url)??null,this.contentfulAlt=((T=c==null?void 0:c.fields)==null?void 0:T.description)??null):n&&(this.contentfulSrc=((V=(j=n==null?void 0:n.fields)==null?void 0:j.file)==null?void 0:V.url)??null,this.contentfulAlt=((P=n==null?void 0:n.fields)==null?void 0:P.description)??null)})}},watch:{isoCode(t,e){t&&t!==e&&this.fetchImage()}}},W={class:"tw-hidden md:tw-block tw-w-full tw-h-40 lg:tw-h-57.5 tw-bg-gradient-to-r tw-from-brand tw-to-brand-300"};function X(t,e,o,c,n,l){const i=O("kv-contentful-img");return Q(),G("div",W,[J(i,{class:"tw-w-full tw-h-full tw-object-cover","contentful-src":n.contentfulSrc,"fallback-format":"jpg",fit:"fill",alt:n.contentfulAlt,width:o.statusCard?336:1024,height:o.statusCard?92:320,"source-sizes":o.statusCard?[]:n.sourceSizes},null,8,["contentful-src","alt","width","height","source-sizes"])])}const ce=U(D,[["render",X]]);D.__docgenInfo={displayName:"HeroBackground",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"statusCard",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/HeroBackground.vue"]};export{ce as H};
