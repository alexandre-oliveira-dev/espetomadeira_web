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
} from 'antd';
import './style.css';
import FormItem from 'antd/es/form/FormItem';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';
import Title from 'antd/es/typography/Title';
import {
  DateParam,
  NumberParam,
  StringParam,
  useQueryParams,
} from 'use-query-params';
import dayjs from 'dayjs';
import { api } from '../../service/api';
import { ReleaseType, Releases } from '../../types';
import { nameof } from '../../common/nameof';

type Data = Releases;

export default function Realeases() {
  const [form] = useForm();
  const [open, setOpen] = useState(false);

  const params = {
    date: DateParam,
    cod: StringParam,
    desc: StringParam,
    paymentMethod: StringParam,
    type: StringParam,
    value: NumberParam,
  };

  const [query, setQuery] = useQueryParams(params);

  const fields: TableColumnsType<any> = [
    {
      title: 'Id',
    },
    {
      title: 'Data',
    },
    {
      title: 'Código',
    },
    {
      title: 'Descrição',
    },
    {
      title: 'Forma de pagamento',
    },
    {
      title: 'Tipo',
    },
    {
      title: 'Valor',
    },
    {
      title: 'Usuário',
    },
    {
      title: 'Ações',
      render() {
        return (
          <Button type="primary" style={{ background: 'green' }}>
            Efetuar pagamento
          </Button>
        );
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
    console.log("🚀 ~ file: index.tsx:97 ~ handleCreate ~ payload:", payload)

    await api
      .post('/Realeases', { data: payload })
      .then(() => {
        alert('REgistro criado com sucesso');
      })
      .catch((err) => console.log(err));
  }

  const ModalCreateRegister = () => {
    return (
      <Modal
        title="Registrar lançamento"
        open={open}
        onOk={()=> handleCreate()}
        okText="salvar"
        cancelText="cancelar"
        onCancel={() => setOpen(false)}
      >
        <Form form={form}>
          <Row style={{ gap: '15px' }}>
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
                <Select placeholder="Selecione"></Select>
              </FormItem>
            </Col>
            <Col>
              <div>
                <span>Descrição</span>
              </div>
              <Input placeholder="Digite aqui"></Input>
            </Col>
            <Col>
              <div>
                <span>Forma de pagamento</span>
              </div>
              <FormItem name={nameof<Data>('formpgm')}>
                <Select placeholder="Selecione"></Select>
              </FormItem>
            </Col>
            <Col>
              <div>
                <span>Tipo</span>
              </div>
              <FormItem name={nameof<Data>('tipo')}>
                <Select placeholder="Selecione">
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
                <span>Valor R$</span>
              </div>
              <FormItem name={nameof<Data>('valor')}>
                <Input type='number' placeholder="Digite aqui"></Input>
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
            //value={query.date as any}
            onChange={(value) => {
              setQuery({ date: dayjs(value).toDate() });
            }}
          ></DatePicker>
        </Col>
        <Col>
          <div>
            <span>Código</span>
          </div>
          <Select placeholder="Selecione"></Select>
        </Col>
        <Col>
          <div>
            <span>Descrição</span>
          </div>
          <Input placeholder="Digite aqui"></Input>
        </Col>
        <Col>
          <div>
            <span>Forma de pagamento</span>
          </div>
          <Select placeholder="Selecione"></Select>
        </Col>
        <Col>
          <div>
            <span>Tipo</span>
          </div>
          <Select placeholder="Selecione">
            <Select.Option value="entrada">Entrada</Select.Option>
            <Select.Option value="saida">Saida</Select.Option>
          </Select>
        </Col>
        <Col>
          <div>
            <span>Valor R$</span>
          </div>
          <Input placeholder="Digite aqui"></Input>
        </Col>
        <Col>
          <div>
            <span>Criar registro</span>
          </div>
          <Button onClick={() => setOpen(true)} type="primary">
            +
          </Button>
        </Col>
      </div>
      <br />

      <div className="tableRealeases">
        <Table columns={fields}></Table>
      </div>
    </div>
  );
}
