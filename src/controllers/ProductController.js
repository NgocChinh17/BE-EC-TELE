const ProductServices = require("../services/ProductServices");

const createProduct = async (req, res) => {
	try {
		const { name, image, type, price, countInStock, rating, description, typeList, discount } =
			req.body;
		if (
			!name ||
			!image ||
			!type ||
			!price ||
			!countInStock ||
			!rating ||
			!typeList ||
			!discount ||
			!description
		) {
			return res.status(200).json({
				status: "ERR",
				message: "the input is require",
			});
		}
		const response = await ProductServices.createProduct(req.body);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const updateProduct = async (req, res) => {
	try {
		const productId = req.params.id;
		const data = req.body;

		if (!productId) {
			return res.status(400).json({
				status: "ERR",
				message: "ProductId is required",
			});
		}

		const response = await ProductServices.updateProduct(productId, data);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(500).json({
			status: "ERR",
			message: e.message || "Something went wrong",
		});
	}
};

const getDetailsProduct = async (req, res) => {
	try {
		const productId = req.params.id;
		if (!productId) {
			return res.status(200).json({
				status: "ERR",
				message: "the productId is required",
			});
		}
		const response = await ProductServices.getDetailsProduct(productId);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const deleteProduct = async (req, res) => {
	try {
		const productId = req.params.id;
		if (!productId) {
			return res.status(200).json({
				status: "ERR",
				message: "the productId is required",
			});
		}
		const response = await ProductServices.deleteProduct(productId);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const deleteMany = async (req, res) => {
	try {
		const ids = req.body.ids;
		if (!ids) {
			return res.status(200).json({
				status: "ERR",
				message: "the ids is required",
			});
		}
		const response = await ProductServices.deleteManyProduct(ids);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const getAllProduct = async (req, res) => {
	try {
		const { limit, page, sort, filter } = req.query;
		const response = await ProductServices.getAllProduct(
			Number(limit) || null,
			Number(page) || 0,
			sort,
			filter
		);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const getAllType = async (req, res) => {
	try {
		const response = await ProductServices.getAllType();
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

module.exports = {
	createProduct,
	updateProduct,
	getDetailsProduct,
	deleteProduct,
	deleteMany,
	getAllProduct,
	getAllType,
};
