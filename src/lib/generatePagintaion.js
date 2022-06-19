import { range } from "./range";

export const generatePagination = (currentPage, totalPages, maxItems) => {
    if (totalPages < 1 || maxItems < 6) {
        return [];
    }
    if (totalPages <= maxItems) {
        return range(1, totalPages)
            .map((index) => ({ type: 'page', value: index }));
    }

    const lastIndex = maxItems - 1;
    const endDelimiterIndex = lastIndex - 1;
    const middle = Math.floor(maxItems / 2);
    if (currentPage <= middle + 1) {
        const pagination = range(1, maxItems).map(index => ({ type: 'page', value: index }))
        pagination[endDelimiterIndex] = ({ type: 'delimeter' });
        pagination[lastIndex].value = totalPages;
        return pagination;
    }

    const isMaxItemsEven = maxItems % 2 === 0;
    let offset = isMaxItemsEven ? -1 : 0;
    if (currentPage + middle > totalPages) {
        offset += currentPage + middle - totalPages;
    }
    const pagination = range(currentPage - middle - offset, Math.min(currentPage + middle, totalPages))
        .map(index => ({ type: 'page', value: index }));
    pagination[0] = ({ type: 'page', value: 1 });
    pagination[1] = ({ type: 'delimeter' });
    pagination[lastIndex].value = totalPages;
    if (pagination[endDelimiterIndex].value !== totalPages - 1) {
        pagination[endDelimiterIndex] = ({ type: 'delimeter' });
    }
    return pagination;
};