const d={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"achievementMilestonesForCheckout"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"loanIds"}},type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"String"}}}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"achievementMilestonesForCheckout"},arguments:[{kind:"Argument",name:{kind:"Name",value:"loanIds"},value:{kind:"Variable",name:{kind:"Name",value:"loanIds"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"checkoutMilestoneProgresses"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"achievement"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"milestoneName"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"postCheckoutProgress"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"progress"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"status"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"target"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:276}};d.loc.source={body:`
                query achievementMilestonesForCheckout($loanIds: [String!]!) {
	achievementMilestonesForCheckout(loanIds: $loanIds){
		checkoutMilestoneProgresses {
			achievement
			milestoneName
			postCheckoutProgress
			progress
			status
			target
		}
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const l=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){l(n,i)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){l(n,i)}),e.definitions&&e.definitions.forEach(function(n){l(n,i)})},r={},f=e=>{e.definitions.forEach(function(i){if(i.name){const n=new Set;l(i,n),r[i.name.value]=n}})};f(d);const m=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const s=e.definitions[n];if(s.name&&s.name.value==i)return s}},k=(e,i)=>{const n={kind:e.kind,definitions:[m(e,i)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const s=r[i]||new Set,t=new Set;let o=new Set;for(s.forEach(c=>{o.add(c)});o.size>0;){const c=o;o=new Set,c.forEach(a=>{t.has(a)||(t.add(a),(r[a]||new Set).forEach(u=>{o.add(u)}))})}return t.forEach(c=>{const a=m(e,c);a&&n.definitions.push(a)}),n};k(d,"achievementMilestonesForCheckout");const v="womens-equality",h="us-economic-equality",g="climate-action",E="refugee-equality",p="basic-needs",y=[v,h,p,g,E];function N(e=[],i=""){return e.filter(t=>t.achievement===i).filter(t=>t.status!=="COMPLETABLE"&&t.status!=="ALREADY_COMPLETE")}export{y as d,N as m};
