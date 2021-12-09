import { Col, Container, Row } from '@dataesr/react-dsfr';
import { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import AuthForm from '../../../components/AuthForm';
import HeaderLayout from '../../../components/HeaderLayout';
import Layout from '../../../components/Layout';
import NavLink from '../../../components/NavLink';
import {
    emailErrorMsg,
    emailMandatoryMsg,
    emailPattern,
    emailPatternHint,
    passwordMandatoryMsg,
} from '../../../helpers/internalMessages';
import NotifService from '../../../services/Notif.service';
import { userService } from '../../../services/User.service';

const formSchema = [
    {
        name: 'account',
        type: 'email',
        label: 'Email',
        required: true,
    },
    {
        label: 'Mot de passe',
        name: 'password',
        type: 'password',
        required: true,
    },
];

function SignIn() {
    const validationSchema = Yup.object().shape({
        account: Yup.string()
            .required(`${emailMandatoryMsg}`)
            .email(`${emailErrorMsg}`),
        password: Yup.string()
            .required(`${passwordMandatoryMsg}`)
            .matches(`${emailPattern}`, `${emailPatternHint}`),
    });

    const onSubmit = (formData) => {
        userService
            .signIn(formData)
            .then(() => {
                window.location = '/';
            })
            .catch((err) => {
                NotifService.info(err, 'error');
            });
    };

    return (
        <Layout>
            <HeaderLayout pageTitle="Se connecter" />
            <Container>
                <Row gutters>
                    <Col n="6">
                        <AuthForm
                            schema={formSchema}
                            onSubmit={onSubmit}
                            validationSchema={validationSchema}
                        />
                    </Col>
                    <Col n="12">
                        <NavLink href="/user/signup">
                            Je n&apos;ai pas encore de compte
                        </NavLink>
                    </Col>
                    <Col n="12">
                        <NavLink href="/user/forgot-password">
                            J&apos;ai perdu mon mot de passe
                        </NavLink>
                    </Col>
                </Row>
            </Container>
            <Toaster />
        </Layout>
    );
}

export default SignIn;
