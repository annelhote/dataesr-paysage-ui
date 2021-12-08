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
        name: 'firstName',
        label: 'Prénom',
        required: true,
    },
    {
        name: 'lastName',
        label: 'Nom',
        required: true,
    },
    {
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true,
    },
    {
        label: 'Mot de passe',
        name: 'password',
        type: 'password',
        required: true,
        hint: '8 caractères minimum dont 1 chiffre, 1 caractère spécial, 1 majuscule',
    },
    {
        label: 'Confirmation de mot passe',
        name: 'confirm_password',
        type: 'password',
        required: true,
    },
    {
        label: 'Pseudo',
        name: 'username',
        required: true,
    },
];

export default function Signup() {
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Le pseudo est obligatoire')
            .matches('^(?=.*[aA-zZ]).{2,18}$', 'Format invalide'),
        email: Yup.string()
            .required("L'email est obligatoire")
            .email("Format d'email incorrecte"),
        password: Yup.string()
            .required('Le mot de passe est obligatoire')
            .matches(
                '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$',
                '8 caractères minimum dont 1 chiffre, 1 caractère spécial, 1 majuscule'
            ),
        firstName: Yup.string()
            .required('Le prénom est obligatoire')
            .matches('^(?=.*[aA-zZ]).{2,18}$', 'Format invalide'),
        lastName: Yup.string()
            .required('Le nom est obligatoire')
            .matches('^(?=.*[aA-zZ]).{2,18}$', 'Format invalide'),
        confirm_password: Yup.string()
            .required()
            .oneOf(
                [Yup.ref('password'), null],
                'Les mots de passe ne sont pas identiques'
            ),
    });

    const onSubmit = (formData) => {
        const {
            password,
            email,
            firstName,
            lastName,
            username,
            confirm_password,
        } = formData;

        if (password === confirm_password) {
            userService
                .signup({ email, password, firstName, lastName, username })
                .then(() => {
                    router.push('/user/activate-account').then(() => {
                        NotifService.info(
                            `Vous avez reçu un code d&apos;activation par mail`,
                            'valid'
                        );
                    });
                })
                .catch((err) => {
                    const errorFr =
                        err === 'email already exists.'
                            ? `L'email ${email} est déjà pris`
                            : err;
                    NotifService.info(errorFr, 'error');
                    console.error('==== LOG ==== ', err);
                });
        }
    };

    return (
        <Layout>
            <HeaderLayout pageTitle="Créer un compte Paysage" />
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
                        <NavLink href="/user/signin">
                            J&apos;ai déjà un compte
                        </NavLink>
                    </Col>
                </Row>
                <Toaster />
            </Container>
        </Layout>
    );
}
