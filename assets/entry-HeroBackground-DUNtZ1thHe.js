import{g as P}from"./entry-index-CWclSTHHJk.js";import{c as G,a as J,r as O,o as Q}from"./entry-vue.esm-bundler-C0PPCo9W96.js";import"./entry-KvWwwHeader-C1bm1YMh4q.js";import R from"./entry-KvContentfulImg-B0t9ZCrx8O.js";import"./entry-numeral-xVHG5DEP0A.js";import{_ as U}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const D={name:"HeroBackground",inject:["apollo","cookieStore"],components:{KvContentfulImg:R},props:{loanId:{type:Number,default:0},statusCard:{type:Boolean,default:!1}},data(){return{contentfulAlt:"",contentfulSrc:"",isoCode:"",stateCode:"",city:"",placeholderKey:"bp-hero-country-placeholder",sourceSizes:[{width:1920,height:460,media:"min-width: 1024px"},{width:1024,height:320,media:"min-width: 734px"}]}},computed:{cityKey(){return`${this.stateKey}-${this.city.toLowerCase()}`},stateKey(){return`${this.countryKey}-${this.stateCode.toLowerCase()}`},countryKey(){return`bp-hero-country-${this.isoCode.toLowerCase()}`}},apollo:{query:P`
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
		`,preFetch:!0,preFetchVariables({route:e}){var t;return{loanId:Number(((t=e==null?void 0:e.params)==null?void 0:t.id)??0)}},variables(){var e,t;return{loanId:this.loanId||Number(((t=(e=this.$route)==null?void 0:e.params)==null?void 0:t.id)??0)}},result(e){var o,c,n,l,i,r;const t=((c=(o=e==null?void 0:e.data)==null?void 0:o.lend)==null?void 0:c.loan)??{};this.isoCode=((l=(n=t==null?void 0:t.geocode)==null?void 0:n.country)==null?void 0:l.isoCode)??"",this.stateCode=((i=t==null?void 0:t.geocode)==null?void 0:i.state)??"",this.city=((r=t==null?void 0:t.geocode)==null?void 0:r.city)??""}},methods:{fetchImage(){this.apollo.query({query:P`
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
				`,variables:{cityKey:this.cityKey,stateKey:this.stateKey,countryKey:this.countryKey,placeholderKey:this.placeholderKey}}).then(e=>{var l,i,r,s,a,d,u,f,h,y,p,m,g,K,b,w,k,C,_,$,I,S,v,B,H,q,x,A,N,j,z,T,F,L,V,E;const t=((d=(a=(s=(r=(i=(l=e==null?void 0:e.data)==null?void 0:l.contentful)==null?void 0:i.city)==null?void 0:r.items)==null?void 0:s[0])==null?void 0:a.fields)==null?void 0:d.backgroundMedia)??null,o=((m=(p=(y=(h=(f=(u=e==null?void 0:e.data)==null?void 0:u.contentful)==null?void 0:f.state)==null?void 0:h.items)==null?void 0:y[0])==null?void 0:p.fields)==null?void 0:m.backgroundMedia)??null,c=((C=(k=(w=(b=(K=(g=e==null?void 0:e.data)==null?void 0:g.contentful)==null?void 0:K.country)==null?void 0:b.items)==null?void 0:w[0])==null?void 0:k.fields)==null?void 0:C.backgroundMedia)??null,n=((B=(v=(S=(I=($=(_=e==null?void 0:e.data)==null?void 0:_.contentful)==null?void 0:$.placeholder)==null?void 0:I.items)==null?void 0:S[0])==null?void 0:v.fields)==null?void 0:B.backgroundMedia)??null;t?(this.contentfulSrc=((q=(H=t==null?void 0:t.fields)==null?void 0:H.file)==null?void 0:q.url)??null,this.contentfulAlt=((x=t==null?void 0:t.fields)==null?void 0:x.description)??null):o?(this.contentfulSrc=((N=(A=o==null?void 0:o.fields)==null?void 0:A.file)==null?void 0:N.url)??null,this.contentfulAlt=((j=o==null?void 0:o.fields)==null?void 0:j.description)??null):c?(this.contentfulSrc=((T=(z=c==null?void 0:c.fields)==null?void 0:z.file)==null?void 0:T.url)??null,this.contentfulAlt=((F=c==null?void 0:c.fields)==null?void 0:F.description)??null):n&&(this.contentfulSrc=((V=(L=n==null?void 0:n.fields)==null?void 0:L.file)==null?void 0:V.url)??null,this.contentfulAlt=((E=n==null?void 0:n.fields)==null?void 0:E.description)??null)})}},watch:{isoCode(e,t){e&&e!==t&&this.fetchImage()}}},W={class:"tw-hidden md:tw-block tw-w-full tw-h-40 lg:tw-h-57.5 tw-bg-gradient-to-r tw-from-brand tw-to-brand-300"};function X(e,t,o,c,n,l){const i=O("kv-contentful-img");return Q(),G("div",W,[J(i,{class:"tw-w-full tw-h-full tw-object-cover","contentful-src":n.contentfulSrc,"fallback-format":"jpg",fit:"fill",alt:n.contentfulAlt,width:o.statusCard?336:1024,height:o.statusCard?92:320,"source-sizes":o.statusCard?[]:n.sourceSizes},null,8,["contentful-src","alt","width","height","source-sizes"])])}const ne=U(D,[["render",X]]);D.__docgenInfo={displayName:"HeroBackground",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}},{name:"statusCard",type:{name:"boolean"},defaultValue:{func:!1,value:"false"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/HeroBackground.vue"]};export{ne as H};
