"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMahallaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_mahalla_dto_1 = require("./create-mahalla.dto");
class UpdateMahallaDto extends (0, mapped_types_1.PartialType)(create_mahalla_dto_1.CreateMahallaDto) {
}
exports.UpdateMahallaDto = UpdateMahallaDto;
//# sourceMappingURL=update-mahalla.dto.js.map