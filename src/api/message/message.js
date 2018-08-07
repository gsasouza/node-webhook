const { array, string, object } = require('yup');
const { createRawMessage } = require('../../core/message/message');

const create = async (ctx) => {
  const { body } = ctx.request;
  const schema = object().shape({
    webhooks: array().of(string().url().required()).required(),
  }).required();

  await schema.validate(body);

  await createRawMessage(body);

  ctx.status = 201;
  ctx.body = ({
    message: 'Message Successfully added to queue',
  });
};

module.exports = {
  create,
};
