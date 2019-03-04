import { PureComponent } from 'react';

class ChildWrapper extends PureComponent {
  render() {
    // eslint-disable-next-line react/prop-types
    return this.props.children;
  }
}

export default ChildWrapper;
