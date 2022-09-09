import { jsonToPrometheus } from './utils';

export class MetricsCollector {
  metrics = {};
  prefix: string;
  intervalId: NodeJS.Timer | undefined;
  getAdditionalMetrics: (() => Promise<Record<string, unknown>>) | undefined;

  constructor(
    interval: number,
    options: {
      prefix: string;
      getAdditionalMetrics?: () => Promise<Record<string, unknown>>;
    },
  ) {
    this.prefix = options.prefix;
    this.getAdditionalMetrics = options.getAdditionalMetrics;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.startCollector(interval);
  }

  private _getPrefixedKey = (key: string) => `${this.prefix}_${key}`;

  private _collect = async () => {
    const additional = await this.getAdditionalMetrics?.();
    const additionalFormatted: Record<string, unknown> = {};
    for (const key in additional) {
      additionalFormatted[this._getPrefixedKey(key)] = additional[key];
    }

    return {
      // https://nodejs.org/api/process.html#processmemoryusage
      [this._getPrefixedKey('rss')]: process.memoryUsage().rss,
      [this._getPrefixedKey('total')]: process.memoryUsage().heapTotal,
      [this._getPrefixedKey('heap_used')]: process.memoryUsage().heapUsed,
      [this._getPrefixedKey('external')]: process.memoryUsage().external,
      [this._getPrefixedKey('array_buffers')]:
        process.memoryUsage().arrayBuffers,
      ...additionalFormatted,
    };
  };

  startCollector = async (interval: number) => {
    this.metrics = await this._collect();
    this.intervalId = setInterval(async () => {
      this.metrics = await this._collect();
    }, interval);
  };

  stopCollector = () => {
    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  };

  toPrometheus = (): string => {
    return jsonToPrometheus(this.metrics);
  };
}
