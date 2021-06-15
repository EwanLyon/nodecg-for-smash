import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { TextField, ThemeProvider } from '@material-ui/core';
import { useReplicant } from 'use-nodecg';

import { darkTheme } from './dark-theme';

const TeamContainer = styled.div`
	display: flex;
	margin: 8px 0;
`;

const TeamIcon = styled.img`
	width: 50px;
	height: auto;
	object-fit: contain;
	margin-right: 16px;
`;

export const ManageTeams: React.FC = () => {
	const [teams, setTeams] = useState<any[]>([]);
	const [teamNamesReplicant, setTeamNamesReplicant] = useReplicant<any[], any[]>('teamNames', []);
	console.log(teamNamesReplicant)

	useEffect(() => {
		setTeams(teamNamesReplicant);
	}, [teamNamesReplicant]);

	useEffect(() => {
		document.addEventListener('dialog-confirmed', setTeamsReplicant);

		return () => {
			document.removeEventListener('dialog-confirmed', setTeamsReplicant);
		}
	}, []);

	const setTeamsReplicant = () => {
		setTeamNamesReplicant(teams);
	}

	const updateSingleTeamName = (name: string, index: number) => {
		const mutableTeam = [...teams];
		mutableTeam[index].name = name;
		setTeams(mutableTeam);
	}

	return (
		<ThemeProvider theme={darkTheme}>
			{teams.map((team, i) => {
				return (
					<TeamContainer key={team.url + i.toString()}>
						<TeamIcon src={team.url} />
						<TextField style={{flexGrow: 1}} value={team.name} id={`team${i}name`} onChange={(e) => updateSingleTeamName(e.target.value, i)} />
					</TeamContainer>
				);
			})}
		</ThemeProvider>
	);
};


render(<ManageTeams />, document.getElementById('manage-teams'));
