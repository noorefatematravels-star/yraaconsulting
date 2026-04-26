import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB
const db = new Database('app.db', { verbose: console.log });
db.pragma('journal_mode = WAL');

// Setup DB schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    role TEXT CHECK(role IN ('customer', 'admin', 'agent')) DEFAULT 'customer',
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    pricing_options TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_id TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    service_id INTEGER,
    amount REAL,
    category_selection TEXT,
    status TEXT DEFAULT 'Order Received',
    payment_status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(service_id) REFERENCES services(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    amount REAL,
    gateway_txn_id TEXT,
    method TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  );

  CREATE TABLE IF NOT EXISTS order_status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    status TEXT,
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  );
`);

try {
  db.exec("ALTER TABLE users ADD COLUMN phone TEXT;");
} catch (e) {
  // Ignore if column already exists
}

try {
  db.exec("ALTER TABLE users ADD COLUMN permissions TEXT DEFAULT '[]';");
} catch (e) {
  // Ignore if column already exists
}

try {
  db.exec("ALTER TABLE services ADD COLUMN image_url TEXT;");
} catch (e) {
  // Ignore if column already exists
}

try {
  db.exec("ALTER TABLE services ADD COLUMN pricing_options TEXT;");
} catch(e) {
  // Ignore
}
try {
  db.exec("ALTER TABLE orders ADD COLUMN amount REAL;");
  db.exec("ALTER TABLE orders ADD COLUMN category_selection TEXT;");
} catch(e) {
  // Ignore
}

// Seed initial services
const seedServices = db.prepare('SELECT count(*) as count FROM services').get() as { count: number };
if (seedServices.count === 0) {
  const insertService = db.prepare('INSERT INTO services (name, description, price) VALUES (?, ?, ?)');
  const defaultServices = [
    ['Trade License New', 'Get a new trade license easily.', 5000],
    ['Trade License Renewal', 'Renew your existing trade license.', 2500],
    ['RJSC Registration', 'Register your company with RJSC.', 15000],
    ['VAT Registration', 'Obtain your Business Identification Number.', 3000],
    ['Income Tax Return', 'File your personal or corporate income tax.', 4000],
    ['TIN Certificate', 'Generate a new e-TIN certificate.', 1000]
  ];
  const insertMany = db.transaction((services) => {
    for (const s of services) insertService.run(s);
  });
  insertMany(defaultServices);
}

const commercialImportOptions = JSON.stringify({
  "product_id": 13202,
  "map": {
    "Commercial Import License": {
      "Import Limit (5 Lac )": [{ "variation": "5 working days (Approx)", "base_price": "12000", "service_charge": "4000", "types": [] }],
      "Import Limit (25 Lac )": [{ "variation": "5 working days (Approx)", "base_price": "18000", "service_charge": "4000", "types": [] }],
      "Import Limit (50 Lac )": [{ "variation": "5 working days (Approx)", "base_price": "36000", "service_charge": "4000", "types": [] }],
      "Import Limit (1 Crore)": [{ "variation": "5 working days (Approx)", "base_price": "56000", "service_charge": "4000", "types": [] }],
      "Import Limit (5 Crore)": [{ "variation": "5 working days (Approx)", "base_price": "70000", "service_charge": "5000", "types": [] }],
      "Import Limit (20 Crore)": [{ "variation": "10 working days (Approx)", "base_price": "81000", "service_charge": "6000", "types": [] }],
      "Import Limit (50 Crore)": [{ "variation": "10 working days (Approx)", "base_price": "93000", "service_charge": "7000", "types": [] }],
      "Import Limit (Unlimited)": [{ "variation": "10 working days (Approx)", "base_price": "110000", "service_charge": "10000", "types": [] }]
    }
  },
  "labels": {
    "label_category": "Service Name",
    "label_location": "Amount Limit",
    "label_variation": "Delivery Timeline",
    "total_title": "Total service price",
    "approx_title": "Approx. Delivery Time"
  }
});

const tradeLicenseOptions = JSON.stringify({
  "product_id": 12532,
  "map": {
    "Trade Licence": {
      "Dhaka North City corporation": [
        { "variation": "Proprietorship", "base_price": "5000", "service_charge": "1500", "types": [{ "name": "General Business", "price": "1000" }, { "name": "Pharmacy", "price": "2500" }, { "name": "Restaurant", "price": "3000" }] },
        { "variation": "Limited Company", "base_price": "5000", "service_charge": "1500", "types": [{ "name": "General Business", "price": "2000" }] }
      ],
      "Dhaka South City corporation": [
        { "variation": "Proprietorship", "base_price": "5000", "service_charge": "1500", "types": [{ "name": "General Business", "price": "1000" }] }
      ]
    }
  },
  "labels": {
    "label_category": "Select Service Name",
    "label_location": "Select Your Business Location",
    "label_variation": "Select Your Business Nature",
    "label_types": "Select Your Business Category",
    "total_title": "Total service price"
  }
});

const limitedCompanyOptions = JSON.stringify({
  "product_id": 12959,
  "map": {
    "Limited Company": {
      "Private Limited Company": [
        { "variation": "Authorized Capital 10,00,000", "base_price": "25000", "service_charge": "0", "types": [] },
        { "variation": "Authorized Capital 40,00,000", "base_price": "28000", "service_charge": "0", "types": [] },
        { "variation": "Authorized Capital 50,00,000", "base_price": "60000", "service_charge": "0", "types": [] },
        { "variation": "Authorized Capital 1,00,00,000", "base_price": "68000", "service_charge": "0", "types": [] }
      ]
    }
  },
  "labels": {
    "label_category": "Service Name",
    "label_location": "Category",
    "label_variation": "Authorised Capital",
    "total_title": "Total service price"
  }
});

const vatRegistrationOptions = JSON.stringify({
  "product_id": 13153,
  "map": {
    "VAT Registration": {
      "New Vat Registration": [
        { "variation": "5 working days (Approx)", "base_price": "5000", "service_charge": "0", "types": [] },
        { "variation": "15 working days (Approx)", "base_price": "4000", "service_charge": "0", "types": [] },
        { "variation": "30 working days (Approx)", "base_price": "3000", "service_charge": "0", "types": [] }
      ]
    }
  },
  "labels": {
    "label_category": "Service Name",
    "label_location": "Vat Registration Category",
    "label_variation": "Delivery Timeline",
    "total_title": "Total service price"
  }
});

const ensureServices = [
    ['Foundation Registration', 'Complete registration support for foundations in Bangladesh including proper documentation and legal compliance.', 25000, 'https://segunbagicha.com/wp-content/uploads/2025/08/24-1024x384.webp', null],
    ['Partnership Firm Registration', 'Register your partnership firm quickly with legally sound agreements and full RJSC compliance.', 15000, 'https://segunbagicha.com/wp-content/uploads/2025/08/22-1024x384.webp', null],
    ['New Trade License', 'Get a new trade license issued directly from the appropriate city corporation or union parishad.', 5000, 'https://segunbagicha.com/wp-content/uploads/2025/08/01-1024x384.webp', tradeLicenseOptions],
    ['NGO Registration', 'Navigate the complexities of creating a non-governmental organization (NGO) with our end-to-end support.', 30000, 'https://segunbagicha.com/wp-content/uploads/2025/08/25-1024x384.webp', null],
    ['Commercial Import License (IRC)', 'Obtaining a Commercial Import License (IRC) requires a clear understanding of import regulations and compliance requirements. We make the process simple, fast, and stress-free.', 12000, 'https://segunbagicha.com/wp-content/uploads/2025/08/31-1024x384.webp', commercialImportOptions],
    ['Industrial Import License Recommendation', 'Get essential recommendations for your industrial operations to secure your import licensing smoothly.', 18000, 'https://segunbagicha.com/wp-content/uploads/2025/08/27-1024x386.webp', null],
    ['Fire License', 'Ensure workplace safety and legal operation with a Fire License approved by the Fire Service and Civil Defense.', 10000, 'https://segunbagicha.com/wp-content/uploads/2025/08/40-1024x385.webp', null],
    ['Increase Import License Limit', 'Upgrade your IRC limit seamlessly to expand your import volumes and meet growing business demands.', 12000, 'https://segunbagicha.com/wp-content/uploads/2025/08/39-1024x384.webp', null],
    ['Company Audit Report Service', 'The Company Audit Report Service ensures that every limited company in Bangladesh prepares and submits an annual audit report certified by a Chartered Accountant.', 46000, 'https://segunbagicha.com/wp-content/uploads/2025/08/19-1024x384.webp', JSON.stringify({ "map": { "Company Audit Report": { "Company Audit Report Yearly": [{ "variation": "10 working days (Approx)", "base_price": "46000", "service_charge": "0", "types": [] }] } }, "labels": { "label_category": "Service Name", "label_location": "Category", "label_variation": "Delivery Timeline", "total_title": "Total service price" } })],
    ['Export License (ERC)', 'An Export Registration Certificate in Bangladesh is the primary requirement to start exporting legally today.', 15000, 'https://segunbagicha.com/wp-content/uploads/2025/08/34-1024x384.webp', null],
    ['Company Name Clearance', 'Secure your business identity with fast and reliable name clearance expertly handled through RJSC.', 2000, 'https://segunbagicha.com/wp-content/uploads/2025/08/20-1024x384.webp', null],
    ['Import License (IRC) Renewal', 'Annual renewal processing for your existing Import Registration Certificate to maintain active import status.', 8000, 'https://segunbagicha.com/wp-content/uploads/2025/08/37-1024x384.webp', null],
    ['One Person Company (OPC) Registration', 'One Person Company (OPC) registration in Bangladesh makes starting a business alone easier than ever.', 20000, 'https://segunbagicha.com/wp-content/uploads/2025/08/21-1024x384.webp', null],
    ['BIDA Registration', 'Registration with the Bangladesh Investment Development Authority, a mandatory requirement for foreign investors.', 12000, 'https://segunbagicha.com/wp-content/uploads/2025/08/26-1024x384.webp', null],
    ['Export License (ERC) Renewal', 'Hassle-free yearly renewal of your Export Registration Certificate to avoid any shipping interruptions.', 8000, 'https://segunbagicha.com/wp-content/uploads/2025/08/36-1024x384.webp', null],
    ['Industrial Import License (IRC)', 'Acquire an industrial IRC to import raw materials and machinery required for your manufacturing plant.', 20000, 'https://segunbagicha.com/wp-content/uploads/2025/08/33-1024x384.webp', null],
    ['Membership Certificate', 'Obtain necessary chamber of commerce or association membership certificates required for business validity.', 10000, 'https://segunbagicha.com/wp-content/uploads/2025/08/29-1024x384.webp', null],
    ['VAT Registration', 'Obtain your Business Identification Number (BIN) to comply with VAT regulations and conduct business legally.', 5000, 'https://segunbagicha.com/wp-content/uploads/2025/08/VAT-1024x384.webp', vatRegistrationOptions],
    ['Trademark Registration', 'Protect your brand identity and intellectual property with our trademark registration services.', 10000, 'https://segunbagicha.com/wp-content/uploads/2025/08/Trademark-1024x384.webp', JSON.stringify({ "map": { "Trademark Application": { "Classes 1-34": [{ "variation": "2 working days (Approx)", "base_price": "5000", "service_charge": "5000", "types": [] }], "Classes 35-45": [{ "variation": "2 working days (Approx)", "base_price": "5000", "service_charge": "5000", "types": [] }] } }, "labels": { "label_category": "Service Name", "label_location": "Trademark Classes", "label_variation": "Delivery Timeline", "total_title": "Total service price" } })],
    ['Limited Company Registration', 'Register your Private Limited Company with ease through our expert consultation and RJSC filings.', 25000, 'https://segunbagicha.com/wp-content/uploads/2025/08/Company-1024x384.webp', limitedCompanyOptions]
];
for (const s of ensureServices) {
    const existing = db.prepare('SELECT id FROM services WHERE name = ?').get(s[0]);
    if (!existing) {
        db.prepare('INSERT INTO services (name, description, price, image_url, pricing_options) VALUES (?, ?, ?, ?, ?)').run(s[0], s[1], s[2], s[3], s[4]);
    } else {
        // Update existing ones just in case to have the image and correct prices
        db.prepare('UPDATE services SET price = ?, image_url = ?, description = ?, pricing_options = ? WHERE name = ?').run(s[2], s[3], s[1], s[4], s[0]);
    }
}


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API ROUTES
  
  // Create Order API
  app.post("/api/orders", (req, res) => {
    try {
      const { name, email, phone, serviceId, amount, categorySelection } = req.body;
      
      let user = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as any;
      if (!user) {
        const insertUser = db.prepare('INSERT INTO users (name, email, phone) VALUES (?, ?, ?)');
        const result = insertUser.run(name, email, phone);
        user = { id: result.lastInsertRowid };
      }

      // Generate tracking ID: YRAA-YYYY-XXXXX
      const year = new Date().getFullYear();
      const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase(); // ~6 chars
      const trackingId = `YRAA-${year}-${randomStr}`;

      const insertOrder = db.prepare('INSERT INTO orders (tracking_id, user_id, service_id, amount, category_selection) VALUES (?, ?, ?, ?, ?)');
      const orderResult = insertOrder.run(trackingId, user.id, serviceId, amount, categorySelection);
      
      const insertHistory = db.prepare('INSERT INTO order_status_history (order_id, status, note) VALUES (?, ?, ?)');
      insertHistory.run(orderResult.lastInsertRowid, 'Order Received', 'Order placed successfully. Waiting for agent assignment.');

      res.status(201).json({ success: true, trackingId, orderId: orderResult.lastInsertRowid });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Track Order API
  app.get("/api/orders/:trackingId", (req, res) => {
    try {
      const { trackingId } = req.params;
      const order = db.prepare(`
        SELECT o.id, o.tracking_id, o.status, o.payment_status, o.amount, o.category_selection, s.name as service_name, s.price as base_price
        FROM orders o
        JOIN services s ON o.service_id = s.id
        WHERE o.tracking_id = ?
      `).get(trackingId) as any;

      if (!order) return res.status(404).json({ error: "Order not found" });

      const price = order.amount !== null ? order.amount : order.base_price;
      order.price = price;

      const history = db.prepare('SELECT status, created_at, note FROM order_status_history WHERE order_id = ? ORDER BY created_at DESC').all(order.id);
      
      res.json({ order, history });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Payment Callback API
  app.post("/api/payments/callback", (req, res) => {
    try {
      const { trackingId, gatewayTxnId, method, status } = req.body;
      
      const order = db.prepare('SELECT id, payment_status, amount FROM orders WHERE tracking_id = ?').get(trackingId) as any;
      if (!order) return res.status(404).json({ error: "Order not found" });

      const service = db.prepare('SELECT price FROM services WHERE id = (SELECT service_id FROM orders WHERE id = ?)').get(order.id) as any;
      const amountToPay = order.amount !== null ? order.amount : service.price;

      const insertPayment = db.prepare('INSERT INTO payments (order_id, amount, gateway_txn_id, method, status) VALUES (?, ?, ?, ?, ?)');
      insertPayment.run(order.id, amountToPay, gatewayTxnId, method, status);

      if (status === 'success') {
        db.prepare('UPDATE orders SET payment_status = ? WHERE id = ?').run('paid', order.id);
      }

      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Payment processing failed" });
    }
  });

  // Get Services
  app.get("/api/services", (req, res) => {
    const services = db.prepare('SELECT * FROM services').all();
    const parsedServices = services.map((s: any) => ({
      ...s,
      pricing_options: s.pricing_options ? JSON.parse(s.pricing_options) : null
    }));
    res.json({ services: parsedServices });
  });

  // User Profile
  app.get("/api/orders/:trackingId/user", (req, res) => {
    try {
      const { trackingId } = req.params;
      const order = db.prepare('SELECT user_id FROM orders WHERE tracking_id = ?').get(trackingId) as any;
      if (!order) return res.status(404).json({ error: "Order not found" });

      const user = db.prepare('SELECT id, name, email, phone FROM users WHERE id = ?').get(order.user_id);
      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.put("/api/orders/:trackingId/user", (req, res) => {
    try {
      const { trackingId } = req.params;
      const { name, email, phone } = req.body;
      const order = db.prepare('SELECT user_id FROM orders WHERE tracking_id = ?').get(trackingId) as any;
      if (!order) return res.status(404).json({ error: "Order not found" });

      const updateUser = db.prepare('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?');
      updateUser.run(name, email, phone, order.user_id);
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Update failed" });
    }
  });

  // Payments History
  app.get("/api/orders/:trackingId/payments", (req, res) => {
    try {
      const { trackingId } = req.params;
      const payments = db.prepare(`
        SELECT p.* 
        FROM payments p
        JOIN orders o ON p.order_id = o.id
        WHERE o.tracking_id = ?
        ORDER BY p.created_at DESC
      `).all(trackingId);
      res.json({ payments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Admin: Get all orders
  app.get("/api/admin/orders", (req, res) => {
    try {
      const orders = db.prepare(`
        SELECT o.*, u.name as user_name, u.email as user_email, s.name as service_name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN services s ON o.service_id = s.id
        ORDER BY o.created_at DESC
      `).all();
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Admin: Update order status
  app.put("/api/admin/orders/:id/status", (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
      db.prepare('INSERT INTO order_status_history (order_id, status) VALUES (?, ?)').run(id, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  // Admin: Get all users
  app.get("/api/admin/users", (req, res) => {
    try {
      const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Admin: Update user role and permissions
  app.put("/api/admin/users/:id/access", (req, res) => {
    try {
      const { id } = req.params;
      const { role, permissions } = req.body;
      db.prepare('UPDATE users SET role = ?, permissions = ? WHERE id = ?').run(role, JSON.stringify(permissions || []), id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update access" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
