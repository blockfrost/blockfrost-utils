import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export const notFoundHandler = (
  _request: FastifyRequest,
  reply: FastifyReply,
): FastifyReply => {
  return reply
    .code(400)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      error: 'Bad Request',
      message: 'Invalid path. Please check https://docs.blockfrost.io/',
      status_code: 400,
    });
};

export const errorHandler = (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
): FastifyReply => {
  if (reply.statusCode === 400) {
    return handle400(reply, error);
  }

  if (reply.statusCode === 404) {
    return handle404(reply);
  }

  if (reply.statusCode >= 500 && reply.statusCode < 600) {
    return handle500(reply, error, request);
  }

  return reply.send(error);
};

export const handle400 = (
  reply: FastifyReply,
  error: FastifyError,
): FastifyReply =>
  reply
    .code(400)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      error: 'Bad Request',
      message: error.message,
      status_code: 400,
    });

export const handle400Custom = (
  reply: FastifyReply,
  message: string,
): FastifyReply =>
  reply
    .code(400)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      error: 'Bad Request',
      message: message,
      status_code: 400,
    });

export const handle402 = (reply: FastifyReply): FastifyReply =>
  reply
    .code(402)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      error: 'Project Over Limit',
      message: 'Usage is over limit.',
      status_code: 402,
    });

export const handle403 = (reply: FastifyReply): FastifyReply =>
  reply
    .code(403)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      error: 'Forbidden',
      message: 'Invalid project token.',
      status_code: 403,
    });

export const handle403Custom = (
  reply: FastifyReply,
  message: string,
): FastifyReply =>
  reply
    .code(403)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      error: 'Forbidden',
      message: message,
      status_code: 403,
    });

export const handle404 = (reply: FastifyReply): FastifyReply =>
  reply
    .code(404)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      error: 'Not Found',
      message: 'The requested component has not been found.',
      status_code: 404,
    });

export const handle500 = (
  reply: FastifyReply,
  error: unknown,
  request: FastifyRequest,
): FastifyReply => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Error in', request.url);
    console.log(error);
  }

  return reply
    .code(500)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      error: 'Internal Server Error',
      message: 'An unexpected response was received from the backend.',
      status_code: 500,
    });
};
