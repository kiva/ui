import{_ as d}from"./entry-myKivaUtils-USlSQzpKdw.js";import{r as s}from"./entry-settingsUtils-BglWvcCZaO.js";import{l as m}from"./entry-logReadQueryError-Codcl0QZ_g.js";const o=`query myKivaForAllUsers {
	my {
		id
	}
	general {
		my_kiva_all_users: uiConfigSetting(key: "my_kiva_all_users_enable") {
			key
			value
		}
	}
}
`,S={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"myKivaForAllUsers"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"my_kiva_all_users"},name:{kind:"Name",value:"uiConfigSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"my_kiva_all_users_enable",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:186,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:o}}},u=`query experimentSetting($key: String!) {
	general {
		uiExperimentSetting(key: $key) {
			key
			value
		}
	}
}
`,c={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentSetting"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"key"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"uiExperimentSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"Variable",name:{kind:"Name",value:"key"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:150,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:u}}};function y(t,i){try{const e=t.readQuery({query:c,variables:{key:i}});return s(e,"general.uiExperimentSetting.value")??{}}catch(e){return m(e,`getExperimentSettingCached experimentSetting: ${i}`),{}}}function _(t,i,e,a,r,l=void 0){const n=t.readFragment({id:`Experiment:${a}`,fragment:d})??{};return n.version&&n.version!=="unassigned"&&i(e,r??a,n.version,l),n}export{S as _,y as g,_ as t};
