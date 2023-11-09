import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, Table, TableColumnsType } from 'antd'
import './style.css'
import FormItem from 'antd/es/form/FormItem'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
import Title from 'antd/es/typography/Title'
import { DateParam, NumberParam, StringParam, useQueryParams } from 'use-query-params'
import dayjs from 'dayjs'

export default function Realeases() {
    const [form] = useForm()
    const [open,setOpen] = useState(false)

    const params = {
        date: DateParam,
        cod: StringParam,
        desc: StringParam,
        paymentMethod: StringParam,
        type: StringParam,
        value:NumberParam
    }

    const [query ,setQuery] = useQueryParams(params)

    const fields: TableColumnsType<any> = [
        {
          title:'Id'
        },
        {
          title:'Data'
        },
        {
          title:'Código'
        },
        {
          title:'Descrição'
        },
        {
          title:'Forma de pagamento'
        },
        {
          title:'Tipo'
        },
        {
          title:'Valor'
        },
        {
          title:'Usuário'
        },
         {
            title: 'Ações',
            render() {
                return (
                    <Button type='primary' style={{background:'green'}}>Efetuar pagamento</Button>
                )
            }
        },
    ]

    function handleCreate() {
        const data = form.getFieldsValue()
        console.log("🚀 ~ file: index.tsx:43 ~ handleCreate ~ data:", data)
    }

    
    const ModalCreateRegister = () => {
        return (
            <Modal
                title='Registrar lançamento'
                open={open}
                onOk={handleCreate}
                okText='salvar'
                cancelText='cancelar'
                onCancel={() => setOpen(false)}
            >
                <Form form={form}>

                    <Row style={{gap:'15px'}}>
                    
                    <Col>
                    <div><span>Data</span></div>
                    <FormItem name={'date'}><DatePicker></DatePicker></FormItem>
                </Col>
                <Col>
                    <div><span>Código</span>
                    </div>
                   <FormItem name={'codigo'}> <Select placeholder='Selecione'>
                         
                    </Select></FormItem>
                </Col>
                <Col>
                    <div><span>Descrição</span></div>
                 <Input placeholder='Digite aqui'></Input>
                </Col>
                <Col>
                    <div><span>Forma de pagamento</span>
                    </div>
                        <FormItem name={'paymentMethod'}>
                                  <Select placeholder='Selecione'>
                         
                    </Select>
                 </FormItem>
                </Col>
                <Col>
                    <div><span>Tipo</span>
                    </div>
                      <FormItem name={'type'}>
                                  <Select placeholder='Selecione'>
                         
                    </Select>
                 </FormItem>
                </Col>
                 <Col>
                    <div><span>Valor R$</span></div>
                 <FormItem name={'value'}><Input placeholder='Digite aqui'></Input></FormItem>
                </Col>
                
          </Row>
                </Form>

            </Modal>
        )
    }


    return (
        <div className='realeasescontainer'>
            <ModalCreateRegister></ModalCreateRegister>
            <Title level={2}>Lançamentos</Title>
            <br />
            <div className="filterRealeases">
                <Col>
                    <div><span>Data</span></div>
                    <DatePicker
                        //value={query.date as any}
                        onChange={(value) => {
                            setQuery({ date: dayjs(value).toDate() })
                    }}
                    ></DatePicker>
                </Col>
                <Col>
                    <div><span>Código</span>
                    </div>
                    <Select placeholder='Selecione'>
                         
                    </Select>
                </Col>
                <Col>
                    <div><span>Descrição</span></div>
                 <Input placeholder='Digite aqui'></Input>
                </Col>
                <Col>
                    <div><span>Forma de pagamento</span>
                    </div>
                    <Select placeholder='Selecione'>
                         
                    </Select>
                </Col>
                <Col>
                    <div><span>Tipo</span>
                    </div>
                    <Select placeholder='Selecione'>
                         <Select.Option value='entrada'>Entrada</Select.Option>
                         <Select.Option value='saida'>Saida</Select.Option>
                    </Select>
                </Col>
                 <Col>
                    <div><span>Valor R$</span></div>
                 <Input placeholder='Digite aqui'></Input>
                </Col>
                <Col>
                    <div><span>Criar registro</span></div>
                <Button onClick={() => setOpen(true)} type='primary'>+</Button>
                </Col>
            </div>
            <br />

            <div className="tableRealeases">
                <Table columns={fields}></Table>
            </div>
        </div>
    )
}