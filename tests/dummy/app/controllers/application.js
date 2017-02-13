import Ember from 'ember';
import { ceil } from 'ember-awesome-macros/math';
import floor from 'ember-awesome-macros/math/floor';
// import { filterBy } from 'ember-awesome-macros';
import ClassBasedComputedProperty from 'ember-classy-computed';

const { observer, computed: { filter }, defineProperty } = Ember;

const DynamicFilterByComputed = ClassBasedComputedProperty.extend({
  filterPropertyDidChange: observer('filterProperty', function() {
    let filterProperty = this.get('filterProperty');
    let property = filter(`collection.@each.${filterProperty}`, (item) => item.get(filterProperty));
    defineProperty(this, 'content', property);
    this.invalidate();
  }),

  compute(collection, filterProperty) {
    this.set('collection', collection);
    this.set('filterProperty', filterProperty);

    return this.get('content');
  }
});

const filterBy = ClassBasedComputedProperty.property(DynamicFilterByComputed);

export default Ember.Controller.extend({
  ceil: ceil(0.5),
  floor: floor(1.5),
  computed: filterBy('array2', 'key2', 'value2')
});
