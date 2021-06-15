import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { Button, TextField, ThemeProvider } from '@material-ui/core';

import { darkTheme } from './dark-theme';

const FlexBox = styled.div`
	display: flex;
	gap: 8px;
`;

export const MiscText: React.FC = () => {
	const topUpdate = () => {
		nodecg.sendMessage('ssbmTopUpdate', topPanelData());
	};

	const topUpdateAnim = () => {
		nodecg.sendMessage('ssbmTopUpdateAnim', topPanelData());
	};

	const sendTopMessage = () => {
		nodecg.sendMessage('ssbmTopMessage', (document.querySelector('#ssbm-message-text') as HTMLTextAreaElement).value);
	};

	const playercamUpdate = () => {
		nodecg.sendMessage('ssbmPlayercam', (document.querySelector('#ssbm-playercam-text') as HTMLTextAreaElement).value);
	};

	const lowerThirdUpdate = () => {
		nodecg.sendMessage('lowerThirdUpdate', lowerThirdData());
	};

	const lowerThirdUpdateAnim = () => {
		nodecg.sendMessage('lowerThirdUpdateAnim', lowerThirdData());
	};

	function topPanelData() {
		return {
			'panel1text': (document.querySelector('#ssbm-top-panel1text') as HTMLTextAreaElement).value,
			'panel2text': (document.querySelector('#ssbm-top-panel2text') as HTMLTextAreaElement).value
		};
	}

	function lowerThirdData() {
		return {
			'top': (document.querySelector('#ssbm-third-top-text') as HTMLTextAreaElement).value,
			'bottom': (document.querySelector('#ssbm-third-bottom-text') as HTMLTextAreaElement).value
		}
	}

	return (
		<ThemeProvider theme={darkTheme}>
			<FlexBox style={{flexDirection: 'column'}}>
				<TextField id="ssbm-top-panel1text" label="Top Panel 1 Text" />
				<TextField id="ssbm-top-panel2text" label="Top Panel 2 Text" />
				<FlexBox>
					<Button onClick={topUpdate} variant="contained" className="indigo ssbm-top-update">Update</Button>
					<Button onClick={topUpdateAnim} variant="contained" className="indigo ssbm-top-update-anim flex-auto">w/ Animation</Button>
				</FlexBox>
				<TextField variant="outlined" multiline rows={2} id="ssbm-message-text" label="Top panel message text" />
				<FlexBox>
					<Button onClick={sendTopMessage} variant="contained" className="indigo ssbm-top-message flex">Send Message</Button>
				</FlexBox>
			</FlexBox>
			<hr />
			<FlexBox style={{flexDirection: 'column'}}>
				<TextField variant="outlined" multiline rows={2} id="ssbm-third-top-text" label="Lower third top text" />
				<TextField variant="outlined" multiline rows={2} id="ssbm-third-bottom-text" label="Lower third bottom text" />
				<FlexBox>
					<Button onClick={lowerThirdUpdate} variant="contained" className="indigo ssbm-third-update">Update</Button>
					<Button onClick={lowerThirdUpdateAnim} variant="contained" className="indigo ssbm-third-update-anim flex-auto">w/ Animation</Button>
				</FlexBox>
				<TextField id="ssbm-playercam-text" label="Playercam Text" />
				<FlexBox>
					<Button onClick={playercamUpdate} variant="contained" className="indigo ssbm-playercam-update flex">Update Playercam</Button>
				</FlexBox>
			</FlexBox>
		</ThemeProvider>
	);
};

render(<MiscText />, document.getElementById('misc-text'));
