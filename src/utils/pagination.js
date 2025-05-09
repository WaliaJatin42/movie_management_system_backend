// src/utils/pagination.js
function getPaginationParams(query) {
    const page = Math.max(parseInt(query.page) || 1, 1); // default page = 1
    const limit = Math.max(parseInt(query.limit) || 10, 1); // default limit = 10
    const skip = (page - 1) * limit;

    return { page, limit, skip };
}

module.exports = { getPaginationParams };
