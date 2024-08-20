ALTER TABLE course CHANGE sessions sessions INT(11) NOT NULL;
UPDATE user SET username = CONCAT(username, '@gmail.com') WHERE id != 1;