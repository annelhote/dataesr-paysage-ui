import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import AuthForm from '../../components/AuthForm';
import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';
import NavLink from '../../components/NavLink';
import NotifService from '../../services/Notif.service';
import { userService } from '../../services/User.service';

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
    const validationSchema = Yup.object().shape({
        activationCode: Yup.string()
            .required('Code d&apos;activation obligatoire')
            .matches('^(?=.*[0-9]).{6}$', 'Code non valide'),
    });

    const onSubmit = (formData) => {
        userService
            .activate(formData)
            .then((resp) => {
                console.log('==== then onSubmit ==== ', router);
                router
                    .push('/user/signin')
                    .then(() => {
                        NotifService.info(
                            'Votre compte est actif, connectez-vous !',
                            'valid'
                        );
                    })
                    .catch((err) => {
                        console.error(
                            '==== router push /user/signin ==== ',
                            err
                        );
                    });
            })
            .catch((err) => {
                NotifService.info(err, 'error');
                console.error('==== ERR ==== ', err);
            });
    };

    
return (
        <Layout>
            <HeaderLayout pageTitle="Activer mon compte" />
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
                        <NavLink href="/user/renewal-code">
                            Recevoir un nouveau code d&apos;activation
                        </NavLink>
                    </Col>
                </Row>
                <Toaster />
            </Container>
        </Layout>
    );
}
