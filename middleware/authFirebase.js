export const verifyFirebaseToken = (req, res, next) => {
  req.user = {
    uid: 'DEV_USER',
    email: 'dev@example.com',
    name: 'Developer',
  };
  next();
};