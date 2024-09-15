const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtServices");

const createUser = (newUser) => {
	return new Promise(async (resolve, reject) => {
		const { email, password, confirmPassword } = newUser;
		try {
			const checkUser = await User.findOne({
				email: email,
			});
			if (checkUser !== null) {
				resolve({
					status: "ERR",
					message: "The email is already",
				});
			}
			const hash = bcrypt.hashSync(password, 10);
			const createdUser = await User.create({
				email,
				password: hash,
			});
			if (createdUser) {
				resolve({
					status: "ok",
					message: "success",
					data: createdUser,
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const loginUser = (userLogin) => {
	return new Promise(async (resolve, reject) => {
		const { email, password } = userLogin;
		try {
			const checkUser = await User.findOne({
				email: email,
			});
			if (checkUser === null) {
				resolve({
					status: "ERR",
					message: "The user is not defined",
				});
			}
			const comparePassword = bcrypt.compareSync(password, checkUser.password);

			if (!comparePassword) {
				resolve({
					status: "OK",
					message: "The password or user is incorrect",
				});
			}
			const access_token = await generalAccessToken({
				id: checkUser.id,
				isAdmin: checkUser.isAdmin,
			});
			const refresh_token = await generalRefreshToken({
				id: checkUser.id,
				isAdmin: checkUser.isAdmin,
			});
			resolve({
				status: "ok",
				message: "success",
				access_token,
				refresh_token,
			});
		} catch (e) {
			reject(e);
		}
	});
};

const updateUser = (id, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkUser = await User.findOne({ _id: id });
			if (checkUser === null) {
				resolve({
					status: "OK",
					message: "The user is not defined",
				});
			}

			const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
			resolve({
				status: "ok",
				message: "success",
				data: updatedUser,
			});
		} catch (e) {
			reject(e);
		}
	});
};

const deleteUser = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkUser = await User.findOne({ _id: id });
			if (checkUser === null) {
				resolve({
					status: "OK",
					message: "The user is not defined",
				});
			}

			await User.findByIdAndDelete(id);
			resolve({
				status: "ok",
				message: "delete user success",
			});
		} catch (e) {
			reject(e);
		}
	});
};

const deleteMany = (ids) => {
	return new Promise(async (resolve, reject) => {
		try {
			await User.deleteMany({ _id: ids });
			resolve({
				status: "ok",
				message: "delete ids success",
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getAllUser = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const allUser = await User.find();
			resolve({
				status: "ok",
				message: "success",
				data: allUser,
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getDetailsUser = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.findOne({ _id: id });
			if (user === null) {
				resolve({
					status: "OK",
					message: "The user is not defined",
				});
			}

			resolve({
				status: "ok",
				message: " success",
				data: user,
			});
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = {
	createUser,
	loginUser,
	updateUser,
	deleteUser,
	getAllUser,
	getDetailsUser,
	deleteMany,
};
