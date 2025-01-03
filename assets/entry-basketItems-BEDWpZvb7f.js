const r={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"basketItems"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"basket"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"items"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}}]}}]}}]}}]}}],loc:{start:0,end:223}};r.loc.source={body:`
                # This will get folded into loanCardData.graphql

query basketItems($basketId: String) {
	shop (basketId: $basketId) {
		id
		basket {
			id
			items {
				values {
					id
				}
			}
		}
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const l=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){l(n,i)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){l(n,i)}),e.definitions&&e.definitions.forEach(function(n){l(n,i)})},c={},f=e=>{e.definitions.forEach(function(i){if(i.name){const n=new Set;l(i,n),c[i.name.value]=n}})};f(r);const m=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const a=e.definitions[n];if(a.name&&a.name.value==i)return a}},u=(e,i)=>{const n={kind:e.kind,definitions:[m(e,i)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const a=c[i]||new Set,o=new Set;let s=new Set;for(a.forEach(d=>{s.add(d)});s.size>0;){const d=s;s=new Set,d.forEach(t=>{o.has(t)||(o.add(t),(c[t]||new Set).forEach(k=>{s.add(k)}))})}return o.forEach(d=>{const t=m(e,d);t&&n.definitions.push(t)}),n};u(r,"basketItems");export{r as d};
