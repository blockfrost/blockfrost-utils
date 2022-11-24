export const jsonToPrometheus = [
  {
    description: 'number and boolean values, nested types',
    data: {
      metric1: 1,
      metric2: -10,
      booleanMetricTrue: true,
      booleanMetricFalse: false,
      nested: {
        metric1: 1,
        metric2: -10,
        booleanMetricTrue: true,
        booleanMetricFalse: false,
      },
    },
    prefix: undefined,
    result: `metric1 1
metric2 -10
booleanMetricTrue 1
booleanMetricFalse 0
nested_metric1 1
nested_metric2 -10
nested_booleanMetricTrue 1
nested_booleanMetricFalse 0
`,
  },
  {
    description: 'number and boolean values, nested types, prefixed',
    data: {
      metric1: 1,
      metric2: -10,
      booleanMetricTrue: true,
      booleanMetricFalse: false,
      nested: {
        metric1: 1,
        metric2: -10,
        booleanMetricTrue: true,
        booleanMetricFalse: false,
      },
    },
    prefix: 'prefix',
    result: `prefix_metric1 1
prefix_metric2 -10
prefix_booleanMetricTrue 1
prefix_booleanMetricFalse 0
prefix_nested_metric1 1
prefix_nested_metric2 -10
prefix_nested_booleanMetricTrue 1
prefix_nested_booleanMetricFalse 0
`,
  },
  {
    description: 'key normalization',
    data: {
      'some-metric': 1,
    },
    prefix: undefined,
    result: `some_metric 1
`,
  },
];
