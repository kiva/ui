import{g as v}from"./entry-index-DGXt1zOePE.js";import{n as f}from"./entry-numeral-CmvrP3KSIW.js";import{l as g}from"./entry-logFormatter-DhjghUk5Me.js";import{d as S}from"./entry-basketCount-D5V0YsUQ7f.js";import{d as p}from"./entry-basketItems-BEDWpZvb7f.js";import"./entry-updateDonation-feoeLdW7rR.js";import{w as N,a as h}from"./entry-exports-CudK1O5XNw.js";const o={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"basketLoansInfo"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"id"}},type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w480h360",block:!1},directives:[]},{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}},type:{kind:"NamedType",name:{kind:"Name",value:"String"}},defaultValue:{kind:"StringValue",value:"w960h720",block:!1},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"lend"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"loan"},arguments:[{kind:"Argument",name:{kind:"Name",value:"id"},value:{kind:"Variable",name:{kind:"Name",value:"id"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"gender"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"image"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",alias:{kind:"Name",value:"default"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgDefaultSize"}}}],directives:[]},{kind:"Field",alias:{kind:"Name",value:"retina"},name:{kind:"Name",value:"url"},arguments:[{kind:"Argument",name:{kind:"Name",value:"customSize"},value:{kind:"Variable",name:{kind:"Name",value:"imgRetinaSize"}}}],directives:[]},{kind:"Field",name:{kind:"Name",value:"hash"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"status"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"loanFundraisingInfo"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"fundedAmount"},arguments:[],directives:[]}]}},{kind:"Field",name:{kind:"Name",value:"geocode"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"city"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"state"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"country"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"isoCode"},arguments:[],directives:[]}]}}]}},{kind:"Field",name:{kind:"Name",value:"use"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"description"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"sector"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"id"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"name"},arguments:[],directives:[]}]}}]}}]}}]}}],loc:{start:0,end:524}};o.loc.source={body:`
                query basketLoansInfo(
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

            `,name:"GraphQL request",locationOffset:{line:1,column:1}};const r=(i,n)=>{if(i.kind==="FragmentSpread")n.add(i.name.value);else if(i.kind==="VariableDefinition"){const e=i.type;e.kind==="NamedType"&&n.add(e.name.value)}i.selectionSet&&i.selectionSet.selections.forEach(function(e){r(e,n)}),i.variableDefinitions&&i.variableDefinitions.forEach(function(e){r(e,n)}),i.definitions&&i.definitions.forEach(function(e){r(e,n)})},m={},y=i=>{i.definitions.forEach(function(n){if(n.name){const e=new Set;r(n,e),m[n.name.value]=e}})};y(o);const u=(i,n)=>{for(let e=0;e<i.definitions.length;e++){const s=i.definitions[e];if(s.name&&s.name.value==n)return s}},b=(i,n)=>{const e={kind:i.kind,definitions:[u(i,n)]};i.hasOwnProperty("loc")&&(e.loc=i.loc);const s=m[n]||new Set,l=new Set;let d=new Set;for(s.forEach(t=>{d.add(t)});d.size>0;){const t=d;d=new Set,t.forEach(a=>{l.has(a)||(l.add(a),(m[a]||new Set).forEach(k=>{d.add(k)}))})}return l.forEach(t=>{const a=u(i,t);a&&e.definitions.push(a)}),e};b(o,"basketLoansInfo");const z="invalidBasket";function c(i,n){g(n,"error");try{N(e=>{e.setTag("loan_id",this.loanId),e.setTag("mutation","addToBasket"),h(n)})}catch{}}function A({amount:i,apollo:n,loanId:e}){return new Promise((s,l)=>{const d=f(i).format("0.00");n.mutate({mutation:v`mutation addToBasket($loanId: Int!, $price: Money!, $basketId: String) {
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
			}`,variables:{loanId:e,price:d},optimisticResponse:{__typename:"Mutation",shop:{id:"0",__typename:"ShopMutation",updateLoanReservation:{__typename:"LoanReservation",id:e,price:d}}},awaitRefetchQueries:!0,refetchQueries:[{query:S},{query:p},{query:o,variables:{id:e}}]}).then(t=>{t.errors?(t.errors.forEach(a=>{c(e,a)}),l(t.errors)):s()}).catch(t=>{(Array.isArray(t)?t:[t]).forEach(a=>{c(e,a)}),l(t)})})}function L({loan:i,cookieStore:n}){n.remove("kvbskt",{path:"/",secure:!0}),n.set("kvatbid",JSON.stringify(i)),window.location.reload()}function T(i){return["shop.invalidBasketId","shop.basketRequired"].includes(i)}export{z as I,L as a,T as h,A as s};
