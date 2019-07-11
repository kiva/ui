const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { lunarExpress } = require('lunar-express');
const getRemoteGqlSchema = require('./util/getRemoteGqlSchema');

module.exports = function mockGraphqlRouter(url) {
	const router = express.Router();

	getRemoteGqlSchema(url).then(schema => {
		const server = new ApolloServer({ schema });

		router.use('/__lunar', lunarExpress({ schema, mocks: {} }));
		server.applyMiddleware({ app: router });
	});

	return router;
};
