"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodecgApiContext = tslib_1.__importStar(require("./nodecg-api-context"));
const nodecg = nodecgApiContext.get();
const teamNamesRep = nodecg.Replicant('teamNames');
const teamLogosRep = nodecg.Replicant('assets:teamlogos');
teamLogosRep.on('change', (newVal) => {
    nodecg.log.info('Logo uploaded/removed. Updating Logos');
    if (!newVal) {
        nodecg.log.info('No Logos');
        return;
    }
    const teamNames = teamNamesRep.value || [];
    // if the diff. between the two lengths > 1, uploads hasn't been initialized properly yet
    // i.e. after restarting server
    // if (Math.abs(teamNamesRep.length - teamLogosRep.length) > 1) return;
    if (teamNames.length < newVal.length) {
        // More logos than names
        const newTeams = newVal.map(logo => {
            return { url: logo.url, name: logo.name };
        });
        teamNamesRep.value = newTeams;
    }
    else if (teamNames.length > newVal.length) {
        // More names than logos
        const mutableTeams = [...teamNames];
        const allUrls = newVal.map(logo => logo.url);
        teamNames.forEach((team, i) => {
            if (!allUrls.includes(team.url)) {
                mutableTeams.splice(i, 1);
            }
        });
        teamNamesRep.value = mutableTeams;
    }
});
