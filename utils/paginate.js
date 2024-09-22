const paginate = async (model, page = 1, pageSize = 10, queryOptions = {}) => {
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  const { count, rows } = await model.findAndCountAll({
    ...queryOptions,
    limit,
    offset,
  });

  const totalPages = Math.ceil(count / pageSize);

  return {
    data: rows,
    pagination: {
      totalItems: count,
      currentPage: page,
      pageSize,
      totalPages,
    },
  };
};

module.exports = paginate;
