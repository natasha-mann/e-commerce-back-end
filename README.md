<h1>E-Commerce Back-End</h1>

<h2> Table of Contents </h2>

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Setting up the database](#setting-up-the-database)
  - [Launch the app](#launch-the-app)
- [Demo Video](#demo-video)
- [Questions](#questions)

## About the Project

This app was built using Node.js, with an express.js server and a MySQL database run through the sequelize package.

The database contains 4 tables - Category, Product, Tag, Product_Tag (junction table) - all of which extend the Sequelize model.

The api is set up with 15 total end points, 5 for each of the three main models as follows:

- GET - find all records
- GET - find one record by ID
- POST - create a new record
- PUT - update a record
- Delete - destroy a record

## Getting Started

### Installation

```
git clone https://github.com/natasha-mann/e-commerce-back-end.git
cd e-commerce-back-end
npm i
```

### Setting up the database

In MySQL workbench:

```
DROP DATABASE IF EXISTS ecommerce_db;

CREATE DATABASE ecommerce_db;
```

To seed the data:

```
npm run seed
```

### Launch the app

```

npm run start

```

## Demo Video

Please click [here](https://drive.google.com/file/d/1Du1HVZGyFOE3WMwi5HTw_fxfIxUmqOEA/view?usp=sharing) to view the demo.

## Questions

If you have any questions about this application, please contact me by [email](mailto:natasha.s.mann@gmail.com).

```

```
