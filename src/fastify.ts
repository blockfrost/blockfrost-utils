import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

type FastifyErrorWithStatusCode = FastifyError & {
  statusCode: NonNullable<FastifyError['statusCode']>;
};

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
  // Validation errors from parsing POST body or request parameters
  // Note: Response body is not validated, but it could still throw
  // serialization error (generic js Error) if it doesn't match the provided schema.
  if (error.statusCode === 400 || error.validation) {
    return handle400(reply, error);
  }

  // TODO: investigate if these are needed
  if (reply.statusCode === 400) {
    return handle400(reply, error);
  }

  if (reply.statusCode === 404) {
    return handle404(reply);
  }

  if (error.statusCode === 415) {
    return handle415(reply, error);
  }

  if (error.statusCode === 500) {
    return handle500(reply, error, request);
  }

  if (error.statusCode !== undefined) {
    // Handle other Fastify errors with statusCode
    return handleFastifyError(
      reply,
      error as FastifyErrorWithStatusCode,
      request,
    );
  }
  // Handle generic js errors
  return handle500(reply, error, request);
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

export const handle415 = (
  reply: FastifyReply,
  error: FastifyError,
): FastifyReply =>
  reply
    .code(415)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      error: 'Unsupported Media Type',
      message: error.message,
      status_code: 415,
    });

export const handle500 = (
  reply: FastifyReply,
  error: unknown,
  request: FastifyRequest,
): FastifyReply => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(`Error in ${request.url}.`, error);
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

export const handleFastifyError = (
  reply: FastifyReply,
  error: FastifyErrorWithStatusCode,
  request: FastifyRequest,
): FastifyReply => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(`Error in ${request.url}.`, error);
  }
  return reply
    .code(error.statusCode)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      // error.name is always "FastifyError", use error.code to provide more info to a client (eg. FST_ERR_CTP_INVALID_MEDIA_TYPE)
      error: error.name,
      message: error.message,
      status_code: error.statusCode,
    });
};

export const handleInvalidAddress = (reply: FastifyReply) => {
  return handle400Custom(
    reply,
    'Invalid address for this network or malformed address format.',
  );
};

export const handleInvalidAsset = (reply: FastifyReply) => {
  return handle400Custom(reply, 'Invalid or malformed asset format.');
};

export const handleInvalidPolicy = (reply: FastifyReply) => {
  return handle400Custom(reply, 'Invalid or malformed policy format.');
};

export const handleInvalidPool = (reply: FastifyReply) => {
  return handle400Custom(reply, 'Invalid or malformed pool id format.');
};

export const handleInvalidStakeAddress = (reply: FastifyReply) => {
  return handle400Custom(reply, 'Invalid or malformed stake address format.');
};
