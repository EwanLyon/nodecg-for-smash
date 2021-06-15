import React, { useState } from 'react';
import { render } from 'react-dom';
import { ThemeProvider, Button, TextField } from '@material-ui/core';
import styled from 'styled-components';

import { darkTheme } from './dark-theme';
import { useReplicant } from 'use-nodecg';

const BracketContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 8px;
`;

export const Bracket: React.FC = () => {
	const [bracketReplicant, setBracketReplicant] = useReplicant<any[], any[]>('bracket', []);
	const [bracketLink, setBracketLink] = useState('');
	const [bracketTitle, setBracketTitle] = useState('');

	function getChallonge() {
		const parser = document.createElement('a');
		parser.href = bracketLink;

		let subdomain = '';
		const hostnameSplit = parser.hostname.split('.');
		if (hostnameSplit.length == 3) {
			subdomain = hostnameSplit[0];
		}

		const path = parser.pathname.split('/')[1];

		return {
			subdomain: subdomain,
			path: path,
		};
	}

	function updateData(bracket: any[]) {
		return {
			bracket: bracket,
			link: bracketLink,
			title: bracketTitle,
		};
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<BracketContainer>
				<TextField
					fullWidth
					value={bracketTitle}
					onChange={(e) => setBracketTitle(e.target.value)}
					label="Bracket Title"
				/>
				<TextField
					fullWidth
					value={bracketLink}
					onChange={(e) => setBracketLink(e.target.value)}
					label="Challonge link"
				/>

				<Button
					fullWidth
					variant="contained"
					className="flex"
					onClick={() => {
						nodecg.sendMessage('ssbmChallongeUpdate', getChallonge(), function (result) {
							setBracketReplicant(result);
							nodecg.sendMessage('ssbmBracketUpdate', updateData(bracketReplicant));
						});
					}}>
					Pull from Challonge
				</Button>
				<hr style={{width: '100%'}} />
				<Button fullWidth variant="contained" className="flex" nodecg-dialog="manual-update">
					Manual Update
				</Button>
			</BracketContainer>
		</ThemeProvider>
	);
};

render(<Bracket />, document.getElementById('bracket'));
