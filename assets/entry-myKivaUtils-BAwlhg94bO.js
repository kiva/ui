import{l as m}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{r as k}from"./entry-settingsUtils-BglWvcCZaO.js";import{g}from"./entry-index-DzTqzqs3pZ.js";import{l as _}from"./entry-logFormatter-DhjghUk5Me.js";const E=`fragment experimentVersion on Experiment {
	id
	version
}
`,v={kind:"Document",definitions:[{kind:"FragmentDefinition",name:{kind:"Name",value:"experimentVersion"},typeCondition:{kind:"NamedType",name:{kind:"Name",value:"Experiment"}},directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"version"},arguments:[],directives:[]}]}}],loc:{start:0,end:96,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:E}}},N=`query experimentSetting($key: String!) {
	general {
		uiExperimentSetting(key: $key) {
			key
			value
		}
	}
}
`,S={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentSetting"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"key"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"uiExperimentSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"Variable",name:{kind:"Name",value:"key"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:150,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:N}}};function V(e,t){try{const n=e.readQuery({query:S,variables:{key:t}});return k(n,"general.uiExperimentSetting.value")??{}}catch(n){return m(n,`getExperimentSettingCached experimentSetting: ${t}`),{}}}function x(e,t,n,a,r,d=void 0){const i=e.readFragment({id:`Experiment:${a}`,fragment:v})??{};return i.version&&i.version!=="unassigned"&&t(n,r??a,i.version,d),i}const p="myKivaJan2025Exp",f="my_kiva_jan_2025",M=4,q="general.my_kiva_all_users.value",y="myKivaGuestAssignment",C="loan_purchase",K=g`
	mutation createUserPreferences($preferences: String) {
		my {
			createUserPreferences(userPreferences: { preferences: $preferences }) {
				id
				preferences
			}
		}
	}
`,U=g`
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
`,h=async(e,t)=>{try{return await e.mutate({mutation:K,variables:{preferences:JSON.stringify(t)}})}catch(n){m(n,"myKivaUtils createUserPreferencesMutation")}},I=async(e,t,n,a)=>{try{const r=JSON.stringify({...n,...a});return await e.mutate({mutation:U,variables:{updateUserPreferencesId:t.id,preferences:r}})}catch(r){m(r,"myKivaUtils updateUserPreferencesMutation")}},T=(e,t,n)=>{n&&t&&(e==null||e.set(y,"true",{path:"/"}))},b=e=>!!(e!=null&&e.get(y)),A=e=>{const t=new Date;t.setMonth(t.getMonth()+2),e==null||e.set("mykivaredirect","true",t)},w=(e,t,n,a,r,d)=>{let i={},c=!1;try{const s=(n==null?void 0:n.preferences)??"";i=s?JSON.parse(s):{},c=!!((i==null?void 0:i[p])??!1)}catch{_("getIsMyKivaEnabled JSON parsing exception","error")}if(c||a<M||r||b(d)){const{version:s}=e.readFragment({id:`Experiment:${f}`,fragment:v})??{},u=s==="b";if(x(e,t,"event-tracking",f,"EXP-MP-1235-Jan2025"),u&&!c&&typeof window<"u"&&typeof n<"u"){const o={[p]:1};n===null?h(e,o):I(e,n,i,o)}const l=c||u;return l&&A(d),l}return!1};export{q as M,C as T,v as _,V as a,w as g,T as s,x as t};
