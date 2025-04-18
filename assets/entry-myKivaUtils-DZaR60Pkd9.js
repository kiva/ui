import{d as D}from"./entry-experimentVersion-DPC15KwAMV.js";import{l as E}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{r as O}from"./entry-settingsUtils-CFNuLM2VJH.js";import{l as I}from"./entry-logFormatter-DhjghUk5Me.js";import{g as A}from"./entry-index-DGXt1zOePE.js";const k={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentSetting"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"key"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"uiExperimentSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"Variable",name:{kind:"Name",value:"key"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:142}};k.loc.source={body:`
                query experimentSetting($key: String!) {
	general {
		uiExperimentSetting(key: $key) {
			key
			value
		}
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const f=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){f(n,i)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){f(n,i)}),e.definitions&&e.definitions.forEach(function(n){f(n,i)})},S={},P=e=>{e.definitions.forEach(function(i){if(i.name){const n=new Set;f(i,n),S[i.name.value]=n}})};P(k);const N=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const r=e.definitions[n];if(r.name&&r.name.value==i)return r}},_=(e,i)=>{const n={kind:e.kind,definitions:[N(e,i)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const r=S[i]||new Set,c=new Set;let s=new Set;for(r.forEach(a=>{s.add(a)});s.size>0;){const a=s;s=new Set,a.forEach(t=>{c.has(t)||(c.add(t),(S[t]||new Set).forEach(o=>{s.add(o)}))})}return c.forEach(a=>{const t=N(e,a);t&&n.definitions.push(t)}),n};_(k,"experimentSetting");const d={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentIds"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"activeExperiments"},name:{kind:"Name",value:"uiConfigSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"active_experiments",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:153}};d.loc.source={body:`
                query experimentIds{
	general {
		activeExperiments: uiConfigSetting(key: "active_experiments") {
			key
			value
		}
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const u=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){u(n,i)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){u(n,i)}),e.definitions&&e.definitions.forEach(function(n){u(n,i)})},g={},V=e=>{e.definitions.forEach(function(i){if(i.name){const n=new Set;u(i,n),g[i.name.value]=n}})};V(d);const b=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const r=e.definitions[n];if(r.name&&r.name.value==i)return r}},q=(e,i)=>{const n={kind:e.kind,definitions:[b(e,i)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const r=g[i]||new Set,c=new Set;let s=new Set;for(r.forEach(a=>{s.add(a)});s.size>0;){const a=s;s=new Set,a.forEach(t=>{c.has(t)||(c.add(t),(g[t]||new Set).forEach(o=>{s.add(o)}))})}return c.forEach(a=>{const t=b(e,a);t&&n.definitions.push(t)}),n};q(d,"experimentIds");const p={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentAssignment"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"experiment"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"version"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:123}};p.loc.source={body:`
                query experimentAssignment($id: String) {
	experiment(id: $id) @client {
		id
		version
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const m=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){m(n,i)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){m(n,i)}),e.definitions&&e.definitions.forEach(function(n){m(n,i)})},h={},U=e=>{e.definitions.forEach(function(i){if(i.name){const n=new Set;m(i,n),h[i.name.value]=n}})};U(p);const R=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const r=e.definitions[n];if(r.name&&r.name.value==i)return r}},T=(e,i)=>{const n={kind:e.kind,definitions:[R(e,i)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const r=h[i]||new Set,c=new Set;let s=new Set;for(r.forEach(a=>{s.add(a)});s.size>0;){const a=s;s=new Set,a.forEach(t=>{c.has(t)||(c.add(t),(h[t]||new Set).forEach(o=>{s.add(o)}))})}return c.forEach(a=>{const t=R(e,a);t&&n.definitions.push(t)}),n};T(p,"experimentAssignment");async function C(e,i){var r,c,s,a;let n;try{const t=e.readQuery({query:d});n=JSON.parse((c=(r=t==null?void 0:t.general)==null?void 0:r.activeExperiments)==null?void 0:c.value).split(",")}catch{}if(!(n!=null&&n.length))try{const{data:t}=await i.query({query:d});n=JSON.parse((a=(s=t==null?void 0:t.general)==null?void 0:s.activeExperiments)==null?void 0:a.value).split(",")}catch{}return n??[]}function Z(e,i){try{const n=e.readQuery({query:k,variables:{key:i}});return O(n,"general.uiExperimentSetting.value")??{}}catch(n){return E(n,`getExperimentSettingCached experimentSetting: ${i}`),{}}}function M(e,i,n,r,c,s=void 0){const a=e.readFragment({id:`Experiment:${r}`,fragment:D})??{};return a.version&&a.version!=="unassigned"&&i(n,c??r,a.version,s),a}const ee=async e=>{let i;try{i=await C(e.cache,e)}catch(n){I(n,"error")}return Promise.all((i??[]).map(n=>e.query({query:p,variables:{id:n}})))},w={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"PostCheckoutAchievements"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"loanIds"}},type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"postCheckoutAchievements"},arguments:[{kind:"Argument",name:{kind:"Name",value:"loanIds"},value:{kind:"Variable",name:{kind:"Name",value:"loanIds"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"overallProgress"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"achievementId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"preCheckoutTier"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"postCheckoutTier"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"contributingLoanIds"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:243}};w.loc.source={body:`
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

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const v=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){v(n,i)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){v(n,i)}),e.definitions&&e.definitions.forEach(function(n){v(n,i)})},y={},K=e=>{e.definitions.forEach(function(i){if(i.name){const n=new Set;v(i,n),y[i.name.value]=n}})};K(w);const x=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const r=e.definitions[n];if(r.name&&r.name.value==i)return r}},L=(e,i)=>{const n={kind:e.kind,definitions:[x(e,i)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const r=y[i]||new Set,c=new Set;let s=new Set;for(r.forEach(a=>{s.add(a)});s.size>0;){const a=s;s=new Set,a.forEach(t=>{c.has(t)||(c.add(t),(y[t]||new Set).forEach(o=>{s.add(o)}))})}return c.forEach(a=>{const t=x(e,a);t&&n.definitions.push(t)}),n};L(w,"PostCheckoutAchievements");const F="myKivaJan2025Exp",$="my_kiva_jan_2025",Q=4,ne="general.my_kiva_all_users.value",J=A`
	mutation createUserPreferences($preferences: String) {
		my {
			createUserPreferences(userPreferences: { preferences: $preferences }) {
				id
				preferences
			}
		}
	}
`,Y=A`
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
`,ie=e=>{var r,c,s,a;const i=((c=(r=e==null?void 0:e.geocode)==null?void 0:r.country)==null?void 0:c.region)??"",n=((a=(s=e==null?void 0:e.geocode)==null?void 0:s.country)==null?void 0:a.name)??"";if(i==="North America"&&n==="United States")return!0;switch(i){case"Central America":case"Africa":case"Asia":return!0;default:return!1}},z=async(e,i)=>{try{return await e.mutate({mutation:J,variables:{preferences:JSON.stringify(i)}})}catch(n){E(n,"myKivaUtils createUserPreferencesMutation")}},G=async(e,i,n,r)=>{try{const c=JSON.stringify({...n,...r});return await e.mutate({mutation:Y,variables:{updateUserPreferencesId:i.id,preferences:c}})}catch(c){E(c,"myKivaUtils updateUserPreferencesMutation")}},te=(e,i,n,r,c)=>{let s={},a=!1;try{const t=(n==null?void 0:n.preferences)??"";s=t?JSON.parse(t):{},a=!!((s==null?void 0:s[F])??!1)}catch{I("getIsMyKivaEnabled JSON parsing exception","error")}if(a||r<Q||c){const{version:t}=e.readFragment({id:`Experiment:${$}`,fragment:D})??{},l=t==="b";if(M(e,i,"event-tracking",$,"EXP-MP-1235-Jan2025"),l&&!a&&typeof window<"u"&&typeof n<"u"){const o={[F]:1};n===null?z(e,o):G(e,n,s,o)}return a||l}return!1};export{ne as M,ee as a,p as b,Z as c,w as d,te as g,ie as h,M as t};
