import{_ as p}from"./entry-experimentVersion-B5y4RTPkgZ.js";import{l as c}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{r as _}from"./entry-settingsUtils-BglWvcCZaO.js";import{l as y}from"./entry-logFormatter-DhjghUk5Me.js";import{g as f}from"./entry-numeral-DJCTM12wUX.js";const N=`query experimentSetting($key: String!) {
	general {
		uiExperimentSetting(key: $key) {
			key
			value
		}
	}
}
`,E={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentSetting"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"key"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"uiExperimentSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"Variable",name:{kind:"Name",value:"key"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:150,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:N}}},x=`query experimentIds{
	general {
		activeExperiments: uiConfigSetting(key: "active_experiments") {
			key
			value
		}
	}
}
`,v={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentIds"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"activeExperiments"},name:{kind:"Name",value:"uiConfigSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"active_experiments",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:161,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:x}}},b=`query experimentAssignment($id: String) {
	experiment(id: $id) @client {
		id
		version
	}
}
`,F={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentAssignment"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"experiment"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"version"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:131,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:b}}};async function q(e,i){var s,r,l,t;let n;try{const a=e.readQuery({query:v});n=JSON.parse((r=(s=a==null?void 0:a.general)==null?void 0:s.activeExperiments)==null?void 0:r.value).split(",")}catch{}if(!(n!=null&&n.length))try{const{data:a}=await i.query({query:v});n=JSON.parse((t=(l=a==null?void 0:a.general)==null?void 0:l.activeExperiments)==null?void 0:t.value).split(",")}catch{}return n??[]}function J(e,i){try{const n=e.readQuery({query:E,variables:{key:i}});return _(n,"general.uiExperimentSetting.value")??{}}catch(n){return c(n,`getExperimentSettingCached experimentSetting: ${i}`),{}}}function h(e,i,n,s,r,l=void 0){const t=e.readFragment({id:`Experiment:${s}`,fragment:p})??{};return t.version&&t.version!=="unassigned"&&i(n,r??s,t.version,l),t}const L=async e=>{let i;try{i=await q(e.cache,e)}catch(n){y(n,"error")}return Promise.all((i??[]).map(n=>e.query({query:F,variables:{id:n}})))},A=`query myKivaForAllUsers {
	my {
		id
		userPreferences {
			id
			preferences
		}
		loans {
			totalCount
		}
	}
	general {
		my_kiva_all_users: uiConfigSetting(key: "my_kiva_all_users_enable") {
			key
			value
		}
	}
}
`,Q={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"myKivaForAllUsers"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userPreferences"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"preferences"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"loans"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"my_kiva_all_users"},name:{kind:"Name",value:"uiConfigSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"my_kiva_all_users_enable",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:259,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:A}}},k="myKivaJan2025Exp",g="my_kiva_jan_2025",K=4,R="general.my_kiva_all_users.value",S="myKivaGuestAssignment",M=f`
	mutation createUserPreferences($preferences: String) {
		my {
			createUserPreferences(userPreferences: { preferences: $preferences }) {
				id
				preferences
			}
		}
	}
`,U=f`
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
`,$=async(e,i)=>{try{return await e.mutate({mutation:M,variables:{preferences:JSON.stringify(i)}})}catch(n){c(n,"myKivaUtils createUserPreferencesMutation")}},O=async(e,i,n,s)=>{try{const r=JSON.stringify({...n,...s});return await e.mutate({mutation:U,variables:{updateUserPreferencesId:i.id,preferences:r}})}catch(r){c(r,"myKivaUtils updateUserPreferencesMutation")}},T=(e,i,n)=>{n&&i&&(e==null||e.set(S,"true",{path:"/"}))},D=e=>!!(e!=null&&e.get(S)),I=e=>{const i=new Date;i.setMonth(i.getMonth()+2),e==null||e.set("mykivaredirect","true",i)},Y=(e,i,n,s,r,l)=>{let t={},a=!1;try{const d=(n==null?void 0:n.preferences)??"";t=d?JSON.parse(d):{},a=!!((t==null?void 0:t[k])??!1)}catch{y("getIsMyKivaEnabled JSON parsing exception","error")}if(a||s<K||r||D(l)){const{version:d}=e.readFragment({id:`Experiment:${g}`,fragment:p})??{},m=d==="b";if(h(e,i,"event-tracking",g,"EXP-MP-1235-Jan2025"),m&&!a&&typeof window<"u"&&typeof n<"u"){const o={[k]:1};n===null?$(e,o):O(e,n,t,o)}const u=a||m;return u&&I(l),u}return!1};export{R as M,Q as _,L as a,F as b,J as c,Y as g,T as s,h as t};
