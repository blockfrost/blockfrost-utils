import { test, expect } from 'vitest';
import sinon from 'sinon';
import { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import {
  notFoundHandler,
  handle400,
  handle400Custom,
  handle402,
  handleInvalidAddress,
  handleFastifyError,
  handle403,
  handle403Custom,
  handle415,
  handle404,
  handle500,
} from './../../src/fastify';

const mockReply = () => {
  return {
    code: sinon.stub().returnsThis(),
    header: sinon.stub().returnsThis(),
    send: sinon.stub().returnsThis(),
  };
};

test('notFoundHandler should return 400 status code with correct message', () => {
  const reply = mockReply();

  notFoundHandler({} as FastifyRequest, reply as FastifyReply);

  expect(reply.code.args[0][0]).toBe(400);
  expect(reply.header.args[0][0]).toBe('Content-Type');
  expect(reply.header.args[0][1]).toBe('application/json; charset=utf-8');
  expect(reply.send.args[0][0]).toStrictEqual({
    error: 'Bad Request',
    message: 'Invalid path. Please check https://docs.blockfrost.io/',
    status_code: 400,
  });
});

test('handle400 should return 400 status code with correct message', () => {
  const error = new Error('Test error');
  const reply = mockReply();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle400(reply as any, error as any);

  expect(reply.code.args[0][0]).toBe(400);
  expect(reply.header.args[0][0]).toBe('Content-Type');
  expect(reply.header.args[0][1]).toBe('application/json; charset=utf-8');
  expect(reply.send.args[0][0]).toStrictEqual({
    error: 'Bad Request',
    message: 'Test error',
    status_code: 400,
  });
});

test('handle400Custom should return 400 status code with custom message', () => {
  const customMessage = 'Custom error message';
  const reply = mockReply();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle400Custom(reply as any, customMessage);

  expect(reply.code.args[0][0]).toBe(400);
  expect(reply.header.args[0][0]).toBe('Content-Type');
  expect(reply.header.args[0][1]).toBe('application/json; charset=utf-8');
  expect(reply.send.args[0][0]).toStrictEqual({
    error: 'Bad Request',
    message: customMessage,
    status_code: 400,
  });
});

test('handleInvalidAddress should return 400 status code with custom message', () => {
  const reply = mockReply();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleInvalidAddress(reply as any);

  expect(reply.code.args[0][0]).toBe(400);
  expect(reply.header.args[0][0]).toBe('Content-Type');
  expect(reply.header.args[0][1]).toBe('application/json; charset=utf-8');
  expect(reply.send.args[0][0]).toStrictEqual({
    error: 'Bad Request',
    message: 'Invalid address for this network or malformed address format.',
    status_code: 400,
  });
});

test('handleFastifyError should return error status code with error message', () => {
  const error: FastifyError = new Error('Test error') as FastifyError;
  error.statusCode = 404;
  error.name = 'FastifyError';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request = { url: '/test' } as any;
  const reply = mockReply();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFastifyError(reply as any, error as any, request);

  expect(reply.code.args[0][0]).toBe(404);
  expect(reply.header.args[0][0]).toBe('Content-Type');
  expect(reply.header.args[0][1]).toBe('application/json; charset=utf-8');
  expect(reply.send.args[0][0]).toStrictEqual({
    error: 'error',
    message: 'Test error',
    status_code: 404,
  });
});

test('handleFastifyError should handle error not named FastifyError', () => {
  const error: FastifyError = new Error('Test error') as FastifyError;
  error.statusCode = 404;
  error.name = 'OtherError';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request = { url: '/test' } as any;
  const reply = mockReply();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFastifyError(reply as any, error as any, request);

  expect(reply.code.args[0][0]).toBe(404);
  expect(reply.header.args[0][0]).toBe('Content-Type');
  expect(reply.header.args[0][1]).toBe('application/json; charset=utf-8');
  expect(reply.send.args[0][0]).toStrictEqual({
    error: 'OtherError',
    message: 'Test error',
    status_code: 404,
  });
});

test('handle402 should return 402 status code with Project Over Limit message', () => {
  const reply = mockReply();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle402(reply as any);

  expect(reply.code.args[0][0]).toBe(402);
  expect(reply.header.args[0][0]).toBe('Content-Type');
  expect(reply.header.args[0][1]).toBe('application/json; charset=utf-8');
  expect(reply.send.args[0][0]).toStrictEqual({
    error: 'Project Over Limit',
    message: 'Usage is over limit.',
    status_code: 402,
  });
});

test('handle403 should return 403 status code with Forbidden message', () => {
  const reply = mockReply();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle403(reply as any);

  expect(reply.code.args[0][0]).toBe(403);
  expect(reply.header.args[0][0]).toBe('Content-Type');
  expect(reply.header.args[0][1]).toBe('application/json; charset=utf-8');
  expect(reply.send.args[0][0]).toStrictEqual({
    error: 'Forbidden',
    message: 'Invalid project token.',
    status_code: 403,
  });
});

test('handle403Custom should return 403 status code with custom Forbidden message', () => {
  const reply = mockReply();
  const customMessage = 'Custom forbidden message';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle403Custom(reply as any, customMessage);

  expect(reply.code.args[0][0]).toBe(403);
  expect(reply.header.args[0][0]).toBe('Content-Type');
  expect(reply.header.args[0][1]).toBe('application/json; charset=utf-8');
  expect(reply.send.args[0][0]).toStrictEqual({
    error: 'Forbidden',
    message: customMessage,
    status_code: 403,
  });
});

test('handle404 should return 404 status code with Not Found error message', () => {
  const reply = mockReply();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle404(reply as any);

  expect(reply.code.args[0][0]).toBe(404);
  expect(reply.header.args[0][0]).toBe('Content-Type');
  expect(reply.header.args[0][1]).toBe('application/json; charset=utf-8');
  expect(reply.send.args[0][0]).toStrictEqual({
    error: 'Not Found',
    message: 'The requested component has not been found.',
    status_code: 404,
  });
});

test('handle415 should return 415 status code with Unsupported Media Type error message', () => {
  const reply = mockReply();
  const error = { message: 'Unsupported Media Type' };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle415(reply as any, error as any);

  expect(reply.code.args[0][0]).toBe(415);
  expect(reply.header.args[0][0]).toBe('Content-Type');
  expect(reply.header.args[0][1]).toBe('application/json; charset=utf-8');
  expect(reply.send.args[0][0]).toStrictEqual({
    error: 'Unsupported Media Type',
    message: error.message,
    status_code: 415,
  });
});

test('handle500 should return 500 status code with Internal Server Error message', () => {
  const reply = mockReply();
  const request = { url: 'http://test-url.com' };
  const error = {
    message: 'An unexpected response was received from the backend.',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle500(reply as any, error, request as any);

  expect(reply.code.args[0][0]).toBe(500);
  expect(reply.header.args[0][0]).toBe('Content-Type');
  expect(reply.header.args[0][1]).toBe('application/json; charset=utf-8');
  expect(reply.send.args[0][0]).toStrictEqual({
    error: 'Internal Server Error',
    message: error.message,
    status_code: 500,
  });
});
