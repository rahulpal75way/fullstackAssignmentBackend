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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_dto_1 = require("./user.dto");
const Schema = mongoose_1.default.Schema;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield bcrypt_1.default.hash(password, 12);
    return hash;
});
exports.hashPassword = hashPassword;
const UserSchema = new Schema({
    name: { type: String },
    email: { type: String },
    active: { type: Boolean, required: false, default: true },
    role: {
        type: String,
        required: true,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
    password: { type: String, select: false },
    refreshToken: { type: String, required: false, default: "", select: false },
    blocked: { type: Boolean, default: false },
    blockReason: { type: String, default: "" },
    provider: {
        type: String,
        enum: Object.values(user_dto_1.ProviderType),
        default: user_dto_1.ProviderType.MANUAL,
    },
    facebookId: { type: String, select: false },
    image: { type: String },
    linkedinId: { type: String, select: false },
}, { timestamps: true });
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.password) {
            this.password = yield (0, exports.hashPassword)(this.password);
        }
        next();
    });
});
exports.default = mongoose_1.default.model("user", UserSchema);
