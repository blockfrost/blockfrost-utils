import { expect, describe, test } from 'vitest';
import { jsonToPrometheus } from '../../src/metrics-collector/utils';
import * as fixtures from './__fixtures__/metrics-collector';

describe('metrics collector', () => {
  fixtures.jsonToPrometheus.forEach(fixture => {
    test(`jsonToPrometheus: ${fixture.description}`, () => {
      const res = jsonToPrometheus(fixture.data, fixture.prefix);

      expect(res).toStrictEqual(fixture.result);
    });
  });
});
