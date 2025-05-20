const c={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"updateLoanReservation"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"loanid"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"price"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Money"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"updateLoanReservation"},arguments:[{kind:"Argument",name:{kind:"Name",value:"loanReservation"},value:{kind:"ObjectValue",fields:[{kind:"ObjectField",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"loanid"}}},{kind:"ObjectField",name:{kind:"Name",value:"price"},value:{kind:"Variable",name:{kind:"Name",value:"price"}}}]}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"price"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:257}};c.loc.source={body:`
                mutation updateLoanReservation($loanid: Int!, $price: Money!, $basketId: String) {
	shop (basketId: $basketId) {
		id
		updateLoanReservation (loanReservation: {
			id: $loanid
			price: $price
		})
		{
			id
			price
		}
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const o=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){o(n,i)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){o(n,i)}),e.definitions&&e.definitions.forEach(function(n){o(n,i)})},r={},u=e=>{e.definitions.forEach(function(i){if(i.name){const n=new Set;o(i,n),r[i.name.value]=n}})};u(c);const m=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const t=e.definitions[n];if(t.name&&t.name.value==i)return t}},v=(e,i)=>{const n={kind:e.kind,definitions:[m(e,i)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const t=r[i]||new Set,s=new Set;let d=new Set;for(t.forEach(l=>{d.add(l)});d.size>0;){const l=d;d=new Set,l.forEach(a=>{s.has(a)||(s.add(a),(r[a]||new Set).forEach(k=>{d.add(k)}))})}return s.forEach(l=>{const a=m(e,l);a&&n.definitions.push(a)}),n};v(c,"updateLoanReservation");export{c as d};
