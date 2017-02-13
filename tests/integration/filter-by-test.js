import EmberObject from 'ember-object';
import { filterBy, raw } from 'ember-awesome-macros';
import { A as emberA } from 'ember-array/utils';
import { moduleFor, test } from 'ember-qunit';
import compute from 'ember-macro-test-helpers/compute';

moduleFor('controller:application', 'Integration | Macro | filter by');

test('it returns empty array if array undefined', function(assert) {
  compute({
    assert,
    computed: filterBy('array', 'key', 'value'),
    deepEqual: []
  });
});

test('it returns empty array if key undefined', function(assert) {
  compute({
    assert,
    computed: filterBy('array', 'key', 'value'),
    properties: {
      array: emberA([{ test: 'val1' }, { test: 'val2' }])
    },
    deepEqual: []
  });
});

test('it returns empty array if not found', function(assert) {
  compute({
    assert,
    computed: filterBy('array', 'key', 'value'),
    properties: {
      array: emberA([{ test: 'val1' }, { test: 'val2' }]),
      key: 'test',
      value: 'val3'
    },
    deepEqual: []
  });
});

test('it filters array if found', function(assert) {
  compute({
    assert,
    computed: filterBy('array', 'key', 'value'),
    properties: {
      array: emberA([{ test: 'val1' }, { test: 'val2' }]),
      key: 'test',
      value: 'val2'
    },
    deepEqual: [{ test: 'val2' }]
  });
});

test('it responds to array property value changes', function(assert) {
  let array = [
    EmberObject.create({ test: 'val1' }),
    EmberObject.create({ test: 'val2' })
  ];

  // let { subject } = compute({
  //   computed: filterBy('array', 'key', 'value'),
  //   properties: {
  //     array,
  //     key: 'test',
  //     value: 'val2'
  //   }
  // });

  let subject = this.subject();
  subject.setProperties({
    array2: array,
    key2: 'test',
    value2: 'val2'
  });

  // let owner = Ember.getOwner(this.subject());
  // let subject = Ember.Controller.extend({
  //   computed: filterBy('array2', 'key2', 'value2')
  // }).create(owner.ownerInjection(), {
  //   array2: array,
  //   key2: 'test',
  //   value2: 'val2'
  // });

  assert.equal(subject.get('computed.length'), 1);

  subject.set('array.0.test', 'val2');

  assert.equal(subject.get('computed.length'), 2);
});

test('it handles raw numbers', function(assert) {
  compute({
    assert,
    computed: filterBy('array', 'key', 3),
    properties: {
      array: emberA([{ test: 2 }, { test: 3 }]),
      key: 'test'
    },
    deepEqual: [{ test: 3 }]
  });
});

test('composable: it filters array if found', function(assert) {
  compute({
    assert,
    computed: filterBy(
      raw(emberA([{ test: 'val1' }, { test: 'val2' }])),
      raw('test'),
      raw('val2')
    ),
    deepEqual: [{ test: 'val2' }]
  });
});
