import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import renderer from 'react-test-renderer';

import LinkTo from '../../components/LinkTo';

Enzyme.configure({ adapter: new Adapter() });

describe('<LinkTo />', () => {
    let wrapper;
    const props = {
        text: 'Ceci est mon texte',
        href: '/this/is/my/href',
    };

    beforeEach(() => {
        wrapper = (props = {}) =>
            shallow(<LinkTo text={props.text} href={props.href} />);
    });
    it('renders correctly LinkTo', () => {
        const tree = renderer
            .create(
                <LinkTo text="Ceci est mon texte" href="/create/structure" />
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('has LinkTo class', () => {
        const component = wrapper(props);
        expect(component.find('div').hasClass('LinkTo')).toBeTruthy();
    });
});
