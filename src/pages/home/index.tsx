import Title from "antd/es/typography/Title";
import AccontBallance from "./components/accontBallance.component";


export default function Home() {
    return (
        <div className="homeContainer">
                        <Title level={2}>Início</Title>
           <br />
            <AccontBallance></AccontBallance>
            <br />
            <br />
            <Title level={2}>Gerar Relatórios</Title>
        </div>
    )
}