import { PureComponent } from 'react';
import { any } from 'prop-types';

class Reference extends PureComponent {
  static propTypes = {
    children: any, // eslint-disable-line react/forbid-prop-types
  }

  static defaultProps = {
    children: null,
  }

  render() {
    const { children } = this.props;
    return children;
  }
}

export default Reference;
