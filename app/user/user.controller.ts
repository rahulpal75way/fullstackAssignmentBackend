import axios from "axios";
import { type Request, type Response } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import verifyAppleToken from "verify-apple-id-token";
import { createResponse } from "../common/helper/response.hepler";
import { sendEmail } from "../common/services/email.service";
import {
  createUserTokens,
  decodeToken,
  isValidPassword,
  verifyRefreshToken,
  verifyToken,
} from "../common/services/passport-jwt.service";
import { ProviderType } from "./user.dto";
import { hashPassword } from "./user.schema";
import * as userService from "./user.service";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);
  res.send(createResponse(result, "User created sucssefully"));
});

export const inviteUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.createUser({
    ...req.body,
    role: "USER",
    active: false,
  });
  const { email } = req.body;
  const { refreshToken } = createUserTokens(result);
  await userService.editUser(result._id, { refreshToken });
  const url = `${process.env.FE_BASE_URL}/reset-password?code=${refreshToken}&type=invite`;
  console.log(url);
  sendEmail({
    to: email,
    subject: "Welcone to <app>",
    html: `<body to create profile> ${url}`,
  });
  res.send(createResponse(result, "User invited sucssefully"));
});

export const verifyInvitation = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;
    const { email, expired } = decodeToken(token);
    const user = await userService.getUserByEmail(email, {
      refreshToken: true,
      active: true,
    });

    if (!user || expired || token !== user.refreshToken) {
      throw createHttpError(400, { message: "Invitation is expired" });
    }

    if (user?.active) {
      throw createHttpError(400, {
        message: "Invitation is accepeted, Please login",
      });
    }

    if (user?.blocked) {
      throw createHttpError(400, { message: "User is blocked" });
    }
    const tokens = await createUserTokens(user);
    await userService.editUser(user._id, {
      password: await hashPassword(password),
      active: true,
      refreshToken: tokens.refreshToken,
    });
    res.send(createResponse(tokens, "User verified sucssefully"));
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;
    const { email, expired } = decodeToken(token);
    console.log({ email, expired });
    const user = await userService.getUserByEmail(email, {
      refreshToken: true,
      active: true,
    });

    if (!user || expired || token !== user.refreshToken) {
      throw createHttpError(400, { message: "Invitation is expired" });
    }

    if (!user?.active) {
      throw createHttpError(400, {
        message: "User is not active",
      });
    }

    if (user?.blocked) {
      throw createHttpError(400, { message: "User is blocked" });
    }
    await userService.editUser(user._id, {
      password: await hashPassword(password),
      refreshToken: "",
    });
    res.send(createResponse(null, "Password updated sucssefully"));
  }
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, password } = req.body;
    const user = await userService.getUserById(req.user?._id!, {
      refreshToken: true,
      active: true,
      password: true,
      provider: true,
    });

    if (!user) {
      throw createHttpError(400, { message: "Invalid user" });
    }

    if (user.provider === ProviderType.MANUAL) {
      const validPassword = await isValidPassword(
        currentPassword,
        user.password!
      );
      if (!validPassword) {
        throw createHttpError(400, {
          message: "Current password doesn't matched",
        });
      }
    }

    await userService.editUser(user._id, {
      password: await hashPassword(password),
      provider: ProviderType.MANUAL,
    });
    res.send(createResponse(null, "Password changed sucssefully"));
  }
);

export const requestResetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await userService.getUserByEmail(email, {
      active: true,
      blocked: true,
      email: true,
    });

    if (!user?.active) {
      throw createHttpError(400, {
        message: "User is not active",
      });
    }

    if (user?.blocked) {
      throw createHttpError(400, { message: "User is blocked" });
    }

    const tokens = createUserTokens(user);

    await userService.editUser(user._id, {
      refreshToken: tokens.refreshToken,
    });

    const url = `${process.env.FE_BASE_URL}/reset-password?code=${tokens.refreshToken}&type=reset-password`;
    console.log(url);

    sendEmail({
      to: email,
      subject: "Reset password",
      html: `<body to create profile> ${url}`,
    });
    res.send(createResponse(null, "Reset password link sent to your email."));
  }
);

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.updateUser(req.params.id, req.body);
  res.send(createResponse(result, "User updated sucssefully"));
});

export const editUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.editUser(req.params.id, req.body);
  res.send(createResponse(result, "User updated sucssefully"));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.deleteUser(req.params.id);
  res.send(createResponse(result, "User deleted sucssefully"));
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getUserById(req.params.id);
  res.send(createResponse(result));
});

export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
  const limit = req.query.limit
    ? parseInt(req.query.limit as string)
    : undefined;
  const result = await userService.getAllAdmins({}, { skip, limit });
  if (skip || limit) {
    const count = await userService.countItems();
    res.send(
      createResponse({
        count,
        users: result,
      })
    );
    return;
  }
  res.send(createResponse(result));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const tokens = createUserTokens(req.user!);
  await userService.editUser(req.user!._id, {
    refreshToken: tokens.refreshToken,
  });
  const user = await userService.getUserById(req.user!._id)
  res.send(createResponse({tokens, user}, "User Logged in successfully"));
});

export const getUserInfo = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.user?._id!);
  res.send(createResponse(user, "User Data Fetched Successfully"));
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  await userService.editUser(user._id, { refreshToken: "" });
  res.send(createResponse({ message: "User logout successfully!" }));
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken  } = req.body;
    const { email } = verifyRefreshToken(refreshToken);
    const user = await userService.getUserByEmail(email, {
      refreshToken: true,
      active: true,
      blocked: true,
      email: true,
      role: true,
    });
    if (!user || refreshToken !== user.refreshToken) {
      throw createHttpError({ message: "Invalid session" });
    }
    if (!user?.active) {
      throw createHttpError({ message: "User is not active" });
    }
    if (user?.blocked) {
      throw createHttpError({ message: "User is blocked" });
    }
    delete user.refreshToken;
    const tokens = createUserTokens(user);
    await userService.editUser(user._id, {
      refreshToken: tokens.refreshToken,
    });
    res.send(createResponse(tokens));
  }
);
