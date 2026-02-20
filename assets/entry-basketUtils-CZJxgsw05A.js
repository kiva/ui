import{n as r}from"./entry-numeral-xVHG5DEP0A.js";import{l as o}from"./entry-logFormatter-DhjghUk5Me.js";import{_ as u}from"./entry-basketCount-CZ-kE9ye_Z.js";import{_ as c}from"./entry-basketItems-B-09YWrzPC.js";import{_ as k}from"./entry-updateLoanReservation-BaDuxVurTB.js";import{w as v,a as g}from"./entry-exports-CudK1O5XNw.js";const N=`query basketLoansInfo(
	$id: Int!
	$imgDefaultSize: String = "w480h360"
	$imgRetinaSize: String = "w960h720"
) {
	lend {
		loan(id: $id) {
			id
			gender
			image {
				id
				default: url(customSize: $imgDefaultSize)
				retina: url(customSize: $imgRetinaSize)
				hash
			}
			name
			status
			loanFundraisingInfo {
				id
				fundedAmount
			}
			geocode {
				city
				state
				country {
					id
					name
					isoCode
				}
			}
			use
			description
			sector {
				id
				name
			}
		}
	}
}
`,S={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"basketLoansInfo"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w480h360",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w960h720",block:!1},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lend"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"loan"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"gender"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"default"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"retina"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}}}],directives:[]},{kind:"Field",name:{kind:"Name",value:"hash"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"status"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loanFundraisingInfo"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"fundedAmount"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"geocode"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"city"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"state"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"country"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isoCode"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"use"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"sector"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:539,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:N}}},f=`mutation createNewBasket {
	shop {
		id
		createBasket
	}
}
`,p={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"mutation",name:{kind:"Name",value:"createNewBasket"},variableDefinitions:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"shop"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"createBasket"},arguments:[],directives:[]}]}}]}}],loc:{start:0,end:98,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:f}}},w="invalidBasket";function l(n,i){o(i,"error");try{v(e=>{e.setTag("loan_id",this.loanId),e.setTag("mutation","addToBasket"),g(i)})}catch{}}async function D({apollo:n,cookieStore:i}){var d;const{data:e}=await n.mutate({mutation:p}),t=(d=e==null?void 0:e.shop)==null?void 0:d.createBasket;return t&&i.set("kvbskt",t,{path:"/",secure:!0}),t}function V({amount:n,apollo:i,loanId:e}){return new Promise((t,d)=>{const m=r(n).format("0.00");i.mutate({mutation:k,variables:{loanId:e,price:m},optimisticResponse:{__typename:"Mutation",shop:{id:"0",__typename:"ShopMutation",updateLoanReservation:{__typename:"LoanReservation",id:e,price:m}}},awaitRefetchQueries:!0,refetchQueries:[{query:u},{query:c},{query:S,variables:{id:e}}]}).then(a=>{a.errors?(a.errors.forEach(s=>{l(e,s)}),d(a.errors)):t()}).catch(a=>{(Array.isArray(a)?a:[a]).forEach(s=>{l(e,s)}),d(a)})})}function B({loan:n,cookieStore:i}){i.remove("kvbskt",{path:"/",secure:!0}),i.set("kvatbid",JSON.stringify(n)),window.location.reload()}function z(n){return["shop.invalidBasketId","shop.basketRequired"].includes(n)}export{w as I,B as a,D as c,z as h,V as s};
