import { ApolloClient, createNetworkInterface } from 'apollo-client';

export default () => new ApolloClient({
	networkInterface: createNetworkInterface({
		uri: 'https://api-vm.kiva.org/graphql?app_id=org.kiva.www&scopes=access&user_id=1017419',
		opts: {
			// credentials: 'same-origin',
			// headers: {
			// 	'x-crumb': '', // cookie.get('kvis') && cookie.get('kvis').substr(6),
			// },
		},
	}),
});
