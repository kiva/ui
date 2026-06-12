import{T as p}from"./entry-TeamMessageCard-7SIYbEGTU0.js";import"./entry-vue.esm-bundler-D6rjCHbx5a.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-tAHLmhMYuW.js";import"./entry-index-B_VjIxz4TE.js";import"./entry-index-BA7RGigQ8D.js";const h={title:"LendingTeams/TeamMessageCard",component:p},g=a=>{const t=(c,{argTypes:l})=>({props:Object.keys(l),components:{TeamMessageCard:p},setup(){return a},template:`
            <div style="max-width: 360px;">
                <team-message-card :message="message" />
            </div>
        `});return t.args=a,t},e=g({message:{id:1001,body:"Great work everyone! We just hit our monthly lending goal. Keep it up! #1002",date:new Date(Date.now()-2*60*60*1e3).toISOString(),sender:{id:42,name:"Jane Doe",publicId:"jane_doe",imageUrl:"https://www-0.development.kiva.org/img/s100/26e15431f51b540f31cd9f011cc54f31.jpg"},team:{id:101,name:"Kiva Friends",teamPublicId:"kiva-friends",imageUrl:"https://www-0.development.kiva.org/img/s100/team_s135.png"}}}),n=g({message:{id:1002,body:"Welcome to the team, everyone! Happy to lend together.",date:new Date(Date.now()-24*60*60*1e3).toISOString(),sender:{id:43,name:"Anonymous Lender",publicId:"anonymous_lender",imageUrl:""},team:{id:101,name:"Kiva Friends",teamPublicId:"kiva-friends",imageUrl:"https://www-0.development.kiva.org/img/s100/team_s135.png"}}});var r,o,s;e.parameters={...e.parameters,docs:{...(r=e.parameters)==null?void 0:r.docs,source:{originalSource:`story({
  message: {
    id: 1001,
    body: 'Great work everyone! We just hit our monthly lending goal. Keep it up! #1002',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    sender: {
      id: 42,
      name: 'Jane Doe',
      publicId: 'jane_doe',
      imageUrl: 'https://www-0.development.kiva.org/img/s100/26e15431f51b540f31cd9f011cc54f31.jpg'
    },
    team: {
      id: 101,
      name: 'Kiva Friends',
      teamPublicId: 'kiva-friends',
      imageUrl: 'https://www-0.development.kiva.org/img/s100/team_s135.png'
    }
  }
})`,...(s=(o=e.parameters)==null?void 0:o.docs)==null?void 0:s.source}}};var m,i,d;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`story({
  message: {
    id: 1002,
    body: 'Welcome to the team, everyone! Happy to lend together.',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    sender: {
      id: 43,
      name: 'Anonymous Lender',
      publicId: 'anonymous_lender',
      imageUrl: ''
    },
    team: {
      id: 101,
      name: 'Kiva Friends',
      teamPublicId: 'kiva-friends',
      imageUrl: 'https://www-0.development.kiva.org/img/s100/team_s135.png'
    }
  }
})`,...(d=(i=n.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};const I=["Default","NoSenderImage"];export{e as Default,n as NoSenderImage,I as __namedExportsOrder,h as default};
