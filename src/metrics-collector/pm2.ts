import { register, Gauge } from 'prom-client';
import pm2, { ProcessDescription } from 'pm2';

export const pm2Metrics = async () => {
  const memoryGauge = new Gauge({
    name: 'worker_memory_bytes',
    help: 'Worker memory usage in bytes',
    labelNames: ['name', 'instance'],
  });

  const cpuGauge = new Gauge({
    name: 'worker_cpu_percentage',
    help: 'Worker CPU usage in percentage',
    labelNames: ['name', 'instance'],
  });

  const uptimeGauge = new Gauge({
    name: 'worker_uptime_seconds',
    help: 'Worker uptime in seconds',
    labelNames: ['name', 'instance'],
  });

  const restartsGauge = new Gauge({
    name: 'worker_restarts_total',
    help: 'Total number of process restarts',
    labelNames: ['name', 'instance'],
  });

  const statusGauge = new Gauge({
    name: 'worker_status',
    help: 'Is the process running',
    labelNames: ['name', 'instance'],
  });

  const instancesGauge = new Gauge({
    name: 'worker_instances',
    help: 'Process instances',
    labelNames: ['name', 'instance'],
  });

  try {
    await new Promise((resolve, reject) => {
      pm2.connect(async error => {
        if (error) {
          console.error(error);
          reject(new Error('Error connecting to PM2'));
        }

        try {
          const processDescriptionList: ProcessDescription[] =
            await new Promise((resolve, reject) => {
              pm2.list((error, list) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(list);
                }
              });
            });

          for (const proc of processDescriptionList) {
            const { name, pm_id: instance, monit, pm2_env } = proc;
            const labels = { name, instance };

            uptimeGauge.set(
              labels,
              pm2_env
                ? Math.round((Date.now() - (pm2_env.pm_uptime || 0)) / 1000)
                : 0,
            );
            statusGauge.set(
              labels,
              pm2_env ? (pm2_env.status === 'online' ? 1 : 0) : 0,
            );
            instancesGauge.set(
              labels,
              pm2_env ? Number(pm2_env.instances) || 1 : 0,
            );
            memoryGauge.set(labels, monit ? monit.memory || 0 : 0);
            cpuGauge.set(labels, monit ? monit.cpu || 0 : 0);
            restartsGauge.set(
              labels,
              pm2_env
                ? pm2_env.unstable_restarts || 0 + (pm2_env.restart_time || 0)
                : 0,
            );
          }
        } catch (error) {
          console.error(error);
          reject(new Error('Error fetching PM2 metrics'));
        } finally {
          pm2.disconnect();
          resolve(true);
        }
      });
    });

    const metrics = await register.metrics();

    return metrics;
  } catch {
    throw new Error('Error fetching PM2 metrics');
  }
};
