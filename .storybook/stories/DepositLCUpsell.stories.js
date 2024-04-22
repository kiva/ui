import Vue from "vue";
import DepositLcUpsell from "@/components/Checkout/DepositLcUpsell.vue";

export default {
	title: "Checkout/DepositLCUpsell",
	component: DepositLcUpsell,
	args: {
    loan: {
      id: 1,
      name: 'Test',
      image: {
        url: "https://www-0.development.kiva.org/img/s100/6b1a24092be3aaa22216874e644a4acf.jpg"
      },
      loanAmount: 1000,
      loanFundraisingInfo: {
        fundedAmount: 100,
        reservedAmount: 200,
      },
      gender: 'male',
      use: 'to buy a boat for his transportation business '
    },
    addToBasket: () => {},
    amountToLend: 500,
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		DepositLcUpsell,
	},
	template: `
		<div>
			<deposit-lc-upsell
				:loan="loan"
        :add-to-basket="addToBasket"
        :amount-to-lend="amountToLend"
			/>
		</div>
	`,
});
