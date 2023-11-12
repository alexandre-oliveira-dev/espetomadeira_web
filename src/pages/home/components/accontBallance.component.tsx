import { Button, Card, Col, Row, Tag, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { api } from '../../../service/api';
import {
  BankBalanceUncheckedCreateInput,
  WalletUncheckedCreateInput,
} from '../../../types';
import dayjs from 'dayjs';
import { formatMoney } from '../../../common/formatMoney';

export default function AccontBallance() {
  //const [open, setOpen] = useState(false);
  const [type, setType] = useState<number | null>(null);
  const [value, setValue] = useState<string>('');
  const [dataBankBalance, setDataBankBalance] = useState<
    BankBalanceUncheckedCreateInput[]
  >([]);
  const [wallet, setWallet] = useState<WalletUncheckedCreateInput[]>([]);

  useEffect(() => {
    async function queryRealeases() {
      try {
        const [data, walletData] = await Promise.all([
          api.post('/findManyBankbalance', {data:{}}),
          api.post('/findManybalance',{data:{}}),
        ]);
        setDataBankBalance(data.data);
        setWallet(walletData.data);
      } catch (err) {
        console.log(err);
        return [];
      }
    }
    queryRealeases();
  }, []);

  async function handleUpdateBalance() {
    console.log(parseFloat(value.replace(',', '.').replace('R$', '')))
    if (value === null) return;
    switch (type) {
      case 1:
        await api
          .post('/balance', {
            data: {
              balance: value.replace(',', '.').replace('R$', ''),
              updated_at: dayjs(new Date()).toISOString(),
            },
          }).then(()=>{
            setTimeout(() => {
              window.location.reload()
            }, 2000);
          })
          
        break;
      case 2:
        await api
          .post('/bankBalance', {
            data: {
              balance: value.replace(',', '.').replace('R$', ''),
              updated_at: dayjs(new Date()).toISOString(),
            },
          }).then(()=>{
            setTimeout(() => {
              window.location.reload()
            }, 2000);
          }).then(()=>{
            setTimeout(() => {
              window.location.reload()
            }, 2000);
          })
          
        break;
    }
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        gap: '20px',
      }}
    >
      <Card
        style={{
          width: '500px',
          height: '300px',
          position: 'relative',
        }}
        title="Saldo em dinheiro e data da última atualização"
      >
        <Col>
          <Row>
            <span>Saldo</span>
          </Row>

          <Row>
            <Tag color="green" style={{ fontSize: '25px', padding: '5px' }}>
              <Typography.Text
                style={{ color: 'green', fontSize: '20px' }}
                editable={{
                  onChange(e) {
                    setValue((e));
                    setType(1);
                  },
                }}
              >
                {formatMoney(
                  Number(value !== '' && type === 1 ? value.replace(',', '.')?.replace('R$', '') : wallet[0]?.balance) || 0
                )}
              </Typography.Text>
              
            </Tag>
            <Tooltip>Digite sem virgulas ou pontos.</Tooltip>
          </Row>
          <br />
          <Row>
            <span>Data</span>
          </Row>
          <Row>
            <span style={{ fontSize: '25px' }}>
              {dayjs(wallet[0]?.updated_at).format('DD/MM/YYYY')}
            </span>
          </Row>
        </Col>
        <Row style={{ width: '100%', position: 'absolute', bottom: 10 }}>
          <Button
            onClick={() => {
              setType(1);
              handleUpdateBalance();

              //setOpen(true);
            }}
            type="primary"
          >
            Atualizar saldo
          </Button>
        </Row>
      </Card>
      <Card
        style={{
          width: '500px',
          height: '300px',
          position: 'relative',
        }}
        title="Saldo bancário e data da última atualização"
      >
        <Col>
          <Row>
            <span>Saldo</span>
          </Row>

          <Row>
            <Tag color="green" style={{ fontSize: '25px', padding: '5px' }}>
              <Typography.Text
                style={{ color: 'green', fontSize: '20px' }}
                editable={{
                  onChange(e) {
                    setType(2);
                    setValue((e));
                  },
                }}
              >
                {formatMoney(
                  Number(
                    value  !== '' && type === 2 ? value.replace(',', '.')?.replace('R$', '') : dataBankBalance[0]?.balance
                  ) || 0
                )}
              </Typography.Text>{' '}
            </Tag>
              <Tooltip>Digite sem virgulas ou pontos.</Tooltip>

          </Row>
          <br />
          <Row>
            <span>Data</span>
          </Row>
          <Row>
            <span style={{ fontSize: '25px' }}>
              {dayjs(dataBankBalance[0]?.updated_at).format('DD/MM/YYYY')}
            </span>
          </Row>
        </Col>
        <Row style={{ width: '100%', position: 'absolute', bottom: 10 }}>
          <Button
            onClick={() => {
              setType(2);
              handleUpdateBalance();
              //setOpen(true);
            }}
            type="primary"
          >
            Atualizar saldo
          </Button>
        </Row>
      </Card>
    </div>
  );
}
