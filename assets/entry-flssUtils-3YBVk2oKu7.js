import{_ as N}from"./entry-KivaClassicBasicLoanCard-BDJ441dsaJ.js";import{l as b}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{f as S}from"./entry-filterConfig-BWjemUWwxM.js";const p=`#import '../fragments/loanCardFields.graphql'

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
`,f={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"flssLoanData"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"filterObject"}},type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FundraisingLoanSearchFilterInput"}}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"sortBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"SortEnum"}},defaultValue:{kind:"EnumValue",value:"personalized"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"pageNumber"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"IntValue",value:"0"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"pageLimit"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"IntValue",value:"0"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w480h360",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w960h720",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"origin"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"fundraisingLoans"},arguments:[{kind:"Argument",name:{kind:"Name",value:"filters"},value:{kind:"Variable",name:{kind:"Name",value:"filterObject"}}},{kind:"Argument",name:{kind:"Name",value:"limit"},value:{kind:"Variable",name:{kind:"Name",value:"pageLimit"}}},{kind:"Argument",name:{kind:"Name",value:"pageNumber"},value:{kind:"Variable",name:{kind:"Name",value:"pageNumber"}}},{kind:"Argument",name:{kind:"Name",value:"sortBy"},value:{kind:"Variable",name:{kind:"Name",value:"sortBy"}}},{kind:"Argument",name:{kind:"Name",value:"origin"},value:{kind:"Variable",name:{kind:"Name",value:"origin"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"FragmentSpread",name:{kind:"Name",value:"loanCardFields"},directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"default"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"retina"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}}}],directives:[]},{kind:"Field",name:{kind:"Name",value:"hash"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:647,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:p}}},h=t=>{const a={};return t.filter(function(l){if(l.kind!=="FragmentDefinition")return!0;const m=l.name.value;return a[m]?!1:(a[m]=!0,!0)})};f.definitions=h(f.definitions.concat(N.definitions));const y=(t,a)=>{const l=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}return e&&"selectionSet"in e&&e.selectionSet&&e.selectionSet.selections.forEach(n=>{l(n,i)}),e&&"variableDefinitions"in e&&e.variableDefinitions&&e.variableDefinitions.forEach(n=>{l(n,i)}),e&&"definitions"in e&&e.definitions&&e.definitions.forEach(n=>{l(n,i)}),i},m=e=>{const i={};return e.definitions.forEach(function(n){"name"in n&&n.name&&(i[n.name.value]=l(n,new Set))}),i},u=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const d=e.definitions[n];if(d&&"name"in d&&d.name&&d.name.value==i)return d}},o=m(t),k=Object.assign({},t,{definitions:[u(t,a)]}),c=o[a]||new Set,s=new Set;let r=new Set;for(c.forEach(e=>{r.add(e)});r.size>0;){const e=r;r=new Set,e.forEach(i=>{s.has(i)||(s.add(i),(o[i]||new Set).forEach(d=>{r.add(d)}))})}return s.forEach(e=>{const i=u(t,e);i&&k.definitions.push(i)}),k};y(f,"flssLoanData");const V=`#import '../fragments/loanCardFields.graphql'

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
        hash
      }
    }
  }
}
`,g={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"loanRecommendations"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"filterObject"}},type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FundraisingLoanSearchFilterInput"}}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"sortBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"SortEnum"}},defaultValue:{kind:"EnumValue",value:"personalized"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w480h360",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w960h720",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"origin"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"userId"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"limit"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"loanRecommendations"},arguments:[{kind:"Argument",name:{kind:"Name",value:"filters"},value:{kind:"Variable",name:{kind:"Name",value:"filterObject"}}},{kind:"Argument",name:{kind:"Name",value:"sortBy"},value:{kind:"Variable",name:{kind:"Name",value:"sortBy"}}},{kind:"Argument",name:{kind:"Name",value:"origin"},value:{kind:"Variable",name:{kind:"Name",value:"origin"}}},{kind:"Argument",name:{kind:"Name",value:"userId"},value:{kind:"Variable",name:{kind:"Name",value:"userId"}}},{kind:"Argument",name:{kind:"Name",value:"limit"},value:{kind:"Variable",name:{kind:"Name",value:"limit"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"FragmentSpread",name:{kind:"Name",value:"loanCardFields"},directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"default"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"retina"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}}}],directives:[]},{kind:"Field",name:{kind:"Name",value:"hash"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:683,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:V}}},F=t=>{const a={};return t.filter(function(l){if(l.kind!=="FragmentDefinition")return!0;const m=l.name.value;return a[m]?!1:(a[m]=!0,!0)})};g.definitions=F(g.definitions.concat(N.definitions));const D=(t,a)=>{const l=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}return e&&"selectionSet"in e&&e.selectionSet&&e.selectionSet.selections.forEach(n=>{l(n,i)}),e&&"variableDefinitions"in e&&e.variableDefinitions&&e.variableDefinitions.forEach(n=>{l(n,i)}),e&&"definitions"in e&&e.definitions&&e.definitions.forEach(n=>{l(n,i)}),i},m=e=>{const i={};return e.definitions.forEach(function(n){"name"in n&&n.name&&(i[n.name.value]=l(n,new Set))}),i},u=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const d=e.definitions[n];if(d&&"name"in d&&d.name&&d.name.value==i)return d}},o=m(t),k=Object.assign({},t,{definitions:[u(t,a)]}),c=o[a]||new Set,s=new Set;let r=new Set;for(c.forEach(e=>{r.add(e)});r.size>0;){const e=r;r=new Set,e.forEach(i=>{s.has(i)||(s.add(i),(o[i]||new Set).forEach(d=>{r.add(d)}))})}return s.forEach(e=>{const i=u(t,e);i&&k.definitions.push(i)}),k};D(g,"loanRecommendations");const $=`#import '../fragments/loanCardFields.graphql'

query flssLoanChannel(
	$ids: [Int],
	$filterObject: [FundraisingLoanSearchFilterInput!]
	$sortBy: SortEnum = personalized
	$pageNumber: Int = 0
	$pageLimit: Int = 0
	$imgDefaultSize: String = "w480h360"
	$imgRetinaSize: String = "w960h720"
	$basketId: String
	$origin: String
) {
	lend {
		loanChannelsById(ids: $ids) {
			id
			name
			headline
			metaTitle
			description
			metaDescription
			url
		}
	}
	fundraisingLoans(filters: $filterObject, sortBy: $sortBy, limit: $pageLimit, pageNumber: $pageNumber, origin: $origin) {
		totalCount
		values {
			id
			...loanCardFields
			image {
				id
				default: url(customSize: $imgDefaultSize)
				retina: url(customSize: $imgRetinaSize)
			}
		}
	}
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
`,v={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"flssLoanChannel"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"ids"}},type:{kind:"ListType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"filterObject"}},type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FundraisingLoanSearchFilterInput"}}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"sortBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"SortEnum"}},defaultValue:{kind:"EnumValue",value:"personalized"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"pageNumber"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"IntValue",value:"0"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"pageLimit"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"IntValue",value:"0"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w480h360",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w960h720",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"origin"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lend"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"loanChannelsById"},arguments:[{kind:"Argument",name:{kind:"Name",value:"ids"},value:{kind:"Variable",name:{kind:"Name",value:"ids"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"headline"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"metaTitle"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"metaDescription"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"url"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"fundraisingLoans"},arguments:[{kind:"Argument",name:{kind:"Name",value:"filters"},value:{kind:"Variable",name:{kind:"Name",value:"filterObject"}}},{kind:"Argument",name:{kind:"Name",value:"sortBy"},value:{kind:"Variable",name:{kind:"Name",value:"sortBy"}}},{kind:"Argument",name:{kind:"Name",value:"limit"},value:{kind:"Variable",name:{kind:"Name",value:"pageLimit"}}},{kind:"Argument",name:{kind:"Name",value:"pageNumber"},value:{kind:"Variable",name:{kind:"Name",value:"pageNumber"}}},{kind:"Argument",name:{kind:"Name",value:"origin"},value:{kind:"Variable",name:{kind:"Name",value:"origin"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"FragmentSpread",name:{kind:"Name",value:"loanCardFields"},directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"default"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"retina"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}}}],directives:[]}]}}]}}]}},{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"basket"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"items"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}}]}}]}}]}}]}}],loc:{start:0,end:890,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:$}}},R=t=>{const a={};return t.filter(function(l){if(l.kind!=="FragmentDefinition")return!0;const m=l.name.value;return a[m]?!1:(a[m]=!0,!0)})};v.definitions=R(v.definitions.concat(N.definitions));const I=(t,a)=>{const l=(e,i)=>{if(e.kind==="FragmentSpread")i.add(e.name.value);else if(e.kind==="VariableDefinition"){const n=e.type;n.kind==="NamedType"&&i.add(n.name.value)}return e&&"selectionSet"in e&&e.selectionSet&&e.selectionSet.selections.forEach(n=>{l(n,i)}),e&&"variableDefinitions"in e&&e.variableDefinitions&&e.variableDefinitions.forEach(n=>{l(n,i)}),e&&"definitions"in e&&e.definitions&&e.definitions.forEach(n=>{l(n,i)}),i},m=e=>{const i={};return e.definitions.forEach(function(n){"name"in n&&n.name&&(i[n.name.value]=l(n,new Set))}),i},u=(e,i)=>{for(let n=0;n<e.definitions.length;n++){const d=e.definitions[n];if(d&&"name"in d&&d.name&&d.name.value==i)return d}},o=m(t),k=Object.assign({},t,{definitions:[u(t,a)]}),c=o[a]||new Set,s=new Set;let r=new Set;for(c.forEach(e=>{r.add(e)});r.size>0;){const e=r;r=new Set,e.forEach(i=>{s.has(i)||(s.add(i),(o[i]||new Set).forEach(d=>{r.add(d)}))})}return s.forEach(e=>{const i=u(t,e);i&&k.definitions.push(i)}),k};I(v,"flssLoanChannel");const z="web:no-context",C="web:bp-funded";function L(t){return S.keys.reduce((a,l)=>({...a,...S.config[l].getFlssFilter(t)}),{})}function w(t,a){return{ids:[...a.ids],filterObject:L({...t,...a}),sortBy:a.sortBy||t.sortBy||null,pageNumber:a.offset/a.limit,pageLimit:a.limit,basketId:a.basketId,origin:(a==null?void 0:a.origin)??z}}async function O(t,a,l){try{return(await t.query({query:v,variables:w(a,l)})).data}catch(m){b(m,"flssUtils fetchLoanChannel flssLoanChannelQuery")}}export{z as F,C as a,O as f};
