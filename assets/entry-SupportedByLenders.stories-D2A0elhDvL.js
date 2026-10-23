import{S as u}from"./entry-SupportedByLenders-Dsfmwrahpm.js";import{V as h}from"./entry-KvUserAvatar-BU-G0DbSG2.js";import"./entry-imageUtils-Bap1kCOa3o.js";import"./entry-vue.esm-bundler-DN41AgNdM7.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-mdi-CvwCDwZH7q.js";import"./entry-KvLoadingPlaceholder-gPTWuMit7I.js";import"./entry-_plugin-vue_export-helper-9uN0dvLoeT.js";import"./entry-KvMaterialIcon-C9eRZ9H8XM.js";const g={lend:{loan:{lendingActions:{values:[{latestSharePurchaseDate:"2023-11-13T10:51:10Z",lender:{name:"Erica",image:{url:"https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg"}},shareAmount:"5.00",__typename:"LendingAction"},{latestSharePurchaseDate:"2023-11-08T02:32:20Z",lender:{name:"Joy",image:{url:"https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg"}},shareAmount:"25.00",__typename:"LendingAction"}],__typename:"LendingActionCollection"}}}},U={title:"Components/SupportedByLenders",component:u},a=_=>(A,{argTypes:y})=>({props:Object.keys(y),components:{SupportedByLenders:u,KvUserAvatar:h},setup(){return _},template:`
            <supported-by-lenders
                :participants="participants"
            />
        `}),e=a({participants:g.lend.loan.lendingActions}),t=a({participants:{values:[],__typename:"LendingActionCollection"}}),n=a({participants:{values:[{latestSharePurchaseDate:"2023-11-15T08:00:00Z",lender:{name:"You",image:{url:"https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg"},publicId:"current-user"},shareAmount:"50.00",isCurrentUser:!0,__typename:"LendingAction"},...g.lend.loan.lendingActions.values],__typename:"LendingActionCollection"}});var r,s,o;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`story({
  participants: activities.lend.loan.lendingActions
})`,...(o=(s=e.parameters)==null?void 0:s.docs)==null?void 0:o.source}}};var i,p,c;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`story({
  participants: {
    values: [],
    __typename: 'LendingActionCollection'
  }
})`,...(c=(p=t.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};var l,m,d;n.parameters={...n.parameters,docs:{...(l=n.parameters)==null?void 0:l.docs,source:{originalSource:`story({
  participants: {
    values: [{
      latestSharePurchaseDate: '2023-11-15T08:00:00Z',
      lender: {
        name: 'You',
        image: {
          url: 'https://www.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg'
        },
        publicId: 'current-user'
      },
      shareAmount: '50.00',
      isCurrentUser: true,
      __typename: 'LendingAction'
    }, ...activities.lend.loan.lendingActions.values],
    __typename: 'LendingActionCollection'
  }
})`,...(d=(m=n.parameters)==null?void 0:m.docs)==null?void 0:d.source}}};const E=["Default","Empty","CurrentUserHighlighted"];export{n as CurrentUserHighlighted,e as Default,t as Empty,E as __namedExportsOrder,U as default};
