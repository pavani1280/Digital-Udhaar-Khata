import Customer from "../models/Customer.js";
import Transaction from "../models/Transaction.js";

// Create a new Customer profile
export const createCustomer = async (req, res, next) => {
  try {
    const { name, phone, address, reminderDate } = req.body;
    const shopkeeperId = req.user._id;

    // Check if customer with same phone exists for this shopkeeper
    const customerExists = await Customer.findOne({ phone, shopkeeperId });
    if (customerExists) {
      return res.status(400).json({ message: "Customer with this phone number already exists in your records" });
    }

    const customer = await Customer.create({
      shopkeeperId,
      name,
      phone,
      address,
      balance: 0,
      reminderDate: reminderDate ? new Date(reminderDate) : null
    });

    res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};

// Retrieve all customers for logged-in shopkeeper
export const getCustomers = async (req, res, next) => {
  try {
    const shopkeeperId = req.user._id;
    const { search, sortBy } = req.query;

    let query = { shopkeeperId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    let sortOptions = { name: 1 }; // default sorting A-Z
    if (sortBy === "balance-desc") {
      sortOptions = { balance: -1 };
    } else if (sortBy === "balance-asc") {
      sortOptions = { balance: 1 };
    } else if (sortBy === "newest") {
      sortOptions = { createdAt: -1 };
    }

    const customers = await Customer.find(query).sort(sortOptions);
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

// Get single customer profile details
export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shopkeeperId = req.user._id;

    const customer = await Customer.findOne({ _id: id, shopkeeperId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    next(error);
  }
};

// Update Customer profile
export const updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shopkeeperId = req.user._id;
    const { name, phone, address, reminderDate } = req.body;

    const customer = await Customer.findOne({ _id: id, shopkeeperId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if phone number is updated and conflicts with existing phone number for this shopkeeper
    if (phone && phone !== customer.phone) {
      const phoneExists = await Customer.findOne({ phone, shopkeeperId });
      if (phoneExists) {
        return res.status(400).json({ message: "Another customer has this phone number" });
      }
    }

    customer.name = name || customer.name;
    customer.phone = phone || customer.phone;
    customer.address = address || customer.address;
    customer.reminderDate = reminderDate ? new Date(reminderDate) : null;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (error) {
    next(error);
  }
};

// Delete Customer profile & associated transactions
export const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const shopkeeperId = req.user._id;

    const customer = await Customer.findOneAndDelete({ _id: id, shopkeeperId });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Delete all ledger items for this customer
    await Transaction.deleteMany({ customerId: id, shopkeeperId });

    res.json({ message: "Customer and all associated transactions deleted successfully" });
  } catch (error) {
    next(error);
  }
};
