const Validator = require("validatorjs");
const Db = require("../model/article.model");
const PostsArticle = Db.posts;

exports.store = async (req, res, next) => {
  const { title, content, category, status } = req.body;
  var message = [];

  const rules = {
    title: "required|string|min:20",
    content: "required|string|min:200",
    category: "required|string|min:3",
    status: "required|string|in:publish,draft,trash",
  };

  const error_msg = {
    in: "The :attribute must be in :in.",
  };

  let validation = new Validator(req.body, rules, error_msg);
  validation.checkAsync(passes, fails);

  function fails() {
    for (var key in validation.errors.all()) {
      var value = validation.errors.all()[key];
      message.push(value[0]);
    }
    res.status(200).json({
      code: 401,
      status: "error",
      message: message,
      result: [],
    });
  }

  async function passes() {
    const t = await Db.sequelize.transaction();
    try {
      let params = {
        title,
        content,
        category,
        status,
      };
      await PostsArticle.create(params, { transaction: t });
      await t.commit();
      res.status(200).json({
        code: 200,
        status: "success",
        message: ["Store data success."],
        result: [],
      });
    } catch (err) {
      await t.rollback();
      message = err.message.includes("SQLState")
        ? "Query syntax error."
        : err.message;

      return res.status(400).json({
        code: 400,
        status: "error",
        message: [message],
        result: [],
      });
    }
  }
};

exports.lists = async (req, res, next) => {
  let { limit, offset, status } = req.query;
  var message = [];
  offset = parseInt(offset) || 0;
  limit = parseInt(limit) || 10;
  const query_order = [["createdAt", "desc"]];

  const rules = {};

  let validation = new Validator(req.query, rules);
  validation.checkAsync(passes, fails);

  function fails() {
    for (var key in validation.errors.all()) {
      var value = validation.errors.all()[key];
      message.push(value[0]);
    }
    res.status(200).json({
      code: 401,
      status: "error",
      message: message,
      result: [],
    });
  }

  async function passes() {
    try {
      const where = {};
      if (status) {
        where.status = status;
      }
      const data = await PostsArticle.findAndCountAll({
        where,
        limit,
        offset,
        order: query_order,
      });
      return res.status(200).json({
        code: 200,
        status: "success",
        message: ["Retrieve data success."],
        result: data.rows,
        total: data.count,
        limit,
        offset,
      });
    } catch (err) {
      message = err.message.includes("SQLState")
        ? "Query syntax error."
        : err.message;

      return res.status(400).json({
        code: 400,
        status: "error",
        message: [message],
        result: [],
      });
    }
  }
};

exports.info = async (req, res, next) => {
  let { id } = req.query;
  var message = [];

  const rules = {
    id: "required",
  };

  let validation = new Validator(req.query, rules);
  validation.checkAsync(passes, fails);

  function fails() {
    for (var key in validation.errors.all()) {
      var value = validation.errors.all()[key];
      message.push(value[0]);
    }
    res.status(200).json({
      code: 401,
      status: "error",
      message: message,
      result: [],
    });
  }

  async function passes() {
    try {
      const data = await PostsArticle.findOne({
        where: {
          id,
        },
      });
      if (!data) {
        return res.status(200).json({
          code: 200,
          status: "success",
          message: ["Data not found"],
          result: [],
        });
      }
      return res.status(200).json({
        code: 200,
        status: "success",
        message: ["Retrieve data success."],
        result: data,
      });
    } catch (err) {
      message = err.message.includes("SQLState")
        ? "Query syntax error."
        : err.message;

      return res.status(400).json({
        code: 400,
        status: "error",
        message: [message],
        result: [],
      });
    }
  }
};

exports.update = async (req, res, next) => {
  const { id, title, content, category, status } = req.body;
  console.log(req.body);
  var message = [];

  Validator.registerAsync(
    "check_id",
    async function (id, attribute, req, passes) {
      try {
        const data = await PostsArticle.findOne({
          where: {
            id,
          },
        });
        if (data) {
          passes();
        } else {
          passes(false, "Data not found.");
        }
      } catch (err) {
        passes(false, err);
      }
    }
  );

  const rules = {
    id: "required|check_id",
    title: "required|string|min:20",
    content: "required|string|min:200",
    category: "required|string|min:3",
    status: "required|string|in:publish,draft,thrash",
  };

  const error_msg = {
    in: "The :attribute must be in :in.",
  };

  let validation = new Validator(req.body, rules, error_msg);
  validation.checkAsync(passes, fails);

  function fails() {
    for (var key in validation.errors.all()) {
      var value = validation.errors.all()[key];
      message.push(value[0]);
    }
    res.status(200).json({
      code: 404,
      status: "error",
      message: message,
      result: [],
    });
  }

  async function passes() {
    const t = await Db.sequelize.transaction();
    try {
      let params = {
        title,
        content,
        category,
        status,
      };
      await PostsArticle.update(params, {
        where: {
          id,
        },
        transaction: t,
      });
      await t.commit();
      res.status(200).json({
        code: 200,
        status: "success",
        message: ["Update data success."],
        result: [],
      });
    } catch (err) {
      await t.rollback();
      message = err.message.includes("SQLState")
        ? "Query syntax error."
        : err.message;

      return res.status(400).json({
        code: 400,
        status: "error",
        message: [message],
        result: [],
      });
    }
  }
};

exports.destroy = async (req, res, next) => {
  const { id } = req.body;
  var message = [];
  Validator.registerAsync(
    "check_id",
    async function (id, attribute, req, passes) {
      try {
        const data = await PostsArticle.findOne({
          where: {
            id,
          },
        });
        if (data) {
          passes();
        } else {
          passes(false, "Data not found.");
        }
      } catch (err) {
        passes(false, err);
      }
    }
  );

  const rules = {
    id: "required|check_id",
  };

  let validation = new Validator(req.body, rules);
  validation.checkAsync(passes, fails);

  function fails() {
    for (var key in validation.errors.all()) {
      var value = validation.errors.all()[key];
      message.push(value[0]);
    }
    res.status(404).json({
      code: 404,
      status: "error",
      message: message,
      result: [],
    });
  }

  async function passes() {
    try {
      const params = {
        status: "trash",
      };
      await PostsArticle.update(params, {
        where: {
          id,
        },
      });
      res.status(200).json({
        code: 200,
        status: "success",
        message: ["Delete data success."],
        result: [],
      });
    } catch (err) {
      message = err.message.includes("SQLState")
        ? "Query syntax error."
        : err.message;

      return res.status(400).json({
        code: 400,
        status: "error",
        message: [message],
        result: [],
      });
    }
  }
};
