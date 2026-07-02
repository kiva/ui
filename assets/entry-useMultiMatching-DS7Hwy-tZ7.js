import{z as t,l as a}from"./entry-vue.esm-bundler-Du63x9n7zJ.js";import{r as l}from"./entry-settingsUtils-DyCLv7scRe.js";import{l as r}from"./entry-logReadQueryError-Codcl0QZ_g.js";const o=`query MultiMatchingEnabled {
	general {
		multiMatchingEnabled: featureSetting(key: "create_multi_match_reservations.enabled") {
			key
			value
		}
	}
}
`,u={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"MultiMatchingEnabled"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"multiMatchingEnabled"},name:{kind:"Name",value:"featureSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"create_multi_match_reservations.enabled",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:192,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:o}}};function m(){const i=a("apollo"),n=t(!1);return i&&i.query({query:u}).then(({data:e})=>{n.value=l(e,"general.multiMatchingEnabled.value")??!1}).catch(e=>r(e,"useMultiMatching multiMatchingEnabled")),{enableMultiMatching:n}}export{m as u};
