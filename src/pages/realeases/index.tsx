/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  TableColumnsType,
  Tag,
} from 'antd';
import './style.css';
import FormItem from 'antd/es/form/FormItem';
import { useForm } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import Title from 'antd/es/typography/Title';
import {
  DateParam,
  NumberParam,
  StringParam,
  useQueryParams,
} from 'use-query-params';
import dayjs from 'dayjs';
import { api } from '../../service/api';
import { PaymentMethod, ReleaseType, Releases } from '../../types';
import { nameof } from '../../common/nameof';
import { formatMoney } from '../../common/formatMoney';
import { FiTrash } from 'react-icons/fi';

type Data = Releases;

const params = {
  date: DateParam,
  cod: StringParam,
  desc: StringParam,
  paymentMethod: StringParam,
  type: StringParam,
  value: NumberParam,
};

export default function Realeases() {
  const [form] = useForm();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useQueryParams(params);
  const [dataTable, setDataTable] = useState<Data[]>([]);
  const [paymetType, setPaymentType] = useState(ReleaseType.entrada);

  const variables = {
    where: {
      tipo: query.type ? { equals: query.type } : undefined,
      data: query?.date
        ? {
            gte: dayjs(query?.date).startOf('day').toISOString(),
            lte: dayjs(query?.date).endOf('day').toISOString(),
          }
        : undefined,

      formpgm: query?.paymentMethod
        ? { equals: query?.paymentMethod }
        : undefined,
      codigo: query?.cod ? { equals: query?.cod } : undefined,
      valor: query?.value ? { equals: query.value } : undefined,
    },
  };

  useEffect(() => {
    async function queryRealeases() {
      try {
        const { data } = await api.post('/findManyRealeases', {
          data: variables.where,
        });
        return setDataTable(data);
      } catch (err) {
        console.log(err);
        return [];
      }
    }
    queryRealeases();
  }, [query?.type, query.date, query.cod, query.value, query.paymentMethod]);

  const fields: TableColumnsType<Data> = [
    {
      title: 'Id',
      dataIndex: nameof<Data>('id'),
    },
    {
      title: 'Data',
      dataIndex: nameof<Data>('data'),
      render(text) {
        return dayjs(text).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Código',
      dataIndex: nameof<Data>('codigo'),
    },
    {
      title: 'Descrição',
      dataIndex: nameof<Data>('descricao'),
    },
    {
      title: 'Forma de pagamento',
      dataIndex: nameof<Data>('formpgm'),
    },
    {
      title: 'Tipo',
      dataIndex: nameof<Data>('tipo'),
      render(text, rec) {
        return rec.tipo === ReleaseType.entrada ? (
          <Tag color="green">{text}</Tag>
        ) : (
          <Tag color="red">{text}</Tag>
        );
      },
      
    },
    {
      title: 'Valor',
      dataIndex: nameof<Data>('valor'),
      render(text, rec) {
        return rec.tipo === ReleaseType.entrada ? (
          <Tag color="green">{formatMoney(text)}</Tag>
        ) : (
          <Tag color="red">{formatMoney(text)}</Tag>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: nameof<Data>('status'),
      render(text, rec) {
        return rec.status === 'pago' ? (
          <Tag color="green">{text}</Tag>
        ) : (
          <Tag color="red">{text}</Tag>
        );
      },
    },
    {
      title: 'Usuário',
      dataIndex: nameof<Data>('Users'), 
    },
    {
      title: 'Ações',
      render(_text, rec) {
        return rec.status === 'pago' || rec.tipo === 'entrada' ? '' :
          <Button onClick={async () => {
            await api.put(`/updateRealeases?id=${rec.id}`, {
              data: {
                status:'pago'
              },
             
            })
            .then(async()=> await api.get('/findManyRealeases') )
          }} type="primary" style={{ background: 'green' }}>
            Efetuar pagamento
          </Button>
        
      },
    },
  ];

  async function handleCreate() {
    const data: Data = form.getFieldsValue();

    const payload: Data = {
      codigo: data?.codigo,
      data: dayjs(data?.data).toISOString(),
      descricao: data?.descricao,
      formpgm: data?.formpgm,
      pago_banco: data?.pago_banco,
      tipo: data?.tipo,
      usersId: data?.usersId,
      valor: Number(data?.valor),
      valor_detalhes: data?.valor_detalhes,
    };

    await api
      .post('/Realeases', { data: payload })
      .then(() => {
        alert('Registro criado com sucesso');
        setOpen(false);
      })
      .catch((err) => console.log(err));
  }

  const ModalCreateRegister = () => {
    return (
      <Modal
        title="Registrar lançamento"
        open={open}
        onOk={() => handleCreate()}
        okText="salvar"
        cancelText="cancelar"
        onCancel={() => setOpen(false)}
      >
        <Form form={form}>
          <Row style={{ gap: '15px' }}>
            <Col>
              <div>
                <span>Tipo</span>
              </div>
              <FormItem name={nameof<Data>('tipo')}>
                <Select
                  onChange={(e) => setPaymentType(e)}
                  placeholder="Selecione"
                >
                  <Select.Option value={ReleaseType.entrada}>
                    {ReleaseType.entrada}
                  </Select.Option>
                  <Select.Option value={ReleaseType.saida}>
                    {ReleaseType.saida}
                  </Select.Option>
                </Select>
              </FormItem>
            </Col>
            <Col>
              <div>
                <span>Data</span>
              </div>
              <FormItem name={nameof<Data>('data')}>
                <DatePicker></DatePicker>
              </FormItem>
            </Col>
            <Col>
              <div>
                <span>Código</span>
              </div>
              <FormItem name={nameof<Data>('codigo')}>
                <Select
                  showSearch
                  style={{
                    width: '300px',
                  }}
                  placeholder="Selecione"
                >
                  <Select.OptGroup label="1 DESPESAS COM FUNCIONARIOS">
                    <Select.Option value="1">
                      1 - FOLHA DE PAGAMENTO
                    </Select.Option>
                    <Select.Option value="11">
                      11 - FOLHA ADIANTAMENTO{' '}
                    </Select.Option>
                    <Select.Option value="12">12 - FOLHA VALE </Select.Option>
                    <Select.Option value="13">
                      13 - VALE TRANSPORTE
                    </Select.Option>
                    <Select.Option value="14">
                      14 - FOLHA RESCISÕES
                    </Select.Option>
                    <Select.Option value="15">15 - FOLHA FÉRIAS</Select.Option>
                    <Select.Option value="16">
                      16 - FOLHA 13º SALÁRIO{' '}
                    </Select.Option>
                    <Select.Option value="17">
                      17 - FOLHA EXTRAS DIVERSAS
                    </Select.Option>
                    <Select.Option value="18">
                      18 - PONTUAÇÃO 10%{' '}
                    </Select.Option>
                    <Select.Option value="19">
                      19 - PONTUAÇÃO 20%{' '}
                    </Select.Option>
                  </Select.OptGroup>

                  <Select.OptGroup label="2 - INSUMO">
                    <Select.Option value="21">
                      21 - INSUMO DIVERSO
                    </Select.Option>
                    <Select.Option value="22">
                      22 - INUMO SOBREMESA
                    </Select.Option>
                    <Select.Option value="23">23 - INSUMO CAFÉ</Select.Option>
                    <Select.Option value="24">
                      24 - INSUMO PÃO DE ALHO
                    </Select.Option>
                    <Select.Option value="25">
                      25 - INSUMO HORTIFRUTI
                    </Select.Option>
                    <Select.Option value="26">
                      26 - INSUMO LATICÍNIO/POLPA
                    </Select.Option>
                    <Select.Option value="27">27 - INSUMO CARNES</Select.Option>
                    <Select.Option value="28">28 - INSUMO FRANGO</Select.Option>
                    <Select.Option value="29">
                      29 - INSUMO PESCADO
                    </Select.Option>
                    <Select.Option value="30">
                      30 - INSUMO CERVEJA/REFRIGERANTE
                    </Select.Option>
                    <Select.Option value="31">31 - INSUMO ÁGUA</Select.Option>
                    <Select.Option value="32">
                      32 - INSUMO BEBIDA QUENTE
                    </Select.Option>
                    <Select.Option value="33">33 - EQUIPAMENTO</Select.Option>
                    <Select.Option value="34">34 - UNIFORME</Select.Option>
                    <Select.Option value="35">35 - LAVANDERIA</Select.Option>
                    <Select.Option value="36">
                      36 - MANUTENCAO EQUIPAMENTOS/PRÉDIO
                    </Select.Option>
                  </Select.OptGroup>

                  <Select.OptGroup label="4 - GRÁFICA/COMANDA/CARDÁPIO/PAPELARIA/ESCRITÓRIO">
                    <Select.Option value="41">
                      41 - COMANDA/CARDÁPIO/ESCRITÓRIO/PAPELARIA
                    </Select.Option>
                    <Select.Option value="42">
                      42 - PROMOÇÃO/DIVULGAÇÃO
                    </Select.Option>
                  </Select.OptGroup>

                  <Select.OptGroup label="5 - ALUGUEIS / IPTU">
                    <Select.Option value="51">51 - ALUGUEL</Select.Option>
                    <Select.Option value="52">52 - IPTU</Select.Option>
                  </Select.OptGroup>

                  <Select.OptGroup label="6 - SABESP/ENEL/GÁS/ INTERNET/ CARVÃO">
                    <Select.Option value="61">61 - SABESP</Select.Option>
                    <Select.Option value="62">62 - ENEL</Select.Option>
                    <Select.Option value="63">63 - GÁS</Select.Option>
                    <Select.Option value="64">64 - INTERNET</Select.Option>
                    <Select.Option value="65">65 - CARVÃO</Select.Option>
                    <Select.Option value="66">66 - COMBUSTIVEL</Select.Option>
                  </Select.OptGroup>

                  <Select.OptGroup label="7 - IMPOSTOS">
                    <Select.Option value="71">71 - IMPOSTO ICMS</Select.Option>
                    <Select.Option value="72">72 - IMPOSTO GPS</Select.Option>
                    <Select.Option value="73">
                      73 - IMPOSTO SINDICATO{' '}
                    </Select.Option>
                    <Select.Option value="74">74 - IMPOSTO DARF</Select.Option>
                    <Select.Option value="75">
                      75 - IMPOSTO SIMPLES
                    </Select.Option>
                    <Select.Option value="76">76 - IMPOSTO DAMSP</Select.Option>
                    <Select.Option value="77">77 - IMPOSTO INSS</Select.Option>
                    <Select.Option value="78">78 - IMPOSTO FGTS</Select.Option>
                    <Select.Option value="79">
                      79 - IMPOSTO OUTROS
                    </Select.Option>
                  </Select.OptGroup>

                  <Select.OptGroup label="8 - CONTRATOS DIVERSOS">
                    <Select.Option value="81">
                      81 - CONTRATO DEDETIZÇÃO
                    </Select.Option>
                    <Select.Option value="82">
                      82 - CONTRATO CONTABILIDADE
                    </Select.Option>
                    <Select.Option value="83">
                      83 - CONTRATO WYSE/DELTA
                    </Select.Option>
                    <Select.Option value="84">
                      84 - CONTRATO MED.OCUP.
                    </Select.Option>
                    <Select.Option value="85">
                      85 - CONTRATO MULTILIXO
                    </Select.Option>
                    <Select.Option value="86">
                      86 - CONTRATO EMPREST. BRADESCO
                    </Select.Option>
                    <Select.Option value="87">
                      87 - CONTRATO NUTRICIONISTA
                    </Select.Option>
                    <Select.Option value="88">
                      88 - CONTRATO OUTROS
                    </Select.Option>
                    <Select.Option value="89">
                      89 - CONTRATO PROLABORE
                    </Select.Option>
                  </Select.OptGroup>

                  <Select.OptGroup label="9 -  DESPESAS">
                    <Select.Option value="91">
                      91 - DESPESA BANCÁRIA
                    </Select.Option>
                    <Select.Option value="92">92 - JUROS</Select.Option>
                    <Select.Option value="93">
                      93 - DESPESAS DIVERSAS
                    </Select.Option>
                    <Select.Option value="94">94 - LIMPEZA</Select.Option>
                    <Select.Option value="95">95 - DESCARTAVEL</Select.Option>
                    <Select.Option value="96">96 - EMBALAGEM </Select.Option>
                    <Select.Option value="97">97 - TAXA CATÃO</Select.Option>
                  </Select.OptGroup>
                </Select>
              </FormItem>
            </Col>
            <Col>
              <div>
                <span>Descrição</span>
              </div>
              <Input placeholder="Digite aqui"></Input>
            </Col>
            {paymetType === ReleaseType.saida && (
              <Col>
                <div>
                  <span>Forma de pagamento</span>
                </div>
                <FormItem name={nameof<Data>('formpgm')}>
                  <Select placeholder="Selecione">
                    <Select.Option value={PaymentMethod.pix}>
                      {PaymentMethod.pix}
                    </Select.Option>
                    <Select.Option value={PaymentMethod.boleto}>
                      {PaymentMethod.boleto}
                    </Select.Option>
                    <Select.Option value={PaymentMethod.credtCard}>
                      {PaymentMethod.credtCard}
                    </Select.Option>
                    <Select.Option value={PaymentMethod.debitCard}>
                      {PaymentMethod.debitCard}
                    </Select.Option>
                    <Select.Option value={PaymentMethod.money}>
                      {PaymentMethod.money}
                    </Select.Option>
                  </Select>
                </FormItem>
              </Col>
            )}

            <Col>
              <div>
                <span>Valor R$</span>
              </div>
              <FormItem name={nameof<Data>('valor')}>
                <Input type="number" placeholder="Digite aqui"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  };

  return (
    <div className="realeasescontainer">
      <ModalCreateRegister></ModalCreateRegister>
      <Title level={2}>Lançamentos</Title>
      <br />
      <div className="filterRealeases">
        <Col>
          <div>
            <span>Data</span>
          </div>
          <DatePicker
            //value={query?.date || undefined}
            onChange={(value) => {
              setQuery({ date: dayjs(value).toDate() });
            }}
          ></DatePicker>
        </Col>
        <Col>
          <div>
            <span>Código</span>
          </div>
          <Select
            value={query?.cod}
            onChange={(value) => {
              setQuery({ cod: value });
            }}
            showSearch
            style={{ width: '300px' }}
            placeholder="Selecione"
          >
            <Select.OptGroup label="1 DESPESAS COM FUNCIONARIOS">
              <Select.Option value="1">1 - FOLHA DE PAGAMENTO</Select.Option>
              <Select.Option value="11">11 - FOLHA ADIANTAMENTO </Select.Option>
              <Select.Option value="12">12 - FOLHA VALE </Select.Option>
              <Select.Option value="13">13 - VALE TRANSPORTE</Select.Option>
              <Select.Option value="14">14 - FOLHA RESCISÕES</Select.Option>
              <Select.Option value="15">15 - FOLHA FÉRIAS</Select.Option>
              <Select.Option value="16">16 - FOLHA 13º SALÁRIO </Select.Option>
              <Select.Option value="17">
                17 - FOLHA EXTRAS DIVERSAS
              </Select.Option>
              <Select.Option value="18">18 - PONTUAÇÃO 10% </Select.Option>
              <Select.Option value="19">19 - PONTUAÇÃO 20% </Select.Option>
            </Select.OptGroup>

            <Select.OptGroup label="2 - INSUMO">
              <Select.Option value="21">21 - INSUMO DIVERSO</Select.Option>
              <Select.Option value="22">22 - INUMO SOBREMESA</Select.Option>
              <Select.Option value="23">23 - INSUMO CAFÉ</Select.Option>
              <Select.Option value="24">24 - INSUMO PÃO DE ALHO</Select.Option>
              <Select.Option value="25">25 - INSUMO HORTIFRUTI</Select.Option>
              <Select.Option value="26">
                26 - INSUMO LATICÍNIO/POLPA
              </Select.Option>
              <Select.Option value="27">27 - INSUMO CARNES</Select.Option>
              <Select.Option value="28">28 - INSUMO FRANGO</Select.Option>
              <Select.Option value="29">29 - INSUMO PESCADO</Select.Option>
              <Select.Option value="30">
                30 - INSUMO CERVEJA/REFRIGERANTE
              </Select.Option>
              <Select.Option value="31">31 - INSUMO ÁGUA</Select.Option>
              <Select.Option value="32">
                32 - INSUMO BEBIDA QUENTE
              </Select.Option>
              <Select.Option value="33">33 - EQUIPAMENTO</Select.Option>
              <Select.Option value="34">34 - UNIFORME</Select.Option>
              <Select.Option value="35">35 - LAVANDERIA</Select.Option>
              <Select.Option value="36">
                36 - MANUTENCAO EQUIPAMENTOS/PRÉDIO
              </Select.Option>
            </Select.OptGroup>

            <Select.OptGroup label="4 - GRÁFICA/COMANDA/CARDÁPIO/PAPELARIA/ESCRITÓRIO">
              <Select.Option value="41">
                41 - COMANDA/CARDÁPIO/ESCRITÓRIO/PAPELARIA
              </Select.Option>
              <Select.Option value="42">42 - PROMOÇÃO/DIVULGAÇÃO</Select.Option>
            </Select.OptGroup>

            <Select.OptGroup label="5 - ALUGUEIS / IPTU">
              <Select.Option value="51">51 - ALUGUEL</Select.Option>
              <Select.Option value="52">52 - IPTU</Select.Option>
            </Select.OptGroup>

            <Select.OptGroup label="6 - SABESP/ENEL/GÁS/ INTERNET/ CARVÃO">
              <Select.Option value="61">61 - SABESP</Select.Option>
              <Select.Option value="62">62 - ENEL</Select.Option>
              <Select.Option value="63">63 - GÁS</Select.Option>
              <Select.Option value="64">64 - INTERNET</Select.Option>
              <Select.Option value="65">65 - CARVÃO</Select.Option>
              <Select.Option value="66">66 - COMBUSTIVEL</Select.Option>
            </Select.OptGroup>

            <Select.OptGroup label="7 - IMPOSTOS">
              <Select.Option value="71">71 - IMPOSTO ICMS</Select.Option>
              <Select.Option value="72">72 - IMPOSTO GPS</Select.Option>
              <Select.Option value="73">73 - IMPOSTO SINDICATO </Select.Option>
              <Select.Option value="74">74 - IMPOSTO DARF</Select.Option>
              <Select.Option value="75">75 - IMPOSTO SIMPLES</Select.Option>
              <Select.Option value="76">76 - IMPOSTO DAMSP</Select.Option>
              <Select.Option value="77">77 - IMPOSTO INSS</Select.Option>
              <Select.Option value="78">78 - IMPOSTO FGTS</Select.Option>
              <Select.Option value="79">79 - IMPOSTO OUTROS</Select.Option>
            </Select.OptGroup>

            <Select.OptGroup label="8 - CONTRATOS DIVERSOS">
              <Select.Option value="81">81 - CONTRATO DEDETIZÇÃO</Select.Option>
              <Select.Option value="82">
                82 - CONTRATO CONTABILIDADE
              </Select.Option>
              <Select.Option value="83">83 - CONTRATO WYSE/DELTA</Select.Option>
              <Select.Option value="84">84 - CONTRATO MED.OCUP.</Select.Option>
              <Select.Option value="85">85 - CONTRATO MULTILIXO</Select.Option>
              <Select.Option value="86">
                86 - CONTRATO EMPREST. BRADESCO
              </Select.Option>
              <Select.Option value="87">
                87 - CONTRATO NUTRICIONISTA
              </Select.Option>
              <Select.Option value="88">88 - CONTRATO OUTROS</Select.Option>
              <Select.Option value="89">89 - CONTRATO PROLABORE</Select.Option>
            </Select.OptGroup>

            <Select.OptGroup label="9 -  DESPESAS">
              <Select.Option value="91">91 - DESPESA BANCÁRIA</Select.Option>
              <Select.Option value="92">92 - JUROS</Select.Option>
              <Select.Option value="93">93 - DESPESAS DIVERSAS</Select.Option>
              <Select.Option value="94">94 - LIMPEZA</Select.Option>
              <Select.Option value="95">95 - DESCARTAVEL</Select.Option>
              <Select.Option value="96">96 - EMBALAGEM </Select.Option>
              <Select.Option value="97">97 - TAXA CATÃO</Select.Option>
            </Select.OptGroup>
          </Select>
        </Col>

        <Col>
          <div>
            <span>Forma de pagamento</span>
          </div>
          <Select
            style={{ width: '200px' }}
            value={query?.paymentMethod}
            onChange={(e) => setQuery({ paymentMethod: e })}
            placeholder="Selecione"
          >
            <Select.Option value={PaymentMethod.pix}>
              {PaymentMethod.pix}
            </Select.Option>
            <Select.Option value={PaymentMethod.money}>
              {PaymentMethod.money}
            </Select.Option>
            <Select.Option value={PaymentMethod.credtCard}>
              {PaymentMethod.credtCard}
            </Select.Option>
            <Select.Option value={PaymentMethod.debitCard}>
              {PaymentMethod.debitCard}
            </Select.Option>
          </Select>
        </Col>
        <Col>
          <div>
            <span>Tipo</span>
          </div>
          <Select
            value={query?.type}
            onChange={(value) => {
              setQuery({ type: value });
            }}
            placeholder="Selecione"
          >
            <Select.Option value="entrada">Entrada</Select.Option>
            <Select.Option value="saida">Saida</Select.Option>
          </Select>
        </Col>
        <Col>
          <div>
            <span>Valor R$</span>
          </div>
          <Input
            value={query?.value as any}
            onChange={(e) => setQuery({ value: Number(e.target.value) })}
            placeholder="Digite aqui"
          ></Input>
        </Col>
        <Col>
          <div>
            <span style={{ fontSize: '10px' }}>Criar registro</span>
          </div>
          <Button onClick={() => setOpen(true)} type="primary">
            +
          </Button>
        </Col>
        <Col>
          <div>
            <span style={{ fontSize: '10px' }}>Limpar filtro</span>
          </div>
          <Button
            onClick={() => setQuery({}, 'replace')}
            type="primary"
            style={{ background: 'gold' }}
          >
            <FiTrash></FiTrash>
          </Button>
        </Col>
      </div>
      <br />

      <div className="tableRealeases">
        <Table
          pagination={{
            pageSize: 5,
          }}
          dataSource={dataTable as Data[]}
          columns={fields}
        ></Table>
      </div>
    </div>
  );
}
