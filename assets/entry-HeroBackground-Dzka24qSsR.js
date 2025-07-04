import{g as P}from"./entry-numeral-DJCTM12wUX.js";import{c as G,a as J,r as O,o as Q}from"./entry-vue.esm-bundler-D5m7h15tzB.js";import"./entry-KvSecondaryNav-DRnkkPAFON.js";import R from"./entry-KvContentfulImg-BPpUk7xXAO.js";import{_ as U}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const D={name:"HeroBackground",inject:["apollo","cookieStore"],components:{KvContentfulImg:R},props:{loanId:{type:Number,default:0}},data(){return{contentfulAlt:"",contentfulSrc:"",isoCode:"",stateCode:"",city:"",placeholderKey:"bp-hero-country-placeholder",sourceSizes:[{width:1920,height:460,media:"min-width: 1024px"},{width:1024,height:320,media:"min-width: 734px"}]}},computed:{cityKey(){return`${this.stateKey}-${this.city.toLowerCase()}`},stateKey(){return`${this.countryKey}-${this.stateCode.toLowerCase()}`},countryKey(){return`bp-hero-country-${this.isoCode.toLowerCase()}`}},apollo:{query:P`
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
		`,preFetch:!0,preFetchVariables({route:e}){var t;return{loanId:Number(((t=e==null?void 0:e.params)==null?void 0:t.id)??0)}},variables(){var e,t;return{loanId:this.loanId||Number(((t=(e=this.$route)==null?void 0:e.params)==null?void 0:t.id)??0)}},result(e){var n,c,o,r,i,l;const t=((c=(n=e==null?void 0:e.data)==null?void 0:n.lend)==null?void 0:c.loan)??{};this.isoCode=((r=(o=t==null?void 0:t.geocode)==null?void 0:o.country)==null?void 0:r.isoCode)??"",this.stateCode=((i=t==null?void 0:t.geocode)==null?void 0:i.state)??"",this.city=((l=t==null?void 0:t.geocode)==null?void 0:l.city)??""}},methods:{fetchImage(){this.apollo.query({query:P`
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
				`,variables:{cityKey:this.cityKey,stateKey:this.stateKey,countryKey:this.countryKey,placeholderKey:this.placeholderKey}}).then(e=>{var r,i,l,s,a,d,u,f,y,h,p,m,g,K,b,w,k,_,$,C,I,S,v,B,H,q,x,A,N,z,T,j,F,L,E,V;const t=((d=(a=(s=(l=(i=(r=e==null?void 0:e.data)==null?void 0:r.contentful)==null?void 0:i.city)==null?void 0:l.items)==null?void 0:s[0])==null?void 0:a.fields)==null?void 0:d.backgroundMedia)??null,n=((m=(p=(h=(y=(f=(u=e==null?void 0:e.data)==null?void 0:u.contentful)==null?void 0:f.state)==null?void 0:y.items)==null?void 0:h[0])==null?void 0:p.fields)==null?void 0:m.backgroundMedia)??null,c=((_=(k=(w=(b=(K=(g=e==null?void 0:e.data)==null?void 0:g.contentful)==null?void 0:K.country)==null?void 0:b.items)==null?void 0:w[0])==null?void 0:k.fields)==null?void 0:_.backgroundMedia)??null,o=((B=(v=(S=(I=(C=($=e==null?void 0:e.data)==null?void 0:$.contentful)==null?void 0:C.placeholder)==null?void 0:I.items)==null?void 0:S[0])==null?void 0:v.fields)==null?void 0:B.backgroundMedia)??null;t?(this.contentfulSrc=((q=(H=t==null?void 0:t.fields)==null?void 0:H.file)==null?void 0:q.url)??null,this.contentfulAlt=((x=t==null?void 0:t.fields)==null?void 0:x.description)??null):n?(this.contentfulSrc=((N=(A=n==null?void 0:n.fields)==null?void 0:A.file)==null?void 0:N.url)??null,this.contentfulAlt=((z=n==null?void 0:n.fields)==null?void 0:z.description)??null):c?(this.contentfulSrc=((j=(T=c==null?void 0:c.fields)==null?void 0:T.file)==null?void 0:j.url)??null,this.contentfulAlt=((F=c==null?void 0:c.fields)==null?void 0:F.description)??null):o&&(this.contentfulSrc=((E=(L=o==null?void 0:o.fields)==null?void 0:L.file)==null?void 0:E.url)??null,this.contentfulAlt=((V=o==null?void 0:o.fields)==null?void 0:V.description)??null)})}},watch:{isoCode(e,t){e&&e!==t&&this.fetchImage()}}},W={class:"tw-hidden md:tw-block tw-w-full tw-h-40 lg:tw-h-57.5 tw-bg-gradient-to-r tw-from-brand tw-to-brand-300"};function X(e,t,n,c,o,r){const i=O("kv-contentful-img");return Q(),G("div",W,[J(i,{class:"tw-w-full tw-h-full tw-object-cover","contentful-src":o.contentfulSrc,"fallback-format":"jpg",fit:"fill",alt:o.contentfulAlt,width:1024,height:320,"source-sizes":o.sourceSizes},null,8,["contentful-src","alt","source-sizes"])])}const oe=U(D,[["render",X]]);D.__docgenInfo={displayName:"HeroBackground",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/HeroBackground.vue"]};export{oe as H};
