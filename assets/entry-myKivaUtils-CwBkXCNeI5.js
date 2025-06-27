import{l as m}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{r as y}from"./entry-settingsUtils-BglWvcCZaO.js";import{g}from"./entry-numeral-DJCTM12wUX.js";import{l as _}from"./entry-logFormatter-DhjghUk5Me.js";const S=`fragment experimentVersion on Experiment {
	id
	version
}
`,f={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"experimentVersion"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Experiment"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"version"},arguments:[],directives:[]}]}}],loc:{start:0,end:96,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:S}}},N=`query myKivaForAllUsers {
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
`,C={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"myKivaForAllUsers"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userPreferences"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"preferences"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"loans"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"my_kiva_all_users"},name:{kind:"Name",value:"uiConfigSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"my_kiva_all_users_enable",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:259,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:N}}},E=`query experimentSetting($key: String!) {
	general {
		uiExperimentSetting(key: $key) {
			key
			value
		}
	}
}
`,F={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentSetting"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"key"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"uiExperimentSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"Variable",name:{kind:"Name",value:"key"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:150,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:E}}};function V(e,i){try{const n=e.readQuery({query:F,variables:{key:i}});return y(n,"general.uiExperimentSetting.value")??{}}catch(n){return m(n,`getExperimentSettingCached experimentSetting: ${i}`),{}}}function x(e,i,n,r,a,d=void 0){const t=e.readFragment({id:`Experiment:${r}`,fragment:f})??{};return t.version&&t.version!=="unassigned"&&i(n,a??r,t.version,d),t}const v="myKivaJan2025Exp",k="my_kiva_jan_2025",b=4,D="general.my_kiva_all_users.value",p="myKivaGuestAssignment",K=g`
	mutation createUserPreferences($preferences: String) {
		my {
			createUserPreferences(userPreferences: { preferences: $preferences }) {
				id
				preferences
			}
		}
	}
`,M=g`
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
`,U=async(e,i)=>{try{return await e.mutate({mutation:K,variables:{preferences:JSON.stringify(i)}})}catch(n){m(n,"myKivaUtils createUserPreferencesMutation")}},h=async(e,i,n,r)=>{try{const a=JSON.stringify({...n,...r});return await e.mutate({mutation:M,variables:{updateUserPreferencesId:i.id,preferences:a}})}catch(a){m(a,"myKivaUtils updateUserPreferencesMutation")}},G=(e,i,n)=>{n&&i&&(e==null||e.set(p,"true",{path:"/"}))},q=e=>!!(e!=null&&e.get(p)),$=e=>{const i=new Date;i.setMonth(i.getMonth()+2),e==null||e.set("mykivaredirect","true",i)},w=(e,i,n,r,a,d)=>{let t={},l=!1;try{const s=(n==null?void 0:n.preferences)??"";t=s?JSON.parse(s):{},l=!!((t==null?void 0:t[v])??!1)}catch{_("getIsMyKivaEnabled JSON parsing exception","error")}if(l||r<b||a||q(d)){const{version:s}=e.readFragment({id:`Experiment:${k}`,fragment:f})??{},c=s==="b";if(x(e,i,"event-tracking",k,"EXP-MP-1235-Jan2025"),c&&!l&&typeof window<"u"&&typeof n<"u"){const o={[v]:1};n===null?U(e,o):h(e,n,t,o)}const u=l||c;return u&&$(d),u}return!1};export{D as M,C as _,f as a,V as b,w as g,G as s,x as t};
