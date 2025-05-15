import{d as I}from"./entry-experimentVersion-DPC15KwAMV.js";import{l as E}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{r as M}from"./entry-settingsUtils-B6HCH--cCk.js";import{l as O}from"./entry-logFormatter-DhjghUk5Me.js";import{g as _}from"./entry-numeral-CMfb424cHV.js";const k={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentSetting"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"key"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"uiExperimentSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"Variable",name:{kind:"Name",value:"key"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:142}};k.loc.source={body:`
                query experimentSetting($key: String!) {
	general {
		uiExperimentSetting(key: $key) {
			key
			value
		}
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const f=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){f(n,i)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){f(n,i)}),e.definitions&&e.definitions.forEach(function(n){f(n,i)})},g={},V=e=>{e.definitions.forEach(function(i){if(i.name){const n=new Set;f(i,n),g[i.name.value]=n}})};V(k);const R=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const s=e.definitions[n];if(s.name&&s.name.value==i)return s}},q=(e,i)=>{const n={kind:e.kind,definitions:[R(e,i)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const s=g[i]||new Set,c=new Set;let r=new Set;for(s.forEach(t=>{r.add(t)});r.size>0;){const t=r;r=new Set,t.forEach(a=>{c.has(a)||(c.add(a),(g[a]||new Set).forEach(o=>{r.add(o)}))})}return c.forEach(t=>{const a=R(e,t);a&&n.definitions.push(a)}),n};q(k,"experimentSetting");const d={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentIds"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"activeExperiments"},name:{kind:"Name",value:"uiConfigSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"active_experiments",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:153}};d.loc.source={body:`
                query experimentIds{
	general {
		activeExperiments: uiConfigSetting(key: "active_experiments") {
			key
			value
		}
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const u=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){u(n,i)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){u(n,i)}),e.definitions&&e.definitions.forEach(function(n){u(n,i)})},h={},C=e=>{e.definitions.forEach(function(i){if(i.name){const n=new Set;u(i,n),h[i.name.value]=n}})};C(d);const x=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const s=e.definitions[n];if(s.name&&s.name.value==i)return s}},U=(e,i)=>{const n={kind:e.kind,definitions:[x(e,i)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const s=h[i]||new Set,c=new Set;let r=new Set;for(s.forEach(t=>{r.add(t)});r.size>0;){const t=r;r=new Set,t.forEach(a=>{c.has(a)||(c.add(a),(h[a]||new Set).forEach(o=>{r.add(o)}))})}return c.forEach(t=>{const a=x(e,t);a&&n.definitions.push(a)}),n};U(d,"experimentIds");const p={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentAssignment"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"experiment"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"version"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:123}};p.loc.source={body:`
                query experimentAssignment($id: String) {
	experiment(id: $id) @client {
		id
		version
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const m=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){m(n,i)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){m(n,i)}),e.definitions&&e.definitions.forEach(function(n){m(n,i)})},y={},K=e=>{e.definitions.forEach(function(i){if(i.name){const n=new Set;m(i,n),y[i.name.value]=n}})};K(p);const F=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const s=e.definitions[n];if(s.name&&s.name.value==i)return s}},T=(e,i)=>{const n={kind:e.kind,definitions:[F(e,i)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const s=y[i]||new Set,c=new Set;let r=new Set;for(s.forEach(t=>{r.add(t)});r.size>0;){const t=r;r=new Set,t.forEach(a=>{c.has(a)||(c.add(a),(y[a]||new Set).forEach(o=>{r.add(o)}))})}return c.forEach(t=>{const a=F(e,t);a&&n.definitions.push(a)}),n};T(p,"experimentAssignment");async function L(e,i){var s,c,r,t;let n;try{const a=e.readQuery({query:d});n=JSON.parse((c=(s=a==null?void 0:a.general)==null?void 0:s.activeExperiments)==null?void 0:c.value).split(",")}catch{}if(!(n!=null&&n.length))try{const{data:a}=await i.query({query:d});n=JSON.parse((t=(r=a==null?void 0:a.general)==null?void 0:r.activeExperiments)==null?void 0:t.value).split(",")}catch{}return n??[]}function ae(e,i){try{const n=e.readQuery({query:k,variables:{key:i}});return M(n,"general.uiExperimentSetting.value")??{}}catch(n){return E(n,`getExperimentSettingCached experimentSetting: ${i}`),{}}}function Q(e,i,n,s,c,r=void 0){const t=e.readFragment({id:`Experiment:${s}`,fragment:I})??{};return t.version&&t.version!=="unassigned"&&i(n,c??s,t.version,r),t}const se=async e=>{let i;try{i=await L(e.cache,e)}catch(n){O(n,"error")}return Promise.all((i??[]).map(n=>e.query({query:p,variables:{id:n}})))},w={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"PostCheckoutAchievements"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"loanIds"}},type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"postCheckoutAchievements"},arguments:[{kind:"Argument",name:{kind:"Name",value:"loanIds"},value:{kind:"Variable",name:{kind:"Name",value:"loanIds"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"overallProgress"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"achievementId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"preCheckoutTier"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"postCheckoutTier"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"contributingLoanIds"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:243}};w.loc.source={body:`
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

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const v=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){v(n,i)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){v(n,i)}),e.definitions&&e.definitions.forEach(function(n){v(n,i)})},S={},G=e=>{e.definitions.forEach(function(i){if(i.name){const n=new Set;v(i,n),S[i.name.value]=n}})};G(w);const $=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const s=e.definitions[n];if(s.name&&s.name.value==i)return s}},J=(e,i)=>{const n={kind:e.kind,definitions:[$(e,i)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const s=S[i]||new Set,c=new Set;let r=new Set;for(s.forEach(t=>{r.add(t)});r.size>0;){const t=r;r=new Set,t.forEach(a=>{c.has(a)||(c.add(a),(S[a]||new Set).forEach(o=>{r.add(o)}))})}return c.forEach(t=>{const a=$(e,t);a&&n.definitions.push(a)}),n};J(w,"PostCheckoutAchievements");const D="myKivaJan2025Exp",A="my_kiva_jan_2025",Y=4,re="general.my_kiva_all_users.value",P="myKivaGuestAssignment",z=_`
	mutation createUserPreferences($preferences: String) {
		my {
			createUserPreferences(userPreferences: { preferences: $preferences }) {
				id
				preferences
			}
		}
	}
`,X=_`
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
`,ce=e=>{var s,c,r,t;const i=((c=(s=e==null?void 0:e.geocode)==null?void 0:s.country)==null?void 0:c.region)??"",n=((t=(r=e==null?void 0:e.geocode)==null?void 0:r.country)==null?void 0:t.name)??"";if(i==="North America"&&n==="United States")return!0;switch(i){case"Central America":case"Africa":case"Asia":return!0;default:return!1}},j=async(e,i)=>{try{return await e.mutate({mutation:z,variables:{preferences:JSON.stringify(i)}})}catch(n){E(n,"myKivaUtils createUserPreferencesMutation")}},B=async(e,i,n,s)=>{try{const c=JSON.stringify({...n,...s});return await e.mutate({mutation:X,variables:{updateUserPreferencesId:i.id,preferences:c}})}catch(c){E(c,"myKivaUtils updateUserPreferencesMutation")}},oe=(e,i,n)=>{n&&i&&(e==null||e.set(P,"true",{path:"/"}))},H=e=>!!(e!=null&&e.get(P)),W=e=>{const i=new Date;i.setMonth(i.getMonth()+2),e==null||e.set("mykivaredirect","true",i)},le=(e,i,n,s,c,r)=>{let t={},a=!1;try{const l=(n==null?void 0:n.preferences)??"";t=l?JSON.parse(l):{},a=!!((t==null?void 0:t[D])??!1)}catch{O("getIsMyKivaEnabled JSON parsing exception","error")}if(a||s<Y||c||H(r)){const{version:l}=e.readFragment({id:`Experiment:${A}`,fragment:I})??{},o=l==="b";if(Q(e,i,"event-tracking",A,"EXP-MP-1235-Jan2025"),o&&!a&&typeof window<"u"&&typeof n<"u"){const b={[D]:1};n===null?j(e,b):B(e,n,t,b)}const N=a||o;return N&&W(r),N}return!1};export{re as M,se as a,p as b,ae as c,w as d,le as g,ce as h,oe as s,Q as t};
