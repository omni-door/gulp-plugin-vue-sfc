import 'mocha';
import { expect } from 'chai';
import plugin from '../';

describe('plugin test', function () {
  it('plugin is a function', function () {
    expect(plugin).to.be.a('function');
    expect(plugin()).to.be.an('object');
    expect(plugin({})).to.be.an('object');
  });
});
