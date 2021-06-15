import * as nodecgApiContext from './nodecg-api-context';

module.exports = (nodecg: any) => {
	// Store a reference to this nodecg API context in a place where other libs can easily access it.
	// This must be done before any other files are `require`d.
	nodecgApiContext.set(nodecg);
	init().then(() => {
		nodecg.log.info('Initialization successful.');
	}).catch(error => {
		nodecg.log.error('Failed to initialize:', error);
	});
};

async function init() {
	const nodecg = nodecgApiContext.get();

	// Replicants
	nodecg.Replicant('roundMatch', {persistent: false});
	nodecg.Replicant('bgInfo', {defaultValue: {image: true, color: '000000', corner: 5}});
	nodecg.Replicant('bracket', {defaultValue: [], persistent: false});
	nodecg.Replicant('twoPlayer', {defaultValue: true});
	nodecg.Replicant('teamNames', {defaultValue: []});

	// require('./check-update-ext');
	require('./node-challonge-ext');
	require('./teams');
}
