import pure from 'rc-pure-component';

const Reference = ({ children }) => children;

const Wrapper = pure(Reference);
Wrapper.displayName = 'Wrapper';

export default Wrapper;
