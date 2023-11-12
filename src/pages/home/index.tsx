/* eslint-disable @typescript-eslint/no-explicit-any */
import Title from 'antd/es/typography/Title';
import AccontBallance from './components/accontBallance.component';
import { Button, Col, DatePicker, Table, Tag } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { api } from '../../service/api';
import { formatMoney } from '../../common/formatMoney';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Home() {
  const [from, setFrom] = useState<any>();
  const [to, setTo] = useState<any>();
  const [relatorioList, setRelatorioList] = useState<[]>([])
  const [load, setLoad] = useState(false)




  function handlePrintFlyer() {
    setTimeout(() => {
      const divRef = document.getElementById('table') as HTMLElement;
      const divToExport = divRef;
      const { offsetWidth, offsetHeight, } = divToExport;
      const pdfWidth = offsetWidth;
      const aspectRatio = offsetWidth / offsetHeight;
      const pdfHeight = pdfWidth / aspectRatio;
      const scale = 15;
      const canvas = document.createElement('canvas');
      canvas.width = pdfWidth * scale;
      canvas.height = pdfHeight * scale;
      canvas.style.width = `${pdfWidth}px`;
      canvas.style.height = `${pdfHeight}px`;

      html2canvas(divToExport, { scale, backgroundColor: '#fff', }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', [pdfWidth, pdfHeight]);
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`relatorio ${dayjs(new Date()).format('DD/MM/YYYY')}.pdf`);
      }).then(() => {
      });
    }, 500);
  }

  return (
    <div className="homeContainer">
      <Title level={2}>Início</Title>
      <br />
      <AccontBallance></AccontBallance>
      <br />
      <br />
      <Title level={2}>Gerar Relatórios</Title>
      <br />
      <br />

      <Col>
        <Title level={4}>Selecione as datas</Title>
        <DatePicker.RangePicker
          allowClear
          //value={[dayjs(query.businessDateFrom), dayjs(query.businessDateTo)]}
          format="DD/MM/YYYY"
          style={{ maxWidth: 250 }}
          allowEmpty={[true, true]}
          //presets={datePickerPresets}
          onChange={(dates) => {
            const [dateFrom, dateTo] = (dates as unknown as [Dayjs, Dayjs]) ?? [
              undefined,
              undefined,
            ];
            setFrom(dateFrom);
            setTo(dateTo);
          }}
        />
        <div style={{ marginTop: '20px' }}>
          {' '}
          <Button
            type="primary"
            onClick={async () => {
              if(!from || !to) return
              setLoad(true)
             const [wallet, bank] = await Promise.all([
                api.post('/findManybalance', {
                  data: {
                      updated_at: from
                        ? {
                            gte: dayjs(from)
                              .startOf('day')
                              .toISOString(),
                            lte: dayjs(to).endOf('day').toISOString(),
                          }
                        : undefined,
                    },
                }),
                api.post('/findManyBankbalance', {
                  data: {
                   
                      updated_at: from
                        ? {
                            gte: dayjs(from)
                              .startOf('day')
                              .toISOString(),
                            lte: dayjs(to).endOf('day').toISOString(),
                          }
                        : undefined,
                    },
                  
                }),
             ]).finally(() => {
               handlePrintFlyer()
               setLoad(false)
             })
              
              //console.log(wallet.data.concat(bank.data))
              setRelatorioList(wallet.data.concat(bank.data))
            }}
          >
            Visualizar
          </Button>
        </div>
        <Table
          id='table'
          size='small'
          style={{
            width: '70%',
            marginTop:'20px'
          }}
          dataSource={relatorioList}
          loading={load}
          columns={[
            {
              title: 'Data',
              dataIndex: 'updated_at',
              render(value) {
                return dayjs(value).format('DD/MM/YYYY HH:MM:ss')
              },
            },
            {
              title:'Valor',
              dataIndex: 'balance',
              render(value) {
                return <Tag color='green'>{ formatMoney(value)}</Tag>
              }
            }
          ]}
        />
      </Col>
    </div>
  );
}
