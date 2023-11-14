import path from 'path';

import bcrypt from 'bcrypt';

export const createHash = (password, salt) => {
    if (salt) {
      return bcrypt.hashSync(password, salt);
    } else {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }
  };
  
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = path.resolve();
const __dirname = path.dirname(__filename);

export default __dirname;
