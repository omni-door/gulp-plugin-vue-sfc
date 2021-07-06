import 'mocha';
import { expect } from 'chai';
import normalize from '../normalize';
import replaceExt from '../replaceExt';

describe('normalize test', function () {
  it('normalize is a function', function () {
    expect(normalize).to.be.a('function');
  });

  it('call normalize', function () {
    expect(normalize('\\')).to.be.equal('/');
  });
});

describe('replaceExt test', function () {
  it('replaceExt is a function', function () {
    expect(replaceExt).to.be.a('function');
  });

  it('call replaceExt', function () {
    expect(replaceExt('', '.js')).to.be.equal('');
    expect(replaceExt('test/index.vue', '.js')).to.be.equal('test/index.js');
  });
});
