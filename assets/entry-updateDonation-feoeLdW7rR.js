const r={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"updateDonation"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"price"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Money"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"isTip"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Boolean"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"updateDonation"},arguments:[{kind:"Argument",name:{kind:"Name",value:"donation"},value:{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"price"},value:{kind:"Variable",name:{kind:"Name",value:"price"}}},{kind:"ObjectField",name:{kind:"Name",value:"isTip"},value:{kind:"Variable",name:{kind:"Name",value:"isTip"}}}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"price"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isTip"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:251}};r.loc.source={body:`
                mutation updateDonation($price: Money!, $isTip: Boolean!, $basketId: String) {
	shop (basketId: $basketId) {
		id
		updateDonation (donation: {
			price: $price,
			isTip: $isTip
		})
		{
			id
			price
			isTip
		}
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const o=(e,n)=>{if(e.kind==="FragmentSpread")n.add(e.name.value);else if(e.kind==="VariableDefinition"){const i=e.type;i.kind==="NamedType"&&n.add(i.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(i){o(i,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(i){o(i,n)}),e.definitions&&e.definitions.forEach(function(i){o(i,n)})},c={},u=e=>{e.definitions.forEach(function(n){if(n.name){const i=new Set;o(n,i),c[n.name.value]=i}})};u(r);const m=(e,n)=>{for(let i=0;i<e.definitions.length;i++){const t=e.definitions[i];if(t.name&&t.name.value==n)return t}},f=(e,n)=>{const i={kind:e.kind,definitions:[m(e,n)]};e.hasOwnProperty("loc")&&(i.loc=e.loc);const t=c[n]||new Set,s=new Set;let d=new Set;for(t.forEach(l=>{d.add(l)});d.size>0;){const l=d;d=new Set,l.forEach(a=>{s.has(a)||(s.add(a),(c[a]||new Set).forEach(k=>{d.add(k)}))})}return s.forEach(l=>{const a=m(e,l);a&&i.definitions.push(a)}),i};f(r,"updateDonation");export{r as d};
