import{L as e}from"./entry-LoanProgress-BYJ4GKIK7w.js";import"./entry-loanUtils-BMxTMkkMAR.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-get-7eV6H4dYCO.js";import"./entry-get-ClabG2OWPD.js";import"./entry-isSymbol-5pnFTpIKM9.js";import"./entry-vue.esm-bundler-Du63x9n7zJ.js";import"./entry-KvWwwHeaderBasic-DMkxmXVWpl.js";import"./entry-index-CWclSTHHJk.js";import"./entry-tailwind.config-DnDN25xoV6.js";import"./entry-index-CovN8vffBz.js";import"./entry-index-DaZG7dZWP2.js";import"./entry-index-jQMUY8qRYX.js";import"./iframe-LCVN7OV2.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const ve={title:"Components/BorrowerProfile/LoanProgress",component:e,parameters:{docs:{description:{component:`LoanProgress renders in both FullBorrowerProfile and MinimalBorrowerProfile.

Public statuses:  fundraising, funded (virtual), expired, refunded
Privileged-only:  raised, payingBack, ended, defaulted, inactive,
                  inactiveExpired, reviewed, deleted, issue`}}}},o=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="fundraising"
            :progress-percent="0.75"
            money-left="250.00"
            time-left="5 days"
            :loading="false"
            :loan-id="123"
        />
    `}),n=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="funded"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    `});n.storyName="Funded / Raised";const s=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="expired"
            :progress-percent="0.65"
            money-left="350.00"
            :loading="false"
            :loan-id="123"
        />
    `}),r=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="inactive"
            :progress-percent="0"
            money-left="600.00"
            :loading="false"
            :loan-id="123"
        />
    `}),a=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="pfp"
            :progress-percent="0.5"
            money-left="500.00"
            time-left="12 days"
            :loading="false"
            :loan-id="123"
            :number-of-lenders="350"
            :pfp-min-lenders="700"
        />
    `}),t=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="payingBack"
            :progress-percent="0.60"
            money-left="400.00"
            :loading="false"
            :loan-id="123"
        />
    `}),p=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="ended"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    `}),l=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="defaulted"
            :progress-percent="0.45"
            money-left="550.00"
            :loading="false"
            :loan-id="123"
        />
    `}),d=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="refunded"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    `}),i=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="inactiveExpired"
            :progress-percent="0"
            money-left="500.00"
            :loading="false"
            :loan-id="123"
        />
    `}),c=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="reviewed"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    `}),m=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="deleted"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    `}),g=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="issue"
            :progress-percent="0.20"
            money-left="800.00"
            :loading="false"
            :loan-id="123"
        />
    `}),u=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            :loading="true"
            :loan-id="123"
        />
    `});var f,y,P;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="fundraising"
            :progress-percent="0.75"
            money-left="250.00"
            time-left="5 days"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(P=(y=o.parameters)==null?void 0:y.docs)==null?void 0:P.source}}};var L,v,S;n.parameters={...n.parameters,docs:{...(L=n.parameters)==null?void 0:L.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="funded"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(S=(v=n.parameters)==null?void 0:v.docs)==null?void 0:S.source}}};var x,E,w;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="expired"
            :progress-percent="0.65"
            money-left="350.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(w=(E=s.parameters)==null?void 0:E.docs)==null?void 0:w.source}}};var B,F,R;r.parameters={...r.parameters,docs:{...(B=r.parameters)==null?void 0:B.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="inactive"
            :progress-percent="0"
            money-left="600.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(R=(F=r.parameters)==null?void 0:F.docs)==null?void 0:R.source}}};var I,k,b;a.parameters={...a.parameters,docs:{...(I=a.parameters)==null?void 0:I.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="pfp"
            :progress-percent="0.5"
            money-left="500.00"
            time-left="12 days"
            :loading="false"
            :loan-id="123"
            :number-of-lenders="350"
            :pfp-min-lenders="700"
        />
    \`
})`,...(b=(k=a.parameters)==null?void 0:k.docs)==null?void 0:b.source}}};var D,_,h;t.parameters={...t.parameters,docs:{...(D=t.parameters)==null?void 0:D.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="payingBack"
            :progress-percent="0.60"
            money-left="400.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(h=(_=t.parameters)==null?void 0:_.docs)==null?void 0:h.source}}};var C,M,N;p.parameters={...p.parameters,docs:{...(C=p.parameters)==null?void 0:C.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="ended"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(N=(M=p.parameters)==null?void 0:M.docs)==null?void 0:N.source}}};var O,j,q;l.parameters={...l.parameters,docs:{...(O=l.parameters)==null?void 0:O.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="defaulted"
            :progress-percent="0.45"
            money-left="550.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(q=(j=l.parameters)==null?void 0:j.docs)==null?void 0:q.source}}};var z,A,G;d.parameters={...d.parameters,docs:{...(z=d.parameters)==null?void 0:z.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="refunded"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(G=(A=d.parameters)==null?void 0:A.docs)==null?void 0:G.source}}};var H,J,K;i.parameters={...i.parameters,docs:{...(H=i.parameters)==null?void 0:H.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="inactiveExpired"
            :progress-percent="0"
            money-left="500.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(K=(J=i.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var Q,T,U;c.parameters={...c.parameters,docs:{...(Q=c.parameters)==null?void 0:Q.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="reviewed"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(U=(T=c.parameters)==null?void 0:T.docs)==null?void 0:U.source}}};var V,W,X;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="deleted"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(X=(W=m.parameters)==null?void 0:W.docs)==null?void 0:X.source}}};var Y,Z,$;g.parameters={...g.parameters,docs:{...(Y=g.parameters)==null?void 0:Y.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="issue"
            :progress-percent="0.20"
            money-left="800.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...($=(Z=g.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var ee,ne,oe;u.parameters={...u.parameters,docs:{...(ee=u.parameters)==null?void 0:ee.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            :loading="true"
            :loan-id="123"
        />
    \`
})`,...(oe=(ne=u.parameters)==null?void 0:ne.docs)==null?void 0:oe.source}}};const Se=["Fundraising","FundedRaised","Expired","Inactive","PrivateFundraisingPeriod","PayingBack","Ended","Defaulted","Refunded","InactiveExpired","Reviewed","Deleted","Issue","Loading"];export{l as Defaulted,m as Deleted,p as Ended,s as Expired,n as FundedRaised,o as Fundraising,r as Inactive,i as InactiveExpired,g as Issue,u as Loading,t as PayingBack,a as PrivateFundraisingPeriod,d as Refunded,c as Reviewed,Se as __namedExportsOrder,ve as default};
