import { Col, Container, Row } from '@dataesr/react-dsfr';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import * as Yup from 'yup';
import AuthForm from '../../../components/AuthForm';
import FieldButton from '../../../components/FieldButton';
import HeaderLayout from '../../../components/HeaderLayout';
import Layout from '../../../components/Layout';
import { AppContext } from '../../../context/GlobalState';
import {
    activationCodePattern,
    codeMandatoryMsg,
    connectAdviceMsg,
    tokenMissingError,
} from '../../../helpers/internalMessages';
import { authService } from '../../../services/Auth.service';
import NotifService from '../../../services/Notif.service';

const formSchema = [
    {
        required: true,
        label: `Code d\'activation`,
        name: 'activationCode',
        hint: 'Code à 6 chiffres reçu par mail',
    },
];

export default function Activate() {
    const router = useRouter();
    const { dispatchPage: dispatch } = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        activationCode: Yup.string()
            .required(codeMandatoryMsg)
            .matches(activationCodePattern, 'Code non valide'),
    });

    const getNewCode = () => {
        authService
            .renewActivationCode()
            .then(({ data }) => {
                const a = data.message.split(' ');
                const email = a[a.length - 1];

                NotifService.info(
                    `Un nouveau code a été envoyé à ${email}`,
                    'valid'
                );
            })
            .catch((err) => {
                console.error(
                    '==== authService.renewActivationCode ==== ',
                    err
                );

                // Todo still useful??
                if (err === tokenMissingError) {
                    router.push('/account/sign-in').then(() => {
                        NotifService.info(connectAdviceMsg, 'neutral', 6000);
                    });
                }
            });
    };

    const onSubmit = (formData) => {
        authService
            .activate(formData)
            .then(() => {
                Cookies.remove('tokens');

                dispatch({
                    type: 'UPDATE_ERROR',
                    payload: { error: '' },
                });

                dispatch({
                    type: 'UPDATE_USER_CONNECTION',
                    payload: { userConnected: false },
                });

                Cookies.set('userConnected', false);

                router.push('/account/sign-in').then(() => {
                    NotifService.info('Compte activé', 'valid');
                    window.location.reload();
                });
            })
            .catch((err) => {
                console.error('==== authService.activate ==== ', err);
                NotifService.info(err, 'error');

                return Promise.reject(err);
            });
    };

    return (
        <Layout headTitle="Paysage - Activer mon compte">
            <HeaderLayout pageTitle="Activer mon compte" />
            <Container>
                <Row gutters>
                    <Col n="12 md-6">
                        <AuthForm
                            schema={formSchema}
                            onSubmit={onSubmit}
                            validationSchema={validationSchema}
                        />
                    </Col>
                    <Col n="12">
                        <FieldButton
                            title="Recevoir un nouveau code d'activation"
                            onClick={getNewCode}
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
