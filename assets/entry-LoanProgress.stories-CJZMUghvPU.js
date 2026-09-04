import{L as e}from"./entry-LoanProgress-CBJRdD4M9n.js";import"./entry-numeral-xVHG5DEP0A.js";import"./entry-_commonjsHelpers-Cpj98o6Yn6.js";import"./entry-vue.esm-bundler-CkX4CbCAj4.js";import"./entry-KvWwwHeaderBasic-DazABq2i2V.js";import"./entry-index-CWclSTHHJk.js";import"./entry-index-DY-WJZJV9t.js";import"./entry-index-DZ6tDFr9r-.js";import"./entry-tailwind.config-CSFvy6LGkL.js";import"./entry-index-XKsyWbakvl.js";import"./iframe-D22wPJfH.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";const Be={title:"Components/BorrowerProfile/LoanProgress",component:e,parameters:{docs:{description:{component:`LoanProgress renders in both FullBorrowerProfile and MinimalBorrowerProfile.

Public statuses:  fundraising, funded (virtual), expired, refunded
Privileged-only:  raised, payingBack, ended, defaulted, inactive,
                  inactiveExpired, reviewed, deleted, issue`}}}},r=()=>({components:{LoanProgress:e},template:`
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
    `});n.storyName="Funded / Raised";const t=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="expired"
            :progress-percent="0.65"
            money-left="350.00"
            :loading="false"
            :loan-id="123"
        />
    `}),l=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="inactive"
            :progress-percent="0"
            money-left="600.00"
            :loading="false"
            :loan-id="123"
        />
    `}),p=()=>({components:{LoanProgress:e},template:`
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
    `}),d=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="payingBack"
            status-label="Paying back"
            :progress-percent="0.60"
            money-left="400.00"
            :loading="false"
            :loan-id="123"
        />
    `}),s=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="payingBack"
            status-label="Paying back delinquent"
            :progress-percent="0.60"
            money-left="400.00"
            :loading="false"
            :loan-id="123"
        />
    `});s.storyName="Paying Back / Delinquent";const i=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="ended"
            status-label="Repaid"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    `}),a=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="ended"
            status-label="Repaid with currency loss"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    `});a.storyName="Ended / Currency Loss";const c=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="defaulted"
            status-label="Ended in default"
            :progress-percent="0.45"
            money-left="550.00"
            :loading="false"
            :loan-id="123"
        />
    `}),m=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="refunded"
            status-label="Refunded"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    `}),g=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="inactiveExpired"
            status-label="Inactive expired"
            :progress-percent="0"
            money-left="500.00"
            :loading="false"
            :loan-id="123"
        />
    `}),u=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="reviewed"
            status-label="Reviewed"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    `}),f=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="deleted"
            status-label="Deleted"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    `}),y=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="issue"
            status-label="Issue"
            :progress-percent="0.20"
            money-left="800.00"
            :loading="false"
            :loan-id="123"
        />
    `}),o=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            loan-status="reviewed"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    `});o.storyName="Missing Status Label (falls back to the raw status)";const P=()=>({components:{LoanProgress:e},template:`
        <loan-progress
            :loading="true"
            :loan-id="123"
        />
    `});var b,L,v;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`() => ({
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
})`,...(v=(L=r.parameters)==null?void 0:L.docs)==null?void 0:v.source}}};var S,k,w;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`() => ({
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
})`,...(w=(k=n.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var E,R,x;t.parameters={...t.parameters,docs:{...(E=t.parameters)==null?void 0:E.docs,source:{originalSource:`() => ({
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
})`,...(x=(R=t.parameters)==null?void 0:R.docs)==null?void 0:x.source}}};var B,I,D;l.parameters={...l.parameters,docs:{...(B=l.parameters)==null?void 0:B.docs,source:{originalSource:`() => ({
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
})`,...(D=(I=l.parameters)==null?void 0:I.docs)==null?void 0:D.source}}};var F,h,q;p.parameters={...p.parameters,docs:{...(F=p.parameters)==null?void 0:F.docs,source:{originalSource:`() => ({
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
})`,...(q=(h=p.parameters)==null?void 0:h.docs)==null?void 0:q.source}}};var C,M,N;d.parameters={...d.parameters,docs:{...(C=d.parameters)==null?void 0:C.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="payingBack"
            status-label="Paying back"
            :progress-percent="0.60"
            money-left="400.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(N=(M=d.parameters)==null?void 0:M.docs)==null?void 0:N.source}}};var _,W,O;s.parameters={...s.parameters,docs:{...(_=s.parameters)==null?void 0:_.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="payingBack"
            status-label="Paying back delinquent"
            :progress-percent="0.60"
            money-left="400.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(O=(W=s.parameters)==null?void 0:W.docs)==null?void 0:O.source}}};var j,z,A;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="ended"
            status-label="Repaid"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(A=(z=i.parameters)==null?void 0:z.docs)==null?void 0:A.source}}};var G,H,J;a.parameters={...a.parameters,docs:{...(G=a.parameters)==null?void 0:G.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="ended"
            status-label="Repaid with currency loss"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(J=(H=a.parameters)==null?void 0:H.docs)==null?void 0:J.source}}};var K,Q,T;c.parameters={...c.parameters,docs:{...(K=c.parameters)==null?void 0:K.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="defaulted"
            status-label="Ended in default"
            :progress-percent="0.45"
            money-left="550.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(T=(Q=c.parameters)==null?void 0:Q.docs)==null?void 0:T.source}}};var U,V,X;m.parameters={...m.parameters,docs:{...(U=m.parameters)==null?void 0:U.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="refunded"
            status-label="Refunded"
            :progress-percent="1"
            money-left="0.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(X=(V=m.parameters)==null?void 0:V.docs)==null?void 0:X.source}}};var Y,Z,$;g.parameters={...g.parameters,docs:{...(Y=g.parameters)==null?void 0:Y.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="inactiveExpired"
            status-label="Inactive expired"
            :progress-percent="0"
            money-left="500.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...($=(Z=g.parameters)==null?void 0:Z.docs)==null?void 0:$.source}}};var ee,ne,se;u.parameters={...u.parameters,docs:{...(ee=u.parameters)==null?void 0:ee.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="reviewed"
            status-label="Reviewed"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(se=(ne=u.parameters)==null?void 0:ne.docs)==null?void 0:se.source}}};var ae,oe,re;f.parameters={...f.parameters,docs:{...(ae=f.parameters)==null?void 0:ae.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="deleted"
            status-label="Deleted"
            :progress-percent="0"
            money-left="1000.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(re=(oe=f.parameters)==null?void 0:oe.docs)==null?void 0:re.source}}};var te,le,pe;y.parameters={...y.parameters,docs:{...(te=y.parameters)==null?void 0:te.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            loan-status="issue"
            status-label="Issue"
            :progress-percent="0.20"
            money-left="800.00"
            :loading="false"
            :loan-id="123"
        />
    \`
})`,...(pe=(le=y.parameters)==null?void 0:le.docs)==null?void 0:pe.source}}};var de,ie,ce;o.parameters={...o.parameters,docs:{...(de=o.parameters)==null?void 0:de.docs,source:{originalSource:`() => ({
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
})`,...(ce=(ie=o.parameters)==null?void 0:ie.docs)==null?void 0:ce.source}}};var me,ge,ue;P.parameters={...P.parameters,docs:{...(me=P.parameters)==null?void 0:me.docs,source:{originalSource:`() => ({
  components: {
    LoanProgress
  },
  template: \`
        <loan-progress
            :loading="true"
            :loan-id="123"
        />
    \`
})`,...(ue=(ge=P.parameters)==null?void 0:ge.docs)==null?void 0:ue.source}}};const Ie=["Fundraising","FundedRaised","Expired","Inactive","PrivateFundraisingPeriod","PayingBack","PayingBackDelinquent","Ended","EndedWithCurrencyLoss","Defaulted","Refunded","InactiveExpired","Reviewed","Deleted","Issue","MissingStatusLabel","Loading"];export{c as Defaulted,f as Deleted,i as Ended,a as EndedWithCurrencyLoss,t as Expired,n as FundedRaised,r as Fundraising,l as Inactive,g as InactiveExpired,y as Issue,P as Loading,o as MissingStatusLabel,d as PayingBack,s as PayingBackDelinquent,p as PrivateFundraisingPeriod,m as Refunded,u as Reviewed,Ie as __namedExportsOrder,Be as default};
