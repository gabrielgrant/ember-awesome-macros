import computed from 'ember-macro-helpers/computed';
import createClassComputed from 'ember-macro-helpers/create-class-computed';

const defaultValue = [];

export default createClassComputed(
  {
    array: false,
    key: true,
    value: false
  },
  key => {
    let suffix = key ? `@each.${key}` : '[]';
    return computed(`array.${suffix}`, 'value', (array, value) => {
      if (!array || !key) {
        return defaultValue;
      }
      return array.filterBy(key, value);
    });
  }
);
