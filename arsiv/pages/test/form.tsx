import { BoxContent, Button, Col, Form, FormOlustur, Input, PropsFormOgeler, Row, isDev } from '@/@base';
import { useCallback, useEffect, useState } from 'react';

export default function Test() {
    const [form, setForm] = useState<object | any>({
        email: 'test@davasis.com',
        ad: 'izzet'
    });

    useEffect(() => {
        console.log('Form state has changed:', form);
    }, [form]);

    const onChange = useCallback((e: any) => {
        isDev && console.log('onChange', e.target.name, e.target.value);
        setForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    }, []);
    const formOgeler: PropsFormOgeler[] = [
        {
            component: (
                <Input
                    label={'E-mail'}
                    name="email"
                    type="email"
                    required={true}
                    placeholder={'E-mail adresinizi giriniz...'}
                    propsInput={{
                        autoComplete: 'username'
                    }}
                />
            )
        },
        {
            component: (
                <Input
                    label={'Ad'}
                    name="ad"
                    required={true}
                    placeholder={'Adınızı giriniz...'}
                    propsInput={{
                        autoComplete: 'name'
                    }}
                />
            ),
            noRender: false
        }
    ];

    return (
        <BoxContent style={{ padding: 20 }}>
            <Form>
                <FormOlustur
                    formOgeler={formOgeler}
                    form={form}
                    onChange={onChange}
                    formType={'noLabel'}
                    justifyContent={'center'}
                    sabitGrid={{
                        label: { xs: 9 },
                        input: { xs: 9 }
                    }}
                />
            </Form>

            <Row justifyContent='center'>
                <Col xs={5}>
                    <Input />
                </Col>
                <Col xs={'auto'}>
                    <Button buttonClass="primary" buttonSize='large'>Test</Button>
                    <Button buttonClass="primary">Test</Button>
                    <Button buttonClass="primary" buttonSize='small'>Test</Button>
                </Col>
            </Row>

            <Button
                onClick={() =>
                    setForm({
                        email: form.email,
                        ad: form.ad ? form.ad + '1' : '1'
                    })
                }
            >
                Arttır
            </Button>

            {/* <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={1}>
                Deneme
                <Input
                    label={"Ad"}
                    name="ad"
                    required={true}
                    placeholder={"Adınızı giriniz..."}
                    propsInput={{
                        autoComplete: "name"
                    }}
                    value={form.ad || ""}
                    onChange={onChange}
                />
            </Col>
            <Col xs={12} sm={6} md={4} lg={3} xl={2} xxl={1}>
                Deneme
                <Input
                    label={"Ad"}
                    name="ad"
                    required={true}
                    placeholder={"Adınızı giriniz..."}
                    propsInput={{
                        autoComplete: "name"
                    }}
                
                />
            </Col> */}
        </BoxContent>
    );
}
