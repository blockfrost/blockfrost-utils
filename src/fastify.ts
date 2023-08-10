import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import stream from 'stream';

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
      error: error.name === 'FastifyError' ? 'error' : error.name,
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

export const handleInvalidAddressFromTo = (reply: FastifyReply) => {
  return handle400Custom(
    reply,
    'Invalid (malformed or out of range) from/to parameter(s).',
  );
};

export const handleInvalidAsset = (reply: FastifyReply) => {
  return handle400Custom(reply, 'Invalid or malformed asset format.');
};

export const handleInvalidBlockHash = (reply: FastifyReply) => {
  return handle400Custom(reply, 'Missing or malformed block hash.');
};

export const handleInvalidBlockNumber = (reply: FastifyReply) => {
  return handle400Custom(
    reply,
    'Missing, out of range or malformed block number.',
  );
};

export const handleInvalidEpoch = (reply: FastifyReply) => {
  return handle400Custom(
    reply,
    'Missing, out of range or malformed epoch_number.',
  );
};

export const handleInvalidLabel = (reply: FastifyReply) => {
  return handle400Custom(reply, 'Missing, out of range or malformed label.');
};

export const handleInvalidPolicy = (reply: FastifyReply) => {
  return handle400Custom(reply, 'Invalid or malformed policy format.');
};

export const handleInvalidPool = (reply: FastifyReply) => {
  return handle400Custom(reply, 'Invalid or malformed pool id format.');
};

export const handleInvalidSlot = (reply: FastifyReply) => {
  return handle400Custom(
    reply,
    'Missing, out of range or malformed slot_number.',
  );
};

export const handleInvalidStakeAddress = (reply: FastifyReply) => {
  return handle400Custom(reply, 'Invalid or malformed stake address format.');
};

export const handleInvalidXpub = (reply: FastifyReply) => {
  return handle400Custom(
    reply,
    'Invalid or malformed xpub format. Has to be hex of length 128.',
  );
};

export const handleInvalidXpubIndex = (reply: FastifyReply) => {
  return handle400Custom(reply, 'Missing, out of range or malformed index.');
};

export const handleInvalidXpubRole = (reply: FastifyReply) => {
  return handle400Custom(reply, 'Missing, out of range or malformed role.');
};

export const convertStreamToString = async (payloadStream: unknown) => {
  const payload = await new Promise<string>((resolve, reject) => {
    if (payloadStream instanceof stream.Readable) {
      // receive error response from the payload stream
      const chunks: Buffer[] = [];

      payloadStream.on('data', chunk => {
        chunks.push(chunk);
      });
      payloadStream.on('error', error => {
        reject(error);
      });
      payloadStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString());
      });
    } else if (typeof payloadStream === 'string') {
      // If payloadStream is just a string then return it
      resolve(payloadStream);
    } else {
      reject(new Error(`Invalid payload type: ${typeof payload}`));
    }
  });

  return payload;
};

export const fromGtTo = (fromToParameters: (number | undefined)[]) => {
  return (
    // from and to heights defined && from height > to height OR
    // from and to height is the same and from index > to index
    (fromToParameters[0] !== undefined &&
      fromToParameters[2] !== undefined &&
      fromToParameters[0] > fromToParameters[2]) ||
    (fromToParameters[1] !== undefined &&
      fromToParameters[3] !== undefined &&
      fromToParameters[0] === fromToParameters[2] &&
      fromToParameters[1] > fromToParameters[3])
  );
};

export const getAdditionalParametersFromRequest = (
  from?: string,
  to?: string,
) => {
  type ParameterType = number | undefined;
  const parameterArray: [
    ParameterType,
    ParameterType,
    ParameterType,
    ParameterType,
  ] = [undefined, undefined, undefined, undefined];

  try {
    const minInt = 0;
    const maxInt = 2_147_483_647;

    if (from !== undefined) {
      const fromTokens = from.split(':');
      const requestParameterIsOK = fromTokens.length <= 2;

      if (requestParameterIsOK) {
        const [heightString, indexString] = fromTokens;
        const height = Number(heightString);
        const index = indexString ? Number(indexString) : undefined; // NaN in case of missing index

        if (
          height >= minInt &&
          height <= maxInt &&
          (index === undefined || (index >= minInt && index <= maxInt))
        ) {
          parameterArray[0] = height;
          parameterArray[1] = index;
        } else {
          return 'outOfRangeOrMalformedErr';
        }
      }
    }

    if (to !== undefined) {
      const toTokens = to.split(':');
      const requestParameterIsOK = toTokens.length <= 2;

      if (requestParameterIsOK) {
        const [heightString, indexString] = toTokens;
        const height = Number(heightString);
        const index = indexString ? Number(indexString) : undefined;

        if (
          height >= minInt &&
          height <= maxInt &&
          (index === undefined || (index >= minInt && index <= maxInt))
        ) {
          parameterArray[2] = height;
          parameterArray[3] = index;
        } else {
          return 'outOfRangeOrMalformedErr';
        }
      }
    }
  } catch (error) {
    console.error(error);
    return 'outOfRangeOrMalformedErr';
  }

  if (fromGtTo(parameterArray)) {
    return 'outOfRangeOrMalformedErr';
  }

  return parameterArray;
};
