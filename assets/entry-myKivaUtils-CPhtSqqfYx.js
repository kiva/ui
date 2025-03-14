import{g as u}from"./entry-index-CKVkeXup4D.js";import{a as X,o as G,b as W,d as Z}from"./entry-vue.esm-bundler-Bbq66B_iPn.js";import"./entry-KvWideLoanCard-M9KpJ2J73i.js";import"./entry-numeral-BEwyVwpTZh.js";import ee from"./entry-KvContentfulImg-CznyjpsOtr.js";import{_ as te}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{d as ne}from"./entry-experimentVersion-DPC15KwAMV.js";import{l as Y}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{t as ie}from"./entry-experimentUtils-CZhauzP3sM.js";import{l as oe}from"./entry-logFormatter-DhjghUk5Me.js";const Q={name:"HeroBackground",inject:["apollo","cookieStore"],components:{KvContentfulImg:ee},props:{loanId:{type:Number,default:0}},data(){return{contentfulAlt:"",contentfulSrc:"",isoCode:"",stateCode:"",city:"",placeholderKey:"bp-hero-country-placeholder",sourceSizes:[{width:1920,height:460,media:"min-width: 1024px"},{width:1024,height:320,media:"min-width: 734px"}]}},computed:{cityKey(){return`${this.stateKey}-${this.city.toLowerCase()}`},stateKey(){return`${this.countryKey}-${this.stateCode.toLowerCase()}`},countryKey(){return`bp-hero-country-${this.isoCode.toLowerCase()}`}},apollo:{query:u`
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
		`,preFetch:!0,preFetchVariables({route:e}){var n;const t=(e==null?void 0:e.value)??e;return{loanId:Number(((n=t==null?void 0:t.params)==null?void 0:n.id)??0)}},variables(){var e,t;return{loanId:this.loanId||Number(((t=(e=this.$route)==null?void 0:e.params)==null?void 0:t.id)??0)}},result(e){var n,o,i,s,r,a;const t=((o=(n=e==null?void 0:e.data)==null?void 0:n.lend)==null?void 0:o.loan)??{};this.isoCode=((s=(i=t==null?void 0:t.geocode)==null?void 0:i.country)==null?void 0:s.isoCode)??"",this.stateCode=((r=t==null?void 0:t.geocode)==null?void 0:r.state)??"",this.city=((a=t==null?void 0:t.geocode)==null?void 0:a.city)??""}},methods:{fetchImage(){this.apollo.query({query:u`
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
				`,variables:{cityKey:this.cityKey,stateKey:this.stateKey,countryKey:this.countryKey,placeholderKey:this.placeholderKey}}).then(e=>{var s,r,a,c,d,p,y,h,g,k,v,b,w,K,S,I,N,_,$,C,E,A,P,F,U,T,x,R,V,L,q,B,O,D,M,H;const t=((p=(d=(c=(a=(r=(s=e==null?void 0:e.data)==null?void 0:s.contentful)==null?void 0:r.city)==null?void 0:a.items)==null?void 0:c[0])==null?void 0:d.fields)==null?void 0:p.backgroundMedia)??null,n=((b=(v=(k=(g=(h=(y=e==null?void 0:e.data)==null?void 0:y.contentful)==null?void 0:h.state)==null?void 0:g.items)==null?void 0:k[0])==null?void 0:v.fields)==null?void 0:b.backgroundMedia)??null,o=((_=(N=(I=(S=(K=(w=e==null?void 0:e.data)==null?void 0:w.contentful)==null?void 0:K.country)==null?void 0:S.items)==null?void 0:I[0])==null?void 0:N.fields)==null?void 0:_.backgroundMedia)??null,i=((F=(P=(A=(E=(C=($=e==null?void 0:e.data)==null?void 0:$.contentful)==null?void 0:C.placeholder)==null?void 0:E.items)==null?void 0:A[0])==null?void 0:P.fields)==null?void 0:F.backgroundMedia)??null;t?(this.contentfulSrc=((T=(U=t==null?void 0:t.fields)==null?void 0:U.file)==null?void 0:T.url)??null,this.contentfulAlt=((x=t==null?void 0:t.fields)==null?void 0:x.description)??null):n?(this.contentfulSrc=((V=(R=n==null?void 0:n.fields)==null?void 0:R.file)==null?void 0:V.url)??null,this.contentfulAlt=((L=n==null?void 0:n.fields)==null?void 0:L.description)??null):o?(this.contentfulSrc=((B=(q=o==null?void 0:o.fields)==null?void 0:q.file)==null?void 0:B.url)??null,this.contentfulAlt=((O=o==null?void 0:o.fields)==null?void 0:O.description)??null):i&&(this.contentfulSrc=((M=(D=i==null?void 0:i.fields)==null?void 0:D.file)==null?void 0:M.url)??null,this.contentfulAlt=((H=i==null?void 0:i.fields)==null?void 0:H.description)??null)})}},watch:{isoCode(e,t){e&&e!==t&&this.fetchImage()}}},re={class:"tw-hidden md:tw-block tw-w-full tw-h-40 lg:tw-h-57.5 tw-bg-gradient-to-r tw-from-brand tw-to-brand-300"};function se(e,t,n,o,i,s){const r=X("kv-contentful-img");return G(),W("div",re,[Z(r,{class:"tw-w-full tw-h-full tw-object-cover","contentful-src":i.contentfulSrc,"fallback-format":"jpg",fit:"fill",alt:i.contentfulAlt,width:1024,height:320,"source-sizes":i.sourceSizes},null,8,["contentful-src","alt","source-sizes"])])}const Ie=te(Q,[["render",se]]);Q.__docgenInfo={displayName:"HeroBackground",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/HeroBackground.vue"]};const m={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"PostCheckoutAchievements"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"loanIds"}},type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"postCheckoutAchievements"},arguments:[{kind:"Argument",name:{kind:"Name",value:"loanIds"},value:{kind:"Variable",name:{kind:"Name",value:"loanIds"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"overallProgress"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"achievementId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"preCheckoutTier"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"postCheckoutTier"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"contributingLoanIds"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:243}};m.loc.source={body:`
                query PostCheckoutAchievements($loanIds: [Int!]!) {
	postCheckoutAchievements(loanIds: $loanIds) {
		overallProgress {
			id
			achievementId
			preCheckoutTier
			postCheckoutTier
			contributingLoanIds
		}
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const l=(e,t)=>{if(e.kind==="FragmentSpread")t.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&t.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){l(n,t)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){l(n,t)}),e.definitions&&e.definitions.forEach(function(n){l(n,t)})},f={},ae=e=>{e.definitions.forEach(function(t){if(t.name){const n=new Set;l(t,n),f[t.name.value]=n}})};ae(m);const J=(e,t)=>{for(let n=0;n<e.definitions.length;n++){const o=e.definitions[n];if(o.name&&o.name.value==t)return o}},ce=(e,t)=>{const n={kind:e.kind,definitions:[J(e,t)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const o=f[t]||new Set,i=new Set;let s=new Set;for(o.forEach(r=>{s.add(r)});s.size>0;){const r=s;s=new Set,r.forEach(a=>{i.has(a)||(i.add(a),(f[a]||new Set).forEach(d=>{s.add(d)}))})}return i.forEach(r=>{const a=J(e,r);a&&n.definitions.push(a)}),n};ce(m,"PostCheckoutAchievements");const z="myKivaJan2025Exp",j="my_kiva_jan_2025",de=4,le=u`
	mutation createUserPreferences($preferences: String) {
		my {
			createUserPreferences(userPreferences: { preferences: $preferences }) {
				id
				preferences
			}
		}
	}
`,ue=u`
	mutation UpdateUserPreferences(
		$updateUserPreferencesId: Int!,
		$preferences: String
	) {
		my {
			updateUserPreferences(id: $updateUserPreferencesId, userPreferences: {
				preferences: $preferences
		}) {
				id
				preferences
			}
		}
	}
`,Ne=e=>{var o,i,s,r;const t=((i=(o=e==null?void 0:e.geocode)==null?void 0:o.country)==null?void 0:i.region)??"",n=((r=(s=e==null?void 0:e.geocode)==null?void 0:s.country)==null?void 0:r.name)??"";if(t==="North America"&&n==="United States")return!0;switch(t){case"Central America":case"Africa":case"Asia":return!0;default:return!1}},fe=async(e,t)=>{try{return await e.mutate({mutation:le,variables:{preferences:JSON.stringify(t)}})}catch(n){Y(n,"myKivaUtils createUserPreferencesMutation")}},me=async(e,t,n,o)=>{try{const i=JSON.stringify({...n,...o});return await e.mutate({mutation:ue,variables:{updateUserPreferencesId:t.id,preferences:i}})}catch(i){Y(i,"myKivaUtils updateUserPreferencesMutation")}},_e=(e,t,n,o)=>{let i={},s=!1;try{const r=(n==null?void 0:n.preferences)??"";i=r?JSON.parse(r):{},s=!!((i==null?void 0:i[z])??!1)}catch{oe("getIsMyKivaEnabled JSON parsing exception","error")}if(s||o<de){const{version:r}=e.readFragment({id:`Experiment:${j}`,fragment:ne})??{},a=r==="b";if(ie(e,t,"event-tracking",j,"EXP-MP-1235-Jan2025"),a&&!s&&typeof window<"u"&&typeof n<"u"){const c={[z]:1};n===null?fe(e,c):me(e,n,i,c)}return s||a}return!1};export{Ie as H,m as d,_e as g,Ne as h};
