const r={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"myKivaForAllUsers"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"my"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"userPreferences"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"preferences"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"loans"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"general"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"my_kiva_all_users"},name:{kind:"Name",value:"uiConfigSetting"},arguments:[{kind:"Argument",name:{kind:"Name",value:"key"},value:{kind:"StringValue",value:"my_kiva_all_users_enable",block:!1}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:251}};r.loc.source={body:`
                query myKivaForAllUsers {
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

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const o=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){o(n,i)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){o(n,i)}),e.definitions&&e.definitions.forEach(function(n){o(n,i)})},c={},f=e=>{e.definitions.forEach(function(i){if(i.name){const n=new Set;o(i,n),c[i.name.value]=n}})};f(r);const u=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const a=e.definitions[n];if(a.name&&a.name.value==i)return a}},k=(e,i)=>{const n={kind:e.kind,definitions:[u(e,i)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const a=c[i]||new Set,d=new Set;let s=new Set;for(a.forEach(l=>{s.add(l)});s.size>0;){const l=s;s=new Set,l.forEach(t=>{d.has(t)||(d.add(t),(c[t]||new Set).forEach(m=>{s.add(m)}))})}return d.forEach(l=>{const t=u(e,l);t&&n.definitions.push(t)}),n};k(r,"myKivaForAllUsers");export{r as d};
