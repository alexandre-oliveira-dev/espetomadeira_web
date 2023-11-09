import { Card, Col, Row, Tag } from "antd";

export default function AccontBallance() {
    return (
        <div style={{
            width: '100%',
            display: "flex",
            gap:'20px'
        }}>
            <Card style={{
                width: '500px',
                height:'300px'
            }}
            title='Saldo em dinheiro e data da última atualização'>
                <Col >
                    <Row>
                        <span>Saldo</span>
                    </Row>

                    <Row>
                        <Tag color="green" style={{fontSize:'25px', padding:'5px'}}>R$ 0,00</Tag>
                    </Row>
                    <br />
                    <Row>
                        <span>Data</span>
                    </Row>
                    <Row>
                        <span style={{fontSize:'25px'}}>16/10/2023</span>
                </Row>
                </Col>
          </Card>
            <Card style={{
                width: '500px',
                height:'300px'
            }}
            title='Saldo bancário e data da última atualização'>
                <Col >
                    <Row>
                        <span>Saldo</span>
                    </Row>

                    <Row>
                        <Tag color="green" style={{fontSize:'25px', padding:'5px'}}>R$ 0,00</Tag>
                    </Row>
                    <br />
                    <Row>
                        <span>Data</span>
                    </Row>
                    <Row>
                        <span style={{fontSize:'25px'}}>16/10/2023</span>
                </Row>
                </Col>
          </Card>
        </div>
    )
}