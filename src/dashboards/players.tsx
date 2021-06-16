import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { Button, MenuItem, Select, TextField, ThemeProvider } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useReplicant } from 'use-nodecg';

import { Characters } from './data/characters';
import { Countries } from './data/countries';
import { darkTheme } from './dark-theme';

export const Players: React.FC = () => {
	const teamsScoreRef = useRef<(TeamsScoreFunc | null)[]>([]);
	const playersRef = useRef<(PlayerInfoFunc | null)[]>([]);
	const swapDropdownsRef = useRef<(SwapDropdownFunc | null)[]>([]);
	const [twoPlayerRep, setTwoPlayerRep] = useReplicant<boolean, boolean>('twoPlayer', true);
	const [teamNamesRep] = useReplicant<string[], string[]>('teamNames', []);

	function updateData() {
		if (twoPlayerRep) {
			return {
				p1Tag: playersRef.current[0]?.getTag(),
				p1Score: playersRef.current[0]?.getScore(),
				p1Char: getCharacter(playersRef.current[0]?.getCharacter()),
				p1Flag: getCountryCode(playersRef.current[0]?.getCountry()),
				p1Sponsor: playersRef.current[0]?.getSponsor(),
				p2Tag: playersRef.current[1]?.getTag(),
				p2Score: playersRef.current[1]?.getScore(),
				p2Char: getCharacter(playersRef.current[1]?.getCharacter()),
				p2Flag: getCountryCode(playersRef.current[1]?.getCountry()),
				p2Sponsor: playersRef.current[1]?.getSponsor(),
			};
		} else {
			return {
				team1: teamsScoreRef.current[0]?.getTeam(),
				team1Score: teamsScoreRef.current[0]?.getScore(),
				team2: teamsScoreRef.current[1]?.getTeam(),
				team2Score: teamsScoreRef.current[1]?.getScore(),
				p1Tag: playersRef.current[0]?.getTag(),
				p1Team: playersRef.current[0]?.getTeam(),
				p1Flag: getCountryCode(playersRef.current[0]?.getCountry()),
				p1Sponsor: playersRef.current[0]?.getSponsor(),
				p2Tag: playersRef.current[1]?.getTag(),
				p2Team: playersRef.current[1]?.getTeam(),
				p2Flag: getCountryCode(playersRef.current[1]?.getCountry()),
				p2Sponsor: playersRef.current[1]?.getSponsor(),
				p3Tag: playersRef.current[2]?.getTag(),
				p3Team: playersRef.current[2]?.getTeam(),
				p3Flag: getCountryCode(playersRef.current[2]?.getCountry()),
				p3Sponsor: playersRef.current[2]?.getSponsor(),
				p4Tag: playersRef.current[3]?.getTag(),
				p4Team: playersRef.current[3]?.getTeam(),
				p4Flag: getCountryCode(playersRef.current[3]?.getCountry()),
				p4Sponsor: playersRef.current[3]?.getSponsor(),
			};
		}
	}

	function swapPlayers() {
		const swap1Index = twoPlayerRep ? 0 : swapDropdownsRef.current[0]?.getSelected() || 0;
		const swap2Index = twoPlayerRep ? 1 : swapDropdownsRef.current[1]?.getSelected() || 0;
		const swap1 = playersRef.current[swap1Index]!;
		const swap2 = playersRef.current[swap2Index]!;
		
		const tmp = {
			// temporarily store the values for player 1
			tag: swap1.getTag(),
			score: swap1.getScore(),
			char: swap1.getCharacter(),
			flag: swap1.getCountry(),
			sponsor: swap1.getSponsor(),
			team: swap1.getTeam(),
		};

		swap1.setTag(swap2.getTag());
		swap1.setScore(swap2.getScore());
		swap1.setCharacter(swap2.getCharacter());
		swap1.setCountry(swap2.getCountry());
		swap1.setSponsor(swap2.getSponsor());
		swap1.setTeam(swap2.getTeam());

		swap2.setTag(tmp.tag);
		swap2.setScore(tmp.score);
		swap2.setCharacter(tmp.char);
		swap2.setCountry(tmp.flag);
		swap2.setSponsor(tmp.sponsor);
		swap2.setTeam(tmp.team);

		return updateData();
	}

	useEffect(() => {
		playersRef.current.forEach((player) => {
			player?.setTeams(teamNamesRep || []);
		});
	}, [teamNamesRep]);

	function getCountryCode(name: string | undefined) {
		return Countries[name || ''] || 'xx';
	}

	function getCharacter(name: string | undefined) {
		return Characters[name || ''] || 'none';
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<div style={{ display: 'flex', gap: 8 }}>
				<Button
					style={{ flexGrow: 1 }}
					variant="contained"
					id="ssbm-players-toggle"
					onClick={() => setTwoPlayerRep(!twoPlayerRep)}>
					Toggle 2/4 players
				</Button>
				<Button variant="contained" id="manage-team-icons" nodecg-dialog="manage-teams">
					Manage Sponsor Icons
				</Button>
			</div>
			{!twoPlayerRep && (
				<div style={{ margin: '8px 0' }}>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<TeamsScore ref={(el) => (teamsScoreRef.current[0] = el)} number={1} id="team1" />
						<TeamsScore ref={(el) => (teamsScoreRef.current[1] = el)} number={2} id="team2" />
					</div>
					<hr className="teams" />
				</div>
			)}
			<div style={{ display: 'flex', gap: 16, justifyContent: 'space-between' }}>
				<PlayerInfo ref={(el) => (playersRef.current[0] = el)} player={1} id="player1" />
				<PlayerInfo ref={(el) => (playersRef.current[1] = el)} player={2} id="player2" />
			</div>
			{!twoPlayerRep && (
				<div style={{ display: 'flex', gap: 16, justifyContent: 'space-between' }} id="p3p4">
					<PlayerInfo ref={(el) => (playersRef.current[2] = el)} player={3} id="player3" />
					<PlayerInfo ref={(el) => (playersRef.current[3] = el)} player={4} id="player4" />
				</div>
			)}
			<hr />
			<Button
				variant="contained"
				id="ssbm-players-update"
				fullWidth
				onClick={() => {console.log(updateData()); nodecg.sendMessage('ssbmPlayerUpdate', updateData())}}>
				Update
			</Button>
			{!twoPlayerRep && (
				<div style={{ display: 'flex' }} id="swap-dropdowns">
					<SwapDropdown ref={(el) => (swapDropdownsRef.current[0] = el)} number={1} id="swap1" />
					<SwapDropdown ref={(el) => (swapDropdownsRef.current[1] = el)} number={2} id="swap2" />
				</div>
			)}

			<Button
				variant="contained"
				id="ssbm-players-swap"
				onClick={() => nodecg.sendMessage('ssbmPlayerUpdate', swapPlayers())}>
				Swap players
			</Button>
		</ThemeProvider>
	);
};

const TeamsScoreContainer = styled.div`
	display: flex;
	gap: 8px;
`;

interface TeamsScoreProps {
	number: number;
	id?: string;
}

interface TeamsScoreFunc {
	getTeam: () => string;
	getScore: () => number;
}

const TeamsScore = React.forwardRef<TeamsScoreFunc, TeamsScoreProps>((props, ref) => {
	const [team, setTeam] = useState('Red');
	const [score, setScore] = useState(0);

	useImperativeHandle(ref, () => ({
		getTeam: () => {
			return team;
		},
		getScore: () => {
			return score;
		},
	}));

	return (
		<TeamsScoreContainer id={props?.id || ''}>
			<Select
				style={{ width: 100 }}
				id={`ssbm-team${props.number}`}
				label={`Team ${props.number}`}
				value={team}
				onChange={(e) => setTeam(e.target.value as string)}>
				<MenuItem value="Red">Red</MenuItem>
				<MenuItem value="Green">Green</MenuItem>
				<MenuItem value="Blue">Blue</MenuItem>
			</Select>
			<TextField
				type="number"
				id={`ssbm-team${props.number}Score`}
				label={`Team ${props.number} Score`}
				value={score}
				onChange={(e) => setScore(parseInt(e.target.value, 10))}
			/>
		</TeamsScoreContainer>
	);
});

const PlayerInfoContainer = styled.div`
	padding-right: 5;
	border: 1px solid rgba(255, 255, 255, 0.23);
	border-radius: 25px;
	padding: 16px;
	margin: 8px 0;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

interface PlayerInfoProps {
	player: number;
	id?: string;
}

interface PlayerInfoFunc {
	getCharacter: () => string;
	setCharacter: (team: string) => void;
	getTag: () => string;
	setTag: (tag: string) => void;
	getScore: () => number;
	setScore: (score: number) => void;
	getCountry: () => string;
	setCountry: (country: string) => void;
	getTeam: () => string;
	setTeam: (team: string) => void;
	setTeams: (teams: string[]) => void;
	getSponsor: () => string;
	setSponsor: (sponsor: string) => void;
}

const PlayerInfo = React.forwardRef<PlayerInfoFunc, PlayerInfoProps>((props, ref) => {
	const [score, setScoreState] = useState(0);
	const [teams, setTeamsState] = useState<any[]>([]);
	const [tag, setTagState] = useState('');
	const [sponsor, setSponsorState] = useState('none');
	const [selectedTeam, setSelectedTeam] = useState('Red');
	const [character, setCharacterState] = useState('None');
	const [country, setCountryState] = useState('None');

	useImperativeHandle(ref, () => ({
		getCharacter: () => {
			return character;
		},
		setCharacter: (newCharacter) => {
			setCharacterState(newCharacter);
		},
		getTag: () => {
			return tag;
		},
		setTag: (newTag) => {
			setTagState(newTag);
		},
		getScore: () => {
			return score;
		},
		setScore: (newScore) => {
			setScoreState(newScore);
		},
		getCountry: () => {
			return country;
		},
		setCountry: (newCountry) => {
			setCountryState(newCountry);
		},
		getTeam: () => {
			return selectedTeam;
		},
		setTeam: (newTeam) => {
			setSelectedTeam(newTeam);
		},
		setTeams: (newTeams) => {
			setTeamsState(newTeams);
		},
		getSponsor: () => {
			return sponsor;
		},
		setSponsor: (newSponsor) => {
			setSponsorState(newSponsor);
		},
	}));

	return (
		<PlayerInfoContainer id={props?.id || ''} className="flex">
			<Select
				id={`ssbm-p${props.player}Sponsor`}
				label="Sponsor"
				value={sponsor}
				onChange={(e) => setSponsorState(e.target.value as string)}>
				<MenuItem value="none">None</MenuItem>
				{teams.map((team, i) => {
					return (
						<MenuItem value={team.name} key={team.url + i.toString()}>
							{team.name}
						</MenuItem>
					);
				})}
			</Select>
			<TextField
				id={`ssbm-p${props.player}Tag`}
				label={`Player ${props.player} Tag`}
				value={tag}
				onChange={(e) => setTagState(e.target.value as string)}
			/>
			<TextField
				type="number"
				className="player-score"
				id={`ssbm-p${props.player}Score`}
				label="Score"
				value={score}
				onChange={(e) => setScoreState(parseInt(e.target.value, 10))}
			/>
			<Select
				id={`ssbm-p${props.player}Team`}
				label={`Player ${props.player} Team`}
				value={selectedTeam}
				onChange={(e) => setSelectedTeam(e.target.value as string)}>
				<MenuItem value="Red">Red</MenuItem>
				<MenuItem value="Green">Green</MenuItem>
				<MenuItem value="Blue">Blue</MenuItem>
			</Select>
			<Autocomplete
				id={`ssbm-p${props.player}Char`}
				className="character-select"
				options={Object.keys(Characters)}
				getOptionLabel={(option) => option}
				renderInput={(params) => (
					<TextField {...params} label={`Player ${props.player} Character`} variant="outlined" />
				)}
				value={character}
				onChange={(_event, newValue) => {
					setCharacterState(newValue || 'none');
				}}
			/>
			<Autocomplete
				id={`ssbm-p${props.player}Flag`}
				options={Object.keys(Countries)}
				getOptionLabel={(option) => option}
				renderInput={(params) => (
					<TextField {...params} label={`Player ${props.player} Port`} variant="outlined" />
				)}
				value={country}
				onChange={(_event, newValue) => {
					setCountryState(newValue || 'xx');
				}}
			/>
		</PlayerInfoContainer>
	);
});

interface SwapDropdownProps {
	number: number;
	id?: string;
}

interface SwapDropdownFunc {
	getSelected: () => number;
}

const SwapDropdown = React.forwardRef<SwapDropdownFunc, SwapDropdownProps>((props, ref) => {
	const [selected, setSelected] = useState(1);

	useImperativeHandle(ref, () => ({
		getSelected: () => {
			return selected;
		},
	}));

	return (
		<Select
			id={props?.id || ''}
			value={selected}
			onChange={(e) => setSelected(parseInt(e.target.value as string, 10))}>
			<MenuItem value="0">Player 1</MenuItem>
			<MenuItem value="1">Player 2</MenuItem>
			<MenuItem value="2">Player 3</MenuItem>
			<MenuItem value="3">Player 4</MenuItem>
		</Select>
	);
});

render(<Players />, document.getElementById('players'));
