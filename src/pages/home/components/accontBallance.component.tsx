import {
  Button,
  Card,
  Col,
  Row,
  Skeleton,
  Spin,
  Tag,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { api } from '../../../service/api';
import {
  BankBalanceUncheckedCreateInput,
  WalletUncheckedCreateInput,
} from '../../../types';
import dayjs from 'dayjs';
import { formatMoney } from '../../../common/formatMoney';

export default function AccontBallance() {
  const [type, setType] = useState<number | null>(null);
  const [value, setValue] = useState<string>('');
  const [load, setLoad] = useState(false);
  const [loadSpin, setLoadSpin] = useState(false);
  const [dataBankBalance, setDataBankBalance] = useState<
    BankBalanceUncheckedCreateInput[]
  >([]);
  const [wallet, setWallet] = useState<WalletUncheckedCreateInput[]>([]);

  useEffect(() => {
    async function queryRealeases() {
      setLoad(true);
      try {
        const [data, walletData] = await Promise.all([
          api.post('/findManyBankbalance', { data: {} }),
          api.post('/findManybalance', { data: {} }),
        ]);
        setDataBankBalance(data.data);
        setWallet(walletData.data);
        setLoad(false);
      } catch (err) {
        console.log(err);
        return [];
      }
    }
    queryRealeases();
  }, []);

  async function handleUpdateBalance() {
    if (value === '') return;
    setLoadSpin(true)
    switch (type) {
      case 1:
        await api
        .post('/balance', {
          data: {
            balance: value.replace(',', '.').replace('R$', ''),
            updated_at: dayjs(new Date()).toISOString(),
          },
        })
        .then(() => {
          setLoadSpin(false)
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        });
        
        break;
        case 2:
          await api
          .post('/bankBalance', {
            data: {
              balance: value.replace(',', '.').replace('R$', ''),
              updated_at: dayjs(new Date()).toISOString(),
            },
          })
          .then(() => {
            setLoadSpin(false)
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          })
          .then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          });

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
      {load ? (
        <Skeleton active></Skeleton>
      ) : (
        <>
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
                        setValue(e);
                        setType(1);
                      },
                    }}
                  >
                    {formatMoney(
                      Number(
                        value !== '' && type === 1
                          ? value.replace(',', '.')?.replace('R$', '')
                          : wallet[0]?.balance
                      ) || 0
                    )}
                  </Typography.Text>
                </Tag>
              </Row>
              <br />
              <Row>
                <span>Data</span>
              </Row>
              <Row>
                <span style={{ fontSize: '20px' }}>
                  {`${dayjs(wallet[0]?.updated_at).format('DD/MM/YYYY')} as ${dayjs(wallet[0]?.updated_at).format('hh:mm:ss')}`}
                </span>
              </Row>
            </Col>
            <Row style={{ width: '100%', position: 'absolute', bottom: 10 }}>
              <Button
                onClick={() => {
                  setType(1);
                  handleUpdateBalance();
                }}
                type="primary"
              >
                  {
                    loadSpin ? <Spin></Spin> : 'Atualizar saldo'
                }
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
                        setValue(e);
                      },
                    }}
                  >
                    {formatMoney(
                      Number(
                        value !== '' && type === 2
                          ? value.replace(',', '.')?.replace('R$', '')
                          : dataBankBalance[0]?.balance
                      ) || 0
                    )}
                  </Typography.Text>{' '}
                </Tag>
              </Row>
              <br />
              <Row>
                <span>Data</span>
              </Row>
              <Row>
                <span style={{ fontSize: '20px' }}>
                  {`${dayjs(dataBankBalance[0]?.updated_at).format('DD/MM/YYYY')} as ${dayjs(dataBankBalance[0]?.updated_at).format('hh:mm:ss')}`}
                </span>
              </Row>
            </Col>
            <Row style={{ width: '100%', position: 'absolute', bottom: 10 }}>
              <Button
                onClick={() => {
                  setType(2);
                  handleUpdateBalance();
                }}
                type="primary"
              >
                 {
                    loadSpin ? <Spin></Spin> : 'Atualizar saldo'
                }
              </Button>
            </Row>
          </Card>
        </>
      )}
    </div>
  );
}
