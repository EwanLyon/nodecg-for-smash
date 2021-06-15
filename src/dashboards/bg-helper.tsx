import React from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import 'jscolor';

const BGHelperContainer = styled.form``;

export const BGHelper: React.FC = () => {

	return (
		<BGHelperContainer>
			<div className="form-group">
				<label>
					<input type="checkbox" id="ssbm-bg-helper-image" checked /> Use images
				</label>
			</div>
			<div className="form-group">
				<input className="jscolor" value="000000" id="ssbm-bg-helper-color" />
			</div>
			<div className="form-group">
				<label htmlFor="ssbm-bg-helper-corner">Corner radius</label>
				<div className="input-group">
					<input className="form-control" type="number" id="ssbm-bg-helper-corner" value="5" />
					<div className="input-group-addon">px</div>
				</div>
			</div>
		</BGHelperContainer>
	);
};

render(<BGHelper />, document.getElementById('bg-helper'));
