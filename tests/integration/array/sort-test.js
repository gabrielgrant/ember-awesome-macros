import { sort } from 'ember-awesome-macros/array';
import { raw } from 'ember-awesome-macros';
import { A as emberA } from 'ember-array/utils';
import { module, test } from 'qunit';
import sinon from 'sinon';
import compute from 'ember-macro-test-helpers/compute';

module('Integration | Macro | array | sort');

test('it returns undefined if array undefined', function(assert) {
  compute({
    assert,
    computed: sort('array'),
    strictEqual: undefined
  });
});

test('it returns a sorted array without a parameter', function(assert) {
  compute({
    assert,
    computed: sort('array'),
    properties: {
      array: emberA(['xyz', 'abc'])
    },
    deepEqual: ['abc', 'xyz']
  });
});

test('it returns a sorted array with an array parameter', function(assert) {
  compute({
    assert,
    computed: sort('array', 'sortDefinition'),
    properties: {
      array: emberA([
        {
          key1: 'abc',
          key2: 'abc'
        },
        {
          key1: 'abc',
          key2: 'xyz'
        }
      ]),
      sortDefinition: [
        'key1',
        'key2:desc'
      ]
    },
    deepEqual: [
      {
        key1: 'abc',
        key2: 'xyz'
      },
      {
        key1: 'abc',
        key2: 'abc'
      }
    ]
  });
});

test('it returns a sorted array with a direct array parameter', function(assert) {
  compute({
    assert,
    computed: sort('array', ['prop:desc']),
    properties: {
      array: [{prop: 1}, {prop: 3}, {prop: 2}]
    },
    deepEqual: [{prop: 3}, {prop: 2}, {prop: 1}]
  });
});

test('it returns a sorted array with function parameter', function(assert) {
  let sortDefinition = sinon.stub().returns(1);

  compute({
    assert,
    computed: sort('array', 'sortDefinition'),
    properties: {
      array: emberA([
        {
          key1: 'abc',
          key2: 'abc'
        },
        {
          key1: 'abc',
          key2: 'xyz'
        }
      ]),
      sortDefinition
    },
    deepEqual: [
      {
        key1: 'abc',
        key2: 'xyz'
      },
      {
        key1: 'abc',
        key2: 'abc'
      }
    ]
  });
});

test('the callback has object context', function(assert) {
  let sortDefinition = sinon.stub().returns(1);

  let { subject } = compute({
    computed: sort('array', 'sortDefinition'),
    properties: {
      array: emberA([
        {
          key1: 'abc',
          key2: 'abc'
        },
        {
          key1: 'abc',
          key2: 'xyz'
        }
      ]),
      sortDefinition
    }
  });

  assert.strictEqual(sortDefinition.thisValues[0], subject);
});

test('the callback is passed the correct args', function(assert) {
  let sortDefinition = sinon.stub().returns(1);

  compute({
    computed: sort('array', 'sortDefinition'),
    properties: {
      array: emberA([
        {
          key1: 'abc',
          key2: 'abc'
        },
        {
          key1: 'abc',
          key2: 'xyz'
        }
      ]),
      sortDefinition
    }
  });

  assert.deepEqual(sortDefinition.args, [[
    {
      key1: 'abc',
      key2: 'abc'
    },
    {
      key1: 'abc',
      key2: 'xyz'
    }
  ]]);
});

test('it does not sort the source array for default sorts', function(assert) {
  let array = [1, 3, 2];
  compute({
    assert,
    computed: sort('array'),
    properties: {
      array
    },
    deepEqual: [1, 2, 3]
  });
  assert.deepEqual(array, [1, 3, 2]);
});

test('it does not sort the source array for property sorts', function(assert) {
  let array = [{prop: 1}, {prop: 3}, {prop: 2}];
  compute({
    assert,
    computed: sort('array', ['prop:desc']),
    properties: {
      array
    },
    deepEqual: [{prop: 3}, {prop: 2}, {prop: 1}]
  });
  assert.deepEqual(array, [{prop: 1}, {prop: 3}, {prop: 2}]);
});

test('composable: it returns a sorted array', function(assert) {
  compute({
    assert,
    computed: sort(raw([1, 3, 2])),
    deepEqual: [1, 2, 3]
  });
});
