export const apiSuccess = (res, data) => {
  return res.send({ data }).status(200);
};