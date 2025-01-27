"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProcessedOrders = exports.getUserProcessingOrders = exports.handlePaymentWebhook = exports.createPaymentSession = exports.deleteOrder = exports.allOrders = exports.getOrder = exports.userOrders = exports.placeOrder = exports.getOrderSummary = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const stripe_1 = __importDefault(require("stripe"));
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
// Stripe configuration
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
});
// PayPal configuration
const environment = new checkout_server_sdk_1.default.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const client = new checkout_server_sdk_1.default.core.PayPalHttpClient(environment);
// 1. Get Order Summary
const getOrderSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items, shippingAddress } = req.body;
        if (!items || items.length === 0) {
            res.status(400).json({ message: "No items provided for order." });
            return;
        }
        if (!shippingAddress) {
            res.status(400).json({ message: "Shipping address is required." });
            return;
        }
        let itemsPrice = 0;
        let shippingPrice = 0;
        const orderItems = yield Promise.all(items.map((_a) => __awaiter(void 0, [_a], void 0, function* ({ productId, quantity, }) {
            const product = yield productModel_1.default.findById(productId).lean();
            if (!product)
                throw new Error(`Product not found: ${productId}`);
            if (product.stock < quantity)
                throw new Error(`Insufficient stock for product: ${product.name}`);
            const itemTotalPrice = product.price * quantity;
            const itemShippingPrice = product.shippingPrice * quantity;
            itemsPrice += itemTotalPrice;
            shippingPrice += itemShippingPrice;
            return {
                product: product._id,
                quantity,
                price: product.price,
                shippingPrice: product.shippingPrice,
            };
        })));
        const totalAmount = itemsPrice + shippingPrice;
        res.status(200).json({
            items: orderItems,
            shippingAddress,
            itemsPrice,
            shippingPrice,
            totalAmount,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getOrderSummary = getOrderSummary;
// 2. Place an Order
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Ensure `userId` is defined
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const username = (_b = req.user) === null || _b === void 0 ? void 0 : _b.name;
        if (!userId || !username) {
            res.status(400).json({ message: "User not authenticated." });
            return;
        }
        const { items, shippingAddress } = req.body;
        if (!items || items.length === 0) {
            res.status(400).json({ message: "Order must contain items." });
            return;
        }
        if (!shippingAddress) {
            res.status(400).json({ message: "Shipping address is required." });
            return;
        }
        let itemsPrice = 0;
        let shippingPrice = 0;
        const orderItems = yield Promise.all(items.map((_a) => __awaiter(void 0, [_a], void 0, function* ({ _id, quantity }) {
            const product = yield productModel_1.default.findById(_id);
            if (!product) {
                throw new Error(`Product not found: ${_id}`);
            }
            if (product.stock < quantity) {
                throw new Error(`Insufficient stock for product: ${product.name}`);
            }
            // Initialize `buyers` array if it doesn't exist
            if (!product.buyers) {
                product.buyers = [];
            }
            // Check if the user already exists in the buyers list
            const existingBuyerIndex = product.buyers.findIndex((buyer) => buyer._id.toString() === userId.toString());
            if (existingBuyerIndex >= 0) {
                product.buyers[existingBuyerIndex].quantity += quantity;
                product.buyers[existingBuyerIndex].status = "Pending";
            }
            else {
                product.buyers.push({
                    _id: userId,
                    username,
                    quantity,
                    status: "Pending",
                });
            }
            // Save the updated product
            yield product.save();
            const itemTotalPrice = product.price * quantity;
            const itemShippingPrice = product.shippingPrice * quantity;
            itemsPrice += itemTotalPrice;
            shippingPrice += itemShippingPrice;
            return {
                _id: product._id,
                name: product.name,
                price: product.price,
                shippingPrice: product.shippingPrice,
                quantity,
                images: product.images,
            };
        })));
        const totalAmount = itemsPrice + shippingPrice;
        const order = new orderModel_1.default({
            user: userId,
            items: orderItems,
            shippingAddress,
            itemsPrice,
            shippingPrice,
            totalAmount,
            status: "Pending",
            paymentStatus: "Pending",
        });
        yield order.save();
        // Update product stock
        for (const { _id, quantity } of orderItems) {
            yield productModel_1.default.findByIdAndUpdate(_id, {
                $inc: { stock: -quantity, salesCount: quantity },
            });
        }
        // Clear user's cart
        const user = yield userModel_1.default.findById(userId);
        if (user && user.cart) {
            user.cart = user.cart.filter((cartItem) => !orderItems.some((orderItem) => orderItem._id.toString() === cartItem._id.toString()));
            yield user.save();
        }
        res
            .status(201)
            .json({ message: "Order placed successfully.", orderId: order._id });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
exports.placeOrder = placeOrder;
// 3. Get Orders for a Specific User
const userOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const orders = yield orderModel_1.default.find({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            paymentStatus: { $in: ["Pending", "Failed"] },
        });
        res.status(200).json(orders);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
exports.userOrders = userOrders;
// 4. Get Order by ID
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orderModel_1.default.findById(req.params.orderId).populate("items.product");
        if (!order) {
            res.status(404).json({ message: "Order not found." });
            return;
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getOrder = getOrder;
// 5. Get All Orders (Admin Only)
const allOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderModel_1.default.find()
            .populate("user")
            .populate("items.product");
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.allOrders = allOrders;
// 6. Delete an Order
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            res.status(400).json({ message: "Invalid order ID." });
            return;
        }
        const order = yield orderModel_1.default.findById(orderId);
        if (!order) {
            res.status(404).json({ message: "Order not found." });
            return;
        }
        order.status = "Cancelled";
        for (const item of order.items) {
            const product = yield productModel_1.default.findById(item._id);
            if (product) {
                product.stock += item.quantity;
                product.salesCount -= item.quantity;
                if (product.buyers) {
                    const buyerIndex = product.buyers.findIndex((buyer) => buyer._id.toString() === order.user.toString());
                    if (buyerIndex !== -1) {
                        const buyerEntry = product.buyers[buyerIndex];
                        if (buyerEntry.quantity === item.quantity) {
                            product.buyers[buyerIndex].quantity = 0;
                            product.buyers[buyerIndex].status = "Cancelled";
                        }
                        else if (buyerEntry.quantity > item.quantity) {
                            product.buyers[buyerIndex].quantity -= item.quantity;
                        }
                    }
                }
                yield product.save();
            }
        }
        // Save the updated order with the new status
        yield order.save();
        res.status(200).json({ message: "Order cancelled successfully." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
exports.deleteOrder = deleteOrder;
//7. payment session
const createPaymentSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { orderIds, paymentMethod } = req.body;
    if (!orderIds || !Array.isArray(orderIds) || !orderIds.length) {
        res.status(400).json({ message: "Invalid or missing order IDs." });
        return;
    }
    if (!["stripe", "paypal"].includes(paymentMethod)) {
        res.status(400).json({ message: "Invalid payment method" });
        return;
    }
    try {
        const orders = yield orderModel_1.default.find({ _id: { $in: orderIds } });
        if (!orders.length) {
            res.status(404).json({ message: "Orders not found" });
            return;
        }
        const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
        if (paymentMethod === "stripe") {
            // Create a Stripe Checkout Session
            const session = yield stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                line_items: orders.flatMap((order) => order.items.map((item) => ({
                    price_data: {
                        currency: "usd",
                        product_data: { name: item.name },
                        unit_amount: item.price * 100,
                    },
                    quantity: item.quantity,
                }))),
                mode: "payment",
                success_url: `${clientUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${clientUrl}/payment-cancelled`,
                metadata: {
                    orderIds: orders.map((order) => { var _a; return (_a = order._id) === null || _a === void 0 ? void 0 : _a.toString(); }).join(","), // Convert to a comma-separated string
                },
            });
            res.status(200).json({ paymentUrl: session.url });
            return;
        }
        else if (paymentMethod === "paypal") {
            const request = new checkout_server_sdk_1.default.orders.OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody({
                intent: "CAPTURE",
                purchase_units: orders.map((order) => {
                    var _a;
                    return ({
                        reference_id: (_a = order._id) === null || _a === void 0 ? void 0 : _a.toString(),
                        amount: {
                            currency_code: "USD",
                            value: order.totalAmount.toFixed(2),
                        },
                    });
                }),
                application_context: {
                    return_url: `${clientUrl}/payment-success`,
                    cancel_url: `${clientUrl}/payment-cancelled`,
                },
            });
            const response = yield client.execute(request);
            if (response.result.status === "CREATED") {
                const approvalUrl = (_a = response.result.links.find((link) => link.rel === "approve")) === null || _a === void 0 ? void 0 : _a.href;
                if (approvalUrl) {
                    res.status(200).json({ paymentUrl: approvalUrl });
                }
                else {
                    res
                        .status(500)
                        .json({ message: "Failed to retrieve PayPal approval URL" });
                }
            }
            else {
                res.status(500).json({ message: "Failed to create PayPal order" });
            }
            return;
        }
        else {
            res.status(400).json({ message: "Invalid payment method" });
            return;
        }
    }
    catch (error) {
        console.error("Payment session error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createPaymentSession = createPaymentSession;
//8.payment webhook PayPal and stripe
const handlePaymentWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (req.headers["stripe-signature"]) {
        const stripeSignature = req.headers["stripe-signature"];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        try {
            let stripeEvent;
            try {
                stripeEvent = stripe.webhooks.constructEvent(req.body, stripeSignature, endpointSecret);
            }
            catch (err) {
                res
                    .status(400)
                    .send(`Stripe webhook signature verification failed: ${err.message}`);
                return;
            }
            switch (stripeEvent.type) {
                case "checkout.session.completed":
                    const session = stripeEvent.data.object;
                    const orderIds = (_a = session.metadata) === null || _a === void 0 ? void 0 : _a.orderIds;
                    if (!orderIds) {
                        res.status(400).send("Order IDs missing in metadata.");
                        return;
                    }
                    const orderIdArray = orderIds.split(",");
                    yield Promise.all(orderIdArray.map((orderId) => __awaiter(void 0, void 0, void 0, function* () {
                        const order = yield orderModel_1.default.findById(orderId);
                        if (order) {
                            order.paymentStatus = "Completed";
                            order.status = "Processing";
                            yield order.save();
                        }
                    })));
                    res.status(200).send("Payment completed successfully.");
                    break;
                case "checkout.session.async_payment_failed":
                    const failedSession = stripeEvent.data.object;
                    const failedOrderIds = (_b = failedSession.metadata) === null || _b === void 0 ? void 0 : _b.orderIds;
                    if (!failedOrderIds) {
                        res.status(400).send("Order IDs missing in metadata.");
                        return;
                    }
                    // Split the comma-separated string into an array
                    const failedOrderIdArray = failedOrderIds.split(",");
                    for (const orderId of failedOrderIdArray) {
                        const failedOrder = yield orderModel_1.default.findById(orderId);
                        if (failedOrder) {
                            failedOrder.paymentStatus = "Failed";
                            yield failedOrder.save();
                        }
                    }
                    res.status(200).send("Payment failed.");
                    break;
                default:
                    res.status(200).send("Event not handled.");
                    break;
            }
            return;
        }
        catch (error) {
            console.error("Error processing Stripe webhook:", error);
            res.status(500).send("Internal server error");
            return;
        }
    }
    // PayPal Webhook Handling
    if (req.headers["paypal-transmission-id"]) {
        try {
            let event;
            try {
                event = JSON.parse(req.body.toString());
            }
            catch (error) {
                res.status(400).send("Invalid JSON payload.");
                return;
            }
            const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
            const PAYPAL_SECRET = process.env.PAYPAL_CLIENT_SECRET;
            const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;
            const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE;
            const authResponse = yield axios_1.default.post(`${PAYPAL_API_BASE}/v1/oauth2/token`, "grant_type=client_credentials", {
                auth: { username: PAYPAL_CLIENT_ID, password: PAYPAL_SECRET },
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            const accessToken = authResponse.data.access_token;
            const validatePayPalHeaders = (headers) => {
                return (headers["paypal-transmission-id"] &&
                    headers["paypal-transmission-sig"] &&
                    headers["paypal-auth-algo"] &&
                    headers["paypal-cert-url"]);
            };
            if (!validatePayPalHeaders(req.headers)) {
                res.status(400).send("Invalid PayPal headers.");
                return;
            }
            const verificationResponse = yield axios_1.default.post(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
                auth_algo: req.headers["paypal-auth-algo"],
                cert_url: req.headers["paypal-cert-url"],
                transmission_id: req.headers["paypal-transmission-id"],
                transmission_sig: req.headers["paypal-transmission-sig"],
                transmission_time: req.headers["paypal-transmission-time"],
                webhook_id: PAYPAL_WEBHOOK_ID,
                webhook_event: event,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (verificationResponse.data.verification_status !== "SUCCESS") {
                res.status(400).send("Invalid PayPal webhook signature.");
                return;
            }
            const capturePayment = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
                var _a, _b, _c;
                const request = new checkout_server_sdk_1.default.orders.OrdersCaptureRequest(orderId);
                try {
                    const captureResponse = yield client.execute(request);
                    return captureResponse.result;
                }
                catch (error) {
                    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.statusCode) === 422 &&
                        ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.body) === null || _c === void 0 ? void 0 : _c.message) === "PAYMENT_ALREADY_DONE") {
                        return null;
                    }
                    throw new Error("Failed to capture payment");
                }
            });
            switch (event.event_type) {
                case "CHECKOUT.ORDER.APPROVED":
                    const purchaseUnits = event.resource.purchase_units;
                    if (!Array.isArray(purchaseUnits)) {
                        res.status(400).send("Invalid webhook payload.");
                        return;
                    }
                    try {
                        const captureResponse = yield capturePayment(event.resource.id);
                        if (captureResponse && captureResponse.status !== "COMPLETED") {
                            res.status(400).send("Payment capture failed.");
                            return;
                        }
                    }
                    catch (error) {
                        res.status(500).send("Payment capture error.");
                        return;
                    }
                    for (const unit of purchaseUnits) {
                        const orderId = unit.reference_id;
                        const order = yield orderModel_1.default.findById(orderId);
                        if (!order) {
                            console.error(`Order with ID ${orderId} not found.`);
                            continue;
                        }
                        if (order.paymentStatus === "Completed") {
                            continue;
                        }
                        order.paymentStatus = "Completed";
                        order.status = "Processing";
                        order.orderPaymentId = `PayPal,${event.resource.id}`;
                        yield order.save();
                    }
                    res.status(200).send("Order approved and processed.");
                    return;
                case "PAYMENT.CAPTURE.COMPLETED":
                    const orderId = (_c = event.resource.supplementary_data) === null || _c === void 0 ? void 0 : _c.related_ids.order_id;
                    if (!orderId) {
                        res.status(400).send("Order ID missing in supplementary data.");
                        return;
                    }
                    const orderPaymentId = `PayPal,${orderId}`;
                    const order = yield orderModel_1.default.findOne({ orderPaymentId });
                    if (!order)
                        return;
                    if ((order === null || order === void 0 ? void 0 : order.paymentStatus) === "Completed") {
                        res.status(200).send("Payment already processed.");
                        return;
                    }
                    order.status = "Processing";
                    order.paymentStatus = "Completed";
                    yield order.save();
                    res.status(200).send("Payment capture completed.");
                    return;
                case "PAYMENT.CAPTURE.DENIED":
                    const deniedOrderIdsMetadata = event.resource.supplementary_data.related_ids.order_id;
                    if (!deniedOrderIdsMetadata) {
                        res.status(400).send("Order IDs missing in metadata.");
                        return;
                    }
                    const deniedOrderIdArray = deniedOrderIdsMetadata.split(",");
                    for (const orderId of deniedOrderIdArray) {
                        const deniedOrder = yield orderModel_1.default.findById(orderId);
                        if (!deniedOrder) {
                            console.error(`Order with ID ${orderId} not found.`);
                            continue;
                        }
                        deniedOrder.paymentStatus = "Failed";
                        yield deniedOrder.save();
                    }
                    res.status(200).send("Payment capture denied.");
                    return;
                default:
                    res.status(200).send("Unhandled event type.");
                    return;
            }
        }
        catch (error) {
            res.status(500).send("Internal server error.");
            return;
        }
    }
    res.status(400).send("Invalid signature");
});
exports.handlePaymentWebhook = handlePaymentWebhook;
//9. Fetch processing orders for the logged-in user
const getUserProcessingOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized access." });
            return;
        }
        const orders = yield orderModel_1.default.find({
            user: userId,
            status: { $in: ["Pending", "Processing", "Shipped"] },
        }).sort({ "timestamps.placedAt": -1 });
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error fetching processing orders:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getUserProcessingOrders = getUserProcessingOrders;
//10. Fetch processed orders for the logged-in user
const getUserProcessedOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized access." });
            return;
        }
        const orders = yield orderModel_1.default.find({
            user: userId,
            status: { $in: ["Delivered", "Cancelled"] },
        }).sort({ "timestamps.deliveredAt": -1 });
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("Error fetching processed orders:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.getUserProcessedOrders = getUserProcessedOrders;
