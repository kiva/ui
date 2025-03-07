import{d as h}from"./entry-KivaClassicBasicLoanCard-BFqIn0kxif.js";import{l as O}from"./entry-logReadQueryError-Codcl0QZ_g.js";import{f as D}from"./entry-filterConfig-C0iiubdtCN.js";const u={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"flssLoanData"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"filterObject"}},type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FundraisingLoanSearchFilterInput"}}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"sortBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"SortEnum"}},defaultValue:{kind:"EnumValue",value:"personalized"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"pageNumber"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"IntValue",value:"0"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"pageLimit"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"IntValue",value:"0"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w480h360",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w960h720",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"origin"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"fundraisingLoans"},arguments:[{kind:"Argument",name:{kind:"Name",value:"filters"},value:{kind:"Variable",name:{kind:"Name",value:"filterObject"}}},{kind:"Argument",name:{kind:"Name",value:"limit"},value:{kind:"Variable",name:{kind:"Name",value:"pageLimit"}}},{kind:"Argument",name:{kind:"Name",value:"pageNumber"},value:{kind:"Variable",name:{kind:"Name",value:"pageNumber"}}},{kind:"Argument",name:{kind:"Name",value:"sortBy"},value:{kind:"Variable",name:{kind:"Name",value:"sortBy"}}},{kind:"Argument",name:{kind:"Name",value:"origin"},value:{kind:"Variable",name:{kind:"Name",value:"origin"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"FragmentSpread",name:{kind:"Name",value:"loanCardFields"},directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"default"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"retina"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}}}],directives:[]},{kind:"Field",name:{kind:"Name",value:"hash"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:639}};u.loc.source={body:`
                #import '../fragments/loanCardFields.graphql'

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

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const w={},A=e=>e.filter(function(n){if(n.kind!=="FragmentDefinition")return!0;const i=n.name.value;return w[i]?!1:(w[i]=!0,!0)});u.definitions=u.definitions.concat(A(h.definitions));const c=(e,n)=>{if(e.kind==="FragmentSpread")n.add(e.name.value);else if(e.kind==="VariableDefinition"){const i=e.type;i.kind==="NamedType"&&n.add(i.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(i){c(i,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(i){c(i,n)}),e.definitions&&e.definitions.forEach(function(i){c(i,n)})},S={},B=e=>{e.definitions.forEach(function(n){if(n.name){const i=new Set;c(n,i),S[n.name.value]=i}})};B(u);const L=(e,n)=>{for(let i=0;i<e.definitions.length;i++){const t=e.definitions[i];if(t.name&&t.name.value==n)return t}},q=(e,n)=>{const i={kind:e.kind,definitions:[L(e,n)]};e.hasOwnProperty("loc")&&(i.loc=e.loc);const t=S[n]||new Set,s=new Set;let l=new Set;for(t.forEach(d=>{l.add(d)});l.size>0;){const d=l;l=new Set,d.forEach(a=>{s.has(a)||(s.add(a),(S[a]||new Set).forEach(r=>{l.add(r)}))})}return s.forEach(d=>{const a=L(e,d);a&&i.definitions.push(a)}),i};q(u,"flssLoanData");const o={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"loanRecommendations"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"filterObject"}},type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FundraisingLoanSearchFilterInput"}}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"sortBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"SortEnum"}},defaultValue:{kind:"EnumValue",value:"personalized"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w480h360",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w960h720",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"origin"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"userId"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"limit"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"loanRecommendations"},arguments:[{kind:"Argument",name:{kind:"Name",value:"filters"},value:{kind:"Variable",name:{kind:"Name",value:"filterObject"}}},{kind:"Argument",name:{kind:"Name",value:"sortBy"},value:{kind:"Variable",name:{kind:"Name",value:"sortBy"}}},{kind:"Argument",name:{kind:"Name",value:"origin"},value:{kind:"Variable",name:{kind:"Name",value:"origin"}}},{kind:"Argument",name:{kind:"Name",value:"userId"},value:{kind:"Variable",name:{kind:"Name",value:"userId"}}},{kind:"Argument",name:{kind:"Name",value:"limit"},value:{kind:"Variable",name:{kind:"Name",value:"limit"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"FragmentSpread",name:{kind:"Name",value:"loanCardFields"},directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"default"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"retina"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}}}],directives:[]},{kind:"Field",name:{kind:"Name",value:"hash"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:675}};o.loc.source={body:`
                #import '../fragments/loanCardFields.graphql'

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

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const R={},j=e=>e.filter(function(n){if(n.kind!=="FragmentDefinition")return!0;const i=n.name.value;return R[i]?!1:(R[i]=!0,!0)});o.definitions=o.definitions.concat(j(h.definitions));const v=(e,n)=>{if(e.kind==="FragmentSpread")n.add(e.name.value);else if(e.kind==="VariableDefinition"){const i=e.type;i.kind==="NamedType"&&n.add(i.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(i){v(i,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(i){v(i,n)}),e.definitions&&e.definitions.forEach(function(i){v(i,n)})},p={},x=e=>{e.definitions.forEach(function(n){if(n.name){const i=new Set;v(n,i),p[n.name.value]=i}})};x(o);const I=(e,n)=>{for(let i=0;i<e.definitions.length;i++){const t=e.definitions[i];if(t.name&&t.name.value==n)return t}},G=(e,n)=>{const i={kind:e.kind,definitions:[I(e,n)]};e.hasOwnProperty("loc")&&(i.loc=e.loc);const t=p[n]||new Set,s=new Set;let l=new Set;for(t.forEach(d=>{l.add(d)});l.size>0;){const d=l;l=new Set,d.forEach(a=>{s.has(a)||(s.add(a),(p[a]||new Set).forEach(r=>{l.add(r)}))})}return s.forEach(d=>{const a=I(e,d);a&&i.definitions.push(a)}),i};G(o,"loanRecommendations");const V={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"flssLoanFacets"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"isoCodeFilters"}},type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FundraisingLoanSearchFilterInput"}}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"themeFilters"}},type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FundraisingLoanSearchFilterInput"}}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"sectorFilters"}},type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FundraisingLoanSearchFilterInput"}}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"tagFilters"}},type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FundraisingLoanSearchFilterInput"}}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"origin"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"isoCodes"},name:{kind:"Name",value:"fundraisingLoans"},arguments:[{kind:"Argument",name:{kind:"Name",value:"filters"},value:{kind:"Variable",name:{kind:"Name",value:"isoCodeFilters"}}},{kind:"Argument",name:{kind:"Name",value:"origin"},value:{kind:"Variable",name:{kind:"Name",value:"origin"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"facets"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"isoCode"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}},{kind:"Field",alias:{kind:"Name",value:"themes"},name:{kind:"Name",value:"fundraisingLoans"},arguments:[{kind:"Argument",name:{kind:"Name",value:"filters"},value:{kind:"Variable",name:{kind:"Name",value:"themeFilters"}}},{kind:"Argument",name:{kind:"Name",value:"origin"},value:{kind:"Variable",name:{kind:"Name",value:"origin"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"facets"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"themes"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}},{kind:"Field",alias:{kind:"Name",value:"sectors"},name:{kind:"Name",value:"fundraisingLoans"},arguments:[{kind:"Argument",name:{kind:"Name",value:"filters"},value:{kind:"Variable",name:{kind:"Name",value:"sectorFilters"}}},{kind:"Argument",name:{kind:"Name",value:"origin"},value:{kind:"Variable",name:{kind:"Name",value:"origin"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"facets"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"sectorId"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}},{kind:"Field",alias:{kind:"Name",value:"tags"},name:{kind:"Name",value:"fundraisingLoans"},arguments:[{kind:"Argument",name:{kind:"Name",value:"filters"},value:{kind:"Variable",name:{kind:"Name",value:"tagFilters"}}},{kind:"Argument",name:{kind:"Name",value:"origin"},value:{kind:"Variable",name:{kind:"Name",value:"origin"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"facets"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"tagsIds"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"key"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"value"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:788}};V.loc.source={body:`
                query flssLoanFacets(
	$isoCodeFilters: [FundraisingLoanSearchFilterInput!],
	$themeFilters: [FundraisingLoanSearchFilterInput!],
	$sectorFilters: [FundraisingLoanSearchFilterInput!],
	$tagFilters: [FundraisingLoanSearchFilterInput!],
	$origin: String) {
	isoCodes: fundraisingLoans(filters: $isoCodeFilters, origin: $origin) {
		facets {
			isoCode {
				key
				value
			}
		}

  	}
	themes: fundraisingLoans(filters: $themeFilters, origin: $origin) {
		facets {
			themes {
				key
				value
			}
		}
	}
	sectors: fundraisingLoans(filters: $sectorFilters, origin: $origin) {
		facets {
			sectorId {
				key
				value
			}
		}
  	}
	tags: fundraisingLoans(filters: $tagFilters, origin: $origin) {
		facets {
			tagsIds {
				key
				value
			}
		}
  	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const f=(e,n)=>{if(e.kind==="FragmentSpread")n.add(e.name.value);else if(e.kind==="VariableDefinition"){const i=e.type;i.kind==="NamedType"&&n.add(i.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(i){f(i,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(i){f(i,n)}),e.definitions&&e.definitions.forEach(function(i){f(i,n)})},b={},P=e=>{e.definitions.forEach(function(n){if(n.name){const i=new Set;f(n,i),b[n.name.value]=i}})};P(V);const E=(e,n)=>{for(let i=0;i<e.definitions.length;i++){const t=e.definitions[i];if(t.name&&t.name.value==n)return t}},_=(e,n)=>{const i={kind:e.kind,definitions:[E(e,n)]};e.hasOwnProperty("loc")&&(i.loc=e.loc);const t=b[n]||new Set,s=new Set;let l=new Set;for(t.forEach(d=>{l.add(d)});l.size>0;){const d=l;l=new Set,d.forEach(a=>{s.has(a)||(s.add(a),(b[a]||new Set).forEach(r=>{l.add(r)}))})}return s.forEach(d=>{const a=E(e,d);a&&i.definitions.push(a)}),i};_(V,"flssLoanFacets");const m={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"flssLoanChannel"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"ids"}},type:{kind:"ListType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"filterObject"}},type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"FundraisingLoanSearchFilterInput"}}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"sortBy"}},type:{kind:"NamedType",name:{kind:"Name",value:"SortEnum"}},defaultValue:{kind:"EnumValue",value:"personalized"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"pageNumber"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"IntValue",value:"0"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"pageLimit"}},type:{kind:"NamedType",name:{kind:"Name",value:"Int"}},defaultValue:{kind:"IntValue",value:"0"},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w480h360",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w960h720",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"basketId"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"origin"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lend"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"loanChannelsById"},arguments:[{kind:"Argument",name:{kind:"Name",value:"ids"},value:{kind:"Variable",name:{kind:"Name",value:"ids"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"headline"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"metaTitle"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"metaDescription"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"url"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"fundraisingLoans"},arguments:[{kind:"Argument",name:{kind:"Name",value:"filters"},value:{kind:"Variable",name:{kind:"Name",value:"filterObject"}}},{kind:"Argument",name:{kind:"Name",value:"sortBy"},value:{kind:"Variable",name:{kind:"Name",value:"sortBy"}}},{kind:"Argument",name:{kind:"Name",value:"limit"},value:{kind:"Variable",name:{kind:"Name",value:"pageLimit"}}},{kind:"Argument",name:{kind:"Name",value:"pageNumber"},value:{kind:"Variable",name:{kind:"Name",value:"pageNumber"}}},{kind:"Argument",name:{kind:"Name",value:"origin"},value:{kind:"Variable",name:{kind:"Name",value:"origin"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"totalCount"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"FragmentSpread",name:{kind:"Name",value:"loanCardFields"},directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"default"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"retina"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}}}],directives:[]}]}}]}}]}},{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[{kind:"Argument",name:{kind:"Name",value:"basketId"},value:{kind:"Variable",name:{kind:"Name",value:"basketId"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"basket"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"items"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]}]}}]}}]}}]}}]}}],loc:{start:0,end:882}};m.loc.source={body:`
                #import '../fragments/loanCardFields.graphql'

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

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const T={},Q=e=>e.filter(function(n){if(n.kind!=="FragmentDefinition")return!0;const i=n.name.value;return T[i]?!1:(T[i]=!0,!0)});m.definitions=m.definitions.concat(Q(h.definitions));const g=(e,n)=>{if(e.kind==="FragmentSpread")n.add(e.name.value);else if(e.kind==="VariableDefinition"){const i=e.type;i.kind==="NamedType"&&n.add(i.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(i){g(i,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(i){g(i,n)}),e.definitions&&e.definitions.forEach(function(i){g(i,n)})},y={},U=e=>{e.definitions.forEach(function(n){if(n.name){const i=new Set;g(n,i),y[n.name.value]=i}})};U(m);const z=(e,n)=>{for(let i=0;i<e.definitions.length;i++){const t=e.definitions[i];if(t.name&&t.name.value==n)return t}},H=(e,n)=>{const i={kind:e.kind,definitions:[z(e,n)]};e.hasOwnProperty("loc")&&(i.loc=e.loc);const t=y[n]||new Set,s=new Set;let l=new Set;for(t.forEach(d=>{l.add(d)});l.size>0;){const d=l;l=new Set,d.forEach(a=>{s.has(a)||(s.add(a),(y[a]||new Set).forEach(r=>{l.add(r)}))})}return s.forEach(d=>{const a=z(e,d);a&&i.definitions.push(a)}),i};H(m,"flssLoanChannel");const $={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"categoryListFlssQuery"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lend"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"loanChannels"},arguments:[{kind:"Argument",name:{kind:"Name",value:"popular"},value:{kind:"BooleanValue",value:!0}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",alias:{kind:"Name",value:"key"},name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"title"},name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:154}};$.loc.source={body:`
                query categoryListFlssQuery {
	lend {
		loanChannels(popular: true) {
			values {
				key: id
				title: name
			}
		}
	}
}

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const N=(e,n)=>{if(e.kind==="FragmentSpread")n.add(e.name.value);else if(e.kind==="VariableDefinition"){const i=e.type;i.kind==="NamedType"&&n.add(i.name.value)}e.selectionSet&&e.selectionSet.selections.forEach(function(i){N(i,n)}),e.variableDefinitions&&e.variableDefinitions.forEach(function(i){N(i,n)}),e.definitions&&e.definitions.forEach(function(i){N(i,n)})},F={},J=e=>{e.definitions.forEach(function(n){if(n.name){const i=new Set;N(n,i),F[n.name.value]=i}})};J($);const C=(e,n)=>{for(let i=0;i<e.definitions.length;i++){const t=e.definitions[i];if(t.name&&t.name.value==n)return t}},K=(e,n)=>{const i={kind:e.kind,definitions:[C(e,n)]};e.hasOwnProperty("loc")&&(i.loc=e.loc);const t=F[n]||new Set,s=new Set;let l=new Set;for(t.forEach(d=>{l.add(d)});l.size>0;){const d=l;l=new Set,d.forEach(a=>{s.has(a)||(s.add(a),(F[a]||new Set).forEach(r=>{l.add(r)}))})}return s.forEach(d=>{const a=C(e,d);a&&i.definitions.push(a)}),i};K($,"categoryListFlssQuery");const W="web:no-context",ie="web:bp-funded";function X(e){return D.keys.reduce((n,i)=>({...n,...D.config[i].getFlssFilter(e)}),{})}function Y(e,n){return{ids:[...n.ids],filterObject:X({...e,...n}),sortBy:n.sortBy||e.sortBy||null,pageNumber:n.offset/n.limit,pageLimit:n.limit,basketId:n.basketId,origin:(n==null?void 0:n.origin)??W}}async function ne(e,n,i){try{return(await e.query({query:m,variables:Y(n,i)})).data}catch(t){O(t,"flssUtils fetchLoanChannel flssLoanChannelQuery")}}export{W as F,ie as a,ne as f};
