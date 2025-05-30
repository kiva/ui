import{_ as f}from"./entry-experimentVersion-B5y4RTPkgZ.js";import{l as m}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{r as N}from"./entry-settingsUtils-BglWvcCZaO.js";import{l as k}from"./entry-logFormatter-DhjghUk5Me.js";import{g as y}from"./entry-numeral-DJCTM12wUX.js";const _=`query experimentSetting($key: String!) {
	general {
		uiExperimentSetting(key: $key) {
			key
			value
		}
	}
}
`,E={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentSetting"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"key"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"uiExperimentSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"Variable",name:{kind:"Name",value:"key"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:150,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:_}}},x=`query experimentIds{
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
`,h={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentAssignment"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"experiment"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"version"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:131,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:b}}};async function q(e,i){var r,a,c,t;let n;try{const s=e.readQuery({query:v});n=JSON.parse((a=(r=s==null?void 0:s.general)==null?void 0:r.activeExperiments)==null?void 0:a.value).split(",")}catch{}if(!(n!=null&&n.length))try{const{data:s}=await i.query({query:v});n=JSON.parse((t=(c=s==null?void 0:s.general)==null?void 0:c.activeExperiments)==null?void 0:t.value).split(",")}catch{}return n??[]}function J(e,i){try{const n=e.readQuery({query:E,variables:{key:i}});return N(n,"general.uiExperimentSetting.value")??{}}catch(n){return m(n,`getExperimentSettingCached experimentSetting: ${i}`),{}}}function A(e,i,n,r,a,c=void 0){const t=e.readFragment({id:`Experiment:${r}`,fragment:f})??{};return t.version&&t.version!=="unassigned"&&i(n,a??r,t.version,c),t}const G=async e=>{let i;try{i=await q(e.cache,e)}catch(n){k(n,"error")}return Promise.all((i??[]).map(n=>e.query({query:h,variables:{id:n}})))},g="myKivaJan2025Exp",p="my_kiva_jan_2025",M=4,L="general.my_kiva_all_users.value",S="myKivaGuestAssignment",F=y`
	mutation createUserPreferences($preferences: String) {
		my {
			createUserPreferences(userPreferences: { preferences: $preferences }) {
				id
				preferences
			}
		}
	}
`,U=y`
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
`,Q=e=>{var r,a,c,t;const i=((a=(r=e==null?void 0:e.geocode)==null?void 0:r.country)==null?void 0:a.region)??"",n=((t=(c=e==null?void 0:e.geocode)==null?void 0:c.country)==null?void 0:t.name)??"";if(i==="North America"&&n==="United States")return!0;switch(i){case"Central America":case"Africa":case"Asia":return!0;default:return!1}},K=async(e,i)=>{try{return await e.mutate({mutation:F,variables:{preferences:JSON.stringify(i)}})}catch(n){m(n,"myKivaUtils createUserPreferencesMutation")}},$=async(e,i,n,r)=>{try{const a=JSON.stringify({...n,...r});return await e.mutate({mutation:U,variables:{updateUserPreferencesId:i.id,preferences:a}})}catch(a){m(a,"myKivaUtils updateUserPreferencesMutation")}},R=(e,i,n)=>{n&&i&&(e==null||e.set(S,"true",{path:"/"}))},O=e=>!!(e!=null&&e.get(S)),I=e=>{const i=new Date;i.setMonth(i.getMonth()+2),e==null||e.set("mykivaredirect","true",i)},T=(e,i,n,r,a,c)=>{let t={},s=!1;try{const d=(n==null?void 0:n.preferences)??"";t=d?JSON.parse(d):{},s=!!((t==null?void 0:t[g])??!1)}catch{k("getIsMyKivaEnabled JSON parsing exception","error")}if(s||r<M||a||O(c)){const{version:d}=e.readFragment({id:`Experiment:${p}`,fragment:f})??{},u=d==="b";if(A(e,i,"event-tracking",p,"EXP-MP-1235-Jan2025"),u&&!s&&typeof window<"u"&&typeof n<"u"){const o={[g]:1};n===null?K(e,o):$(e,n,t,o)}const l=s||u;return l&&I(c),l}return!1};export{L as M,h as _,G as a,J as b,T as g,Q as h,R as s,A as t};
