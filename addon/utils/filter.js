import Ember from 'ember';

const { computed, get } = Ember;

const FILTERS = {
  equals(value, comparison) {
    return value.toUpperCase() === comparison.toUpperCase();
  },
  contains(value, contains) {
    return value.toUpperCase().indexOf(contains.toUpperCase()) !== -1;
  },
  greaterThan(value, comparison) {
    return value > comparison;
  },
  greaterThanEqual(value, comparison) {
    return value >= comparison;
  },
  lowerThan(value, comparison) {
    return value < comparison;
  },
  lowerThanEqual(value, comparison) {
    return value <= comparison;
  },
  startsWith(value, part) {
    return value.toUpperCase().indexOf(part.toUpperCase()) === 0;
  },
  endsWith(value, part) {
    const valueLength = value.length;
    const partLength = part.length;

    return value.toUpperCase().indexOf(part.toUpperCase()) === (valueLength - partLength);
  }
};

function filter(filters, list) {
  return list.filter(function(item) {
    let isOk = true;

    filters.forEach(function(filter) {
      const itemValue = get(item, filter.propertyPath);
      const filterFn = FILTERS[filter.filterName];
      const OK = filterFn(itemValue, filter.value);

      if (!OK) { isOk = false; }
    });

    return isOk;
  });
}

export default Ember.Object.extend({
  filteredContent: computed(
  'content.[]', 'filters.@each.{value,propertyPath}', function() {
    return filter(this.get('filters'), this.get('content'));
  }),

  filters: computed(function() {
    return Ember.A();
  }),

  filterTypes: [
    { label: 'Equals',                filter: 'equals' },
    { label: 'Contains',              filter: 'contains' },
    { label: 'Greater than',          filter: 'greaterThan' },
    { label: 'Greater than or equal', filter: 'greaterThanEqual' },
    { label: 'Lower than',            filter: 'lowerThan' },
    { label: 'Lower than or equal',   filter: 'lowerThanEqual' },
    { label: 'Starts with',           filter: 'startsWith' },
    { label: 'Ends with',             filter: 'endsWith' }
  ],

  addFilter(filterName, propertyPath, value) {
    this.get('filters').pushObject({
      filterName:   filterName,
      propertyPath: propertyPath,
      value:        value
    });
  }
});
