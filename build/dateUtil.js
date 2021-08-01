"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementDate = exports.copyDate = exports.formatDate = void 0;
const formatDate = (dateObject) => {
    return dateObject.toISOString().slice(0, 10);
};
exports.formatDate = formatDate;
const copyDate = (date) => {
    return new Date(date.getTime());
};
exports.copyDate = copyDate;
const incrementDate = ({ dateObject, incrementBy: increment = 1, }) => {
    dateObject.setDate(dateObject.getDate() + increment);
};
exports.incrementDate = incrementDate;
//# sourceMappingURL=dateUtil.js.map