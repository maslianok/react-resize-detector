import { renderIntoDocument } from 'react-dom/test-utils';

import React from 'react';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { JSDOM } from 'jsdom';

import ResizeDetector from '../../src/index';

chai.use(spies);

/* eslint-disable no-unused-expressions */

describe('Results', () => {
  before(() => {
    const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
    global.window = jsdom.window;
    global.document = jsdom.window.document;
    global.navigator = global.window.navigator;
  });

  it('renders entries with vote counts or zero', () => {
    function onResize() { }

    const onResizeSpy = chai.spy(onResize);

    renderIntoDocument(
      <ResizeDetector handleWidth handleHeight onResize={onResizeSpy} />,
    );

    expect(onResizeSpy).to.have.been.called();
  });
});
