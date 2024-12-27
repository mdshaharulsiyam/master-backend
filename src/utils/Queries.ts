const escapeRegex = (str: string): string => {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

interface QueryKeys {
    limit?: string;
    page?: string;
    sort?: string;
    order?: string;
    [key: string]: any;
}

interface SearchKeys {
    [key: string]: string;
}

interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

interface ResponseData<T> {
    success: boolean;
    data: T;
    pagination?: Pagination;
}

const Queries = async <T>(
    collectionModel: any,
    queryKeys: QueryKeys,
    searchKeys: SearchKeys,
    populatePath?: string | string[],
    selectFields?: string | string[],
    modelSelect?: string
): Promise<ResponseData<T>> => {
    try {
        const { limit, page, sort, order, ...filters } = queryKeys;
        let query: any = {};

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
        let sortOrder: any = {};
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
        } else {
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
            } else {
                if (selectFields) {
                    queryExec = queryExec.populate({
                        path: populatePath,
                        select: selectFields
                    });
                } else {
                    queryExec = queryExec.populate(populatePath);
                }
            }
        }

        const [result, totalItems] = await Promise.all([
            queryExec,
            collectionModel.countDocuments(query)
        ]);

        let responseData: ResponseData<T> = {
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

    } catch (error: any) {
        throw new Error(error.message || "An error occurred while executing the query");
    }
};

export default Queries;