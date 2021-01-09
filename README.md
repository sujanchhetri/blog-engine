# Blog-Engine

[![Dependency Status](https://img.shields.io/david/sujanchhetri/blog-engine.svg)](https://david-dm.org/sujanchhetri/blog-engine)
[![MIT Licensed](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

This repo consists of the backend for a blogging platform. Most of the features that are in a blog is available here.

## Features
- User Signup / Signin
- JWT based Authentication System
- Role Based Authorization System-user/admin
- Blogs Search
- Related Blogs
- Categories
- Tags
- User Profile
- Blog Author Private Contact Form
- Multiple User Authorization System
- Social Login with Google
- Admin / User Dashboard privilage
- Image Uploads
- Load More Blogs


### Usage
You can access the following endpoints on http://localhost:8000/api

- - -

#### Authentication

- - -

| Method      | Path |   
| ---        |    ----   |  
| post      | /pre-signup      | 
| post   | /signup       | 
| post   | /signin       | 
| post   | /google-login      | 
| get   | /signout        |
| get   | /secret        |
| put   | /forgot-password        | 
| put   | /reset-password |  

- - -

#### Blog-Post

- - -

| Method      | Path |    
| ---        |    ----   | 
| post      | /blog     |
| post   | /blogs-categories-tags       | 
| post   | /blogs/related     |
| post   | /user/blog      |
| get   | /blogs       |
| get   | /blog/:slug       | 
| get   | /blog/photo/:slug       |
| get   | /blogs/search | 
| get   | /:username/blogs |   
|delete  | /blog/:slug |   
|delete  | /user/blog/:slug |   
|put  | /blog/:slug |   
|put  | /user/blog/:slug |   



- - -

#### Categories , Tags & Form

- - -

| Method      | Path |    
| ---        |    ----   | 
| post      | /category   |
| post   | /tag      | 
| post   | /contact     | 
| post   | /contact-blog-author     | 
| get   | /categories      |
| get   | /category/:slug      | 
| get   | /tags       |
| get   | /tag/:slug | 
|delete  | /category/:slug |   
|delete  | /tag/:slug |   
 
 - - -

#### User

- - -

| Method      | Path |    
| ---        |    ----  | 
| get   | /user/profile      |
| get   | /user/:username     | 
| get   | /user/photo/:username      |
| put  | /user/update     |
| put  | /user/follow     |
| put  | /user/unfollow     |

<br/>
## Contributing

There are two ways to contribute to this project. **submitting new features or fixing bugs** 


### To submit a new feature or a bugfix

Please contribute! There are plenty of work to do. To get started, you have to [fork](https://github.com/sujanchhetri/blog-engine/fork) this repo to your own GitHub account first. Then open up a terminal on your machine and enter the following commands:

```bash
git clone https://github.com/<your user name>/blog-engine.git
cd blog-engine
npm install
npm start
```

> Add the requirements in the .env file

This will start the development server on `http://localhost:8000/`. This should reload automatically when you make changes to the code, but no code is perfect, so sometimes you may need to restart it. :)

If you want to submit a new feature or a bugfix, the best way is to create the changes in a separate branch, e.g.: `git checkout -b feature/mycoolfeature`. This will make it easier for you to submit a pull request and get your feature merged.

- - -

#### This engine is used by [Blogue](https://blogue.tech)
