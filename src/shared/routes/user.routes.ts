import { Router } from "express";
import multer from "multer";

import CreateUserService from "../../modules/users/services/CreateUserService";
import UpdateUserAvaterService from "../../modules/users/services/UpdateUserAvatarService";

import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import uploadConfig from "../../config/upload";

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post("/", async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();
  const user = await createUser.execute({
    name,
    email,
    password,
  });
  delete user.password;

  response.json(user);
});

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvaterService();
    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  }
);
export default usersRouter;
