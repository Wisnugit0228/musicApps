const InvariantError = require("../../exceptions/InvariantError");
const { playlistSchema, playlistSongSchema } = require("./schema");

const playlistValidator = {
  playlistValidate: (payload) => {
    const validateResult = playlistSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },

  playlistSongValidate: (payload) => {
    const result = playlistSongSchema.validate(payload);
    if (result.error) {
      throw new InvariantError(result.error.message);
    }
  },
};

module.exports = playlistValidator;
