import { test, expect } from 'vitest';
import sinon from 'sinon';
import { FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import {
  notFoundHandler,
  handle400,
  handle400Custom,
  handleInvalidAddress,
  handleFastifyError,
} from './../../src/fastify';

test('notFoundHandler should return 400 status code with correct message', () => {
  const reply = {
    code: sinon.stub().returnsThis(),
    header: sinon.stub().returnsThis(),
    send: sinon.stub().returnsThis(),
  };

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
  const reply = {
    code: sinon.stub().returnsThis(),
    header: sinon.stub().returnsThis(),
    send: sinon.stub().returnsThis(),
  };

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
  const reply = {
    code: sinon.stub().returnsThis(),
    header: sinon.stub().returnsThis(),
    send: sinon.stub().returnsThis(),
  };

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
  const reply = {
    code: sinon.stub().returnsThis(),
    header: sinon.stub().returnsThis(),
    send: sinon.stub().returnsThis(),
  };

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

  const request = { url: '/test' } as any;
  const reply = {
    code: sinon.stub().returnsThis(),
    header: sinon.stub().returnsThis(),
    send: sinon.stub().returnsThis(),
  };

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

  const request = { url: '/test' } as any;
  const reply = {
    code: sinon.stub().returnsThis(),
    header: sinon.stub().returnsThis(),
    send: sinon.stub().returnsThis(),
  };

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
