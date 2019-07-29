--Updated table on 07-Jan-2019
	CREATE TABLE usersData
(
	id integer PRIMARY KEY,
	userId varchar(100) NOT NULL COLLATE NOCASE,
	userName varchar(200)COLLATE NOCASE,
	emailId varchar(100) COLLATE NOCASE,
	phoneNumber varchar(100) COLLATE NOCASE,
	userRole varchar (100) NOT NULL COLLATE NOCASE,
	userscope varchar(100) NOT NULL COLLATE NOCASE,
	userPassword varchar(100) NOT NULL,
	isNewUser boolean 
	);

	-- Insert Query --
	INSERT INTO usersData (userId,userName,emailId,PhoneNumber,UserRole,scope,userPassword,isNewUser) values('Admin','Amritha','amritha@siemens.com','81025368','Admin','Admin','$2a$10$zExr4C2AlrxUY0/4p/x4PuztvGHO.2EUHTF5mv3KTgHQDiGudlB4u',1);
	--'$2a$10$zExr4C2AlrxUY0/4p/x4PuztvGHO.2EUHTF5mv3KTgHQDiGudlB4u' --123

-- table to store token infor for limiting user login
	CREATE TABLE usersTokenDetails
(
	id integer PRIMARY KEY,
	userId text NOT NULL COLLATE NOCASE,
	userName text COLLATE NOCASE,
	token text NOT NULL,
	loginTimeStamp Date NOT NULL
	);