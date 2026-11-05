import{_ as N}from"./entry-loanCardFields-B0P-5lp--W.js";import{l as S}from"./entry-logReadQueryError-BL2yt7MPC5.js";import{f as g}from"./entry-filterConfig-FQH45DUwPz.js";const b=`#import '../fragments/loanCardFields.graphql'

query flssLoanData(
	$filterObject: [FundraisingLoanSearchFilterInput!]
	$sortBy: SortEnum = personalized
	$pageNumber: Int = 0
	$pageLimit: Int = 0
	$imgDefaultSize: String = "w480h360"
	$imgRetinaSize: String = "w960h720"
	$origin: String
) {
	fundraisingLoans(
		filters: $filterObject,
		limit: $pageLimit,
		pageNumber: $pageNumber,
		sortBy: $sortBy,
		origin: $origin
	) {
		totalCount
		values {
			id
			...loanCardFields
			image {
				id
				default: url(customSize: $imgDefaultSize)
				retina: url(customSize: $imgRetinaSize)
				hash
			}
		}
	}
}
`,v={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"flssLoanData"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"filterObject"}},type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FundraisingLoanSearchFilterInput"}}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"sortBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"SortEnum"}},defaultValue:{kind:"EnumValue",value:"personalized"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"pageNumber"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"IntValue",value:"0"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"pageLimit"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"IntValue",value:"0"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w480h360",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w960h720",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"origin"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"fundraisingLoans"},arguments:[{kind:"Argument",name:{kind:"Name",value:"filters"},value:{kind:"Variable",name:{kind:"Name",value:"filterObject"}}},{kind:"Argument",name:{kind:"Name",value:"limit"},value:{kind:"Variable",name:{kind:"Name",value:"pageLimit"}}},{kind:"Argument",name:{kind:"Name",value:"pageNumber"},value:{kind:"Variable",name:{kind:"Name",value:"pageNumber"}}},{kind:"Argument",name:{kind:"Name",value:"sortBy"},value:{kind:"Variable",name:{kind:"Name",value:"sortBy"}}},{kind:"Argument",name:{kind:"Name",value:"origin"},value:{kind:"Variable",name:{kind:"Name",value:"origin"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"FragmentSpread",name:{kind:"Name",value:"loanCardFields"},directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"default"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"retina"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}}}],directives:[]},{kind:"Field",name:{kind:"Name",value:"hash"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:647,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:b}}},p=t=>{const l={};return t.filter(function(a){if(a.kind!=="FragmentDefinition")return!0;const d=a.name.value;return l[d]?!1:(l[d]=!0,!0)})};v.definitions=p(v.definitions.concat(N.definitions));const y=(t,l)=>{const a=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}return e&&"selectionSet"in e&&e.selectionSet&&e.selectionSet.selections.forEach(n=>{a(n,i)}),e&&"variableDefinitions"in e&&e.variableDefinitions&&e.variableDefinitions.forEach(n=>{a(n,i)}),e&&"definitions"in e&&e.definitions&&e.definitions.forEach(n=>{a(n,i)}),i},d=e=>{const i={};return e.definitions.forEach(function(n){"name"in n&&n.name&&(i[n.name.value]=a(n,new Set))}),i},s=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const r=e.definitions[n];if(r&&"name"in r&&r.name&&r.name.value==i)return r}},o=d(t),u=Object.assign({},t,{definitions:[s(t,l)]}),c=o[l]||new Set,k=new Set;let m=new Set;for(c.forEach(e=>{m.add(e)});m.size>0;){const e=m;m=new Set,e.forEach(i=>{k.has(i)||(k.add(i),(o[i]||new Set).forEach(r=>{m.add(r)}))})}return k.forEach(e=>{const i=s(t,e);i&&u.definitions.push(i)}),u};y(v,"flssLoanData");const h=`#import '../fragments/loanCardFields.graphql'

query loanRecommendations(
  $filterObject: [FundraisingLoanSearchFilterInput!]
  $sortBy: SortEnum = personalized
  $imgDefaultSize: String = "w480h360"
  $imgRetinaSize: String = "w960h720"
  $origin: String
  $userId: Int
  $limit: Int
) {
  loanRecommendations(
    filters: $filterObject,
    sortBy: $sortBy,
    origin: $origin,
    userId: $userId,
    limit: $limit
  ) {
    totalCount
    values {
      id
      ...loanCardFields
      image {
        id
        default: url(customSize: $imgDefaultSize)
        retina: url(customSize: $imgRetinaSize)
        s100: url(customSize: "s100")
        hash
      }
    }
  }
}
`,f={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"loanRecommendations"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"filterObject"}},type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FundraisingLoanSearchFilterInput"}}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"sortBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"SortEnum"}},defaultValue:{kind:"EnumValue",value:"personalized"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w480h360",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w960h720",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"origin"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"userId"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"limit"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"loanRecommendations"},arguments:[{kind:"Argument",name:{kind:"Name",value:"filters"},value:{kind:"Variable",name:{kind:"Name",value:"filterObject"}}},{kind:"Argument",name:{kind:"Name",value:"sortBy"},value:{kind:"Variable",name:{kind:"Name",value:"sortBy"}}},{kind:"Argument",name:{kind:"Name",value:"origin"},value:{kind:"Variable",name:{kind:"Name",value:"origin"}}},{kind:"Argument",name:{kind:"Name",value:"userId"},value:{kind:"Variable",name:{kind:"Name",value:"userId"}}},{kind:"Argument",name:{kind:"Name",value:"limit"},value:{kind:"Variable",name:{kind:"Name",value:"limit"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"FragmentSpread",name:{kind:"Name",value:"loanCardFields"},directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"default"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"retina"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"s100"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"StringValue",value:"s100",block:!1}}],directives:[]},{kind:"Field",name:{kind:"Name",value:"hash"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:721,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:h}}},V=t=>{const l={};return t.filter(function(a){if(a.kind!=="FragmentDefinition")return!0;const d=a.name.value;return l[d]?!1:(l[d]=!0,!0)})};f.definitions=V(f.definitions.concat(N.definitions));const F=(t,l)=>{const a=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}return e&&"selectionSet"in e&&e.selectionSet&&e.selectionSet.selections.forEach(n=>{a(n,i)}),e&&"variableDefinitions"in e&&e.variableDefinitions&&e.variableDefinitions.forEach(n=>{a(n,i)}),e&&"definitions"in e&&e.definitions&&e.definitions.forEach(n=>{a(n,i)}),i},d=e=>{const i={};return e.definitions.forEach(function(n){"name"in n&&n.name&&(i[n.name.value]=a(n,new Set))}),i},s=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const r=e.definitions[n];if(r&&"name"in r&&r.name&&r.name.value==i)return r}},o=d(t),u=Object.assign({},t,{definitions:[s(t,l)]}),c=o[l]||new Set,k=new Set;let m=new Set;for(c.forEach(e=>{m.add(e)});m.size>0;){const e=m;m=new Set,e.forEach(i=>{k.has(i)||(k.add(i),(o[i]||new Set).forEach(r=>{m.add(r)}))})}return k.forEach(e=>{const i=s(t,e);i&&u.definitions.push(i)}),u};F(f,"loanRecommendations");const D="web:no-context",w="web:bp-funded",E="web:goal-recommended-loan";function L(t){return g.keys.reduce((l,a)=>({...l,...g.config[a].getFlssFilter(t)}),{})}async function I(t,l,a=null,d=0,s=15,o=D){var u;try{return(u=(await t.query({query:v,variables:{filterObject:l,sortBy:a,pageNumber:d/s,pageLimit:s,origin:o},fetchPolicy:"network-only"})).data)==null?void 0:u.fundraisingLoans}catch(c){S(c,"flssUtils fetchLoans flssLoanQuery")}}export{w as F,E as a,I as f,L as g};
