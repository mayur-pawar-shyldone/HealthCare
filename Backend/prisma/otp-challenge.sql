CREATE TABLE IF NOT EXISTS otpchallenge (
  id VARCHAR(191) NOT NULL,
  mobile VARCHAR(191) NOT NULL,
  codeHash VARCHAR(64) NOT NULL,
  purpose VARCHAR(191) NOT NULL,
  fullName VARCHAR(191) NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  expiresAt DATETIME(3) NOT NULL,
  consumedAt DATETIME(3) NULL,
  createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  INDEX OtpChallenge_mobile_purpose_idx (mobile, purpose),
  INDEX OtpChallenge_createdAt_idx (createdAt)
);
