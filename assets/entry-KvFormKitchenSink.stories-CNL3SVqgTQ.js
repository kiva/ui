import{K as o}from"./entry-KvBaseInput-Db98KZn4P1.js";import{K as i}from"./entry-KvCheckbox-CbK7xM6OtO.js";import{K as d}from"./entry-KvCurrencyInput-DIiLwlUqi1.js";import{K as a}from"./entry-KvSelect-DKHO6brSly.js";import{K as v}from"./entry-KvPhoneInput-NFsfFATt-H.js";import{K as r}from"./entry-KvPillToggle-Bggu2rC-Sk.js";import{K as s}from"./entry-KvRadio-D0BXpfCFhG.js";import{K as p}from"./entry-KvToggle-Bnby7XP1nv.js";import{K as k}from"./entry-KvVerificationCodeInput-BtfYm12h2F.js";import"./entry-vue.esm-bundler-CTwdbZZHjD.js";import"./entry-KvWideLoanCard-CfbcqIxttL.js";import"./entry-_commonjsHelpers-BosuxZz1dT.js";import"./entry-KvCheckbox-Bnu8GR9peP.js";import"./entry-index.browser-vcSNLBTfP4.js";import"./entry-attrs-C2OODjD6EW.js";import"./entry-numeral-BEwyVwpTZh.js";import"./entry-KvTextInput-D9rMZd2Muf.js";import"./entry-KvMaterialIcon-Dgz8mJKr4K.js";import"./entry-_plugin-vue_export-helper-DlAUqK2UKH.js";import"./entry-index-BGoCgNbB3p.js";import"./entry-KvFlag-B4hdgYLnZX.js";const _={title:"Kv/Form Elements"},e=()=>({components:{KvBaseInput:o,KvCheckbox:i,KvCurrencyInput:d,KvSelect:a,KvPhoneInput:v,KvPillToggle:r,KvRadio:s,KvToggle:p,KvVerificationCodeInput:k},data(){return{kvBaseInputError:{validationName:!1,$error:!0,$params:{validationName:{}}},kvCheckboxModel1:!0,kvCheckboxModel2:!1,kvCheckboxModel3:!1,kvCurrencyAmount:25,KvSelectModel:"test2",KvPhoneInput:"",kvPillOptions:[{title:"Option 1",key:"o1",disabled:!0},{title:"Option 2",key:"o2"},{title:"Option 3",key:"o3"}],kvPillSelected:"o2",kvSplitPillOptions:[{title:"$10",key:"s1"},{title:"$25",key:"s2"},{title:"$50",key:"s3"},{title:"Other",key:"s4"}],kvSplitPillSelected:"s2",kvRadioSelected:"female",kvRadioButtonsSelected:"2",kvToggle1:!0,kvToggle2:!1,kvToggle3:!0,KvVerificationCodeInput:123456,kvBaseInputValue:""}},template:`
        <section id="section-form">
            <form>
                <fieldset>
                    <legend>Example Legend</legend>

                    <fieldset style="margin-bottom: 2rem;">
                        <legend>KvPillToggle</legend>
                        <kv-pill-toggle
                            id="pill"
                            :options="kvPillOptions"
                            :selected="kvPillSelected"
                        />
                    </fieldset>

                    <fieldset style="margin-bottom: 2rem;">
                        <legend>KvPillToggle (Split Pill Option)</legend>
                        <kv-pill-toggle
                            id="split-pill"
                            :options="kvSplitPillOptions"
                            :split-pills="true"
                            :selected="kvSplitPillSelected"
                        />
                    </fieldset>

                    <fieldset style="margin-bottom: 2rem;">
                        <legend>KvRadio</legend>
                        <kv-radio
                            id="gender-radio-both"
                            radio-value="both"
                            v-model="kvRadioSelected"
                            disabled
                        >
                            Everyone
                        </kv-radio>
                        <kv-radio
                            id="gender-radio-female"
                            radio-value="female"
                            v-model="kvRadioSelected"
                        >
                            Women only
                        </kv-radio>
                        <kv-radio
                            id="gender-radio-male"
                            radio-value="male"
                            v-model="kvRadioSelected"
                        >
                            Men only
                        </kv-radio>
                    </fieldset>

                    <fieldset style="margin-bottom: 2rem;">
                        <legend>Kv Radio - Button Style</legend>
                        <kv-radio
                            id="radio-option-1"
                            radio-value="1"
                            v-model="kvRadioButtonsSelected"
                            :pill-style="true"
                            disabled
                        >
                            Option 1
                        </kv-radio>
                        <kv-radio
                            id="radio-option-2"
                            radio-value="2"
                            v-model="kvRadioButtonsSelected"
                            :pill-style="true"
                        >
                            Option 2
                        </kv-radio>
                        <kv-radio
                            id="radio-option-3"
                            radio-value="3"
                            v-model="kvRadioButtonsSelected"
                            :pill-style="true"
                        >
                            Option 3
                        </kv-radio>
                    </fieldset>

                    <fieldset style="margin-bottom: 2rem;">
                        <legend>KvCheckbox</legend>
                        <kv-checkbox
                            id="checkbox-1"
                            v-model="kvCheckboxModel1"
                            disabled
                        >
                            Option 1
                        </kv-checkbox>
                        <kv-checkbox
                            id="checkbox-2"
                            v-model="kvCheckboxModel2"
                        >
                            Option 2
                        </kv-checkbox>
                        <kv-checkbox
                            id="checkbox-3"
                            v-model="kvCheckboxModel3"
                        >
                            Option 3
                        </kv-checkbox>
                    </fieldset>

                    <fieldset style="margin-bottom: 2rem;">
                        <legend>KvToggle</legend>
                        <kv-toggle
                            id="kv-toggle-1"
                            v-model="kvToggle1"
                            disabled
                        >
                            Option 1
                        </kv-toggle>
                        <kv-toggle
                            id="kv-toggle-2"
                            v-model="kvToggle2"
                        >
                            Option 2
                        </kv-toggle>
                        <kv-toggle
                            id="kv-toggle-3"
                            v-model="kvToggle3"
                        >
                            Option 3
                        </kv-toggle>
                    </fieldset>

                    <fieldset style="margin-bottom: 2rem;">
                        <kv-select v-model="KvSelectModel">
                            <option value="test">Test</option>
                            <option value="test2">Test2</option>
                            <option value="test3">Test3</option>
                        </kv-select>
                    </fieldset>

                </fieldset>

                <fieldset>
                    <label class="input-label" for="amount">
                        KvCurrencyInput
                    </label>
                    <kv-currency-input id="amount" v-model="kvCurrencyAmount" />
                </fieldset>

                <fieldset>
                    <label class="input-label" for="phone_number">
                        KvPhoneInput
                    </label>
                    <kv-phone-input id="phone_number" v-model="KvPhoneInput" />
                </fieldset>

                <fieldset>
                    <label class="input-label" for="verification_code">
                        KvVerificationCodeInput
                    </label>
                    <kv-verification-code-input id="verification_code" v-model="KvVerificationCodeInput" />
                </fieldset>

                <fieldset>
                    <label>
                        Input Text
                        <input
                            type="text"
                            name="inputText"
                            maxlength="40"
                        >
                    </label>
                    <label>
                        Input Text Area
                        <textarea
                            name="inputTextarea"
                            rows="4"
                        ></textarea>
                    </label>
                </fieldset>

                <fieldset>
                    <legend>KvBaseInput</legend>
                    <kv-base-input
                        type="text"
                        name="baseInput"
                        :validation="{}"
                        v-model="kvBaseInputValue"
                    >
                        Base input
                    </kv-base-input>
                    <kv-base-input
                        type="text"
                        name="baseInputError"
                        :validation="kvBaseInputError"
                        v-model="kvBaseInputValue"
                    >
                        Base input with error

                        <template #validationName>
                            There is a problem
                        </template>
                    </kv-base-input>
                </fieldset>
            </form>
        </section>
    `});var n,t,l;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`() => ({
  components: {
    KvBaseInput,
    KvCheckbox,
    KvCurrencyInput,
    KvSelect,
    KvPhoneInput,
    KvPillToggle,
    KvRadio,
    KvToggle,
    KvVerificationCodeInput
  },
  data() {
    return {
      kvBaseInputError: {
        validationName: false,
        $error: true,
        $params: {
          validationName: {}
        }
      },
      kvCheckboxModel1: true,
      kvCheckboxModel2: false,
      kvCheckboxModel3: false,
      kvCurrencyAmount: 25,
      KvSelectModel: 'test2',
      KvPhoneInput: '',
      kvPillOptions: [{
        title: 'Option 1',
        key: 'o1',
        disabled: true
      }, {
        title: 'Option 2',
        key: 'o2'
      }, {
        title: 'Option 3',
        key: 'o3'
      }],
      kvPillSelected: 'o2',
      kvSplitPillOptions: [{
        title: '$10',
        key: 's1'
      }, {
        title: '$25',
        key: 's2'
      }, {
        title: '$50',
        key: 's3'
      }, {
        title: 'Other',
        key: 's4'
      }],
      kvSplitPillSelected: 's2',
      kvRadioSelected: 'female',
      kvRadioButtonsSelected: '2',
      kvToggle1: true,
      kvToggle2: false,
      kvToggle3: true,
      KvVerificationCodeInput: 123456,
      kvBaseInputValue: ''
    };
  },
  template: \`
        <section id="section-form">
            <form>
                <fieldset>
                    <legend>Example Legend</legend>

                    <fieldset style="margin-bottom: 2rem;">
                        <legend>KvPillToggle</legend>
                        <kv-pill-toggle
                            id="pill"
                            :options="kvPillOptions"
                            :selected="kvPillSelected"
                        />
                    </fieldset>

                    <fieldset style="margin-bottom: 2rem;">
                        <legend>KvPillToggle (Split Pill Option)</legend>
                        <kv-pill-toggle
                            id="split-pill"
                            :options="kvSplitPillOptions"
                            :split-pills="true"
                            :selected="kvSplitPillSelected"
                        />
                    </fieldset>

                    <fieldset style="margin-bottom: 2rem;">
                        <legend>KvRadio</legend>
                        <kv-radio
                            id="gender-radio-both"
                            radio-value="both"
                            v-model="kvRadioSelected"
                            disabled
                        >
                            Everyone
                        </kv-radio>
                        <kv-radio
                            id="gender-radio-female"
                            radio-value="female"
                            v-model="kvRadioSelected"
                        >
                            Women only
                        </kv-radio>
                        <kv-radio
                            id="gender-radio-male"
                            radio-value="male"
                            v-model="kvRadioSelected"
                        >
                            Men only
                        </kv-radio>
                    </fieldset>

                    <fieldset style="margin-bottom: 2rem;">
                        <legend>Kv Radio - Button Style</legend>
                        <kv-radio
                            id="radio-option-1"
                            radio-value="1"
                            v-model="kvRadioButtonsSelected"
                            :pill-style="true"
                            disabled
                        >
                            Option 1
                        </kv-radio>
                        <kv-radio
                            id="radio-option-2"
                            radio-value="2"
                            v-model="kvRadioButtonsSelected"
                            :pill-style="true"
                        >
                            Option 2
                        </kv-radio>
                        <kv-radio
                            id="radio-option-3"
                            radio-value="3"
                            v-model="kvRadioButtonsSelected"
                            :pill-style="true"
                        >
                            Option 3
                        </kv-radio>
                    </fieldset>

                    <fieldset style="margin-bottom: 2rem;">
                        <legend>KvCheckbox</legend>
                        <kv-checkbox
                            id="checkbox-1"
                            v-model="kvCheckboxModel1"
                            disabled
                        >
                            Option 1
                        </kv-checkbox>
                        <kv-checkbox
                            id="checkbox-2"
                            v-model="kvCheckboxModel2"
                        >
                            Option 2
                        </kv-checkbox>
                        <kv-checkbox
                            id="checkbox-3"
                            v-model="kvCheckboxModel3"
                        >
                            Option 3
                        </kv-checkbox>
                    </fieldset>

                    <fieldset style="margin-bottom: 2rem;">
                        <legend>KvToggle</legend>
                        <kv-toggle
                            id="kv-toggle-1"
                            v-model="kvToggle1"
                            disabled
                        >
                            Option 1
                        </kv-toggle>
                        <kv-toggle
                            id="kv-toggle-2"
                            v-model="kvToggle2"
                        >
                            Option 2
                        </kv-toggle>
                        <kv-toggle
                            id="kv-toggle-3"
                            v-model="kvToggle3"
                        >
                            Option 3
                        </kv-toggle>
                    </fieldset>

                    <fieldset style="margin-bottom: 2rem;">
                        <kv-select v-model="KvSelectModel">
                            <option value="test">Test</option>
                            <option value="test2">Test2</option>
                            <option value="test3">Test3</option>
                        </kv-select>
                    </fieldset>

                </fieldset>

                <fieldset>
                    <label class="input-label" for="amount">
                        KvCurrencyInput
                    </label>
                    <kv-currency-input id="amount" v-model="kvCurrencyAmount" />
                </fieldset>

                <fieldset>
                    <label class="input-label" for="phone_number">
                        KvPhoneInput
                    </label>
                    <kv-phone-input id="phone_number" v-model="KvPhoneInput" />
                </fieldset>

                <fieldset>
                    <label class="input-label" for="verification_code">
                        KvVerificationCodeInput
                    </label>
                    <kv-verification-code-input id="verification_code" v-model="KvVerificationCodeInput" />
                </fieldset>

                <fieldset>
                    <label>
                        Input Text
                        <input
                            type="text"
                            name="inputText"
                            maxlength="40"
                        >
                    </label>
                    <label>
                        Input Text Area
                        <textarea
                            name="inputTextarea"
                            rows="4"
                        ></textarea>
                    </label>
                </fieldset>

                <fieldset>
                    <legend>KvBaseInput</legend>
                    <kv-base-input
                        type="text"
                        name="baseInput"
                        :validation="{}"
                        v-model="kvBaseInputValue"
                    >
                        Base input
                    </kv-base-input>
                    <kv-base-input
                        type="text"
                        name="baseInputError"
                        :validation="kvBaseInputError"
                        v-model="kvBaseInputValue"
                    >
                        Base input with error

                        <template #validationName>
                            There is a problem
                        </template>
                    </kv-base-input>
                </fieldset>
            </form>
        </section>
    \`
})`,...(l=(t=e.parameters)==null?void 0:t.docs)==null?void 0:l.source}}};const $=["KitchenSink"];export{e as KitchenSink,$ as __namedExportsOrder,_ as default};
