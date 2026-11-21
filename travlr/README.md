# Travlr Getaways — CS 465 Full Stack Development

## Project Overview

Travlr Getaways is a full stack travel-booking demonstration application developed for Southern New Hampshire University's CS 465 course. It includes a customer-facing website and an administrative single-page application (SPA). The customer website displays travel destinations, while the admin application allows authenticated users to view, add, and edit trip information. The project uses the MEAN stack—MongoDB, Express, Angular, and Node.js—along with Handlebars templates for the customer-facing website.

## Architecture

**Express HTML and JavaScript compared with an Angular SPA.** The customer-facing side uses Express routes, Handlebars templates, HTML, CSS, and JavaScript. Express handles incoming requests and renders the travel page on the server, making it straightforward to reuse headers, footers, and layouts while delivering complete pages to the browser. JavaScript supports routing, controllers, and dynamic data handling. The administrative side uses Angular as a single-page application. Angular updates the interface through components and client-side routing without requiring a full-page reload for each view. Unlike the server-rendered customer site, the admin SPA requests trip data from an Express RESTful API and renders the response in reusable components. Both approaches use JavaScript-based technologies, but they divide rendering and interaction responsibilities differently.

**Why MongoDB?** MongoDB is a NoSQL document database that stores records in a JSON-like format. Trip records contain related fields such as code, name, length, start date, resort, price, image, and description, which fit naturally into documents. MongoDB works well with Node.js and Express through Mongoose, which provides schemas and validation. This combination makes it practical to retrieve and update trip information through API endpoints and to extend the project with user records for authentication.

## Functionality

**JSON versus JavaScript.** JavaScript is a programming language used to implement application logic, while JSON is a lightweight data-interchange format. JSON represents structured values using objects, arrays, strings, numbers, and other supported types, but it does not contain executable functions. In Travlr Getaways, trip information was first moved from hard-coded travel-page HTML into a `trips.json` file. Later, Express API endpoints returned trip data as JSON from MongoDB. Angular's HTTP client consumed that JSON and displayed it as trip cards. JSON therefore connects the backend's data and the frontend's presentation.

**Refactoring and reusable components.** The project was refactored from a static travel page into an Express MVC structure, separating routes, controllers, models, and views. Handlebars loops replaced repetitive trip markup. In Angular, the Trip Listing component manages the collection of destinations, while the reusable Trip Card component displays each destination. The Trip Data Service centralizes API communication, and the Authentication Service manages login state and JWT storage. A JWT interceptor further centralizes authentication headers for protected requests. These changes reduce duplicate code, improve consistency, simplify testing and debugging, and make future updates easier because shared behavior can be changed in one place.

## Testing

Testing the full stack application required checking both the displayed interface and the API requests supporting it. I tested public `GET /api/trips` and `GET /api/trips/:tripCode` endpoints to confirm trip retrieval, `POST /api/trips` to add a test trip, and `PUT /api/trips/:tripCode` to update its information. I checked the returned JSON in the browser, observed HTTP status codes in the Express terminal, and verified trip documents in MongoDB Compass. Angular was also tested in the browser to confirm that trip cards loaded, form submissions worked, and saved changes appeared after refreshing.

Security introduced another testing layer. I tested registration and login endpoints that return JSON Web Tokens (JWTs), then verified that an unauthenticated `PUT` request received HTTP `401 Unauthorized`. A request using a valid Bearer token was allowed to update the test trip. Finally, I verified that the Angular navbar switched between Log In and Log Out, that management buttons were hidden when logged out, and that authenticated edits still worked. These tests reinforced the difference between a route existing, a request being valid, and a user being authenticated to perform an operation. Hiding buttons improves the interface, but server-side authorization checks are essential because users can call API endpoints directly.

## Reflection

This course gave me practical experience building a complete application instead of focusing on isolated pages or scripts. I developed stronger skills in JavaScript, Node.js, Express, Angular, TypeScript, MongoDB, Mongoose, RESTful APIs, and Git/GitHub. I also learned to troubleshoot across the full stack: checking terminal output, resolving missing routes, confirming database connections, using browser developer tools, and testing API responses before changing more code.

The project helped me understand how application architecture, reusable components, data exchange, and authentication fit together. I can now discuss and demonstrate a working project with a customer-facing interface, an administrative SPA, database persistence, and JWT-based authentication. Those are concrete portfolio examples I can use when pursuing opportunities in software development. I also recognize that a coursework implementation is not the same as a production-hardened application; future improvements would include stronger authorization controls, improved credential handling, automated tests, and dependency-security reviews.

## Technologies Used

- Node.js and Express
- JavaScript and TypeScript
- Angular and Bootstrap
- Handlebars, HTML, and CSS
- MongoDB and Mongoose
- RESTful APIs and JSON
- Passport local authentication and JSON Web Tokens
- Git and GitHub

## Running Locally

The source project is located in the `travlr` directory of this repository.

1. Install Node.js and MongoDB, and start the local MongoDB server.
2. In `travlr`, install dependencies with `npm install`.
3. Create a private `travlr/.env` file containing a newly generated `JWT_SECRET` value. **Do not commit this file.**
4. Start Express from `travlr` with `npm start` (default: `http://localhost:3000`).
5. In a separate terminal, go to `travlr/app_admin`, run `npm install`, and then `npx ng serve` (default: `http://localhost:4200`).
6. Populate the MongoDB database with the trip data using the project's existing seed process if the database is empty.
7. Open the customer website at `http://localhost:3000/travel` or the Angular admin site at `http://localhost:4200`.

The admin's add and edit operations require a registered account and a valid JWT. The `.env` file and the live MongoDB database are intentionally excluded from source control.

## Repository

GitHub: https://github.com/NovaAn16/CS465

The final coursework implementation is on the `module7` branch.
