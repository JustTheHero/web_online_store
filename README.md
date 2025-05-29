# SCC0219 - Introdução ao Desenvolvimento Web <br/>

# Project Report: ElojobDie
-> Gabriel Hyppolito - NUSP 14571810 </br>
-> Juan Marques Jordão - NUSP 14758742 </br>

## 1. Requirements:
  * The project is an online store system that sells accounts, online coaching sessions, and services to boost your rank in online games.
  * The system authentication will support 2 types of users:
      - Administrators, responsible for registering/managing administrators, customers, and the products/services provided. The application comes with a default admin account (username: admin, password: admin).
      - Customers, users who access the system to purchase services/products.
  * Each customer and user record includes fields for name, email, phone number, discord username and ID.
  * Each service/product record includes fields for name, ID, photo, description, price, quantity in stock, and quantity sold.
  * Selling Products (or Services): Products are selected, quantities are chosen, and added to a cart. Products are purchased using a credit card number (any number is accepted by the system). The quantity sold is subtracted from the stock and added to the total quantity sold. Carts are emptied only upon payment or by the customer.
  * Product/Service Management: Administrators can create, read, update, and delete (CRUD) products and services. For example, they can change stock quantities.
  * Users can search for desired products/services using a functional search bar.
  * Users can see all their orders and write reviews for delivered ones.
  * Reviews can be filtered by service type.
  * Users can navigate through different product tabs.

## 2. Project Description:
  * The implemented functionalities include:
     - Login system for customers and administrators.
     - Cart to add/remove products and confirm purchases.
     - User data storage.
     - Admin permissions to change prices, stock, and availability.
     - Search bar for products.
     - Main page showcasing featured products and separate tabs for different types of services.

    * Navigation diagram (SPA) for the screen mockups:
     <p>
      <img src="Prototypes/diagrama.png" alt="diagrama">
     </p>

    * Mockup for the Product Details Page:
     <p>
      <img src="Prototypes/prodDetails.png" alt="Details"/>
     </p>

    * Mockup for the page showing search results based on the user's query:
     <p>
      <img src="Prototypes/searchResult.png" alt="Search"/>
     </p>

    * Mockup for the payment page:
     <p>
      <img src="Prototypes/orderPage.png" alt="Order"/>
     </p>

    * Mockup for the confirmed purchase page:
     <p>
      <img src="Prototypes/confirmedPage.png" alt="Confirmed"/>
     </p>

    * Mockup for the Register page:
     <p>
      <img src="Prototypes/registerPage.png" alt="Register"/>
     </p>

    * Mockup for the User Account page:
     <p>
      <img src="Prototypes/UserAccount.png" alt="Account"/>
     </p>

    * Mockup for the User Management page:
     <p>
      <img src="Prototypes/userManagement.png" alt="Management"/>
     </p>

    * Mockup for the Storage page:
     <p>
      <img src="Prototypes/storagePage.png" alt="Storage"/>
     </p>
     
   * All data related to storage, products, and users will be saved on a server.

## 3. Code Comments:

## 4. Test Plan:
* Back-end funcionalities will be tested using Postman.
* For the Milestone 2 features, we considered using the Beeceptor API to perform tests with GET, POST, etc., requests to retrieve products and make purchases. However, due to the request limit on free accounts hindering development, the idea was not implemented.
* Therefore, functionalities such as product retrieval, inventory and user management, review pages, and product purchases primarily use mock items to simulate the database. The main mocks, used in more than one component, are located in "/web/src/data/". Others are declared and used within their own component.
* The management of users and inventory with mock items is not persistent; it only demonstrates the functionality of CRUD operations. These can be performed by admins through an "isAdmin" flag, which is always set to True for testing purposes.
* Creating products and reviews does not update the respective mocks so they appear on their corresponding pages. It only demonstrates the functionality, which will work properly once the server is implemented, since mocks are static.
* For the product purchase functionality, the "CartContext.jsx" component is used, located in "web/src/contexts". This component uses Hooks and the Context API to manage the global state of the shopping cart, ensuring consistency between the inventory and the cart contents. It handles item addition/removal and ensures the user cannot purchase more than the available stock, among other validations.

## 5. Test Results:
* Category and specific product pages correctly filter from the product mock.
* Reviews are displayed and filtered correctly.
* The shopping cart and purchase logic correctly interact with product inventory, ensuring stock updates in the browser's local storage and blocking purchase attempts that exceed available stock or are invalid.
* It is possible to create, delete, grant admin permissions, or revoke admin rights for users correctly, with the data also being saved in the browser's local storage.
* CRUD operations on the storage are also saved locally.

## 6. Build Procedures:

## 7. Problems:

## 8. Comments:
