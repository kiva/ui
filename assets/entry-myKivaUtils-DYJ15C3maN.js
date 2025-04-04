import{g as u}from"./entry-index-CKVkeXup4D.js";import{a as X,o as G,b as W,d as Z}from"./entry-vue.esm-bundler-Bbq66B_iPn.js";import"./entry-KvWideLoanCard-ac7XPc0PbW.js";import"./entry-numeral-BEwyVwpTZh.js";import ee from"./entry-KvContentfulImg-euStQvIYwX.js";import{_ as te}from"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import{d as ne}from"./entry-experimentVersion-DPC15KwAMV.js";import{l as j}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{t as ie}from"./entry-experimentUtils-CZhauzP3sM.js";import{l as oe}from"./entry-logFormatter-DhjghUk5Me.js";const Q={name:"HeroBackground",inject:["apollo","cookieStore"],components:{KvContentfulImg:ee},props:{loanId:{type:Number,default:0}},data(){return{contentfulAlt:"",contentfulSrc:"",isoCode:"",stateCode:"",city:"",placeholderKey:"bp-hero-country-placeholder",sourceSizes:[{width:1920,height:460,media:"min-width: 1024px"},{width:1024,height:320,media:"min-width: 734px"}]}},computed:{cityKey(){return`${this.stateKey}-${this.city.toLowerCase()}`},stateKey(){return`${this.countryKey}-${this.stateCode.toLowerCase()}`},countryKey(){return`bp-hero-country-${this.isoCode.toLowerCase()}`}},apollo:{query:u`
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
		`,preFetch:!0,preFetchVariables({route:e}){var n;const t=(e==null?void 0:e.value)??e;return{loanId:Number(((n=t==null?void 0:t.params)==null?void 0:n.id)??0)}},variables(){var e,t;return{loanId:this.loanId||Number(((t=(e=this.$route)==null?void 0:e.params)==null?void 0:t.id)??0)}},result(e){var n,o,i,r,s,a;const t=((o=(n=e==null?void 0:e.data)==null?void 0:n.lend)==null?void 0:o.loan)??{};this.isoCode=((r=(i=t==null?void 0:t.geocode)==null?void 0:i.country)==null?void 0:r.isoCode)??"",this.stateCode=((s=t==null?void 0:t.geocode)==null?void 0:s.state)??"",this.city=((a=t==null?void 0:t.geocode)==null?void 0:a.city)??""}},methods:{fetchImage(){this.apollo.query({query:u`
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
				`,variables:{cityKey:this.cityKey,stateKey:this.stateKey,countryKey:this.countryKey,placeholderKey:this.placeholderKey}}).then(e=>{var r,s,a,l,c,p,y,h,g,k,v,b,K,S,w,I,_,N,E,$,C,A,F,P,U,T,R,x,L,V,M,O,q,B,D,H;const t=((p=(c=(l=(a=(s=(r=e==null?void 0:e.data)==null?void 0:r.contentful)==null?void 0:s.city)==null?void 0:a.items)==null?void 0:l[0])==null?void 0:c.fields)==null?void 0:p.backgroundMedia)??null,n=((b=(v=(k=(g=(h=(y=e==null?void 0:e.data)==null?void 0:y.contentful)==null?void 0:h.state)==null?void 0:g.items)==null?void 0:k[0])==null?void 0:v.fields)==null?void 0:b.backgroundMedia)??null,o=((N=(_=(I=(w=(S=(K=e==null?void 0:e.data)==null?void 0:K.contentful)==null?void 0:S.country)==null?void 0:w.items)==null?void 0:I[0])==null?void 0:_.fields)==null?void 0:N.backgroundMedia)??null,i=((P=(F=(A=(C=($=(E=e==null?void 0:e.data)==null?void 0:E.contentful)==null?void 0:$.placeholder)==null?void 0:C.items)==null?void 0:A[0])==null?void 0:F.fields)==null?void 0:P.backgroundMedia)??null;t?(this.contentfulSrc=((T=(U=t==null?void 0:t.fields)==null?void 0:U.file)==null?void 0:T.url)??null,this.contentfulAlt=((R=t==null?void 0:t.fields)==null?void 0:R.description)??null):n?(this.contentfulSrc=((L=(x=n==null?void 0:n.fields)==null?void 0:x.file)==null?void 0:L.url)??null,this.contentfulAlt=((V=n==null?void 0:n.fields)==null?void 0:V.description)??null):o?(this.contentfulSrc=((O=(M=o==null?void 0:o.fields)==null?void 0:M.file)==null?void 0:O.url)??null,this.contentfulAlt=((q=o==null?void 0:o.fields)==null?void 0:q.description)??null):i&&(this.contentfulSrc=((D=(B=i==null?void 0:i.fields)==null?void 0:B.file)==null?void 0:D.url)??null,this.contentfulAlt=((H=i==null?void 0:i.fields)==null?void 0:H.description)??null)})}},watch:{isoCode(e,t){e&&e!==t&&this.fetchImage()}}},re={class:"tw-hidden md:tw-block tw-w-full tw-h-40 lg:tw-h-57.5 tw-bg-gradient-to-r tw-from-brand tw-to-brand-300"};function se(e,t,n,o,i,r){const s=X("kv-contentful-img");return G(),W("div",re,[Z(s,{class:"tw-w-full tw-h-full tw-object-cover","contentful-src":i.contentfulSrc,"fallback-format":"jpg",fit:"fill",alt:i.contentfulAlt,width:1024,height:320,"source-sizes":i.sourceSizes},null,8,["contentful-src","alt","source-sizes"])])}const Ie=te(Q,[["render",se]]);Q.__docgenInfo={displayName:"HeroBackground",exportName:"default",description:"",tags:{},props:[{name:"loanId",type:{name:"number"},defaultValue:{func:!1,value:"0"}}],sourceFiles:["/home/runner/work/ui/ui/src/components/BorrowerProfile/HeroBackground.vue"]};const m={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"PostCheckoutAchievements"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"loanIds"}},type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"postCheckoutAchievements"},arguments:[{kind:"Argument",name:{kind:"Name",value:"loanIds"},value:{kind:"Variable",name:{kind:"Name",value:"loanIds"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"overallProgress"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"achievementId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"preCheckoutTier"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"postCheckoutTier"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"contributingLoanIds"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:243}};m.loc.source={body:`
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

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const d=(e,t)=>{if(e.kind==="FragmentSpread")t.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&t.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){d(n,t)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){d(n,t)}),e.definitions&&e.definitions.forEach(function(n){d(n,t)})},f={},ae=e=>{e.definitions.forEach(function(t){if(t.name){const n=new Set;d(t,n),f[t.name.value]=n}})};ae(m);const J=(e,t)=>{for(let n=0;n<e.definitions.length;n++){const o=e.definitions[n];if(o.name&&o.name.value==t)return o}},ce=(e,t)=>{const n={kind:e.kind,definitions:[J(e,t)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const o=f[t]||new Set,i=new Set;let r=new Set;for(o.forEach(s=>{r.add(s)});r.size>0;){const s=r;r=new Set,s.forEach(a=>{i.has(a)||(i.add(a),(f[a]||new Set).forEach(c=>{r.add(c)}))})}return i.forEach(s=>{const a=J(e,s);a&&n.definitions.push(a)}),n};ce(m,"PostCheckoutAchievements");const Y="myKivaJan2025Exp",z="my_kiva_jan_2025",le=4,_e="general.my_kiva_all_users.value",de=u`
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
`,Ne=e=>{var o,i,r,s;const t=((i=(o=e==null?void 0:e.geocode)==null?void 0:o.country)==null?void 0:i.region)??"",n=((s=(r=e==null?void 0:e.geocode)==null?void 0:r.country)==null?void 0:s.name)??"";if(t==="North America"&&n==="United States")return!0;switch(t){case"Central America":case"Africa":case"Asia":return!0;default:return!1}},fe=async(e,t)=>{try{return await e.mutate({mutation:de,variables:{preferences:JSON.stringify(t)}})}catch(n){j(n,"myKivaUtils createUserPreferencesMutation")}},me=async(e,t,n,o)=>{try{const i=JSON.stringify({...n,...o});return await e.mutate({mutation:ue,variables:{updateUserPreferencesId:t.id,preferences:i}})}catch(i){j(i,"myKivaUtils updateUserPreferencesMutation")}},Ee=(e,t,n,o,i)=>{let r={},s=!1;try{const a=(n==null?void 0:n.preferences)??"";r=a?JSON.parse(a):{},s=!!((r==null?void 0:r[Y])??!1)}catch{oe("getIsMyKivaEnabled JSON parsing exception","error")}if(s||o<le||i){const{version:a}=e.readFragment({id:`Experiment:${z}`,fragment:ne})??{},l=a==="b";if(ie(e,t,"event-tracking",z,"EXP-MP-1235-Jan2025"),l&&!s&&typeof window<"u"&&typeof n<"u"){const c={[Y]:1};n===null?fe(e,c):me(e,n,r,c)}return s||l}return!1};export{Ie as H,_e as M,m as d,Ee as g,Ne as h};
