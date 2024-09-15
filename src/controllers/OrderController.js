const OrderServices = require("../services/OrderServices");

const createOrderProduct = async (req, res) => {
	try {
		const {
			paymentMethod,
			itemsPrice,
			shippingPrice,
			totalPrice,
			fullName,
			address,
			city,
			phone,
			isPaid,
			paiAt,
		} = req.body;
		if (
			(!paymentMethod ||
				!itemsPrice ||
				!totalPrice ||
				!fullName ||
				!address ||
				!city ||
				!phone ||
				isPaid,
			paiAt)
		) {
			return res.status(200).json({
				status: "ERR",
				message: "the input is require",
			});
		}
		const response = await OrderServices.createOrderProduct(req.body);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const getAllOrderDetails = async (req, res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res.status(200).json({
				status: "ERR",
				message: "the userId is required",
			});
		}
		const response = await OrderServices.getAllOrderDetails(userId);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const getDetailsOrder = async (req, res) => {
	try {
		const orderId = req.params.id;
		if (!orderId) {
			return res.status(200).json({
				status: "ERR",
				message: "the userId is required",
			});
		}
		const response = await OrderServices.getDetailsOrder(orderId);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const cancelOrder = async (req, res) => {
	try {
		const orderId = req.params.id;
		const data = req.body;
		if (!orderId) {
			return res.status(200).json({
				status: "ERR",
				message: "The userId is require",
			});
		}
		const response = await OrderServices.cancelOrder(orderId, data);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const getAllOrder = async (req, res) => {
	try {
		const data = await OrderServices.getAllOrder();
		return res.status(200).json(data);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

module.exports = {
	createOrderProduct,
	getAllOrderDetails,
	getDetailsOrder,
	cancelOrder,
	getAllOrder,
};
