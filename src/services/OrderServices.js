const Order = require("../models/OderProduct");
const Product = require("../models/ProductModel");

const createOrderProduct = async (newOrder) => {
	return new Promise(async (resolve, reject) => {
		const {
			orderItems,
			paymentMethod,
			itemsPrice,
			shippingPrice,
			totalPrice,
			fullName,
			address,
			city,
			phone,
			user,
			isPaid,
			paiAt,
		} = newOrder;
		try {
			const promises = orderItems.map(async (order) => {
				const productData = await Product.findOneAndUpdate(
					{
						_id: order.Product,
						countInStock: { $gte: order.amount },
					},
					{
						$inc: {
							countInStock: -order.amount,
							sold: +order.amount,
						},
					},
					{ new: true }
				);
				if (productData) {
					const createdOrder = await Order.create({
						orderItems,
						shippingAddress: {
							fullName,
							address,
							city,
							phone,
						},
						paymentMethod,
						itemsPrice,
						shippingPrice,
						totalPrice,
						user: user,
						isPaid,
						paiAt,
					});
					if (createdOrder) {
						return {
							status: "ok",
							message: "success",
						};
					}
				} else {
					return {
						status: "ok",
						message: "ERR",
						id: order.Product,
					};
				}
			});
			const results = await Promise.all(promises);
			const newData = results && results.filter((item) => item.id);
			if (newData.length) {
				resolve({
					status: "ERR",
					message: `Sản phẩm Với id ${newData.join(",")} không đủ hàng`,
				});
			}
			resolve({
				status: "ok",
				message: "success",
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getAllOrderDetails = async (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const order = await Order.find({ user: id });
			if (order === null) {
				resolve({
					status: "OK",
					message: "The order is not defined",
				});
			} else {
				resolve({
					status: "ok",
					message: "success",
					data: order,
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const getDetailsOrder = async (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const order = await Order.findById({ _id: id });
			if (order === null) {
				resolve({
					status: "OK",
					message: "The order is not defined",
				});
			} else {
				resolve({
					status: "ok",
					message: "success",
					data: order,
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const cancelOrder = async (id, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const promises = data.map(async (order) => {
				const productData = await Product.findOneAndUpdate(
					{
						_id: order.Product,
						sold: { $gte: order.amount },
					},

					{
						$inc: {
							countInStock: +order.amount,
							sold: -order.amount,
						},
					},
					{ new: true }
				);
				if (!productData) {
					return {
						status: "ERR",
						message: `Product with id ${order.Product} does not exist`,
					};
				}
			});
			await Promise.all(promises);
			const order = await Order.findByIdAndDelete(id);
			if (!order) {
				return resolve({
					status: "ERR",
					message: "The order is not found",
				});
			}
			resolve({
				status: "ok",
				message: "Order cancelled successfully",
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getAllOrder = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const allOrder = await Order.find();
			resolve({
				status: "ok",
				message: "success",
				data: allOrder,
			});
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = {
	createOrderProduct,
	getAllOrderDetails,
	getDetailsOrder,
	cancelOrder,
	getAllOrder,
};
