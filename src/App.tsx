import React from 'react';
import { Row, Col, Container } from 'reactstrap';
import { StockPriceScreen } from './components/StockPriceScreen';


function App() {
  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col xs={12}>
            <h1>Stock price web app</h1>
          </Col>
        </Row>
        <StockPriceScreen />
      </Container>
    </div>
  );
}

export default App;
