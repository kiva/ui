const c={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"loanSearchStateQuery"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"loanSearchState"},arguments:[],directives:[{kind:"Directive",name:{kind:"Name",value:"client"},arguments:[]}],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"gender"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"sectorId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"countryIsoCode"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"sortBy"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"themeId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"tagId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"pageOffset"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"pageLimit"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"distributionModel"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isIndividual"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"lenderRepaymentTerm"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"min"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"max"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"keywordSearch"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"partnerId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"partnerRiskRating"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"min"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"max"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"partnerDefaultRate"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"min"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"max"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"partnerAvgProfitability"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"min"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"max"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"isMatchable"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"flexibleFundraisingEnabled"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"activityId"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:473}};c.loc.source={body:`
                query loanSearchStateQuery {
	loanSearchState @client {
		id
		gender
		sectorId
		countryIsoCode
		sortBy
		themeId
		tagId
		pageOffset
		pageLimit
		distributionModel
		isIndividual
		lenderRepaymentTerm {
			min
			max
		}
		keywordSearch
		partnerId
		partnerRiskRating {
			min
			max
		}
		partnerDefaultRate {
			min
			max
		}
		partnerAvgProfitability {
			min
			max
		}
		isMatchable
		flexibleFundraisingEnabled
		activityId
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const r=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(n){r(n,i)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(n){r(n,i)}),e.definitions&&e.definitions.forEach(function(n){r(n,i)})},m={},k=e=>{e.definitions.forEach(function(i){if(i.name){const n=new Set;r(i,n),m[i.name.value]=n}})};k(c);const o=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const a=e.definitions[n];if(a.name&&a.name.value==i)return a}},v=(e,i)=>{const n={kind:e.kind,definitions:[o(e,i)]};e.hasOwnProperty("loc")&&(n.loc=e.loc);const a=m[i]||new Set,l=new Set;let d=new Set;for(a.forEach(s=>{d.add(s)});d.size>0;){const s=d;d=new Set,s.forEach(t=>{l.has(t)||(l.add(t),(m[t]||new Set).forEach(u=>{d.add(u)}))})}return l.forEach(s=>{const t=o(e,s);t&&n.definitions.push(t)}),n};v(c,"loanSearchStateQuery");
