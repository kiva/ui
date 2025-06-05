import{n as r,g as u}from"./entry-numeral-DJCTM12wUX.js";import{l as o}from"./entry-logFormatter-DhjghUk5Me.js";import{_ as k}from"./entry-basketCount-CZ-kE9ye_Z.js";import{_ as c}from"./entry-basketItems-AJqL_yrdZS.js";import{w as v,a as g}from"./entry-exports-CudK1O5XNw.js";const N=`query basketLoansInfo(
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
`,S={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"basketLoansInfo"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w480h360",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w960h720",block:!1},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lend"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"loan"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"gender"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"default"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"retina"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}}}],directives:[]},{kind:"Field",name:{kind:"Name",value:"hash"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"status"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loanFundraisingInfo"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"fundedAmount"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"geocode"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"city"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"state"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"country"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isoCode"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"use"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"sector"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:539,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:N}}},y="invalidBasket";function l(n,a){o(a,"error");try{v(e=>{e.setTag("loan_id",this.loanId),e.setTag("mutation","addToBasket"),g(a)})}catch{}}function _({amount:n,apollo:a,loanId:e}){return new Promise((m,d)=>{const s=r(n).format("0.00");a.mutate({mutation:u`mutation addToBasket($loanId: Int!, $price: Money!, $basketId: String) {
				shop (basketId: $basketId) {
					id
					updateLoanReservation (loanReservation: {
						id: $loanId
						price: $price
					}) {
						id
						price
					}
				}
			}`,variables:{loanId:e,price:s},optimisticResponse:{__typename:"Mutation",shop:{id:"0",__typename:"ShopMutation",updateLoanReservation:{__typename:"LoanReservation",id:e,price:s}}},awaitRefetchQueries:!0,refetchQueries:[{query:k},{query:c},{query:S,variables:{id:e}}]}).then(i=>{i.errors?(i.errors.forEach(t=>{l(e,t)}),d(i.errors)):m()}).catch(i=>{(Array.isArray(i)?i:[i]).forEach(t=>{l(e,t)}),d(i)})})}function I({loan:n,cookieStore:a}){a.remove("kvbskt",{path:"/",secure:!0}),a.set("kvatbid",JSON.stringify(n)),window.location.reload()}function R(n){return["shop.invalidBasketId","shop.basketRequired"].includes(n)}export{y as I,I as a,R as h,_ as s};
