"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let AuthController = class AuthController {
    async api42Callback(req, res) {
        const user = req.user;
        const userData = {
            name: user.displayName,
            avatarUrl: user.photos && user.photos[0].value,
        };
        const frontendUrl = "http://localhost:8080";
        res.redirect(`${frontendUrl}?name=${encodeURIComponent(userData.name)}&avatarUrl=${encodeURIComponent(userData.avatarUrl)}`);
    }
    api42Login() {
    }
};
__decorate([
    (0, common_1.Get)('api42/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('api42')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "api42Callback", null);
__decorate([
    (0, common_1.Get)('api42'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('api42')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "api42Login", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth')
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map