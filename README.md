# app

[![Deploy to Cyclic](https://deploy.cyclic.sh/button.svg)](https://deploy.cyclic.sh/)

<br>

## Description
Iron Sports Club is a platform where instructors can publish their own sports classes and students can sign up for them. 

## User stories
- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault.
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **auth/login** - As a user I want to see a welcome page that gives me the option to either log in as an existing user, or sign up with a new account. 
- **auth/signup** - As a user I want to sign up with my full information so that I can either create sports classes, or book them.
- **profile** - as A user I want to be able to see my profile with my info and the classes I booked or created
- **classes/class-list** - as a user I want to be able to browse all existing classes
- **classes/class-details** - as user I want to be able to see details for every class that is available, so that I can book/cancel them (if I'm a student) or edit/delete them (if I'm an instructor)
<br>

## Routes
- GET /
    - renders index.hbs

 - GET /auth/signup
  - redirects to / if user logged in
  - renders signup.hbs

- POST /auth/signup
    - body:
        - email
        - password
        - fullName
        - role
    - if successful, redirects to /auth/profile
    - if unsuccessful, displays error message

- GET /auth/login
    - renders /auth/login

- POST /auth/login
  - redirects to /auth/profile if user logged in
  - body:
    - email
    - password
 - if unsuccessful, displays error message

- GET /auth/profile
    - renders profile.hbs

- POST /auth/logout
  - body: (empty)

- GET /classes/list
    - renders classes/list.hbs

- GET /classes/:id/class-details
    - renders classes/class-details.hbs

- GET /classes/create-class
    - renders classes/create-class.hbs

- POST /classes/create-class
    - body:
        - className, 
        - duration, 
        - date, 
        - timeOfDay, 
        - description

- GET /classes/:id/edit-class
    - renders classes/edit-class

- POST /classes/:id/edit-class
     - body:
        - className, 
        - duration, 
        - date, 
        - timeOfDay, 
        - description

- POST /classes/:id/delete
    - redirects to /auth/profile if successful

- POST /classes/:id/book-class
    - redirects to /classes/${id}/class-details if successful

- POST /classes/:id/cancel-class
    - redirects to /classes/${id}/class-details if successful


## Models
- User
const userSchema = new Schema(
    {
      fullName: {
        type: String,
        trim: true,
        required: false,
        unique: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      },
      password: {
        type: String,
        required: true
      },
      role: {
        type: String,
        required: true,
        enum: ["Instructor", "Student"]
      },

      classes: [{ type: Schema.Types.ObjectId, ref: "Class" }]
    },
    {
      // this second object adds extra properties: `createdAt` and `updatedAt`
      timestamps: true
    }
  );


- Class
const classSchema = new Schema ({
    className: {
        type: String,
        required: true,
        unique: true
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    timeOfDay: {
        type: String,
        required: true
    },
    defaultIcon: {
        type: String,
        default: "./public/images/default-cllass-icon.jpg.jpg"
    },
    description: {
        type: String
    },
    owner: {type: Schema.Types.ObjectId, ref: "Instructor"},
    attendees: [{ type: Schema.Types.ObjectId, ref: "Student" }]
})


<br>

## Backlog
- Ability to pay for classes with credits
- Rate classes

<br>

## Links
- Miro board: https://miro.com/app/board/uXjVP0lKtk0=/

<br>

### git
- Repo: https://github.com/iron-sports-club/app

<br>

### Slides
- https://docs.google.com/presentation/d/1mQL6m3qb5KPu_r_Z4Rc27hpfCGfOEbiFvaCvQTCHwTU/edit#slide=id.g1d2ae48d645_0_35