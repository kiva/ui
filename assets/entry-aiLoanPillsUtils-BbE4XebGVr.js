import{l}from"./entry-logReadQueryError-Codcl0QZ_g.js";const t=`query GetLoanPills($loanIds: [Int!]!) {
  getLoanPills(loanIds: $loanIds) {
    values {
      loanId
      pills
    }
  }
}`,s={kind:"Document",definitions:[{kind:"OperationDefinition",operation:"query",name:{kind:"Name",value:"GetLoanPills"},variableDefinitions:[{kind:"VariableDefinition",variable:{kind:"Variable",name:{kind:"Name",value:"loanIds"}},type:{kind:"NonNullType",type:{kind:"ListType",type:{kind:"NonNullType",type:{kind:"NamedType",name:{kind:"Name",value:"Int"}}}}},directives:[]}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"getLoanPills"},arguments:[{kind:"Argument",name:{kind:"Name",value:"loanIds"},value:{kind:"Variable",name:{kind:"Name",value:"loanIds"}}}],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"values"},arguments:[],directives:[],selectionSet:{kind:"SelectionSet",selections:[{kind:"Field",name:{kind:"Name",value:"loanId"},arguments:[],directives:[]},{kind:"Field",name:{kind:"Name",value:"pills"},arguments:[],directives:[]}]}}]}}]}}],loc:{start:0,end:163,source:{name:"GraphQL request",locationOffset:{line:1,column:1},body:t}}},d=async(i,a)=>{var n;try{const{data:e}=await i.query({query:s,variables:{loanIds:a}});return((n=e.getLoanPills)==null?void 0:n.values)??[]}catch(e){l(e,"aiLoanPillsUtils aiLoanPillsQuery")}};export{d as f};
