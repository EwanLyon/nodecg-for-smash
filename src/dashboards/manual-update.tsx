import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { MenuItem, Select, TextField, ThemeProvider } from '@material-ui/core';

import { darkTheme } from './dark-theme';
import { useReplicant } from 'use-nodecg';

const InputContainers = styled.div`
	margin: 16px 0;
`;

export const ManualUpdate: React.FC = () => {
	const [p1Name, setP1Name] = useState('');
	const [p1Score, setP1Score] = useState(0);
	const [p2Name, setP2Name] = useState('');
	const [p2Score, setP2Score] = useState(0);
	const [bracket, setBracket] = useState<any[]>([]);
	const [winner, setWinner] = useState(0);

	const [bracketRep] = useReplicant<any[], any[]>('bracket', []);
	const [roundMatchRep, setRoundMatchRep] = useReplicant<number, number>('roundMatch', 0);

	useEffect(() => {
		setBracket([...bracketRep]);
	}, [bracketRep]);

	useEffect(() => {
		updateFields();
	}, [roundMatchRep]);

	function updateFields() {
		if (!bracket || !bracket[roundMatchRep]) return;
		setP1Name(bracket[roundMatchRep].p1name);
		setP1Score(bracket[roundMatchRep].score[0]);
		setP2Score(bracket[roundMatchRep].p2name);
		setP2Score(bracket[roundMatchRep].score[1]);
		setWinner(bracket[roundMatchRep].winner);
	}

	useEffect(() => {
		document.addEventListener('dialog-confirmed', updateBracketRep);

		return () => {
			document.removeEventListener('dialog-confirmed', updateBracketRep);
		}
	}, []);

	const updateBracketRep = () => {
		updateBracket();
		nodecg.sendMessage('ssbmBracketUpdateOnly', bracket);
	}

	function updateBracket() {
		if (!bracket[roundMatchRep]) return;
		bracket[roundMatchRep].p1name = p1Name;
		bracket[roundMatchRep].score[0] = p1Score;
		bracket[roundMatchRep].p2name = p2Name;
		bracket[roundMatchRep].score[1] = p2Score;
		bracket[roundMatchRep].winner = winner;
		console.log(bracket);
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<InputContainers>
				<Select
					fullWidth
					label="Match"
					value={roundMatchRep}
					onChange={(e) => {
						setRoundMatchRep(parseInt(e.target.value as string, 10));
					}}>
					<MenuItem value={0}>R1M1 (winners semis 1)</MenuItem>
					<MenuItem value={1}>R1M2 (winners semis 2)</MenuItem>
					<MenuItem value={2}>R2M1 (winners finals)</MenuItem>
					<MenuItem value={3}>L1M1 (loser gets 7th 1)</MenuItem>
					<MenuItem value={4}>L1M2 (loser gets 7th 2)</MenuItem>
					<MenuItem value={5}>L2M1 (losers quarters 1)</MenuItem>
					<MenuItem value={6}>L2M2 (losers quarters 2)</MenuItem>
					<MenuItem value={7}>L3M1 (losers semis)</MenuItem>
					<MenuItem value={8}>L4M1 (losers finals)</MenuItem>
					<MenuItem value={9}>R3M1 (grand finals set 1)</MenuItem>
					<MenuItem value={10}>R3M2 (grand finals set 2)</MenuItem>
				</Select>
			</InputContainers>
			<InputContainers>
				<TextField fullWidth label="Player 1" value={p1Name} onChange={(e) => setP1Name(e.target.value)} />
				<TextField
					fullWidth
					type="number"
					label="Player 1 Score"
					value={p1Score}
					onChange={(e) => setP1Score(parseInt(e.target.value, 10))}
				/>
			</InputContainers>
			<InputContainers>
				<TextField fullWidth label="Player 2" value={p2Name} onChange={(e) => setP2Name(e.target.value)} />
				<TextField
					fullWidth
					type="number"
					label="Player 2 Score"
					value={p2Score}
					onChange={(e) => setP2Score(parseInt(e.target.value, 10))}
				/>
			</InputContainers>
			<InputContainers>
				<Select
					fullWidth
					label="Match"
					value={winner}
					onChange={(e) => {
						setWinner(parseInt(e.target.value as string, 10));
					}}>
					<MenuItem value={0}>No winner</MenuItem>
					<MenuItem value={1}>Player 1 wins</MenuItem>
					<MenuItem value={2}>Player 2 wins</MenuItem>
				</Select>
			</InputContainers>
		</ThemeProvider>
	);
};

render(<ManualUpdate />, document.getElementById('manual-update'));
