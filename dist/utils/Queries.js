"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const escapeRegex = (str) => {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
const Queries = (collectionModel, queryKeys, searchKeys, populatePath, selectFields, modelSelect) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit, page, sort, order } = queryKeys, filters = __rest(queryKeys, ["limit", "page", "sort", "order"]);
        let query = {};
        // Handle search keys with regex
        if (Object.keys(searchKeys).length > 0) {
            query.$or = Object.keys(searchKeys)
                .map(key => {
                const value = searchKeys[key];
                if (typeof value === 'string') {
                    return {
                        [key]: { $regex: escapeRegex(value), $options: "i" }
                    };
                }
                return {}; // Return empty object if value is not a string
            })
                .filter(item => Object.keys(item).length > 0); // Remove empty objects
        }
        // Handle filters
        if (filters) {
            Object.keys(filters).forEach(key => {
                if (filters[key] && filters[key] !== 'undefined') {
                    query[key] = filters[key];
                }
            });
        }
        // Handle sorting
        let sortOrder = {};
        if (sort) {
            sortOrder[sort] = order === "desc" ? -1 : 1;
        }
        const itemsPerPage = parseInt(limit || "30", 10);
        const currentPage = parseInt(page || "1", 10);
        let queryExec = collectionModel.find(query);
        // Apply field selection for the main model
        if (modelSelect) {
            queryExec = queryExec.select(modelSelect);
        }
        if (page) {
            queryExec = queryExec
                .sort(sortOrder)
                .skip((currentPage - 1) * itemsPerPage)
                .limit(itemsPerPage);
        }
        else {
            queryExec = queryExec.sort(sortOrder);
        }
        // Handle population logic
        if (populatePath) {
            if (Array.isArray(populatePath)) {
                populatePath.forEach((path, index) => {
                    const fields = Array.isArray(selectFields) ? selectFields[index] : selectFields;
                    queryExec = queryExec.populate({
                        path: path,
                        select: fields
                    });
                });
            }
            else {
                if (selectFields) {
                    queryExec = queryExec.populate({
                        path: populatePath,
                        select: selectFields
                    });
                }
                else {
                    queryExec = queryExec.populate(populatePath);
                }
            }
        }
        const [result, totalItems] = yield Promise.all([
            queryExec,
            collectionModel.countDocuments(query)
        ]);
        let responseData = {
            success: true,
            data: result,
        };
        if (page) {
            responseData = {
                success: true,
                data: result,
                pagination: {
                    currentPage,
                    itemsPerPage,
                    totalItems,
                    totalPages: Math.ceil(totalItems / itemsPerPage)
                }
            };
        }
        return responseData;
    }
    catch (error) {
        throw new Error(error.message || "An error occurred while executing the query");
    }
});
exports.default = Queries;
