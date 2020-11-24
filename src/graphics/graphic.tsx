import React from 'react';
import {render} from 'react-dom';
import styled from 'styled-components';

const GraphicContainer = styled.div``;

const Graphic: React.FC = () => {
	return <GraphicContainer></GraphicContainer>
}

render(<Graphic/>, document.getElementById('graphic'));