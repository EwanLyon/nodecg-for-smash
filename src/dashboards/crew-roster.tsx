import React, { useImperativeHandle, useRef, useState } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { Button, Checkbox, TextField, ThemeProvider } from '@material-ui/core';

import { darkTheme } from './dark-theme';

const CrewRosterContainer = styled.div`
	display: flex;
	flex-direction: column;
`;

export const CrewRoster: React.FC = () => {
	const r1CrewMembersRefs = useRef<(CrewMemberFunc | null)[]>([]);
	const r2CrewMembersRefs = useRef<(CrewMemberFunc | null)[]>([]);
	const crewScoresRefs = useRef<(CrewScoreFunc | null)[]>([]);

	function updateData() {
		var roster1 = getRoster(1);
		var roster2 = getRoster(2);
		var teamNamesStock = getTeamNamesStock();
		var kos1 = getKOs(1);
		var kos2 = getKOs(2);

		return {
			roster1: roster1,
			roster2: roster2,
			teamNamesStock: teamNamesStock,
			kos1: kos1,
			kos2: kos2,
		};
	}

	function getRoster(team: number) {
		let roster = [];

		if (team === 1) {
			roster = r1CrewMembersRefs.current.map((member) => member?.getTag());
		} else {
			roster = r2CrewMembersRefs.current.map((member) => member?.getTag());
		}

		return roster;
	}

	function getTeamNamesStock() {
		const team1 = crewScoresRefs.current[0];
		const team2 = crewScoresRefs.current[1];
		return {
			team1name: team1?.getName(),
			team1stock: team1?.getScore(),
			team2name: team2?.getName(),
			team2stock: team2?.getScore(),
		};
	}

	function getKOs(team: string | number) {
		let kos = [];

		if (team === 1) {
			kos = r1CrewMembersRefs.current.map((member) => member?.getKO());
		} else {
			kos = r2CrewMembersRefs.current.map((member) => member?.getKO());
		}

		return kos;
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<CrewRosterContainer>
				<CrewScore ref={(el) => (crewScoresRefs.current[0] = el)} number={1} />
				<CrewScore ref={(el) => (crewScoresRefs.current[0] = el)} number={2} />
				<hr style={{width: '100%'}} />
				<div id="roster1" style={{ display: 'flex', flexDirection: 'column' }}>
					<div style={{ width: '99%', textAlign: 'right' }}>KO?</div>
					<CrewMember ref={(el) => (r1CrewMembersRefs.current[0] = el)} number={1} />
					<CrewMember ref={(el) => (r1CrewMembersRefs.current[1] = el)} number={2} />
					<CrewMember ref={(el) => (r1CrewMembersRefs.current[2] = el)} number={3} />
					<CrewMember ref={(el) => (r1CrewMembersRefs.current[3] = el)} number={4} />
					<CrewMember ref={(el) => (r1CrewMembersRefs.current[4] = el)} number={5} />
					<CrewMember ref={(el) => (r1CrewMembersRefs.current[5] = el)} number={6} />
					<CrewMember ref={(el) => (r1CrewMembersRefs.current[6] = el)} number={7} />
					<CrewMember ref={(el) => (r1CrewMembersRefs.current[7] = el)} number={8} />
					<CrewMember ref={(el) => (r1CrewMembersRefs.current[8] = el)} number={9} />
					<CrewMember ref={(el) => (r1CrewMembersRefs.current[9] = el)} number={10} />
				</div>
				<hr style={{width: '100%'}} />
				<div id="roster2" style={{ display: 'flex', flexDirection: 'column' }}>
					<div style={{ width: '99%', textAlign: 'right' }}>KO?</div>
					<CrewMember ref={(el) => (r2CrewMembersRefs.current[0] = el)} number={1} />
					<CrewMember ref={(el) => (r2CrewMembersRefs.current[1] = el)} number={2} />
					<CrewMember ref={(el) => (r2CrewMembersRefs.current[2] = el)} number={3} />
					<CrewMember ref={(el) => (r2CrewMembersRefs.current[3] = el)} number={4} />
					<CrewMember ref={(el) => (r2CrewMembersRefs.current[4] = el)} number={5} />
					<CrewMember ref={(el) => (r2CrewMembersRefs.current[5] = el)} number={6} />
					<CrewMember ref={(el) => (r2CrewMembersRefs.current[6] = el)} number={7} />
					<CrewMember ref={(el) => (r2CrewMembersRefs.current[7] = el)} number={8} />
					<CrewMember ref={(el) => (r2CrewMembersRefs.current[8] = el)} number={9} />
					<CrewMember ref={(el) => (r2CrewMembersRefs.current[9] = el)} number={10} />
				</div>
				<hr style={{width: '100%'}} />
				<Button style={{marginBottom: 8}} variant="contained" onClick={() => nodecg.sendMessage('ssbmCrewUpdate', updateData())}>
					Update roster and show
				</Button>
				<Button variant="contained" onClick={() => nodecg.sendMessage('ssbmCrewHide', 0)}>
					Hide
				</Button>
			</CrewRosterContainer>
		</ThemeProvider>
	);
};

const CrewScoreContainer = styled.div`
	display: flex;
	gap: 8px;
	justify-content: space-between;
`;

interface CrewScoreProps {
	number: number;
}

interface CrewScoreFunc {
	getScore: () => number;
	getName: () => string;
}

const CrewScore = React.forwardRef<CrewScoreFunc, CrewScoreProps>((props, ref) => {
	const [name, setName] = useState('');
	const [score, setScore] = useState(0);

	useImperativeHandle(ref, () => ({
		getScore: () => {
			return score;
		},
		getName: () => {
			return name;
		},
	}));

	return (
		<CrewScoreContainer className="flex">
			<TextField
				fullWidth
				label={`Crew ${props.number} Name`}
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<TextField
				type="number"
				label={`Crew ${props.number} Score`}
				value={score}
				onChange={(e) => setScore(parseInt(e.target.value, 10))}
			/>
		</CrewScoreContainer>
	);
});

const CrewMemberContainer = styled.div`
	display: flex;
	gap: 8px;
`;

interface CrewMemberProps {
	number: number;
}

interface CrewMemberFunc {
	getTag: () => string;
	getKO: () => boolean;
}

const CrewMember = React.forwardRef<CrewMemberFunc, CrewMemberProps>((props, ref) => {
	const [tag, setTag] = useState('');
	const [ko, setKO] = useState(false);

	useImperativeHandle(ref, () => ({
		getTag: () => {
			return tag;
		},
		getKO: () => {
			return ko;
		},
	}));

	return (
		<CrewMemberContainer>
			<TextField
				fullWidth
				label={`Player ${props.number}`}
				value={tag}
				onChange={(e) => setTag(e.target.value)}
			/>
			<Checkbox checked={ko} onChange={(e) => setKO(e.target.checked)} />
		</CrewMemberContainer>
	);
});

render(<CrewRoster />, document.getElementById('crew-roster'));
