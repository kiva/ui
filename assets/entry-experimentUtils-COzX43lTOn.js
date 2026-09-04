import{_ as l}from"./entry-experimentVersion-B5y4RTPkgZ.js";import{r as o}from"./entry-settingsUtils-DJB3XWMHQq.js";import{l as m}from"./entry-logReadQueryError-BL2yt7MPC5.js";const s=`query experimentSetting($key: String!) {
	general {
		uiExperimentSetting(key: $key) {
			key
			value
		}
	}
}
`,u={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"experimentSetting"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"key"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"uiExperimentSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"Variable",name:{kind:"Name",value:"key"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:150,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:s}}};function v(t,n){try{const e=t.readQuery({query:u,variables:{key:n}});return o(e,"general.uiExperimentSetting.value")??{}}catch(e){return m(e,`getExperimentSettingCached experimentSetting: ${n}`),{}}}function p(t,n,e,a,r,d=void 0){const i=t.readFragment({id:`Experiment:${a}`,fragment:l})??{};return i.version&&i.version!=="unassigned"&&n(e,r??a,i.version,d),i}export{v as g,p as t};
