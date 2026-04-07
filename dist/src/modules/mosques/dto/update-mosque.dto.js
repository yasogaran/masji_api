"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMosqueDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_mosque_dto_1 = require("./create-mosque.dto");
class UpdateMosqueDto extends (0, mapped_types_1.PartialType)(create_mosque_dto_1.CreateMosqueDto) {
}
exports.UpdateMosqueDto = UpdateMosqueDto;
//# sourceMappingURL=update-mosque.dto.js.map