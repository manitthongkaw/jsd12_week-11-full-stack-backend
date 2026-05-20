import bcrypt from "bcrypt";

async function hashPassword(string) {
  const hashedPassword = await bcrypt.hash(string, 12);
  return hashedPassword;
};

// console.log( await hashPassword("password123") );
// Output: $2b$12$9j2wBlr1LBKvIb2/obSEAeAaDFoncCMMY5CNT4AsJqmVuBpRijFLC

// Check a password:
// console.log( await bcrypt.compare("password123", "$2b$12$9j2wBlr1LBKvIb2/obSEAeAaDFoncCMMY5CNT4AsJqmVuBpRijFLC") );