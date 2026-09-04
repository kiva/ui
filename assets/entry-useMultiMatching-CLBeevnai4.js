import{q as n}from"./entry-vue.esm-bundler-CkX4CbCAj4.js";import{a as o}from"./entry-settingsUtils-DJB3XWMHQq.js";import{u as r}from"./entry-useApolloQuery-BhW_iXEb35.js";const u=`query MultiMatchingEnabled {
	general {
		multiMatchingEnabled: featureSetting(key: "create_multi_match_reservations.enabled") {
			key
			value
		}
	}
}
`,s={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"MultiMatchingEnabled"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"multiMatchingEnabled"},name:{kind:"Name",value:"featureSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"create_multi_match_reservations.enabled",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:192,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:u}}},t={query:s},c=[t];function g(){const{result:e,error:i}=r(t),a=n(()=>o(e.value,"general.multiMatchingEnabled.value")??!1),l=n(()=>e.value!==null||i.value!==null);return{enableMultiMatching:a,multiMatchingResolved:l}}const k=[...c];export{k as _,g as u};
