const Product = require("../models/ProductModel");

const createProduct = (newProduct) => {
	return new Promise(async (resolve, reject) => {
		const { name, image, type, price, countInStock, rating, description, typeList, discount } =
			newProduct;
		try {
			const checkProduct = await Product.findOne({
				name: name,
			});
			if (checkProduct !== null) {
				resolve({
					status: "OK",
					message: "The name of product is already",
				});
			}
			const newProducts = await Product.create({
				name,
				image,
				type,
				price,
				countInStock: Number(countInStock),
				rating,
				description,
				typeList,
				quality: Number(discount),
			});
			if (newProducts) {
				resolve({
					status: "ok",
					message: "success",
					data: newProducts,
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const updateProduct = (id, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkProduct = await Product.findOne({ _id: id });

			if (!checkProduct) {
				return resolve({
					status: "ERR",
					message: "The product does not exist",
				});
			}

			const updatedProduct = await Product.findByIdAndUpdate(id, data, {
				new: true,
			});

			return resolve({
				status: "OK",
				message: "Product updated successfully",
				data: updatedProduct,
			});
		} catch (e) {
			return reject(e);
		}
	});
};

const deleteProduct = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkProduct = await Product.findOne({ _id: id });
			if (checkProduct === null) {
				resolve({
					status: "OK",
					message: "The Product is not defined",
				});
			}

			await Product.findByIdAndDelete(id);
			resolve({
				status: "ok",
				message: "delete Product success",
			});
		} catch (e) {
			reject(e);
		}
	});
};

const deleteManyProduct = (ids) => {
	return new Promise(async (resolve, reject) => {
		try {
			await Product.deleteMany({ _id: ids });
			resolve({
				status: "ok",
				message: "delete ids success",
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getDetailsProduct = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const newProducts = await Product.findOne({ _id: id });
			if (newProducts === null) {
				resolve({
					status: "OK",
					message: "The Product is not defined",
				});
			}

			resolve({
				status: "ok",
				message: " success",
				data: newProducts,
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getAllProduct = (limit, page, sort, filter) => {
	return new Promise(async (resolve, reject) => {
		try {
			const totalProducts = await Product.countDocuments();
			let allProduct = [];
			if (filter) {
				const label = filter[0];
				const allObjectFilter = await Product.find({
					[label]: { $regex: filter[1] },
				})
					.limit(limit)
					.skip(page * limit);
				resolve({
					status: "ok",
					message: "success",
					data: allObjectFilter,
					total: totalProducts,
					pageCurrent: Number(page + 1),
					totalPage: Math.ceil(totalProducts / limit),
				});
			}
			if (sort) {
				const objectSort = {};
				objectSort[sort[1]] = sort[0];
				const allProductSort = await Product.find()
					.limit(limit)
					.skip(page * limit)
					.sort(objectSort);
				resolve({
					status: "ok",
					message: "success",
					data: allProductSort,
					total: totalProducts,
					pageCurrent: Number(page + 1),
					totalPage: Math.ceil(totalProducts / limit),
				});
			}
			if (!limit) {
				allProduct = await Product.find();
			} else {
				allProduct = await Product.find()
					.limit(limit)
					.skip(page * limit);
			}
			resolve({
				status: "ok",
				message: "success",
				data: allProduct,
				total: totalProducts,
				pageCurrent: Number(page + 1),
				totalPage: Math.ceil(totalProducts / limit),
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getAllType = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const allType = await Product.distinct("typeList");
			resolve({
				status: "ok",
				message: "success",
				data: allType,
			});
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = {
	createProduct,
	updateProduct,
	getDetailsProduct,
	deleteProduct,
	deleteManyProduct,
	getAllProduct,
	getAllType,
};
