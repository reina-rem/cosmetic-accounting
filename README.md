# Cosmetic Accounting
This project was developed as a test assignment for the Junior Backend NodeJS Developer position. It demonstrates my ability to create a functional eCommerce backend API as a CRM+ERP system for a fictional cosmetics manufacturing company. In this project, only the MVP backend functionality was developed, without the use of external systems or client applications.

## Live Demo 
You can view the live demo of the application here: __[Live Demo]__
Link to documentation: __[Docs]__

Administrator account to test the app:
- email: johndoe@example.com
- password: securepassword123

## Technologies Used
- TypeScript (v5.1.3)
- NodeJS (v20.18.1)
- NestJS (v10.4.8)
- TypeORM (v0.3.20)
- PostgreSQL (v15.10)

## Functionality
### Roles
- Owner
  - Sees all information about the company
  - Manages the employee list

- Manager
  - Manages the warehouse
  - Records expenses
  - Records purchased goods
  - Writes off the defective products

- Consultant
  - Sees the full product catalog, complete list of orders, and registered customers
  - Records orders received via social media
  - Sets delivery dates for completed orders
  - Generates invoices for payment
  - Edits private notes on customers
  - Cancels orders upon customer request

- Manufacturer
  - Sees the warehouse status
  - Views new orders for production
  - Records replenishment of produced products
  - Updates order readiness status
  - Writes off defective products

- Courier
  - Sees the list of orders ready for delivery
  - Marks delivered orders as completed

- Customer
  - Places an order
  - Receives a notification when the order is ready to specify a desired delivery date
  - Manages account data

### Authorization
- A user can have multiple roles
- Customers must register in order to place orders independently
- Employees are registered by the owner
- Employees can register as customers to place orders with a discount
- Customers can completely delete their accounts along with personal data
- The owner can delete the authorization data for employees, but the employee's account remains in the database

### Order Status
- Pending – When the customer or consultant creates an order; once the payment confirmation field is filled, the order becomes available for the manufacturer
- Ready – When the manufacturer has prepared the order; once the delivery date is set, the order becomes available for the courier
- Completed – When the courier has delivered the order
- Cancelled – When the consultant cancels the order

### Product Availability in the Warehouse
- inStock – When the product has been produced but not yet ordered (e.g., when an order was canceled or when a batch of products was produced in advance)
- reserved – When an order has been created, but the order is not yet in the "ready" status

## Cool Features
### Application
- Swagger docs, including automatically populated roles via a custom decorator Roles
- Transactions to ensure data consistency
- Project structure divided into modules, controllers, and services in accordance with NestJS framework recommendations
- Comments in appropriate places indicating potential application features with integrations from external systems, such as payment systems or communication services

### Authorization
- Authentication via JWT (for mobile apps) and cookies (for web interface) is supported
- Custom middleware and guard for extracting and validating data from the token
- Custom decorator for extracting current user id in controllers
- Maintaining one-to-many and many-to-many table relationships
- Table inheritance via one-to-one relationships to extend user information depending on their role

### Business Logic
- Saving records (except users) on deletion with the isDeleted flag, which is used for filtering output
- Cascading handling of related values when deleting users
- Order status control to ensure access for selected roles and maintain data integrity regarding product availability in stock
- Automatic deduction of products and packaging when the status is changed to "ready"
- Endpoint segregation to differentiate access scenarios to resources depending on the role being used
- All requests are logged to provide the possibility for further analytics; in this implementation, logs are sent to the console, as logging is planned to use a separate database to avoid blocking the main database during transaction processing

## Deploy
The deployment was done on the free hosting platform [render.com](https://render.com). The database storage size is only 1GB.
